import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnnouncementPage from './pages/AnnouncementPage';
import AuthorisationPage from './pages/AuthorisationPage';
import JobBoardPage from './pages/JobBoard';
import MeetUpPage from './pages/MeetUpPage';
import PgFinderPage from './pages/PgFinder';
import ProfilePage from './pages/ProfilePage';
import ReachingOutPage from './pages/ReachingOut';
import WhosWhoPage from './pages/WhosWhoPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './auth/ProtectedRoute';
import CommunityPage from './pages/CommunityPage';
import Modal from "react-modal";
<<<<<<< HEAD
import AppContextProvider from './AppContextProvider';
=======
import LogoutButton from './auth/LogoutButton';
import LoginModal from './auth/LoginModal';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import CreateCommunityButton from "./create_community/CreateCommunityButton";
>>>>>>> 2928b6b (Added LemmyAPI code with getClient() function)
=======
import CreateCommunityButton from "./components/CreateCommunityButton";
>>>>>>> 3c3fa49 (Updated import statements)
=======
>>>>>>> 6a996b2 (Moved CreateCommunity Button to ReachingOut.tsx)
=======
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import CreateCommunityButton from "./create_community/CreateCommunityButton";
>>>>>>> 0638474 (Added files for the create community component)
=======
import CreateCommunityButton from "./components/CreateCommunityButton";
>>>>>>> 3c3fa49 (Updated import statements)
>>>>>>> Stashed changes
>>>>>>> 242d027 (Resolving merge conflicts)

Modal.setAppElement('#root');

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <Router>
        <div className="relative min-h-screen">
          <Sidebar />
<<<<<<< HEAD
=======
          <LogoutButton />
          <LoginModal />
>>>>>>> 6a996b2 (Moved CreateCommunity Button to ReachingOut.tsx)
          <main className="pt-10 px-4">
            <Routes>
              <Route path="/login" element={<AuthorisationPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/" element={<ProtectedRoute />} >
                <Route path="/announcements" element={<AnnouncementPage />} />
                <Route path="/job-board" element={<JobBoardPage />} />
                <Route path="/meetup" element={<MeetUpPage />} />
                <Route path="/pg-finder" element={<PgFinderPage />} />
                <Route path="/reaching-out" element={<ReachingOutPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/community/:communityId" element={<CommunityPage />} />
              </Route>
              {/* TODO: Move these back into the protected route */}
              <Route path="/profile/:id" element={<ProfilePage />} /> 
              <Route path="/whos-who" element={<WhosWhoPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
};


export default App;
