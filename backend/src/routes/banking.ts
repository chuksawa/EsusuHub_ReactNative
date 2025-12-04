import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { pool } from '../config/database';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError, ValidationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get bank accounts
router.get('/accounts', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, account_number, account_type, account_name, balance, available_balance,
              currency, interest_rate, minimum_balance, status, opened_date, maturity_date,
              created_at, updated_at
       FROM bank_accounts
       WHERE user_id = $1
       ORDER BY opened_date DESC`,
      [req.userId]
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        accountNumber: row.account_number,
        accountType: row.account_type,
        accountName: row.account_name,
        balance: parseFloat(row.balance) || 0,
        availableBalance: parseFloat(row.available_balance) || 0,
        currency: row.currency,
        interestRate: parseFloat(row.interest_rate) || 0,
        minimumBalance: parseFloat(row.minimum_balance) || 0,
        status: row.status,
        openedDate: row.opened_date,
        maturityDate: row.maturity_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get bank accounts', code: 'GET_ACCOUNTS_ERROR' });
  }
});

// Get bank account by ID
router.get('/accounts/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, account_number, account_type, account_name, balance, available_balance,
              currency, interest_rate, minimum_balance, status, opened_date, maturity_date,
              created_at, updated_at
       FROM bank_accounts
       WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Bank account not found');
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      accountNumber: row.account_number,
      accountType: row.account_type,
      accountName: row.account_name,
      balance: parseFloat(row.balance) || 0,
      availableBalance: parseFloat(row.available_balance) || 0,
      currency: row.currency,
      interestRate: parseFloat(row.interest_rate) || 0,
      minimumBalance: parseFloat(row.minimum_balance) || 0,
      status: row.status,
      openedDate: row.opened_date,
      maturityDate: row.maturity_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to get bank account', code: 'GET_ACCOUNT_ERROR' });
  }
});

// Create bank account application
router.post(
  '/accounts/apply',
  authenticate,
  [
    body('accountType').isIn(['savings', 'current', 'fixed_deposit']).withMessage('Invalid account type'),
    body('employmentStatus').optional().notEmpty().withMessage('Employment status cannot be empty'),
    body('monthlyIncome').optional().isFloat({ min: 0 }).withMessage('Monthly income must be a positive number'),
    body('initialDeposit').optional().isFloat({ min: 0 }).withMessage('Initial deposit must be a positive number'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        accountType,
        employmentStatus,
        employerName,
        monthlyIncome,
        purposeOfAccount,
        initialDeposit,
        preferredBranch,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO bank_account_applications (
          user_id, account_type, employment_status, employer_name, monthly_income,
          purpose_of_account, initial_deposit, preferred_branch, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
        RETURNING *`,
        [
          req.userId,
          accountType,
          employmentStatus || null,
          employerName || null,
          monthlyIncome || null,
          purposeOfAccount || null,
          initialDeposit || null,
          preferredBranch || null,
        ]
      );

      const application = result.rows[0];
      res.status(201).json({
        id: application.id,
        userId: application.user_id,
        accountType: application.account_type,
        employmentStatus: application.employment_status,
        employerName: application.employer_name,
        monthlyIncome: application.monthly_income ? parseFloat(application.monthly_income) : null,
        purposeOfAccount: application.purpose_of_account,
        initialDeposit: application.initial_deposit ? parseFloat(application.initial_deposit) : null,
        preferredBranch: application.preferred_branch,
        status: application.status,
        applicationDate: application.application_date,
        createdAt: application.created_at,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to submit application', code: 'APPLICATION_ERROR' });
    }
  }
);

