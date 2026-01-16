import axios from 'axios';
import { HiSparkles } from 'react-icons/hi';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
   productId: number;
};
//Define a type for the shape of the reviews.
type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};
//Define a type for the reviews endpoint object.
type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   //call the mutation hook and give it an object, mutationFn, for mutating or updating data.
   const {
      mutate: handleSummarize, //to handle the click event of th button.
      isPending: isSummaryLoading,
      isError: isSummaryError,
      data: SummarizeResponse,
   } = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   //State variables replaced with the mutation hook above.
   /*    //Track the summary.
   const [summary, setSummary] = useState('');
   //Track the loading state.
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   //Track errors.
   const [summaryError, setSummaryError] = useState(''); */

   /*    //State variable. Replaced by useQuery.
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(''); */

   //use the query hook from Tanstack.
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId], //to cache reviews separatly for each product.
      queryFn: () => fetchReviews(), //get the data from the backend.
   });

   //Define a function for handling summary generation, and use axios to make an API and return the data. This is only responsible for calling the backend.
   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   //The try/catch completly was replaced with the call to the backend above.
   /*       try {
         setIsSummaryLoading(true);
         setSummaryError('');

         const { data } = await axios.post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         );

         setSummary(data.summary);
      } catch (error) {
         console.error(error);
         setSummaryError('Could not summarize the reviews. Try again!');
      } finally {
         setIsSummaryLoading(false);
      } */

   //Const to make an API call using axios and insert products dynamically. You get the data and return it.
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <p className="text-red-600">
            Could not fetch reviews. Try again later!
         </p>
      );
   }
   //if there are no reviews for a product.
   if (!reviewData?.reviews.length) {
      return null;
   }

   const currentSummary = reviewData.summary || SummarizeResponse?.summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => handleSummarize()}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {isSummaryError && (
                     <p className="text-red-600">
                        Could not summarize reviews. Try again later!
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
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
