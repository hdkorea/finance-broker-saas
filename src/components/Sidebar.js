import { Link } from 'react-router-dom';


import React from 'react';

function Sidebar({ clients = [], addNewClient, setSelectedClient }) {
    return (
      <div className="w-64 bg-gray-100 p-4">
        <button 
          onClick={addNewClient}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          + NEW CLIENT
        </button>
        {clients.length > 0 ? (
          <ul>
            {clients.map(client => (
              <li 
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="cursor-pointer p-2 hover:bg-gray-200 rounded"
              >
                {client.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No clients available</p>
        )}
      </div>
    );
  }

export default Sidebar;

<Link to="/admin" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
  Admin Dashboard
</Link>