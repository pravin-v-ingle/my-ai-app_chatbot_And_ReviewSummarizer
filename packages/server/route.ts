import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controller/chat.controller';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const router = express.Router();
const adapter = new PrismaMariaDb({
   host: process.env.DATABASE_HOST,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
   connectionLimit: 5,
});

router.get('/', (req: Request, res: Response) => {
   res.send('hello world');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'hello world' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const prisma = new PrismaClient({ adapter });
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid Product Id.' });
      return;
   }
   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });

   res.json(reviews);
});

export default router;
