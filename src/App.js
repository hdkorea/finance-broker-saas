import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ClientProfile from './components/ClientProfile';
import AdminPage from './pages/AdminPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const addNewClient = () => {
    // Implement this function to add a new client
    console.log("Add new client");
  };

  return (
    <Router>
      {isAuthenticated && <Header />}
      <div className="flex">
        {isAuthenticated && (
          <Sidebar 
            clients={clients} 
            addNewClient={addNewClient} 
            setSelectedClient={setSelectedClient}
          />
        )}
        <div className="flex-1">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
  <Route path="/signup" element={<Signup />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <AdminPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/chat"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <ChatInterface />
      </ProtectedRoute>
    }
  />
  <Route
    path="/client/:id"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <ClientProfile />
      </ProtectedRoute>
    }
  />
</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;