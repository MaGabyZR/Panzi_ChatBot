import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
   value: number; // rating from 0 to 5
};

const StarRating = ({ value }: Props) => {
   //Placeholder to render icons.
   const placeholders = [1, 2, 3, 4, 5];

   return (
      <div className="flex gap-1 text-orange-400">
         {placeholders.map((p) =>
            p <= value ? <FaStar key={p} /> : <FaRegStar key={p} />
         )}
      </div>
   );
};

export default StarRating;
