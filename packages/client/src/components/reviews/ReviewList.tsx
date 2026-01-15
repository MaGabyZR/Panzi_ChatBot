import axios from 'axios';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';

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

const ReviewList = ({ productId }: Props) => {
   //State variable.
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   useEffect(() => {
      //Const to make an API call using axios and insert products dynamically.
      const fetchReviews = async () => {
         try {
            setIsLoading(true);
            const { data } = await axios.get<GetReviewsResponse>(
               `/api/products/${productId}/reviews`
            );
            setReviewData(data);
         } catch (error) {
            console.error(error);
            setError('Could not fetch the reviews. Try again later!');
         } finally {
            setIsLoading(false);
         }
      };
      //make an API call and get the data.
      fetchReviews();
   }, [productId]);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <p className="text-red-500">{error}</p>;
   }

   return (
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
   );
};

export default ReviewList;
