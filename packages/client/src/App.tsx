//import ChatBot from './components/chat/ChatBot';
import ReviewList from './components/reviews/reviewList';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         <ReviewList productId={1} />
      </div>
   );
}

export default App;