// Get bank account applications
router.get('/accounts/applications', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, account_type, employment_status, employer_name, monthly_income,
              purpose_of_account, initial_deposit, preferred_branch, status,
              application_date, review_date, approval_date, reviewer_notes,
              created_at, updated_at
       FROM bank_account_applications
       WHERE user_id = $1
       ORDER BY application_date DESC`,
      [req.userId]
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        accountType: row.account_type,
        employmentStatus: row.employment_status,
        employerName: row.employer_name,
        monthlyIncome: row.monthly_income ? parseFloat(row.monthly_income) : null,
        purposeOfAccount: row.purpose_of_account,
        initialDeposit: row.initial_deposit ? parseFloat(row.initial_deposit) : null,
        preferredBranch: row.preferred_branch,
        status: row.status,
        applicationDate: row.application_date,
        reviewDate: row.review_date,
        approvalDate: row.approval_date,
        reviewerNotes: row.reviewer_notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get applications', code: 'GET_APPLICATIONS_ERROR' });
  }
});

// Get bank transactions
router.get(
  '/transactions',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const accountId = req.query.accountId as string;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;

      let queryText = '';
      let queryParams: any[] = [];

      if (accountId) {
        // Verify account belongs to user
        const accountCheck = await pool.query(
          'SELECT id FROM bank_accounts WHERE id = $1 AND user_id = $2',
          [accountId, req.userId]
        );

        if (accountCheck.rows.length === 0) {
          throw new NotFoundError('Bank account not found');
        }

        queryText = `
          SELECT bt.*, ba.account_number, ba.account_name
          FROM bank_transactions bt
          JOIN bank_accounts ba ON bt.account_id = ba.id
          WHERE bt.account_id = $1
          ORDER BY bt.transaction_date DESC
          LIMIT $2 OFFSET $3
        `;
        queryParams = [accountId, pageSize, offset];
      } else {
        queryText = `
          SELECT bt.*, ba.account_number, ba.account_name
          FROM bank_transactions bt
          JOIN bank_accounts ba ON bt.account_id = ba.id
          WHERE ba.user_id = $1
          ORDER BY bt.transaction_date DESC
          LIMIT $2 OFFSET $3
        `;
        queryParams = [req.userId, pageSize, offset];
      }

      const result = await pool.query(queryText, queryParams);

      // Get total count
      let countQuery = '';
      let countParams: any[] = [];

      if (accountId) {
        countQuery = 'SELECT COUNT(*) FROM bank_transactions WHERE account_id = $1';
        countParams = [accountId];
      } else {
        countQuery = `
          SELECT COUNT(*) FROM bank_transactions bt
          JOIN bank_accounts ba ON bt.account_id = ba.id
          WHERE ba.user_id = $1
        `;
        countParams = [req.userId];
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        transactions: result.rows.map((row) => ({
          id: row.id,
          accountId: row.account_id,
          accountNumber: row.account_number,
          accountName: row.account_name,
          transactionType: row.transaction_type,
          amount: parseFloat(row.amount),
          balanceAfter: parseFloat(row.balance_after),
          description: row.description,
          referenceNumber: row.reference_number,
          recipientAccount: row.recipient_account,
          recipientBank: row.recipient_bank,
          status: row.status,
          transactionDate: row.transaction_date,
          valueDate: row.value_date,
          createdAt: row.created_at,
        })),
        total,
        page,
        pageSize,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to get transactions', code: 'GET_TRANSACTIONS_ERROR' });
    }
  }
);

// Create deposit transaction
router.post(
  '/transactions/deposit',
  authenticate,
  [
    body('accountId').isUUID().withMessage('Valid account ID is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { accountId, amount, description } = req.body;

      // Verify account belongs to user
      const accountResult = await pool.query(
        'SELECT id, balance, available_balance FROM bank_accounts WHERE id = $1 AND user_id = $2',
        [accountId, req.userId]
      );

      if (accountResult.rows.length === 0) {
        throw new NotFoundError('Bank account not found');
      }

      const account = accountResult.rows[0];
      const newBalance = parseFloat(account.balance) + amount;
      const newAvailableBalance = parseFloat(account.available_balance) + amount;

      // Generate reference number
      const referenceNumber = `DEP-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Create transaction
      const transactionResult = await pool.query(
        `INSERT INTO bank_transactions (
          account_id, transaction_type, amount, balance_after, description, reference_number, status
        )
        VALUES ($1, 'deposit', $2, $3, $4, $5, 'completed')
        RETURNING *`,
        [accountId, amount, newBalance, description || 'Deposit', referenceNumber]
      );

      // Update account balance
      await pool.query(
        'UPDATE bank_accounts SET balance = $1, available_balance = $2, updated_at = NOW() WHERE id = $3',
        [newBalance, newAvailableBalance, accountId]
      );

      const transaction = transactionResult.rows[0];
      res.status(201).json({
        id: transaction.id,
        accountId: transaction.account_id,
        transactionType: transaction.transaction_type,
        amount: parseFloat(transaction.amount),
        balanceAfter: parseFloat(transaction.balance_after),
        description: transaction.description,
        referenceNumber: transaction.reference_number,
        status: transaction.status,
        transactionDate: transaction.transaction_date,
        valueDate: transaction.value_date,
        createdAt: transaction.created_at,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to process deposit', code: 'DEPOSIT_ERROR' });
    }
  }
);

// Create withdrawal transaction
router.post(
  '/transactions/withdraw',
  authenticate,
  [
    body('accountId').isUUID().withMessage('Valid account ID is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { accountId, amount, description } = req.body;

      // Verify account belongs to user
      const accountResult = await pool.query(
        'SELECT id, balance, available_balance, minimum_balance FROM bank_accounts WHERE id = $1 AND user_id = $2',
        [accountId, req.userId]
      );

      if (accountResult.rows.length === 0) {
        throw new NotFoundError('Bank account not found');
      }

      const account = accountResult.rows[0];
      const availableBalance = parseFloat(account.available_balance);
      const minimumBalance = parseFloat(account.minimum_balance) || 0;

      if (availableBalance < amount) {
        throw new ValidationError('Insufficient funds');
      }

      if (availableBalance - amount < minimumBalance) {
        throw new ValidationError(`Withdrawal would violate minimum balance requirement of ${minimumBalance}`);
      }

      const newBalance = parseFloat(account.balance) - amount;
      const newAvailableBalance = availableBalance - amount;

      // Generate reference number
      const referenceNumber = `WDL-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Create transaction
      const transactionResult = await pool.query(
        `INSERT INTO bank_transactions (
          account_id, transaction_type, amount, balance_after, description, reference_number, status
        )
        VALUES ($1, 'withdrawal', $2, $3, $4, $5, 'completed')
        RETURNING *`,
        [accountId, amount, newBalance, description || 'Withdrawal', referenceNumber]
      );

      // Update account balance
      await pool.query(
        'UPDATE bank_accounts SET balance = $1, available_balance = $2, updated_at = NOW() WHERE id = $3',
        [newBalance, newAvailableBalance, accountId]
      );

      const transaction = transactionResult.rows[0];
      res.status(201).json({
        id: transaction.id,
        accountId: transaction.account_id,
        transactionType: transaction.transaction_type,
        amount: parseFloat(transaction.amount),
        balanceAfter: parseFloat(transaction.balance_after),
        description: transaction.description,
        referenceNumber: transaction.reference_number,
        status: transaction.status,
        transactionDate: transaction.transaction_date,
        valueDate: transaction.value_date,
        createdAt: transaction.created_at,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to process withdrawal', code: 'WITHDRAWAL_ERROR' });
    }
  }
);

export default router;

