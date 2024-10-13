import React from 'react';

function ClientProfile({ selectedClient }) {
  if (!selectedClient) {
    return (
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Client Profile</h2>
        <p>No client selected</p>
      </div>
    );
  }

  const {
    name,
    job,
    income,
    assets,
    loan_purpose
  } = selectedClient;

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Client Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {name || 'Not provided'}</p>
        <p><strong>Occupation:</strong> {job || 'Not provided'}</p>
        <p><strong>Annual Income:</strong> {income || 'Not provided'}</p>
        <p><strong>Assets:</strong> {assets || 'Not provided'}</p>
        <p><strong>Loan Purpose:</strong> {loan_purpose || 'Not provided'}</p>
      </div>
    </div>
  );
}

export default ClientProfile;