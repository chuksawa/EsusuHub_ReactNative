import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { pool } from '../config/database';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';

const router = Router();

// Get all groups (with optional filtering)
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const myGroupsOnly = req.query.myGroupsOnly === 'true';
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;

      // Get user's tenant_id
      const userResult = await pool.query('SELECT tenant_id FROM users WHERE id = $1', [req.userId]);
      const tenantId = userResult.rows[0]?.tenant_id;

      let queryText = '';
      let queryParams: any[] = [];

      if (myGroupsOnly) {
        queryText = `
          SELECT sg.*, u.full_name as creator_name,
                 COUNT(DISTINCT gm.id) as current_members
          FROM savings_groups sg
          LEFT JOIN users u ON sg.created_by = u.id
          LEFT JOIN group_memberships gm ON sg.id = gm.group_id
          WHERE EXISTS (
            SELECT 1 FROM group_memberships gm2
            WHERE gm2.group_id = sg.id AND gm2.user_id = $1
          )
          ${tenantId ? 'AND sg.tenant_id = $2' : ''}
          GROUP BY sg.id, u.full_name
          ORDER BY sg.created_at DESC
          LIMIT ${tenantId ? '$3' : '$2'} OFFSET ${tenantId ? '$4' : '$3'}
        `;
        queryParams = tenantId ? [req.userId, tenantId, pageSize, offset] : [req.userId, pageSize, offset];
      } else {
        queryText = `
          SELECT sg.*, u.full_name as creator_name,
                 COUNT(DISTINCT gm.id) as current_members
          FROM savings_groups sg
          LEFT JOIN users u ON sg.created_by = u.id
          LEFT JOIN group_memberships gm ON sg.id = gm.group_id
          WHERE 1=1
          ${tenantId ? 'AND sg.tenant_id = $1' : ''}
          GROUP BY sg.id, u.full_name
          ORDER BY sg.created_at DESC
          LIMIT ${tenantId ? '$2' : '$1'} OFFSET ${tenantId ? '$3' : '$2'}
        `;
        queryParams = tenantId ? [tenantId, pageSize, offset] : [pageSize, offset];
      }

      const result = await pool.query(queryText, queryParams);

      res.json(
        result.rows.map((row) => {
          const settings = row.settings || {};
          return {
            id: row.id,
            name: row.name,
            description: row.description,
            adminId: row.created_by,
            adminName: row.creator_name,
            monthlyContribution: parseFloat(settings.monthly_contribution || '0'),
            totalMembers: parseInt(settings.max_members || '0'),
            currentMembers: parseInt(row.current_members) || 0,
            startDate: settings.start_date || null,
            endDate: settings.end_date || null,
            payoutOrder: settings.payout_order || 'fixed',
            penaltyFee: parseFloat(settings.penalty_fee || '0'),
            status: settings.status || 'recruiting',
            groupImageUrl: settings.group_image_url || null,
            rules: settings.rules || null,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        })
      );
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get groups', code: 'GET_GROUPS_ERROR' });
    }
  }
);

// Get user's groups
router.get('/my-groups', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Handle dev users (they don't exist in database)
    if (req.userId === 'dev-user-123' || req.userId?.startsWith('dev-')) {
      // Return empty array for dev users, or you could return mock data
      return res.json([]);
    }

    // Get user's tenant_id
    const userResult = await pool.query('SELECT tenant_id FROM users WHERE id = $1', [req.userId]);
    const tenantId = userResult.rows[0]?.tenant_id;

    const result = await pool.query(
      `SELECT sg.*, u.full_name as creator_name,
              COUNT(DISTINCT gm.id) as current_members,
              gm.role
       FROM savings_groups sg
       JOIN group_memberships gm ON sg.id = gm.group_id
       LEFT JOIN users u ON sg.created_by = u.id
       WHERE gm.user_id = $1 ${tenantId ? 'AND sg.tenant_id = $2' : ''}
       GROUP BY sg.id, u.full_name, gm.role
       ORDER BY sg.created_at DESC`,
      tenantId ? [req.userId, tenantId] : [req.userId]
    );

    res.json(
      result.rows.map((row) => {
        const settings = row.settings || {};
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          adminId: row.created_by,
          adminName: row.creator_name,
          monthlyContribution: parseFloat(settings.monthly_contribution || '0'),
          totalMembers: parseInt(settings.max_members || '0'),
          currentMembers: parseInt(row.current_members) || 0,
          startDate: settings.start_date || null,
          endDate: settings.end_date || null,
          payoutOrder: settings.payout_order || 'fixed',
          penaltyFee: parseFloat(settings.penalty_fee || '0'),
          status: settings.status || 'recruiting',
          groupImageUrl: settings.group_image_url || null,
          rules: settings.rules || null,
          myRole: row.role,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      })
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get my groups', code: 'GET_MY_GROUPS_ERROR' });
  }
});

