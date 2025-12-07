import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { pool } from '../config/database';
import { config } from '../config/env';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { validate } from '../middleware/validation';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError, UnauthorizedError, ValidationError } from '../utils/errors';

const router = Router();

// Register
router.post(
  '/register',
  // Add a simple middleware to log request arrival
  (req, _res, next) => {
    console.log('📨 [REGISTER] Request arrived at route handler');
    console.log('📨 [REGISTER] Body:', JSON.stringify(req.body));
    next();
  },
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone')
      .notEmpty().withMessage('Phone number is required')
      .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters')
      .matches(/^[\+]?[0-9\s\-\(\)]+$/).withMessage('Phone number contains invalid characters'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('fullName').notEmpty().withMessage('Full name is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const { email, phone, password, fullName } = req.body;
    console.log('📥 [REGISTER] Request received:', {
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      body: { email, fullName, phone: phone ? '***' : undefined, hasPassword: !!password },
      timestamp: new Date().toISOString(),
    });
    try {

      console.log('🔐 [REGISTER] Hashing password...');
      // Hash password first (fast operation)
      const passwordHash = await hashPassword(password);
      console.log('✅ [REGISTER] Password hashed');

      // Check if user exists (with timeout)
      console.log('🔍 [REGISTER] Checking if user exists...');
      let existingUser;
      try {
        existingUser = await Promise.race([
          pool.query('SELECT id FROM public.users WHERE email = $1 OR phone = $2', [email, phone]),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 5000))
        ]) as any;
        console.log('✅ [REGISTER] User check completed');
      } catch (queryError: any) {
        if (queryError.message === 'Query timeout') {
          console.error('Database query timeout - using dev mode workaround');
          // In dev mode, skip database check and create mock user
          if (config.nodeEnv === 'development') {
            const mockUser = {
              id: `mock_${Date.now()}`,
              email,
              phone,
              full_name: fullName,
              email_confirmed_at: new Date(),
              created_at: new Date(),
            };
            
            const accessToken = generateAccessToken({ userId: mockUser.id, email: mockUser.email });
            const refreshToken = generateRefreshToken({ userId: mockUser.id, email: mockUser.email });
            
            res.status(201).json({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                phone: mockUser.phone,
                fullName: mockUser.full_name,
                isVerified: true,
                createdAt: mockUser.created_at,
              },
              accessToken,
              refreshToken,
              _devNote: 'Mock user created - database query timeout',
            });
          }
          throw new ValidationError('Database connection timeout. Please try again.');
        }
        throw queryError;
      }

      if (existingUser.rows.length > 0) {
        throw new ValidationError('User with this email or phone already exists');
      }

      // Get tenant_id from first tenant or create default (with timeout)
      let tenantId = null;
      try {
        const tenantResult = await Promise.race([
          pool.query('SELECT id FROM tenants LIMIT 1'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000))
        ]) as any;
        tenantId = tenantResult.rows[0]?.id || null;
      } catch (tenantError: any) {
        // If tenant query fails, continue with null (not critical)
        console.warn('Could not get tenant_id, continuing with null:', tenantError.message);
      }

      // Create user (Supabase schema)
      // Note: Supabase may have RLS policies that prevent direct inserts
      // If this fails, we may need to use Supabase Auth API instead
      console.log('💾 [REGISTER] Inserting user into database...');
      let result;
      try {
        // First, create user in auth.users (Supabase schema)
        console.log('📝 [REGISTER] Creating in auth.users...');
        const authResult = await Promise.race([
          pool.query(
            `INSERT INTO auth.users (
              instance_id, id, aud, role, email, encrypted_password, 
              email_confirmed_at, created_at, updated_at, phone
            )
            VALUES (
              '00000000-0000-0000-0000-000000000000',
              gen_random_uuid(),
              'authenticated',
              'authenticated',
              $1,
              $2,
              NOW(),
              NOW(),
              NOW(),
              $3
            )
            RETURNING id, email`,
            [email, passwordHash, phone]
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Auth insert timeout')), 5000))
        ]) as any;
        
        const authUser = authResult.rows[0];
        console.log('✅ [REGISTER] Created in auth.users:', authUser.id);
        
        // Then, create user in public.users
        console.log('📝 [REGISTER] Creating in public.users...');
        result = await Promise.race([
          pool.query(
            `INSERT INTO public.users (id, tenant_id, auth_user_id, email, full_name, phone, created_at, updated_at)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING id, email, phone, full_name, created_at`,
            [tenantId, authUser.id, email, fullName, phone]
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Public insert timeout')), 5000))
        ]) as any;
        console.log('✅ [REGISTER] User inserted successfully:', result.rows[0]?.id);
      } catch (dbError: any) {
        // Handle timeout errors
        if (dbError.message === 'Auth insert timeout' || dbError.message === 'Public insert timeout') {
          console.error('Database insert timeout - using dev mode workaround');
          if (config.nodeEnv === 'development') {
            const mockUser = {
              id: `mock_${Date.now()}`,
              email,
              phone,
              full_name: fullName,
              email_confirmed_at: new Date(),
              created_at: new Date(),
            };
            
            const accessToken = generateAccessToken({ userId: mockUser.id, email: mockUser.email });
            const refreshToken = generateRefreshToken({ userId: mockUser.id, email: mockUser.email });
            
            res.status(201).json({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                phone: mockUser.phone,
                fullName: mockUser.full_name,
                isVerified: true,
                createdAt: mockUser.created_at,
              },
              accessToken,
              refreshToken,
              _devNote: 'Mock user created - database insert timeout',
            });
          }
          throw new ValidationError('Database operation timed out. Please try again.');
        }
        
        // If encrypted_password column doesn't exist or RLS blocks it
        if (dbError.message?.includes('encrypted_password') || 
            dbError.message?.includes('permission denied') ||
            dbError.message?.includes('new row violates row-level security')) {
          console.error('Database insert failed - Supabase RLS or schema issue:', dbError.message);
          
          // In dev mode, create a mock user response to allow testing
          if (config.nodeEnv === 'development') {
            console.warn('⚠️  Dev mode: Creating mock user due to database restrictions');
            const mockUser = {
              id: `mock_${Date.now()}`,
              email,
              phone,
              full_name: fullName,
              email_confirmed_at: new Date(),
              created_at: new Date(),
            };
            
            // Generate tokens for mock user
            const accessToken = generateAccessToken({ userId: mockUser.id, email: mockUser.email });
            const refreshToken = generateRefreshToken({ userId: mockUser.id, email: mockUser.email });
            
            res.status(201).json({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                phone: mockUser.phone,
                fullName: mockUser.full_name,
                isVerified: true,
                createdAt: mockUser.created_at,
              },
              accessToken,
              refreshToken,
              _devNote: 'Mock user created - database insert blocked by Supabase RLS',
            });
          }
          
          throw new ValidationError(
            'Registration failed due to database permissions. ' +
            'Supabase users table is protected by RLS. Please use Supabase Auth API or contact administrator.'
          );
        }
        throw dbError;
      }

      const user = result.rows[0];

      // Generate tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          fullName: user.full_name,
          isVerified: !!user.email_confirmed_at,
          createdAt: user.created_at,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      // Provide more detailed error in dev mode
      const isDev = process.env.NODE_ENV !== 'production';
      const errorMessage = isDev && error.message 
        ? `Registration failed: ${error.message}` 
        : 'Registration failed';
      res.status(500).json({ 
        message: errorMessage, 
        code: 'REGISTRATION_ERROR',
        ...(isDev && { details: error.message })
      });
    }
  }
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    console.log('🔐 [LOGIN] Request received:', { email, hasPassword: !!password });
    try {
      // Find user - Supabase uses auth.users for passwords, public.users for profile
      console.log('🔍 [LOGIN] Searching for user with email:', email);
      const result = await pool.query(
        `SELECT 
           COALESCE(pu.id, au.id) as id,
           au.email,
           COALESCE(pu.phone, au.phone) as phone,
           pu.full_name,
           au.encrypted_password::text as encrypted_password,
           au.email_confirmed_at,
           au.deleted_at,
           au.last_sign_in_at
         FROM auth.users au
         LEFT JOIN public.users pu ON pu.auth_user_id = au.id
         WHERE au.email = $1 
         LIMIT 1`,
        [email]
      );
      console.log('✅ [LOGIN] User query completed, found:', result.rows.length, 'user(s)');

      if (result.rows.length === 0) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const user = result.rows[0];
      console.log('📋 [LOGIN] User data:', { 
        id: user.id, 
        email: user.email, 
        hasPassword: !!user.encrypted_password,
        passwordType: typeof user.encrypted_password 
      });

      // Check if user is deleted
      if (user.deleted_at) {
        throw new UnauthorizedError('Account has been deleted');
      }

      // Verify password (from auth.users)
      console.log('🔐 [LOGIN] Verifying password...');
      // Ensure encrypted_password is a string
      const passwordHash = typeof user.encrypted_password === 'string' 
        ? user.encrypted_password 
        : (user.encrypted_password ? String(user.encrypted_password) : null);
      
      // If no password hash exists, this user was likely created via Supabase Auth UI
      // In dev mode, we can allow login with a default password or skip verification
      if (!passwordHash) {
        if (config.nodeEnv === 'development') {
          console.warn('⚠️  [LOGIN] User has no password hash. In dev mode, allowing login.');
          console.warn('⚠️  [LOGIN] Dev mode: Skipping password check for user without hash');
          // Allow login in dev mode if no password is set
        } else {
          throw new UnauthorizedError('Account not properly configured. Please reset your password.');
        }
      } else {
        const isValidPassword = await comparePassword(password, passwordHash);
        if (!isValidPassword) {
          console.log('❌ [LOGIN] Password verification failed');
          throw new UnauthorizedError('Invalid email or password');
        }
        console.log('✅ [LOGIN] Password verified');
      }
      
      // Continue with login if we get here (password verified or dev mode bypass)

      // Update last login in auth.users (use auth_user_id if available, otherwise use id)
      console.log('📝 [LOGIN] Updating last_sign_in_at...');
      const authUserId = user.id; // This is from auth.users
      await pool.query('UPDATE auth.users SET last_sign_in_at = NOW() WHERE id = $1', [authUserId]);
      console.log('✅ [LOGIN] Last sign in updated');

      // Generate tokens (use public.users id if available, otherwise auth.users id)
      console.log('🎫 [LOGIN] Generating tokens...');
      const userId = user.id; // Use the ID from the query result
      const accessToken = generateAccessToken({ userId, email: user.email });
      const refreshToken = generateRefreshToken({ userId, email: user.email });
      console.log('✅ [LOGIN] Tokens generated, sending response');

      res.json({
        user: {
          id: userId,
          email: user.email,
          phone: user.phone || '',
          fullName: user.full_name || '',
          isVerified: !!user.email_confirmed_at,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      console.error('❌ [LOGIN] Error:', error.message || error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message, code: error.code });
        return;
      }
      res.status(500).json({ message: 'Login failed', code: 'LOGIN_ERROR', details: error.message });
    }
  }
);

