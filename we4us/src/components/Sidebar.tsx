import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/authorization', label: 'Authorization' },
    { to: '/job-board', label: 'Job Board' },
    { to: '/meetup', label: 'Meet Up' },
    { to: '/pg-finder', label: 'PG Finder' },
    { to: '/profile', label: 'Profile' },
    { to: '/reaching-out', label: 'Reaching Out' },
    { to: '/whos-who', label: 'Who\'s Who' }
  ];

  return (
    <>
      {}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 text-white"
      >
        <Menu size={24} />
      </button>

      {}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 flex"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div 
            className="w-64 h-full bg-gray-900 text-white shadow-lg transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold">WE4US</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link 
                      to={item.to} 
                      onClick={() => setIsOpen(false)}
                      className="block py-2 px-4 hover:bg-gray-700 rounded"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;