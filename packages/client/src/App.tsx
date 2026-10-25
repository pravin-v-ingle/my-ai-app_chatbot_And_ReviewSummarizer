import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router';
import ReviewsPage from './pages/ReviewsPage';
import ChatPage from './pages/ChatPage';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
   `px-3 py-1 rounded ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`;

function App() {
   return (
      <BrowserRouter>
         <div className="flex flex-col h-screen w-full">
            <nav className="flex gap-2 p-4 border-b">
               <NavLink to="/reviews" className={navLinkClass}>
                  Reviews
               </NavLink>
               <NavLink to="/chat" className={navLinkClass}>
                  Chatbot
               </NavLink>
            </nav>
            <main className="flex-1 min-h-0 p-4">
               <Routes>
                  <Route
                     path="/"
                     element={<Navigate to="/reviews" replace />}
                  />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/chat" element={<ChatPage />} />
               </Routes>
            </main>
         </div>
      </BrowserRouter>
   );
}

export default App;