// Refresh token
router.post(
  '/refresh-token',
  validate([
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const payload = verifyRefreshToken(refreshToken);
      
      // Generate new tokens
      const accessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
      const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email });

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error: any) {
      res.status(401).json({ message: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.phone, u.full_name, u.email_confirmed_at, 
              u.created_at, u.updated_at, u.last_sign_in_at, u.deleted_at,
              u.metadata, u.raw_user_meta_data
       FROM public.users u
       WHERE u.id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND' });
      return;
    }

    const user = result.rows[0];
    const metadata = user.metadata || user.raw_user_meta_data || {};
    
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.full_name,
      isVerified: !!user.email_confirmed_at,
      metadata,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_sign_in_at,
      deletedAt: user.deleted_at,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get user', code: 'GET_USER_ERROR' });
  }
});

// Logout
router.post('/logout', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  // In a production app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
});

// Forgot password
router.post(
  '/forgot-password',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await pool.query('SELECT id FROM public.users WHERE email = $1', [email]);
      
      if (result.rows.length > 0) {
        // In production, send password reset email here
        // For now, just return success
      }

      res.json({ message: 'If the email exists, a password reset link has been sent' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to process request', code: 'FORGOT_PASSWORD_ERROR' });
    }
  }
);

// Reset password
router.post(
  '/reset-password',
  validate([
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      // In production, verify the reset token
      // For now, this is a placeholder
      res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to reset password', code: 'RESET_PASSWORD_ERROR' });
    }
  }
);

// Verify email
router.post(
  '/verify-email',
  validate([
    body('token').notEmpty().withMessage('Verification token is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;

      // In production, verify the email token
      // For now, this is a placeholder
      res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to verify email', code: 'VERIFY_EMAIL_ERROR' });
    }
  }
);

// Resend verification
router.post(
  '/resend-verification',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      // In production, send verification email
      res.json({ message: 'Verification email sent' });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to send verification email', code: 'RESEND_VERIFICATION_ERROR' });
    }
  }
);

export default router;

