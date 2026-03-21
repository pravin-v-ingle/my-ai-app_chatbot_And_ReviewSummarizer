import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controller/chat.controller';
import { reviewController } from './controller/review.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('hello world');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'hello world' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

export default router;
