import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Briefcase, Users, Building2, Heart, Award } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = {
    name: 'Username', // Replace with actual user data
    avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  };

  return (
    <>
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <Link to="/profile" className="user-profile" onClick={onClose}>
          <img src={user.avatar} alt="Profile" className="user-avatar" />
          <div className="user-info">
            <div className="user-name">{user.name}</div>
          </div>
        </Link>

        <nav className="nav-items">
          {navItems.map(({ to, label, icon: Icon }) => (
            <div key={to}>
              <Link
                to={to}
                className={`nav-item ${location.pathname === to ? 'active' : ''}`}
                onClick={onClose}
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

      {isOpen && <div className="sidebar-overlay visible" onClick={onClose} />}
    </>
  );
};

export default Sidebar;
