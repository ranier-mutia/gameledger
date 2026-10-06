// middleware/validateRequest.js

/**
 * Validates req.body or req.query against a Zod schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query'} target - Defaults to 'body' for POST routes
 */
export const validate = (schema, target = 'body') => (req, res, next) => {
    try {
      // 1. Run Zod parse on req.body (or req.query)
      const validatedData = schema.parse(req[target]);
  
      // 2. Overwrite req[target] with clean, coerced, transformed data
      req[target] = validatedData;
  
      // 3. Move to controller
      next();
    } catch (error) {
      // 4. Stop request if validation fails
      return res.status(400).json({
        error: 'Invalid request payload',
        details: error.errors,
      });
    }
  };