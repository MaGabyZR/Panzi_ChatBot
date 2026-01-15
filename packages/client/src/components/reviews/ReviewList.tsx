import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import StarRating from './StarRating';
import { useQuery } from '@tanstack/react-query';

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
   //use the query hook from Tanstack.
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId], //to cache reviews separatly for each product.
      queryFn: () => fetchReviews(), //get the data from the backend.
   });

   /*    //State variable. Replaced by useQuery.
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(''); */

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
      return (
         <p className="text-red-500">
            Could not fetch reviews. Try again later!
         </p>
      );
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
