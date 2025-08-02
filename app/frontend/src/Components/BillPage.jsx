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
        <div className="bill-page">
            <div className='heading'>
                <h1>Electricity Usage & Bill Calculator</h1>
                {successMessage && <p className="success">{successMessage}</p>} {/* Success message below the heading */}
            </div>
            <div className="form">
                <button onClick={fetchUsageData} disabled={loading}>
                    <div className="button-content">
                        <CiDollar className="dollar-icon" />
                        {loading ? 'Calculating...' : 'Calculate Total Bill'}
                    </div>
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="result-container">
                <div className="billcontainer">
                    <div className="usagediv">
                        <div className="heading-container">
                            <SlEnergy className='energy-icon' />
                            <p className="heading">Total Usage</p>
                        </div>
                        <p className="value">{totalUsage} hours</p>
                    </div>
                    <div className="Electricitydiv">
                        <div className="heading-container">
                            <RiBillLine className='bill-icon' />
                            <p className="heading">Total Electricity Bill</p>
                        </div>
                        <p className="value">₹{bill}</p>
                    </div>
                </div>

                {dataFetched && ( // Conditionally render the Clear button
                    <button onClick={clearUsageData} disabled={loading} className="clear-btn">
                        {loading ? 'Clearing...' : 'Clear Data'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BillPage;