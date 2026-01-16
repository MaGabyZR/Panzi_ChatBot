import axios from 'axios';

//In this module define all the Types and functions for talking to the backend.

//Define a type for the shape of the reviews.
export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};
//Define a type for the reviews endpoint object.
export type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export type SummarizeResponse = {
   summary: string;
};
//Make an API call using axios and insert products dynamically. You get the data and return it.
export const reviewsApi = {
   fetchReviews(productId: number) {
      return axios
         .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
         .then((res) => res.data);
   },
   //Define a function for handling summary generation, and use axios to make an API and return the data. This is only responsible for calling the backend.
   summarizeReviews(productId: number) {
      return axios
         .post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         )
         .then((res) => res.data);
   },
};
