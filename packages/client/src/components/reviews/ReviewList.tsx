import axios from 'axios';
import { HiSparkles } from 'react-icons/hi';
import StarRating from './StarRating';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
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
   //Track the summary.
   const [summary, setSummary] = useState('');
   //Track the loading state.
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);

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

   //Define a function for handling summary generation, and use axios to make an API call.
   const handleSummarize = async () => {
      setIsSummaryLoading(true);

      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );

      setSummary(data.summary);
      setIsSummaryLoading(false);
   };

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
         <p className="text-red-500">
            Could not fetch reviews. Try again later!
         </p>
      );
   }
   //if there are no reviews for a product.
   if (!reviewData?.reviews.length) {
      return null;
   }

   const currentSummary = reviewData.summary || summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
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
