import axios from 'axios';
import { useEffect, useState } from 'react';

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

   useEffect(() => {
      //Const to make an API call using axios and insert products dynamically.
      const fetchReviews = async () => {
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
      };
      //make an API call and get the data.
      fetchReviews();
   }, [productId]);

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>Rating: {review.rating}/5</div>
               <p className="py-2">{review.content}</p>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
