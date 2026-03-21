import { type Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/reviews.repository';
import { llmClient } from '../llm/client';
import promptSummarizeReviews from '../prompts/summarizeReviews.txt';
export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = promptSummarizeReviews.replace(
         '{{reviews}}',
         joinedReviews
      );
      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1',
         prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