// Get group by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT sg.*, u.full_name as creator_name,
              COUNT(DISTINCT gm.id) as current_members
       FROM savings_groups sg
       LEFT JOIN users u ON sg.created_by = u.id
       LEFT JOIN group_memberships gm ON sg.id = gm.group_id
       WHERE sg.id = $1
       GROUP BY sg.id, u.full_name`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Group not found');
    }

    const row = result.rows[0];
    const settings = row.settings || {};
    res.json({
      id: row.id,
      name: row.name,
      description: row.description,
      adminId: row.created_by,
      adminName: row.creator_name,
      monthlyContribution: parseFloat(settings.monthly_contribution || '0'),
      totalMembers: parseInt(settings.max_members || '0'),
      currentMembers: parseInt(row.current_members) || 0,
      startDate: settings.start_date || null,
      endDate: settings.end_date || null,
      payoutOrder: settings.payout_order || 'fixed',
      penaltyFee: parseFloat(settings.penalty_fee || '0'),
      status: settings.status || 'recruiting',
      groupImageUrl: settings.group_image_url || null,
      rules: settings.rules || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to get group', code: 'GET_GROUP_ERROR' });
  }
});

// Create group
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Group name is required'),
    body('monthlyContribution').isFloat({ min: 0 }).withMessage('Monthly contribution must be a positive number'),
    body('totalMembers').isInt({ min: 2, max: 50 }).withMessage('Total members must be between 2 and 50'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('payoutOrder').optional().isIn(['fixed', 'random', 'bidding']).withMessage('Invalid payout order'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        name,
        description,
        monthlyContribution,
        totalMembers,
        startDate,
        endDate,
        payoutOrder = 'fixed',
        penaltyFee = 0,
        groupImageUrl,
        rules,
      } = req.body;

      // Get user's tenant_id
      const userResult = await pool.query('SELECT tenant_id FROM users WHERE id = $1', [req.userId]);
      const tenantId = userResult.rows[0]?.tenant_id;

      // Calculate end date if not provided (assuming monthly cycles)
      const calculatedEndDate = endDate || new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + totalMembers));

      // Build settings JSON
      const settings = {
        monthly_contribution: monthlyContribution,
        max_members: totalMembers,
        start_date: startDate,
        end_date: calculatedEndDate,
        payout_order: payoutOrder,
        penalty_fee: penaltyFee,
        group_image_url: groupImageUrl,
        rules: rules,
        status: 'recruiting',
      };

      const result = await pool.query(
        `INSERT INTO savings_groups (name, description, created_by, tenant_id, settings)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, description, req.userId, tenantId, JSON.stringify(settings)]
      );

      const group = result.rows[0];

      // Add creator as owner/admin member
      await pool.query(
        `INSERT INTO group_memberships (group_id, user_id, role, joined_at)
         VALUES ($1, $2, 'owner', NOW())`,
        [group.id, req.userId]
      );

      res.status(201).json({
        id: group.id,
        name: group.name,
        description: group.description,
        adminId: group.created_by,
        monthlyContribution: parseFloat(settings.monthly_contribution),
        totalMembers: parseInt(settings.max_members),
        currentMembers: 1,
        startDate: settings.start_date,
        endDate: settings.end_date,
        payoutOrder: settings.payout_order,
        penaltyFee: parseFloat(settings.penalty_fee),
        status: settings.status,
        groupImageUrl: settings.group_image_url,
        rules: settings.rules,
        createdAt: group.created_at,
        updatedAt: group.updated_at,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to create group', code: 'CREATE_GROUP_ERROR' });
    }
  }
);

