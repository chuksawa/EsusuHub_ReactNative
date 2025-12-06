import { Router, Response } from 'express';
import { body } from 'express-validator';
import { pool } from '../config/database';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { NotFoundError, ValidationError } from '../utils/errors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Get user profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📋 [GET_PROFILE] Fetching profile for user:', req.userId);
    
    // Query Supabase schema: public.users + auth.users join
    // The userId from JWT could be either public.users.id or auth.users.id
    // Try matching on both
    const result = await pool.query(
      `SELECT 
         COALESCE(pu.id, au.id) as id,
         au.id as auth_user_id,
         pu.id as public_user_id,
         au.email,
         COALESCE(pu.phone, au.phone) as phone,
         pu.full_name,
         au.email_confirmed_at,
         pu.metadata,
         pu.created_at,
         pu.updated_at,
         au.last_sign_in_at as last_login
       FROM auth.users au
       LEFT JOIN public.users pu ON pu.auth_user_id = au.id
       WHERE (pu.id = $1 OR au.id = $1)
       LIMIT 1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ [GET_PROFILE] User not found:', req.userId);
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
      return;
    }

    const user = result.rows[0];
    console.log('✅ [GET_PROFILE] Profile found for:', user.email);
    
    // Extract additional data from metadata JSONB if available
    const metadata = user.metadata || {};
    
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone || '',
      fullName: user.full_name || '',
      handle: metadata.handle || '',
      avatarUrl: metadata.avatar_url || null,
      isVerified: !!user.email_confirmed_at,
      bvn: metadata.bvn || null,
      nin: metadata.nin || null,
      dateOfBirth: metadata.date_of_birth || null,
      address: metadata.address || null,
      city: metadata.city || null,
      state: metadata.state || null,
      country: metadata.country || 'Nigeria',
      occupation: metadata.occupation || null,
      monthlyIncome: metadata.monthly_income ? parseFloat(metadata.monthly_income) : null,
      emergencyContact: metadata.emergency_contact || {
        name: null,
        phone: null,
        relationship: null,
      },
      preferredLanguage: metadata.preferred_language || 'en',
      notificationPreferences: metadata.notification_preferences || {
        email: true,
        sms: true,
        push: true,
      },
      kycStatus: metadata.kyc_status || 'pending',
      kycDocuments: metadata.kyc_documents || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
      status: metadata.status || 'active',
    });
  } catch (error: any) {
    console.error('❌ [GET_PROFILE] Error:', error.message);
    res.status(500).json({ 
      message: 'Failed to get profile', 
      code: 'GET_PROFILE_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Update user profile
router.put(
  '/me',
  authenticate,
  [
    body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('handle').optional().isLength({ min: 3, max: 50 }).withMessage('Handle must be between 3 and 50 characters'),
    body('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
  ],
  validate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        fullName,
        handle,
        phone,
        dateOfBirth,
        address,
        city,
        state,
        country,
        occupation,
        monthlyIncome,
        emergencyContact,
        preferredLanguage,
        notificationPreferences,
      } = req.body;

      // Check if handle is taken (if changed)
      if (handle) {
        const handleCheck = await pool.query(
          'SELECT id FROM users WHERE handle = $1 AND id != $2',
          [handle, req.userId]
        );
        if (handleCheck.rows.length > 0) {
          throw new ValidationError('Handle is already taken');
        }
      }

      // Check if phone is taken (if changed)
      if (phone) {
        const phoneCheck = await pool.query(
          'SELECT id FROM users WHERE phone = $1 AND id != $2',
          [phone, req.userId]
        );
        if (phoneCheck.rows.length > 0) {
          throw new ValidationError('Phone number is already taken');
        }
      }

      // Update user
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 1;

      if (fullName) {
        updateFields.push(`full_name = $${paramCount++}`);
        updateValues.push(fullName);
      }
      if (handle) {
        updateFields.push(`handle = $${paramCount++}`);
        updateValues.push(handle);
      }
      if (phone) {
        updateFields.push(`phone = $${paramCount++}`);
        updateValues.push(phone);
      }
      if (dateOfBirth) {
        updateFields.push(`date_of_birth = $${paramCount++}`);
        updateValues.push(dateOfBirth);
      }
      if (address) {
        updateFields.push(`address = $${paramCount++}`);
        updateValues.push(address);
      }
      if (city) {
        updateFields.push(`city = $${paramCount++}`);
        updateValues.push(city);
      }
      if (state) {
        updateFields.push(`state = $${paramCount++}`);
        updateValues.push(state);
      }
      if (country) {
        updateFields.push(`country = $${paramCount++}`);
        updateValues.push(country);
      }
      if (occupation) {
        updateFields.push(`occupation = $${paramCount++}`);
        updateValues.push(occupation);
      }
      if (monthlyIncome !== undefined) {
        updateFields.push(`monthly_income = $${paramCount++}`);
        updateValues.push(monthlyIncome);
      }

      if (updateFields.length > 0) {
        updateValues.push(req.userId);
        await pool.query(
          `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount}`,
          updateValues
        );
      }

      // Update user profile
      if (emergencyContact || preferredLanguage || notificationPreferences) {
        const profileFields: string[] = [];
        const profileValues: any[] = [];
        let profileParamCount = 1;

        if (emergencyContact) {
          if (emergencyContact.name) {
            profileFields.push(`emergency_contact_name = $${profileParamCount++}`);
            profileValues.push(emergencyContact.name);
          }
          if (emergencyContact.phone) {
            profileFields.push(`emergency_contact_phone = $${profileParamCount++}`);
            profileValues.push(emergencyContact.phone);
          }
          if (emergencyContact.relationship) {
            profileFields.push(`emergency_contact_relationship = $${profileParamCount++}`);
            profileValues.push(emergencyContact.relationship);
          }
        }
        if (preferredLanguage) {
          profileFields.push(`preferred_language = $${profileParamCount++}`);
          profileValues.push(preferredLanguage);
        }
        if (notificationPreferences) {
          profileFields.push(`notification_preferences = $${profileParamCount++}`);
          profileValues.push(JSON.stringify(notificationPreferences));
        }

        if (profileFields.length > 0) {
          profileValues.push(req.userId);
          await pool.query(
            `UPDATE user_profiles SET ${profileFields.join(', ')}, updated_at = NOW() WHERE user_id = $${profileParamCount}`,
            profileValues
          );
        }
      }

      // Get updated user
      const result = await pool.query(
        `SELECT u.id, u.email, u.phone, u.full_name, u.handle, u.avatar_url, u.is_verified,
                u.bvn, u.nin, u.date_of_birth, u.address, u.city, u.state, u.country,
                u.occupation, u.monthly_income, u.created_at, u.updated_at, u.last_login, u.status,
                up.emergency_contact_name, up.emergency_contact_phone, up.emergency_contact_relationship,
                up.preferred_language, up.notification_preferences, up.kyc_status, up.kyc_documents
         FROM users u
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [req.userId]
      );

      const user = result.rows[0];
      res.json({
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        handle: user.handle,
        avatarUrl: user.avatar_url,
        isVerified: user.is_verified,
        bvn: user.bvn,
        nin: user.nin,
        dateOfBirth: user.date_of_birth,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        occupation: user.occupation,
        monthlyIncome: user.monthly_income ? parseFloat(user.monthly_income) : null,
        emergencyContact: {
          name: user.emergency_contact_name,
          phone: user.emergency_contact_phone,
          relationship: user.emergency_contact_relationship,
        },
        preferredLanguage: user.preferred_language,
        notificationPreferences: user.notification_preferences,
        kycStatus: user.kyc_status,
        kycDocuments: user.kyc_documents,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login,
        status: user.status,
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Failed to update profile', code: 'UPDATE_PROFILE_ERROR' });
    }
  }
);

