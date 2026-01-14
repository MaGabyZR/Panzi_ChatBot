import ReviewList from './components/reviews/ReviewList';

function App() {
   return (
      //to controll height and widht in a flexible way. Replace <ChatBot/> with <ReviewList/>
      <div className="p-4 h-screen w-full">
         <ReviewList productId={5} />
      </div>
   );
}

export default App;
