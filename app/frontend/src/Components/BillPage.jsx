import React, { useState } from 'react';
import './BillPage.css';
import { CiDollar } from "react-icons/ci";
import { SlEnergy } from "react-icons/sl";
import { RiBillLine } from "react-icons/ri";

const BillPage = () => {
    const [totalUsage, setTotalUsage] = useState(0); // Default to 0
    const [bill, setBill] = useState(0); // Default to 0
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

    const ratePerHour = 5; // Rate per hour in your currency

    const fetchUsageData = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/calculateUsage`);

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch usage data.');
                return;
            }

            const data = await response.json();

            const usage = parseFloat(data.totalDuration) || 0; // Adjust key based on backend
            const calculatedBill = usage * ratePerHour;

            setTotalUsage(usage.toFixed(2)); // Display with 2 decimal places
            setBill(calculatedBill.toFixed(2)); // Display with 2 decimal places
            setDataFetched(true); // Mark data as fetched
        } catch (err) {
            console.error('Fetch Error:', err.message);
            setError('An error occurred while fetching the usage data.');
        } finally {
            setLoading(false);
        }
    };

    const clearUsageData = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/clearUsage`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to clear usage data.');
                return;
            }

            setTotalUsage(0); // Reset to 0
            setBill(0); // Reset to 0
            setSuccessMessage('All usage data cleared successfully.');
            setDataFetched(false); // Hide the Clear button
        } catch (err) {
            console.error('Clear Error:', err.message);
            setError('An error occurred while clearing the usage data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bill-page dark:bg-[#081229] bg-white">
            <div className='heading'>
                <h1 className="dark:text-white">Electricity Usage & Bill Calculator</h1>
                {successMessage && <p className="success dark:text-green-400">{successMessage}</p>} {/* Success message below the heading */}
            </div>
            <div className="form">
                <button onClick={fetchUsageData} disabled={loading} className="dark:bg-[#1b1e38] dark:hover:bg-[#2a2d4d]">
                    <div className="button-content">
                        <CiDollar className="dollar-icon dark:text-white" />
                        {loading ? 'Calculating...' : 'Calculate Total Bill'}
                    </div>
                </button>
            </div>

            {error && <p className="error dark:text-red-400">{error}</p>}

            <div className="result-container">
                <div className="billcontainer">
                    <div className="usagediv dark:bg-[#1b1e38] dark:border-gray-600">
                        <div className="heading-container">
                            <SlEnergy className='energy-icon dark:text-blue-400' />
                            <p className="heading dark:text-white">Total Usage</p>
                        </div>
                        <p className="value dark:text-white">{totalUsage} hours</p>
                    </div>
                    <div className="Electricitydiv dark:bg-[#1b1e38] dark:border-gray-600">
                        <div className="heading-container">
                            <RiBillLine className='bill-icon dark:text-blue-400' />
                            <p className="heading dark:text-white">Total Electricity Bill</p>
                        </div>
                        <p className="value dark:text-white">₹{bill}</p>
                    </div>
                </div>

                {dataFetched && ( // Conditionally render the Clear button
                    <button onClick={clearUsageData} disabled={loading} className="clear-btn dark:bg-red-700 dark:hover:bg-red-800">
                        {loading ? 'Clearing...' : 'Clear Data'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BillPage;