import React from 'react';
import { GraduationCap } from 'lucide-react';
import WordPoem from "../assets/word_poem.png"
import '../styles/LandingPage.css';
import MemoriesGallery from '../components/MemoriesGallery';
import { memories } from '../assets/memories/MemoriesData';
import { LoginButton } from '../auth/LoginHandler';
import { useAuth } from '../auth/AuthProvider';
import AnnouncementsPreview from '../components/Announcements/AnnouncementsPreview';

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <div className="landing-container">
        <div className="landing-left">
          <div>
            <div className="landing-title">
              <GraduationCap size={70} />
              <h1>WE4US</h1>
            </div>
            <p className="landing-desc">
              Hello Duckie! Welcome to WE4US, a vibrant community of smart women engineers shaping
              the future of technology.
            </p>
            {isLoggedIn ? <AnnouncementsPreview /> : <LoginButton />}
          </div>
        </div>
        <div className="landing-right">
          <img src={WordPoem} alt="Women in Tech" className="landing-image" />
        </div>
      </div>
      <div className="memories-section">
        <MemoriesGallery memories={memories} />
      </div>
    </>
  );
};

export default LandingPage;