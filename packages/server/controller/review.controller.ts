import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product Id.' });
         return;
      }
      const reviews = await reviewService.getReviews(productId);

      res.json(reviews);
   },
};
