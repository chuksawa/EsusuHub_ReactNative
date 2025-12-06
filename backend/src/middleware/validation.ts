import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('🔍 [VALIDATION] Starting validation for', req.path);
    console.log('🔍 [VALIDATION] Number of validators:', validations.length);
    try {
      // Add timeout to validation execution
      const validationPromise = Promise.all(validations.map((validation, index) => {
        console.log(`🔍 [VALIDATION] Running validator ${index + 1}/${validations.length}`);
        return validation.run(req);
      }));
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout after 5 seconds')), 5000)
      );
      
      await Promise.race([validationPromise, timeoutPromise]);
      console.log('✅ [VALIDATION] Validation checks completed');

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        console.log('✅ [VALIDATION] All validations passed, proceeding to handler');
        next();
        return;
      }

      console.log('❌ [VALIDATION] Validation failed:', errors.array());
      res.status(400).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: errors.array(),
      });
      return;
    } catch (error: any) {
      console.error('❌ [VALIDATION] Error during validation:', error);
      res.status(500).json({
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        error: error.message,
      });
      return;
    }
  };
};
