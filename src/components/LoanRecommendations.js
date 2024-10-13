import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoanRecommendations({ clientInfo }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientInfo && Object.keys(clientInfo).length > 0) {
      fetchRecommendations();
    }
  }, [clientInfo]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/loan-recommendations', clientInfo);
      setRecommendations(response.data);
    } catch (err) {
      setError('Failed to fetch loan recommendations. Please try again.');
      console.error('Error fetching loan recommendations:', err);
    }
    setIsLoading(false);
  };

  if (isLoading) return <div>Loading recommendations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Loan Recommendations</h2>
      {recommendations.length === 0 ? (
        <p>No recommendations available yet.</p>
      ) : (
        <ul className="space-y-4">
          {recommendations.map((loan, index) => (
            <li key={index} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{loan.bankName}</h3>
              <p className="text-gray-600">{loan.productName}</p>
              <p>Interest Rate: {loan.interestRate}%</p>
              <p>Loan Amount: ${loan.loanAmount}</p>
              <p>Term: {loan.term} years</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LoanRecommendations;