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
import AuthProvider from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import Modal from "react-modal";
import LogoutButton from './auth/LogoutButton';
import LoginModal from './auth/LoginModal';

Modal.setAppElement('#root');

const App: React.FC = () => {
  return (
    <AuthProvider >
      <Router>
        <div className="relative min-h-screen">
          <Sidebar />
          <LogoutButton />
          <LoginModal />
          <main className="pt-10 px-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/" element={<ProtectedRoute />} >
                <Route path="/announcements" element={<AnnouncementPage />} />
                <Route path="/authorization" element={<AuthorisationPage />} />
                <Route path="/job-board" element={<JobBoardPage />} />
                <Route path="/meetup" element={<MeetUpPage />} />
                <Route path="/pg-finder" element={<PgFinderPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/reaching-out" element={<ReachingOutPage />} />
                <Route path="/whos-who" element={<WhosWhoPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};


export default App;