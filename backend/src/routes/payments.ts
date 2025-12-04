import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { pool } from '../config/database';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get payment methods
router.get('/methods', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json([
      { id: 'bank', name: 'Bank Transfer', enabled: true },
      { id: 'card', name: 'Debit/Credit Card', enabled: true },
      { id: 'mobile', name: 'Mobile Money', enabled: true },
      { id: 'cash', name: 'Cash', enabled: true },
    ]);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get payment methods', code: 'GET_METHODS_ERROR' });
  }
});

// Get payment accounts
router.get('/accounts', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, account_type, account_name, display_name, bank_name, account_number,
              phone_number, mobile_provider, wallet_provider, wallet_username,
              is_default, is_verified, status, created_at
       FROM payment_accounts
       WHERE user_id = $1 AND status = 'active'
       ORDER BY is_default DESC, created_at DESC`,
      [req.userId]
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        accountType: row.account_type,
        accountName: row.account_name,
        displayName: row.display_name,
        bankName: row.bank_name,
        accountNumber: row.account_number,
        phoneNumber: row.phone_number,
        mobileProvider: row.mobile_provider,
        walletProvider: row.wallet_provider,
        walletUsername: row.wallet_username,
        isDefault: row.is_default,
        isVerified: row.is_verified,
        status: row.status,
        createdAt: row.created_at,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get payment accounts', code: 'GET_ACCOUNTS_ERROR' });
  }
});

// Process payment/contribution
router.post(
  '/',
  authenticate,
  [
    body('groupId').isUUID().withMessage('Valid group ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('paymentMethod').isIn(['bank', 'card', 'mobile', 'cash']).withMessage('Invalid payment method'),
    body('paymentAccountId').optional().isUUID().withMessage('Valid payment account ID is required'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { groupId, amount, paymentMethod, paymentAccountId, dueDate, notes } = req.body;

      // Verify group exists and user is a member
      const groupCheck = await pool.query(
        `SELECT sg.id, sg.settings,
                EXISTS(SELECT 1 FROM group_memberships WHERE group_id = sg.id AND user_id = $1) as is_member
         FROM savings_groups sg
         WHERE sg.id = $2`,
        [req.userId, groupId]
      );

      if (groupCheck.rows.length === 0) {
        throw new NotFoundError('Group not found');
      }

      const group = groupCheck.rows[0];
      const settings = group.settings || {};

      if (!group.is_member) {
        throw new ValidationError('You are not a member of this group');
      }

      if (settings.status !== 'active') {
        throw new ValidationError('Group is not active');
      }

      // Verify amount matches monthly contribution (with some tolerance)
      const expectedAmount = parseFloat(settings.monthly_contribution || '0');
      if (Math.abs(amount - expectedAmount) > 0.01) {
        throw new ValidationError(`Amount must match monthly contribution of ${expectedAmount}`);
      }

      // Generate transaction reference
      const transactionReference = `TXN-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Create contribution (Supabase uses payer_user_id)
      const result = await pool.query(
        `INSERT INTO contributions (
          group_id, payer_user_id, amount, currency, payment_reference, status, metadata
        )
        VALUES ($1, $2, $3, $4, $5, 'pending', $6)
        RETURNING *`,
        [
          groupId, 
          req.userId, 
          amount, 
          'NGN',
          transactionReference, 
          JSON.stringify({ paymentMethod, paymentAccountId, dueDate, notes })
        ]
      );

      const contribution = result.rows[0];

      // In a real application, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment after a short delay
      // In production, this would be handled by a webhook from the payment provider

      // Update contribution status to completed (simulated)
      await pool.query(
        "UPDATE contributions SET status = 'completed', updated_at = NOW() WHERE id = $1",
        [contribution.id]
      );

      // Get updated contribution
      const updatedContribution = await pool.query(
        `SELECT c.*, sg.name as group_name
         FROM contributions c
         JOIN savings_groups sg ON c.group_id = sg.id
         WHERE c.id = $1`,
        [contribution.id]
      );

      const row = updatedContribution.rows[0];
      const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
      
      res.status(201).json({
        id: row.id,
        groupId: row.group_id,
        groupName: row.group_name,
        userId: row.payer_user_id,
        amount: parseFloat(row.amount),
        currency: row.currency || 'NGN',
        paymentMethod: metadata.paymentMethod,
        paymentAccountId: metadata.paymentAccountId,
        transactionReference: row.payment_reference,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to process payment', code: 'PAYMENT_ERROR' });
    }
  }
);

// Get payment history
router.get(
  '/history',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const groupId = req.query.groupId as string;
      const offset = (page - 1) * pageSize;

      let queryText = '';
      let queryParams: any[] = [];

      if (groupId) {
        queryText = `
          SELECT c.*, sg.name as group_name
          FROM contributions c
          JOIN savings_groups sg ON c.group_id = sg.id
          WHERE c.payer_user_id = $1 AND c.group_id = $2
          ORDER BY c.created_at DESC
          LIMIT $3 OFFSET $4
        `;
        queryParams = [req.userId, groupId, pageSize, offset];
      } else {
        queryText = `
          SELECT c.*, sg.name as group_name
          FROM contributions c
          JOIN savings_groups sg ON c.group_id = sg.id
          WHERE c.payer_user_id = $1
          ORDER BY c.created_at DESC
          LIMIT $2 OFFSET $3
        `;
        queryParams = [req.userId, pageSize, offset];
      }

      const result = await pool.query(queryText, queryParams);

      // Get total count
      let countQuery = '';
      let countParams: any[] = [];

      if (groupId) {
        countQuery = 'SELECT COUNT(*) FROM contributions WHERE payer_user_id = $1 AND group_id = $2';
        countParams = [req.userId, groupId];
      } else {
        countQuery = 'SELECT COUNT(*) FROM contributions WHERE payer_user_id = $1';
        countParams = [req.userId];
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        payments: result.rows.map((row) => {
          const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
          return {
            id: row.id,
            groupId: row.group_id,
            groupName: row.group_name,
            userId: row.payer_user_id,
            amount: parseFloat(row.amount),
            currency: row.currency || 'NGN',
            status: row.status,
            paymentMethod: metadata.paymentMethod,
            transactionReference: row.payment_reference,
            createdAt: row.created_at,
            completedAt: row.status === 'completed' ? row.created_at : null,
          };
        }),
        total,
        page,
        pageSize,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get payment history', code: 'GET_HISTORY_ERROR' });
    }
  }
);

// Get payment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.*, sg.name as group_name
       FROM contributions c
       JOIN savings_groups sg ON c.group_id = sg.id
       WHERE c.id = $1 AND c.payer_user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Payment not found');
    }

    const row = result.rows[0];
    const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
    
    res.json({
      id: row.id,
      groupId: row.group_id,
      groupName: row.group_name,
      userId: row.payer_user_id,
      amount: parseFloat(row.amount),
      currency: 'NGN',
      status: row.status,
      paymentMethod: row.payment_method,
      paymentAccountId: row.payment_account_id,
      transactionReference: row.transaction_reference,
      paymentDate: row.payment_date,
      dueDate: row.due_date,
      lateFee: parseFloat(row.late_fee) || 0,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to get payment', code: 'GET_PAYMENT_ERROR' });
  }
});

export default router;

