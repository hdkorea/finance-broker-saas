import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [banks, setBanks] = useState([]);
  const [newBankName, setNewBankName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get('/api/banks');
      console.log('Fetched banks:', response.data);
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks:', error.response || error);
      setError('Error fetching banks. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleUploadPolicy = async (e) => {
    e.preventDefault();
    if (!newBankName || !pdfFile) {
      setError('Please provide both bank name and policy file.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('policy', pdfFile);
    formData.append('bankName', newBankName);
  
    try {
      const response = await axios.post('/api/banks/policies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Upload response:', response.data);
      alert('Policy uploaded successfully');
      setNewBankName('');
      setPdfFile(null);
      fetchBanks();
    } catch (error) {
      console.error('Error uploading policy:', error.response ? error.response.data : error.message);
      setError('Error uploading policy. Please try again.');
    }
    setIsLoading(false);
  };

  const handleEditBank = async (bankId, newName) => {
    try {
      await axios.put(`/api/banks/${bankId}`, { name: newName });
      fetchBanks();
    } catch (error) {
      setError('Error updating bank name. Please try again.');
      console.error('Error updating bank name:', error);
    }
  };

  const handleDeletePolicy = async (bankId, policyId) => {
    try {
      await axios.delete(`/api/banks/${bankId}/policies/${policyId}`);
      fetchBanks();
    } catch (error) {
      setError('Error deleting policy. Please try again.');
      console.error('Error deleting policy:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleUploadPolicy} className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Upload New Policy</h2>
        <input
          type="text"
          value={newBankName}
          onChange={(e) => setNewBankName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Bank Name"
          disabled={isLoading}
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 mr-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload Policy'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-2">Banks and Policies</h2>
      {banks.map(bank => (
        <div key={bank.id} className="mb-4">
          <h3 className="text-xl font-semibold">{bank.name}</h3>
          <button
            onClick={() => {
              const newName = prompt('Enter new bank name:', bank.name);
              if (newName) handleEditBank(bank.id, newName);
            }}
            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
          >
            Edit
          </button>
          <ul>
            {bank.policies.map(policy => (
              <li key={policy.id} className="flex items-center">
                {policy.name}
                <button
                  onClick={() => handleDeletePolicy(bank.id, policy.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminPage;