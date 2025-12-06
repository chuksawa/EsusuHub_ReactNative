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
    
    // Convert relative avatar URL to full URL if needed
    let avatarUrl = metadata.avatar_url || null;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || `localhost:${process.env.PORT || 5166}`;
      avatarUrl = `${protocol}://${host}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
    }
    
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone || '',
      fullName: user.full_name || '',
      handle: metadata.handle || '',
      avatarUrl: avatarUrl,
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
          'SELECT id FROM public.users WHERE metadata->>\'handle\' = $1 AND id != $2',
          [handle, req.userId]
        );
        if (handleCheck.rows.length > 0) {
          throw new ValidationError('Handle is already taken');
        }
      }

      // Check if phone is taken (if changed)
      if (phone) {
        const phoneCheck = await pool.query(
          'SELECT id FROM public.users WHERE phone = $1 AND id != $2',
          [phone, req.userId]
        );
        if (phoneCheck.rows.length > 0) {
          throw new ValidationError('Phone number is already taken');
        }
      }

      // Get current user metadata
      const currentUser = await pool.query(
        'SELECT metadata FROM public.users WHERE id = $1',
        [req.userId]
      );
      const currentMetadata = currentUser.rows[0]?.metadata || {};

      // Build update fields for public.users
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 1;
      const newMetadata = { ...currentMetadata };

      if (fullName) {
        updateFields.push(`full_name = $${paramCount++}`);
        updateValues.push(fullName);
      }
      if (phone) {
        updateFields.push(`phone = $${paramCount++}`);
        updateValues.push(phone);
      }
      
      // Store extended fields in metadata JSONB
      if (handle) newMetadata.handle = handle;
      if (dateOfBirth) newMetadata.date_of_birth = dateOfBirth;
      if (address) newMetadata.address = address;
      if (city) newMetadata.city = city;
      if (state) newMetadata.state = state;
      if (country) newMetadata.country = country;
      if (occupation) newMetadata.occupation = occupation;
      if (monthlyIncome !== undefined) newMetadata.monthly_income = monthlyIncome;
      if (emergencyContact) newMetadata.emergency_contact = emergencyContact;
      if (preferredLanguage) newMetadata.preferred_language = preferredLanguage;
      if (notificationPreferences) newMetadata.notification_preferences = notificationPreferences;

      // Update metadata if it changed
      if (Object.keys(newMetadata).length > Object.keys(currentMetadata).length || 
          JSON.stringify(newMetadata) !== JSON.stringify(currentMetadata)) {
        updateFields.push(`metadata = $${paramCount++}`);
        updateValues.push(JSON.stringify(newMetadata));
      }

      if (updateFields.length > 0) {
        updateValues.push(req.userId);
        await pool.query(
          `UPDATE public.users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount}`,
          updateValues
        );
      }

      // Get updated user (same query as /me endpoint)
      const result = await pool.query(
        `SELECT 
           COALESCE(pu.id, au.id) as id,
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
         WHERE COALESCE(pu.id, au.id) = $1
         LIMIT 1`,
        [req.userId]
      );

      const user = result.rows[0];
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
      console.log('📸 [UPLOAD_AVATAR] Request received from user:', req.userId);
      
      if (!req.file) {
        console.log('❌ [UPLOAD_AVATAR] No file uploaded');
        res.status(400).json({ message: 'No file uploaded', code: 'NO_FILE' });
        return;
      }

      console.log('✅ [UPLOAD_AVATAR] File received:', req.file.filename, req.file.size, 'bytes');

      // Get the base URL for the server
      const protocol = req.protocol || 'http';
      const host = req.get('host') || `localhost:${process.env.PORT || 5166}`;
      const baseUrl = `${protocol}://${host}`;
      
      // Return full URL so React Native can fetch it
      const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;
      
      console.log('📸 [UPLOAD_AVATAR] Avatar URL:', avatarUrl);

      // Get current user metadata
      const currentUser = await pool.query(
        'SELECT metadata FROM public.users WHERE id = $1',
        [req.userId]
      );
      const currentMetadata = currentUser.rows[0]?.metadata || {};

      // Update metadata with avatar_url
      const updatedMetadata = {
        ...currentMetadata,
        avatar_url: avatarUrl,
      };

      // Update user metadata in public.users table
      await pool.query(
        'UPDATE public.users SET metadata = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(updatedMetadata), req.userId]
      );

      console.log('✅ [UPLOAD_AVATAR] Avatar URL saved:', avatarUrl);

      res.json({ avatarUrl });
    } catch (error: any) {
      console.error('❌ [UPLOAD_AVATAR] Error:', error.message);
      res.status(500).json({ 
        message: 'Failed to upload avatar', 
        code: 'UPLOAD_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
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
    console.log('📋 [TRANSACTIONS] Fetching transactions for user:', req.userId);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    // Get contributions - check if payment_method exists, otherwise get from metadata
    let contributionsResult;
    try {
      contributionsResult = await pool.query(
        `SELECT c.id, c.group_id, c.amount, c.status, c.created_at,
                c.payment_reference, c.metadata,
                sg.name as group_name
         FROM contributions c
         JOIN savings_groups sg ON c.group_id = sg.id
         WHERE c.payer_user_id = $1
         ORDER BY c.created_at DESC
         LIMIT $2 OFFSET $3`,
        [req.userId, pageSize, offset]
      );
    } catch (contribError: any) {
      console.error('❌ [TRANSACTIONS] Error fetching contributions:', contribError.message);
      // If contributions table doesn't exist or has issues, return empty
      contributionsResult = { rows: [] };
    }

    // Get payouts
    let payoutsResult;
    try {
      payoutsResult = await pool.query(
        `SELECT p.id, p.group_id, p.amount, p.status, p.payout_date, p.created_at,
                sg.name as group_name
         FROM payouts p
         JOIN savings_groups sg ON p.group_id = sg.id
         WHERE p.recipient_id = $1
         ORDER BY p.created_at DESC
         LIMIT $2 OFFSET $3`,
        [req.userId, pageSize, offset]
      );
    } catch (payoutError: any) {
      console.error('❌ [TRANSACTIONS] Error fetching payouts:', payoutError.message);
      // If payouts table doesn't exist or has issues, return empty
      payoutsResult = { rows: [] };
    }

    // Get total counts (with error handling)
    let contributionsCount = { rows: [{ count: '0' }] };
    let payoutsCount = { rows: [{ count: '0' }] };
    
    try {
      contributionsCount = await pool.query(
        'SELECT COUNT(*) as count FROM contributions WHERE payer_user_id = $1',
        [req.userId]
      );
    } catch (e) {
      console.warn('⚠️  [TRANSACTIONS] Could not count contributions:', (e as any).message);
    }
    
    try {
      payoutsCount = await pool.query(
        'SELECT COUNT(*) as count FROM payouts WHERE recipient_id = $1',
        [req.userId]
      );
    } catch (e) {
      console.warn('⚠️  [TRANSACTIONS] Could not count payouts:', (e as any).message);
    }

    const transactions = [
      ...contributionsResult.rows.map((row) => {
        const metadata = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        return {
          id: row.id,
          type: 'contribution',
          groupId: row.group_id,
          groupName: row.group_name,
          amount: parseFloat(row.amount),
          status: row.status,
          date: row.created_at, // Use created_at if payment_date doesn't exist
          createdAt: row.created_at,
          paymentMethod: metadata.paymentMethod || 'unknown',
          transactionReference: row.payment_reference || null,
        };
      }),
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

    console.log('✅ [TRANSACTIONS] Returning', transactions.length, 'transactions');

    res.json({
      data: transactions, // Frontend expects 'data' field
      transactions, // Also include for compatibility
      total: parseInt(contributionsCount.rows[0]?.count || '0') + parseInt(payoutsCount.rows[0]?.count || '0'),
      page,
      pageSize,
    });
  } catch (error: any) {
    console.error('❌ [TRANSACTIONS] Error:', error.message);
    res.status(500).json({ 
      message: 'Failed to get transactions', 
      code: 'GET_TRANSACTIONS_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
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
      `SELECT 
         COALESCE(pu.id, au.id) as id,
         au.email,
         COALESCE(pu.phone, au.phone) as phone,
         pu.full_name,
         pu.metadata,
         au.email_confirmed_at
       FROM auth.users au
       LEFT JOIN public.users pu ON pu.auth_user_id = au.id
       WHERE (pu.full_name ILIKE $1 OR pu.metadata->>'handle' ILIKE $1 OR au.email ILIKE $1)
         AND COALESCE(pu.id, au.id) != $2
         AND (pu.metadata->>'status' IS NULL OR pu.metadata->>'status' = 'active')
       LIMIT 20`,
      [searchTerm, req.userId]
    );

    res.json(
      result.rows.map((row) => {
        const metadata = row.metadata || {};
        return {
          id: row.id,
          email: row.email,
          phone: row.phone || '',
          fullName: row.full_name || '',
          handle: metadata.handle || '',
          avatarUrl: metadata.avatar_url || null,
          isVerified: !!row.email_confirmed_at,
        };
      })
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to search users', code: 'SEARCH_ERROR' });
  }
});

export default router;

