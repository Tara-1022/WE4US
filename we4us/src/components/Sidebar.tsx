import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Briefcase, Users, Building2, Heart, Award } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';
import { useProfileContext } from './ProfileContext';
import {getProfileImageSource } from '../library/ImageHandling';
import { useAuth } from '../auth/AuthProvider';
import '../styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { to: '/home', label: 'Home', icon: Home, highlightedPaths: ["/home"] },
  { to: '/announcements', label: 'Announcements', icon: Bell, highlightedPaths: ["/announcements"] },
  { to: '/reaching-out', label: 'Reaching Out', icon: Heart, highlightedPaths: ["/reaching-out", "/post", "/community", "/search"] },
  { to: '/whos-who', label: "Who's Who", icon: Award, highlightedPaths: ["/whos-who", "/profile"] },
  { to: '/job-board', label: 'Job Board', icon: Briefcase, highlightedPaths: ["/job-board"] },
  { to: '/meetup', label: 'Meet Up', icon: Users, highlightedPaths: ["/meetup"] },
  { to: '/pg-finder', label: 'PG Finder', icon: Building2, highlightedPaths: ["/pg-finder"] }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const {profileInfo} = useProfileContext();
  const { isLoggedIn } = useAuth();
  const profileImageUrl = getProfileImageSource(profileInfo)

  const user = {
    name: profileInfo?.display_name,
    username: profileInfo?.username,
    avatar: profileImageUrl
  };

  return (
    <>
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <Link to="/profile" className="user-profile">
          <img src={user.avatar} alt="Profile" className="user-avatar" />
          <div className="user-info">
            <div className="user-display-name">{user.name}</div>
            <div className="user-name">{user.username ? "@" + user.username : undefined}</div>
          </div>
        </Link>
        <nav className="nav-items">
          {navItems.map(({ to, label, icon: Icon, highlightedPaths }) => (
            <div key={to}>
              <Link
                to={to}
                className={`nav-item ${(highlightedPaths.some((h) => location.pathname.startsWith(h))) ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </div>
          ))}
        </nav>

        {isLoggedIn && (
          <div className="logout-section">
            <LogoutButton />
          </div>
        )}
        
      </div>
    </>
  );
};

export default Sidebar;
