import { reviewRepository } from '../repositories/reviews.repository';
import { llmClient } from '../llm/client';
export const reviewService = {
   //    async getReviews(productId: number): Promise<Review[]> {
   //       return reviewRepository.getReviews(productId);
   //    },

   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) return existingSummary;
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const summary = await llmClient.summarizeReviews(joinedReviews);

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
