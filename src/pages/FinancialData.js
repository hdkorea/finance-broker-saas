import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FinancialData = () => {
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement financial data submission logic
        console.log('Financial data submitted:', { income, expenses });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Financial Data</h1>
            <nav className="mb-4">
                <ul className="flex space-x-4">
                    <li><Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link></li>
                    <li><Link to="/profile" className="text-blue-500 hover:underline">Profile</Link></li>
                    <li><Link to="/financial-data" className="text-blue-500 hover:underline">Financial Data</Link></li>
                    <li><Link to="/logout" className="text-blue-500 hover:underline">Logout</Link></li>
                </ul>
            </nav>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="income">
                        Monthly Income
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="income"
                        type="number"
                        placeholder="Your Monthly Income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expenses">
                        Monthly Expenses
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="expenses"
                        type="number"
                        placeholder="Your Monthly Expenses"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit Financial Data
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FinancialData;