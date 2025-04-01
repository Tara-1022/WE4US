import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Briefcase, Users, Building2, Heart, Award } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';
import DuckAvatar from '../assets/profile_duck.png';
import { useProfileContext } from './ProfileContext';
import '../styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

<<<<<<< HEAD
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/job-board', label: 'Job Board' },
    { to: '/meet-up', label: 'Meet Up' },
    { to: '/pg-finder', label: 'PG Finder' },
    { to: '/profile', label: 'Profile' },
    { to: '/reaching-out', label: 'Reaching Out' },
    { to: '/whos-who', label: 'Who\'s Who' }
  ];
=======
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

  const user = {
    name: profileInfo?.displayName,
    username: profileInfo?.userName,
    avatar: DuckAvatar
  };
>>>>>>> 923972dee53c63de3bb3b1750c437fc8c644a8be

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
