import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div>
      <button 
        onClick={toggleSidebar} 
        className={`sidebar-toggle ${isSidebarOpen ? 'sidebar-open' : ''}`}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;