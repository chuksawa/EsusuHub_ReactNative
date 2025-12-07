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
      const userResult = await pool.query('SELECT tenant_id FROM public.users WHERE id = $1', [req.userId]);
      const tenantId = userResult.rows[0]?.tenant_id;

      let queryText = '';
      let queryParams: any[] = [];

      if (myGroupsOnly) {
        queryText = `
          SELECT sg.*, u.full_name as creator_name,
                 COUNT(DISTINCT gm.id) as current_members
          FROM savings_groups sg
          LEFT JOIN public.users u ON sg.created_by = u.id
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
          LEFT JOIN public.users u ON sg.created_by = u.id
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

// Get group configuration (MUST come before /:id route)
router.get('/configuration', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // system_settings table may not exist in Supabase, so return default configuration
    // In the future, this could be stored in a settings table or environment variables
    console.log('📋 [GROUP_CONFIG] Returning default configuration');
    
    // Match the frontend GroupConfiguration interface
    res.json({
      minContribution: 1000,
      maxContribution: 10000000,
      minMembers: 2,
      maxMembers: 50,
      cycleDurations: [6, 12, 18, 24], // Common cycle durations in months
    });
  } catch (error: any) {
    console.error('❌ [GROUP_CONFIG] Error:', error.message);
    // Return defaults even on error
    res.json({
      minContribution: 1000,
      maxContribution: 10000000,
      minMembers: 2,
      maxMembers: 50,
      cycleDurations: [6, 12, 18, 24],
    });
  }
});

// Get user's groups
router.get('/my-groups', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Handle dev users (they don't exist in database)
    if (req.userId === 'dev-user-123' || req.userId?.startsWith('dev-')) {
      // Return empty array for dev users, or you could return mock data
      res.json([]);
    }

    // Get user's tenant_id
    const userResult = await pool.query('SELECT tenant_id FROM public.users WHERE id = $1', [req.userId]);
    const tenantId = userResult.rows[0]?.tenant_id;

    const result = await pool.query(
      `SELECT sg.*, u.full_name as creator_name,
              COUNT(DISTINCT gm.id) as current_members,
              gm.role
       FROM savings_groups sg
       JOIN group_memberships gm ON sg.id = gm.group_id
       LEFT JOIN public.users u ON sg.created_by = u.id
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
    console.log('📋 [GET_GROUP] Fetching group:', id);

    // First get the group
    const groupResult = await pool.query(
      `SELECT sg.*, u.full_name as creator_name
       FROM savings_groups sg
       LEFT JOIN public.users u ON sg.created_by = u.id
       WHERE sg.id = $1`,
      [id]
    );

    if (groupResult.rows.length === 0) {
      console.log('❌ [GET_GROUP] Group not found:', id);
      throw new NotFoundError('Group not found');
    }

    // Get member count separately
    const memberCountResult = await pool.query(
      `SELECT COUNT(*) as count FROM group_memberships WHERE group_id = $1`,
      [id]
    );

    const row = groupResult.rows[0];
    // Parse settings JSONB - it might be a string or already an object
    let settings: any = {};
    try {
      if (typeof row.settings === 'string') {
        settings = JSON.parse(row.settings);
      } else if (row.settings) {
        settings = row.settings;
      }
    } catch (e) {
      console.warn('⚠️  [GET_GROUP] Could not parse settings:', e);
      settings = {};
    }

    const currentMembers = parseInt(memberCountResult.rows[0]?.count || '0');
    
    console.log('✅ [GET_GROUP] Group found:', row.name);

    res.json({
      id: row.id,
      name: row.name,
      description: row.description,
      adminId: row.created_by,
      adminName: row.creator_name || 'Unknown',
      monthlyContribution: parseFloat(settings.monthly_contribution || '0'),
      currency: 'NGN', // Default currency
      maxMembers: parseInt(settings.max_members || '0'),
      totalMembers: parseInt(settings.max_members || '0'), // For compatibility
      currentMembers,
      cycleDuration: settings.cycle_duration || parseInt(settings.max_members || '12'), // Calculate from members or default
      startDate: settings.start_date || row.created_at,
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
    console.error('❌ [GET_GROUP] Error:', error.message);
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ 
      message: 'Failed to get group', 
      code: 'GET_GROUP_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Create group
router.post(
  '/',
  authenticate,
  validate([
    body('name').notEmpty().withMessage('Group name is required'),
    body('monthlyContribution').isFloat({ min: 0 }).withMessage('Monthly contribution must be a positive number'),
    body('maxMembers').optional().isInt({ min: 2, max: 50 }).withMessage('Max members must be between 2 and 50'),
    body('totalMembers').optional().isInt({ min: 2, max: 50 }).withMessage('Total members must be between 2 and 50'),
    body('cycleDuration').optional().isInt({ min: 1 }).withMessage('Cycle duration must be a positive number'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('payoutOrder').optional().isIn(['fixed', 'random', 'bidding']).withMessage('Invalid payout order'),
  ]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    console.log('📝 [CREATE_GROUP] Request received from user:', req.userId);
    try {
      const {
        name,
        description,
        monthlyContribution,
        totalMembers,
        maxMembers, // Frontend might send maxMembers instead of totalMembers
        startDate,
        endDate,
        payoutOrder = 'fixed',
        penaltyFee = 0,
        groupImageUrl,
        rules,
        cycleDuration, // Frontend sends cycleDuration
      } = req.body;

      console.log('📝 [CREATE_GROUP] Request body:', {
        name,
        monthlyContribution,
        totalMembers,
        maxMembers,
        startDate,
        cycleDuration,
      });

      // Use maxMembers if totalMembers is not provided
      const finalTotalMembers = totalMembers || maxMembers;
      if (!finalTotalMembers) {
        throw new ValidationError('Total members or max members is required');
      }

      // Get user's tenant_id
      console.log('🔍 [CREATE_GROUP] Getting tenant_id...');
      const userResult = await pool.query(
        'SELECT tenant_id FROM public.users WHERE id = $1',
        [req.userId]
      );
      const tenantId = userResult.rows[0]?.tenant_id;
      console.log('✅ [CREATE_GROUP] Tenant ID:', tenantId);

      // Calculate end date if not provided
      // Use cycleDuration if provided, otherwise use totalMembers
      const cycleMonths = cycleDuration || finalTotalMembers;
      const calculatedEndDate = endDate || new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + cycleMonths));
      console.log('📅 [CREATE_GROUP] Calculated end date:', calculatedEndDate);

      // Build settings JSON
      const settings = {
        monthly_contribution: monthlyContribution,
        max_members: finalTotalMembers,
        cycle_duration: cycleMonths,
        start_date: startDate,
        end_date: calculatedEndDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        payout_order: payoutOrder,
        penalty_fee: penaltyFee,
        group_image_url: groupImageUrl,
        rules: rules,
        status: 'recruiting',
      };

      console.log('💾 [CREATE_GROUP] Inserting group into database...');
      const result = await pool.query(
        `INSERT INTO savings_groups (name, description, created_by, tenant_id, settings)
         VALUES ($1, $2, $3, $4, $5::jsonb)
         RETURNING *`,
        [name, description || null, req.userId, tenantId, JSON.stringify(settings)]
      );

      const group = result.rows[0];
      console.log('✅ [CREATE_GROUP] Group created:', group.id);

      // Add creator as admin member
      console.log('👤 [CREATE_GROUP] Adding creator as admin member...');
      await pool.query(
        `INSERT INTO group_memberships (group_id, user_id, role, joined_at)
         VALUES ($1, $2, 'admin', CURRENT_DATE)`,
        [group.id, req.userId]
      );
      console.log('✅ [CREATE_GROUP] Creator added as admin');

      const parsedSettings = typeof group.settings === 'string' ? JSON.parse(group.settings) : (group.settings || settings);
      
      console.log('✅ [CREATE_GROUP] Sending response');
      res.status(201).json({
        id: group.id,
        name: group.name,
        description: group.description,
        adminId: group.created_by,
        adminName: 'You', // Will be filled by frontend
        monthlyContribution: parseFloat(parsedSettings.monthly_contribution || settings.monthly_contribution),
        currency: 'NGN',
        maxMembers: parseInt(parsedSettings.max_members || settings.max_members),
        totalMembers: parseInt(parsedSettings.max_members || settings.max_members),
        currentMembers: 1,
        cycleDuration: parseInt(parsedSettings.cycle_duration || settings.cycle_duration || finalTotalMembers),
        startDate: parsedSettings.start_date || settings.start_date,
        endDate: parsedSettings.end_date || settings.end_date,
        payoutOrder: parsedSettings.payout_order || settings.payout_order,
        penaltyFee: parseFloat(parsedSettings.penalty_fee || settings.penalty_fee),
        status: parsedSettings.status || settings.status,
        groupImageUrl: parsedSettings.group_image_url || settings.group_image_url,
        rules: parsedSettings.rules || settings.rules,
        createdAt: group.created_at,
        updatedAt: group.updated_at,
      });
    } catch (error: any) {
      console.error('❌ [CREATE_GROUP] Error:', error.message);
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ 
        message: 'Failed to create group', 
        code: 'CREATE_GROUP_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }
);

// Update group
router.put(
  '/:id',
  authenticate,
  validate([
    body('name').optional().notEmpty().withMessage('Group name cannot be empty'),
    body('monthlyContribution').optional().isFloat({ min: 0 }).withMessage('Monthly contribution must be a positive number'),
  ]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if user is admin
      const adminCheck = await pool.query(
        'SELECT created_by FROM savings_groups WHERE id = $1',
        [id]
      );

      if (adminCheck.rows.length === 0) {
        throw new NotFoundError('Group not found');
      }

      if (adminCheck.rows[0].created_by !== req.userId) {
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
         JOIN public.users u ON sg.created_by = u.id
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
        adminId: row.created_by,
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
       JOIN public.users u ON gm.user_id = u.id
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
       VALUES ($1, $2, 'member', CURRENT_DATE)`,
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

// Remove member from group (admin only)
router.delete('/:id/members/:userId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;

    // Check if user is admin of the group
    const groupCheck = await pool.query(
      'SELECT created_by FROM savings_groups WHERE id = $1',
      [id]
    );

    if (groupCheck.rows.length === 0) {
      throw new NotFoundError('Group not found');
    }

    if (groupCheck.rows[0].created_by !== req.userId) {
      throw new ForbiddenError('Only group admin can remove members');
    }

    // Check if target user is a member
    const memberCheck = await pool.query(
      'SELECT role FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new NotFoundError('User is not a member of this group');
    }

    // Don't allow removing admin
    if (memberCheck.rows[0].role === 'admin') {
      throw new ValidationError('Cannot remove group admin');
    }

    // Remove member
    await pool.query(
      'DELETE FROM group_memberships WHERE group_id = $1 AND user_id = $2',
      [id, userId]
    );

    // Update group member count
    const memberCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM group_memberships WHERE group_id = $1',
      [id]
    );
    const currentMembers = parseInt(memberCountResult.rows[0].count);

    res.json({ message: 'Member removed successfully', currentMembers });
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError || error instanceof ForbiddenError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to remove member', code: 'REMOVE_MEMBER_ERROR' });
  }
});

export default router;

