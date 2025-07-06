import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DeviceUsageBarGraph = () => {
  const [usageData, setUsageData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [error, setError] = useState("");

  // Fetch device usage data
  useEffect(() => {
    fetch("http://localhost:8080/api/devices/calculateUsage")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch usage data.");
        }
        return response.json();
      })
      .then((data) => {
        if (!data.usageData || data.usageData.length === 0) {
          setUsageData([]); // Ensure usageData is an empty array
          setTotalBill(0);
          setError("No device usage data available.");
        } else {
          setUsageData(data.usageData);
          setTotalBill(data.totalBill);
          setError("");
        }
      })
      .catch((error) => {
        console.error("Error fetching device usage data:", error.message);
        setError("An error occurred while fetching the device usage data.");
      });
  }, []);

  // Prepare data for the bar chart
  const chartData = {
    labels: usageData.length > 0 ? usageData.map((device) => device.deviceRoomName) : ["No Data"],
    datasets: [
      {
        label: "Time Connected (hours)",
        data: usageData.length > 0 ? usageData.map((device) => parseFloat(device.duration)) : [0],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Device Usage Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Time Connected (hours)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Devices (Room)",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="mt-5" style={{ width: "80%", margin: "0 auto" }}>
      <h2 className=" dark:text-pink-300 font-semibold">Device Usage</h2>
      <Bar data={chartData} options={chartOptions} />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <h3>Total Bill: ₹{totalBill}</h3>
        )}
      </div>
    </div>
  );
};

export default DeviceUsageBarGraph;
