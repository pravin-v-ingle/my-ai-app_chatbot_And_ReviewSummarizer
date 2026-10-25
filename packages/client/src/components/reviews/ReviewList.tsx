import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import {
   type SummarizeResponse,
   type GetReviewsResponse,
   reviewsApi,
} from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   const recentSummary =
      reviewQuery.data?.summary || summaryMutation.data?.summary;
   if (reviewQuery.isPending) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (reviewQuery.isError) {
      return (
         <p className="text-red-500">
            Could not fetch reviews. Try again later.
         </p>
      );
   }

   if (!reviewQuery.data?.reviews.length) {
      return null;
   }
   return (
      <div>
         <div className="mb-5">
            {recentSummary ? (
               <p>{recentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not load summary. Try again later!
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
