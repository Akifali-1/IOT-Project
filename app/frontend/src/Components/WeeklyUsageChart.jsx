import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './utility.css';

const WeeklyUsageChart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState({
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Usage (kWh)',
                data: [0, 0, 0, 0, 0, 0, 0], // Initial placeholder data
                backgroundColor: [
                    'rgba(128, 0, 128)', // Purple
                    'rgba(75, 192, 192)', // Teal
                    'rgba(255, 206, 86)', // Yellow
                    'rgba(54, 162, 235)', // Blue
                    'rgba(255, 99, 132)', // Pink
                    'rgba(153, 102, 255)', // Violet
                    'rgba(255, 159, 64)', // Orange
                ],
                borderWidth: 1,
                barThickness: 15, // Adjust bar width
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/devices/weeklyUsage`);
                const data = response.data;

                // Extract usage data and labels dynamically from response
                const updatedData = data.map((item) => parseFloat(item.usage)); // Convert usage to numeric values
                const updatedLabels = data.map((item) => item.day); // Extract days of the week

                setChartData((prev) => ({
                    ...prev,
                    labels: updatedLabels, // Update labels dynamically
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: updatedData, // Update data dynamically
                        },
                    ],
                }));
            } catch (error) {
                console.error('Error fetching weekly usage:', error);
                setError('Failed to fetch weekly usage data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex justify-center items-center ml-[5.6rem] ">
            <div className="bg-[#f8faff] dark:bg-transparent dark:border-[1px] dark:border-[#ffffff3f]  p-2 rounded-[30px] " style={{ width: '890px', height: '255px' }}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.raw.toFixed(2)} kWh`,
                                },
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                            },
                            legend: {
                                display: true,
                                position: 'top',
                            },
                        },
                        scales: {
                            x: {
                                grid: { display: false }, // Hide grid lines on X-axis
                                title: { display: true, text: 'Days of the Week' },
                            },
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Usage (kWh)' },
                                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default WeeklyUsageChart;