// Upload avatar
router.post(
  '/me/avatar',
  authenticate,
  upload.single('file'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
        return;
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      await pool.query('UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [
        avatarUrl,
        req.userId,
      ]);

      res.json({ avatarUrl });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to upload avatar', code: 'UPLOAD_ERROR' });
    }
  }
);

// Get user achievements (placeholder)
router.get('/me/achievements', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // This would query achievements from a separate table
    // For now, return empty array
    res.json([]);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get achievements', code: 'GET_ACHIEVEMENTS_ERROR' });
  }
});

// Get user transactions
router.get('/me/transactions', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    // Get contributions
    const contributionsResult = await pool.query(
      `SELECT c.id, c.group_id, c.amount, c.payment_method, c.status, c.payment_date, c.created_at,
              sg.name as group_name
       FROM contributions c
       JOIN savings_groups sg ON c.group_id = sg.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, pageSize, offset]
    );

    // Get payouts
    const payoutsResult = await pool.query(
      `SELECT p.id, p.group_id, p.amount, p.status, p.payout_date, p.created_at,
              sg.name as group_name
       FROM payouts p
       JOIN savings_groups sg ON p.group_id = sg.id
       WHERE p.recipient_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, pageSize, offset]
    );

    // Get total counts
    const contributionsCount = await pool.query(
      'SELECT COUNT(*) FROM contributions WHERE user_id = $1',
      [req.userId]
    );
    const payoutsCount = await pool.query(
      'SELECT COUNT(*) FROM payouts WHERE recipient_id = $1',
      [req.userId]
    );

    const transactions = [
      ...contributionsResult.rows.map((row) => ({
        id: row.id,
        type: 'contribution',
        groupId: row.group_id,
        groupName: row.group_name,
        amount: parseFloat(row.amount),
        status: row.status,
        date: row.payment_date || row.created_at,
        createdAt: row.created_at,
      })),
      ...payoutsResult.rows.map((row) => ({
        id: row.id,
        type: 'payout',
        groupId: row.group_id,
        groupName: row.group_name,
        amount: parseFloat(row.amount),
        status: row.status,
        date: row.payout_date || row.created_at,
        createdAt: row.created_at,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      transactions,
      total: parseInt(contributionsCount.rows[0].count) + parseInt(payoutsCount.rows[0].count),
      page,
      pageSize,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get transactions', code: 'GET_TRANSACTIONS_ERROR' });
  }
});

// Search users
router.get('/search', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      res.json([]);
      return;
    }

    const searchTerm = `%${query}%`;
    const result = await pool.query(
      `SELECT id, email, phone, full_name, handle, avatar_url, is_verified
       FROM users
       WHERE (full_name ILIKE $1 OR handle ILIKE $1 OR email ILIKE $1)
         AND id != $2
         AND status = 'active'
       LIMIT 20`,
      [searchTerm, req.userId]
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        email: row.email,
        phone: row.phone,
        fullName: row.full_name,
        handle: row.handle,
        avatarUrl: row.avatar_url,
        isVerified: row.is_verified,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to search users', code: 'SEARCH_ERROR' });
  }
});

export default router;

