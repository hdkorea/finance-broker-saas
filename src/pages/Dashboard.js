import React from 'react';
import Navigation from '../components/Navigation';

const Dashboard = () => {
    const placeholderData = {
        totalAssets: 250000,
        totalLiabilities: 150000,
        netWorth: 100000,
        monthlyIncome: 5000,
        monthlyExpenses: 3500
    };

    return (
        <div>
            <Navigation />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
                    <ul>
                        <li>Total Assets: ${placeholderData.totalAssets}</li>
                        <li>Total Liabilities: ${placeholderData.totalLiabilities}</li>
                        <li>Net Worth: ${placeholderData.netWorth}</li>
                        <li>Monthly Income: ${placeholderData.monthlyIncome}</li>
                        <li>Monthly Expenses: ${placeholderData.monthlyExpenses}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;