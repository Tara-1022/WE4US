// Layout.tsx
import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Sidebar style={{ width: '250px', backgroundColor: '#333', color: '#fff' }}>
        <Menu>
          <MenuItem>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/announcement" style={{ color: '#fff', textDecoration: 'none' }}>Announcement</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/halloffame" style={{ color: '#fff', textDecoration: 'none' }}>Hall of Fame</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/jobboard" style={{ color: '#fff', textDecoration: 'none' }}>Job Board</Link>
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Main Content */}
      <div style={{ marginLeft: '250px', padding: '20px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
