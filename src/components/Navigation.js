import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
        <li><Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link></li>
        <li><Link to="/admin" className="text-white hover:text-gray-300">Admin</Link></li>
        <li><Link to="/chat" className="text-white hover:text-gray-300">Chat</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;