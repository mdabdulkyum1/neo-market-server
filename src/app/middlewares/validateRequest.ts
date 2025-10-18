import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodType, ZodRawShape } from "zod";

const validateRequest =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

export const validateRequestArray =
  (schema: ZodType<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
