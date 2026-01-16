import { HiSparkles } from 'react-icons/hi';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
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
   //call the mutation hook and give it an object, mutationFn, for mutating or updating data and call the API layer.
   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   //State variables replaced with the mutation hook above.
   /*    //Track the summary.
   const [summary, setSummary] = useState('');
   //Track the loading state.
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   //Track errors.
   const [summaryError, setSummaryError] = useState(''); */

   /*    //State variable. Replaced by useQuery bellow.
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(''); */

   //use the query hook from Tanstack.
   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId], //to cache reviews separatly for each product.
      queryFn: () => reviewsApi.fetchReviews(productId), //get the data from the backend from the API layer.
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (reviewsQuery.isError) {
      return (
         <p className="text-red-600">
            Could not fetch reviews. Try again later!
         </p>
      );
   }
   //if there are no reviews for a product.
   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p>{currentSummary}</p>
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
                     <p className="text-red-600">
                        Could not summarize reviews. Try again later!
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
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
