import React from 'react';
import { GraduationCap } from 'lucide-react';
import WE from "../assets/We.png";
import '../styles/LandingPage.css';
import MemoriesGallery from '../components/MemoriesGallery';
import { memories } from '../assets/memories/MemoriesData';
import { LoginButton } from '../auth/LoginHandler';

const LandingPage: React.FC = () => {

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
            <LoginButton />
          </div>
        </div>
        <div className="landing-right">
          <img src={WE} alt="Women in Tech" className="landing-image" />
        </div>
      </div>
      <div className="memories-section">
        <MemoriesGallery memories={memories} />
      </div>
    </>
  );
};

export default LandingPage;