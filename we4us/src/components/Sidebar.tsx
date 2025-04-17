import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Briefcase, Users, Building2, Heart, Award } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';
import { useProfileContext } from './ProfileContext';
import {getProfileImageUrl } from '../library/ImageHandling';
import '../styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/announcements', label: 'Announcements', icon: Bell },
  { to: '/reaching-out', label: 'Reaching Out', icon: Heart },
  { to: '/whos-who', label: "Who's Who", icon: Award },
  { to: '/job-board', label: 'Job Board', icon: Briefcase },
  { to: '/meetup', label: 'Meet Up', icon: Users },
  { to: '/pg-finder', label: 'PG Finder', icon: Building2 }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const {profileInfo} = useProfileContext();
  const profileImageUrl = getProfileImageUrl(profileInfo)

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
            <div className="user-name">{"@" + user.username}</div>
          </div>
        </Link>
        <nav className="nav-items">
          {navItems.map(({ to, label, icon: Icon }) => (
            <div key={to}>
              <Link
                to={to}
                className={`nav-item ${location.pathname === to ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </div>
          ))}
        </nav>

        <div className="logout-section">
          <LogoutButton/>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
