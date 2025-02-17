import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with a lighter background */}
      <Sidebar style={{ width: '250px', backgroundColor: '#f4f4f4', color: '#333' }}>
        <Menu>
          <MenuItem>
            <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Home</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/announcements" style={{ color: '#333', textDecoration: 'none' }}>Announcements</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/authorization" style={{ color: '#333', textDecoration: 'none' }}>Authorization</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/jobboard" style={{ color: '#333', textDecoration: 'none' }}>Job Board</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/meetup" style={{ color: '#333', textDecoration: 'none' }}>Meet Up</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/pgfinder" style={{ color: '#333', textDecoration: 'none' }}>PG Finder</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/profile" style={{ color: '#333', textDecoration: 'none' }}>Profile</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/reachingout" style={{ color: '#333', textDecoration: 'none' }}>Reaching Out</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/whoswho" style={{ color: '#333', textDecoration: 'none' }}>Who's Who</Link>
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Main Content Area */}
      <div style={{ padding: '20px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