// Update group
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Group name cannot be empty'),
    body('monthlyContribution').optional().isFloat({ min: 0 }).withMessage('Monthly contribution must be a positive number'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if user is admin
      const adminCheck = await pool.query(
        'SELECT admin_id FROM savings_groups WHERE id = $1',
        [id]
      );

      if (adminCheck.rows.length === 0) {
        throw new NotFoundError('Group not found');
      }

      if (adminCheck.rows[0].admin_id !== req.userId) {
        throw new ForbiddenError('Only group admin can update the group');
      }

      const {
        name,
        description,
        monthlyContribution,
        startDate,
        endDate,
        payoutOrder,
        penaltyFee,
        groupImageUrl,
        rules,
      } = req.body;

      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 1;

      if (name) {
        updateFields.push(`name = $${paramCount++}`);
        updateValues.push(name);
      }
      if (description !== undefined) {
        updateFields.push(`description = $${paramCount++}`);
        updateValues.push(description);
      }
      if (monthlyContribution) {
        updateFields.push(`monthly_contribution = $${paramCount++}`);
        updateValues.push(monthlyContribution);
      }
      if (startDate) {
        updateFields.push(`start_date = $${paramCount++}`);
        updateValues.push(startDate);
      }
      if (endDate) {
        updateFields.push(`end_date = $${paramCount++}`);
        updateValues.push(endDate);
      }
      if (payoutOrder) {
        updateFields.push(`payout_order = $${paramCount++}`);
        updateValues.push(payoutOrder);
      }
      if (penaltyFee !== undefined) {
        updateFields.push(`penalty_fee = $${paramCount++}`);
        updateValues.push(penaltyFee);
      }
      if (groupImageUrl !== undefined) {
        updateFields.push(`group_image_url = $${paramCount++}`);
        updateValues.push(groupImageUrl);
      }
      if (rules !== undefined) {
        updateFields.push(`rules = $${paramCount++}`);
        updateValues.push(rules);
      }

      if (updateFields.length === 0) {
        res.status(400).json({ message: 'No fields to update', code: 'NO_UPDATE_FIELDS' });
        return;
      }

      updateValues.push(id);
      await pool.query(
        `UPDATE savings_groups SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount}`,
        updateValues
      );

      // Get updated group
      const result = await pool.query(
        `SELECT sg.*, u.full_name as admin_name,
                COUNT(DISTINCT gm.id) as current_members
         FROM savings_groups sg
         JOIN users u ON sg.admin_id = u.id
         LEFT JOIN group_memberships gm ON sg.id = gm.group_id AND gm.status = 'active'
         WHERE sg.id = $1
         GROUP BY sg.id, u.full_name`,
        [id]
      );

      const row = result.rows[0];
      res.json({
        id: row.id,
        name: row.name,
        description: row.description,
        adminId: row.admin_id,
        adminName: row.admin_name,
        monthlyContribution: parseFloat(row.monthly_contribution),
        totalMembers: row.total_members,
        currentMembers: parseInt(row.current_members) || 0,
        startDate: row.start_date,
        endDate: row.end_date,
        payoutOrder: row.payout_order,
        penaltyFee: parseFloat(row.penalty_fee),
        status: row.status,
        groupImageUrl: row.group_image_url,
        rules: row.rules,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to update group', code: 'UPDATE_GROUP_ERROR' });
    }
  }
);

// Delete group
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user is admin
    const adminCheck = await pool.query(
      'SELECT admin_id FROM savings_groups WHERE id = $1',
      [id]
    );

    if (adminCheck.rows.length === 0) {
      throw new NotFoundError('Group not found');
    }

    if (adminCheck.rows[0].admin_id !== req.userId) {
      throw new ForbiddenError('Only group admin can delete the group');
    }

    await pool.query('DELETE FROM savings_groups WHERE id = $1', [id]);

    res.json({ message: 'Group deleted successfully' });
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to delete group', code: 'DELETE_GROUP_ERROR' });
  }
});

// Get group members
router.get('/:id/members', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT gm.*, u.full_name, u.email, u.phone
       FROM group_memberships gm
       JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [id]
    );

    res.json(
      result.rows.map((row) => {
        const meta = row.meta || {};
        return {
          id: row.id,
          userId: row.user_id,
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          role: row.role,
          joinDate: row.joined_at,
          meta,
          createdAt: row.created_at || row.joined_at,
        };
      })
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get group members', code: 'GET_MEMBERS_ERROR' });
  }
});

// Get group activity
router.get('/:id/activity', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get contributions (uses payer_user_id in Supabase schema)
    const contributions = await pool.query(
      `SELECT c.*, u.full_name, u.email
       FROM contributions c
       JOIN users u ON c.payer_user_id = u.id
       WHERE c.group_id = $1
       ORDER BY c.created_at DESC
       LIMIT 50`,
      [id]
    );

    const activities = contributions.rows.map((row) => ({
      type: 'contribution',
      id: row.id,
      userId: row.payer_user_id,
      userName: row.full_name,
      amount: parseFloat(row.amount),
      currency: row.currency || 'NGN',
      status: row.status,
      paymentReference: row.payment_reference,
      metadata: row.metadata || {},
      date: row.created_at,
      createdAt: row.created_at,
    }));

    res.json(activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get group activity', code: 'GET_ACTIVITY_ERROR' });
  }
});

