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

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Sidebar />
        <main className="pt-10 px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/announcements" element={<AnnouncementPage />} />
            <Route path="/authorization" element={<AuthorisationPage />} />
            <Route path="/job-board" element={<JobBoardPage />} />
            <Route path="/meetup" element={<MeetUpPage />} />
            <Route path="/pg-finder" element={<PgFinderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reaching-out" element={<ReachingOutPage />} />
            <Route path="/whos-who" element={<WhosWhoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
import { useEffect, useState } from 'react'
import { PostView } from 'lemmy-js-client';
import { getPostList } from './components/lib';
import PostList from './components/PostList';
import './App.css'

const Loader = () => <h3>Loading...</h3>;

function App() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null)
  useEffect(() => {
    setTimeout(() => { // simulating a delay. TODO: Remove timeout
      getPostList().then(postList => setPostViews(postList));
      console.log("Fetched posts")
    }, 1000)
  }
    , [])
  if (!postViews) {
    return <Loader />;
  }
  else if (postViews.length == 0) {
    return <h3>No posts to see!</h3>;
  }
  else {
    return (
      <>
        <h1>Recent Posts</h1>
        <PostList postViews={postViews} />
      </>
    );
  }
}

export default App;