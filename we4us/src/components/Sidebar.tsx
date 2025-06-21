import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, Briefcase, Users, Building2, Heart, Award, MessagesSquare } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';
import { useProfileContext } from './ProfileContext';
import { getProfileImageSource } from '../library/ImageHandling';
import '../styles/sidebar.css';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';
import { useAuth } from '../auth/AuthProvider';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void; 
}

const navItems = [
  { to: '/home', label: 'Home', icon: Home, highlightedPaths: ["/home"] },
  { to: '/announcements', label: 'Announcements', icon: Bell, highlightedPaths: ["/announcements"] },
  { to: '/reaching-out', label: 'Reaching Out', icon: Heart, highlightedPaths: ["/reaching-out", "/post", "/community", "/search"] },
  { to: '/whos-who', label: "Who's Who", icon: Award, highlightedPaths: ["/whos-who", "/profile"] },
  { to: '/job-board', label: 'Job Board', icon: Briefcase, highlightedPaths: ["/job-board"] },
  { to: '/meetup', label: 'Meet Up', icon: Users, highlightedPaths: ["/meetup"] },
  { to: '/pg-finder', label: 'PG Finder', icon: Building2, highlightedPaths: ["/pg-finder"] },
  { to: '/chats', label: 'Private Messaging', icon: MessagesSquare, highlightedPaths: ["/chats", "/chat"] }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { profileInfo } = useProfileContext();
  const { isLoggedIn } = useAuth();
  const profileImageUrl = getProfileImageSource(profileInfo)
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  const user = {
    name: profileInfo?.display_name,
    username: profileInfo?.username,
    avatar: profileImageUrl
  };

  const handlePasswordChange = (success: boolean) => {
    if (success) {
      alert("Password changed successfully!");
      setShowModal(false);  // Close the modal
    }
  };
    const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  return (
    <>
      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <Link to="/profile" className="user-profile" onClick={handleNavClick}>
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
                className={`nav-item ${(highlightedPaths.some((h) => location.pathname.startsWith(h))) ? 'active' : ''}`} onClick={handleNavClick}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </div>
          ))}
        </nav>

        {isLoggedIn && (
          <><div className="change-password-section">
            <p onClick={() => setShowModal(true)} className="text-link-orange">
              Change Password
            </p>
            <ChangePasswordModal
              isOpen={showModal}
              handleClose={() => setShowModal(false)}
              onPasswordChange={handlePasswordChange}
            />
          </div><div className="logout-section">
              <LogoutButton />
            </div></>
        )}
      </div>
    </>
  );
};

export default Sidebar;