// Join group
router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if group exists
    const groupCheck = await pool.query(
      'SELECT id, settings FROM savings_groups WHERE id = $1',
      [id]
    );

    if (groupCheck.rows.length === 0) {
      throw new NotFoundError('Group not found');
    }

    const group = groupCheck.rows[0];
    const settings = group.settings || {};
    const maxMembers = parseInt(settings.max_members || '0');
    const status = settings.status || 'recruiting';

    if (status !== 'recruiting') {
      throw new ValidationError('Group is not accepting new members');
    }

    // Get current member count
    const memberCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM group_memberships WHERE group_id = $1',
      [id]
    );
    const currentMembers = parseInt(memberCountResult.rows[0].count);

    if (currentMembers >= maxMembers) {
      throw new ValidationError('Group is full');
    }

    // Check if user is already a member
    const memberCheck = await pool.query(
      'SELECT id FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (memberCheck.rows.length > 0) {
      throw new ValidationError('You are already a member of this group');
    }

    // Add member (no status column in Supabase schema)
    await pool.query(
      `INSERT INTO group_memberships (group_id, user_id, role, joined_at)
       VALUES ($1, $2, 'member', NOW())`,
      [id, req.userId]
    );

    // Check if group is now full and update status in settings
    const newMemberCount = currentMembers + 1;
    if (newMemberCount >= maxMembers) {
      const updatedSettings = { ...settings, status: 'active' };
      await pool.query(
        'UPDATE savings_groups SET settings = $1 WHERE id = $2',
        [JSON.stringify(updatedSettings), id]
      );
    }

    res.json({ message: 'Successfully joined group' });
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to join group', code: 'JOIN_GROUP_ERROR' });
  }
});

// Leave group
router.post('/:id/leave', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user is a member
    const memberCheck = await pool.query(
      "SELECT id, role FROM group_memberships WHERE group_id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new NotFoundError('You are not a member of this group');
    }

    // Check if user is admin/owner
    if (memberCheck.rows[0].role === 'admin' || memberCheck.rows[0].role === 'owner') {
      throw new ValidationError('Group admin cannot leave the group. Transfer admin or delete the group instead.');
    }

    // Remove member (delete from group_memberships - no status column)
    await pool.query(
      'DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [id, req.userId]
    );

    // Update group status in settings if needed
    const groupCheck = await pool.query(
      'SELECT settings FROM savings_groups WHERE id = $1',
      [id]
    );
    if (groupCheck.rows.length > 0) {
      const settings = groupCheck.rows[0].settings || {};
      const memberCountResult = await pool.query(
        'SELECT COUNT(*) as count FROM group_memberships WHERE group_id = $1',
        [id]
      );
      const currentMembers = parseInt(memberCountResult.rows[0].count);
      const maxMembers = parseInt(settings.max_members || '0');
      
      if (currentMembers < maxMembers && settings.status === 'active') {
        const updatedSettings = { ...settings, status: 'recruiting' };
        await pool.query(
          'UPDATE savings_groups SET settings = $1 WHERE id = $2',
          [JSON.stringify(updatedSettings), id]
        );
      }
    }

    res.json({ message: 'Successfully left group' });
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to leave group', code: 'LEAVE_GROUP_ERROR' });
  }
});

// Get group configuration
router.get('/configuration', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT key, value FROM system_settings WHERE key IN ('max_group_members', 'min_contribution_amount', 'max_contribution_amount', 'default_penalty_percentage')"
    );

    const config: any = {};
    result.rows.forEach((row) => {
      config[row.key] = row.value;
    });

    res.json({
      maxGroupMembers: parseInt(config.max_group_members || '50'),
      minContributionAmount: parseFloat(config.min_contribution_amount || '1000'),
      maxContributionAmount: parseFloat(config.max_contribution_amount || '10000000'),
      defaultPenaltyPercentage: parseFloat(config.default_penalty_percentage || '5'),
      payoutOrders: ['fixed', 'random', 'bidding'],
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get configuration', code: 'GET_CONFIG_ERROR' });
  }
});

export default router;

