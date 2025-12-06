import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { pool } from '../config/database';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

const router = Router();

// Get notifications
router.get(
  '/',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const unreadOnly = req.query.unreadOnly === 'true';
      const offset = (page - 1) * pageSize;

      let queryText = '';
      let queryParams: any[] = [];

      if (unreadOnly) {
        queryText = `
          SELECT * FROM notifications
          WHERE user_id = $1 AND is_read = false
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
        queryParams = [req.userId, pageSize, offset];
      } else {
        queryText = `
          SELECT * FROM notifications
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
        queryParams = [req.userId, pageSize, offset];
      }

      const result = await pool.query(queryText, queryParams);

      // Get total count
      let countQuery = '';
      let countParams: any[] = [];

      if (unreadOnly) {
        countQuery = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false';
        countParams = [req.userId];
      } else {
        countQuery = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1';
        countParams = [req.userId];
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        notifications: result.rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          title: row.title,
          message: row.message,
          type: row.type,
          relatedId: row.related_id,
          isRead: row.is_read,
          actionUrl: row.action_url,
          createdAt: row.created_at,
        })),
        total,
        page,
        pageSize,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to get notifications', code: 'GET_NOTIFICATIONS_ERROR' });
    }
  }
);

// Mark notification as read
router.put(
  '/:id/read',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, req.userId]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError('Notification not found');
      }

      res.json({ message: 'Notification marked as read' });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to mark notification as read', code: 'MARK_READ_ERROR' });
    }
  }
);

// Mark all notifications as read
router.put('/read-all', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [req.userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark all as read', code: 'MARK_ALL_READ_ERROR' });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Notification not found');
    }

    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message, code: error.code });
      return;
    }
    res.status(500).json({ message: 'Failed to delete notification', code: 'DELETE_ERROR' });
  }
});

// Get notification settings
router.get('/settings', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT metadata FROM public.users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      res.json({
        email: true,
        sms: true,
        push: true,
      });
      return;
    }

    const metadata = result.rows[0].metadata || {};
    const preferences = metadata.notification_preferences || {
      email: true,
      sms: true,
      push: true,
    };

    res.json(preferences);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get settings', code: 'GET_SETTINGS_ERROR' });
  }
});

// Update notification settings
router.put(
  '/settings',
  authenticate,
  [
    body('email').optional().isBoolean().withMessage('Email must be a boolean'),
    body('sms').optional().isBoolean().withMessage('SMS must be a boolean'),
    body('push').optional().isBoolean().withMessage('Push must be a boolean'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email, sms, push } = req.body;

      const preferences: any = {};
      if (email !== undefined) preferences.email = email;
      if (sms !== undefined) preferences.sms = sms;
      if (push !== undefined) preferences.push = push;

      // Get current metadata
      const currentResult = await pool.query(
        'SELECT metadata FROM public.users WHERE id = $1',
        [req.userId]
      );
      
      const currentMetadata = currentResult.rows[0]?.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        notification_preferences: {
          ...(currentMetadata.notification_preferences || { email: true, sms: true, push: true }),
          ...preferences,
        },
      };

      await pool.query(
        `UPDATE public.users
         SET metadata = $1::jsonb,
             updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(updatedMetadata), req.userId]
      );

      res.json(updatedMetadata.notification_preferences || { email: true, sms: true, push: true });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to update settings', code: 'UPDATE_SETTINGS_ERROR' });
    }
  }
);

export default router;

