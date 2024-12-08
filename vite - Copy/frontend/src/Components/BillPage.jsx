import React, { useState } from "react";
import "./BillPage.css";

const BillPage = () => {
    const [totalUsage, setTotalUsage] = useState(0);
    const [bill, setBill] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    const ratePerHour = 5;

    const fetchUsageData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8080/api/devices/calculateUsage"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data.");
            }
            const data = await response.json();
            const usage = parseFloat(data.totalDuration) || 0;
            const calculatedBill = usage * ratePerHour;
            setTotalUsage(usage.toFixed(2));
            setBill(calculatedBill.toFixed(2));
            setDataFetched(true);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearUsageData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8080/api/devices/clearUsage",
                { method: "DELETE" }
            );
            if (!response.ok) {
                throw new Error("Failed to clear data.");
            }
            setTotalUsage(0);
            setBill(0);
            setDataFetched(false);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="head1">
            <div className="inner-face"></div> {/* Inner white face */}
            {/* Whiskers */}
            <div className="mustache">
                <div className="mustache-hair mustache-left-hair"></div>
                <div className="mustache-hair mustache-left-hair"></div>
                <div className="mustache-hair mustache-left-hair"></div>
                <div className="mustache-hair mustache-right-hair"></div>
                <div className="mustache-hair mustache-right-hair"></div>
                <div className="mustache-hair mustache-right-hair"></div>
            </div>

            {/* Left Eye (Total Usage) */}
            <div className="eye left-eye">
                <p>{totalUsage} hrs</p>
            </div>
            {/* Right Eye (Total Bill) */}
            <div className="eye right-eye">
                <p>₹{bill}</p>
            </div>
            {/* Nose */}
            <div className="nose">
                <button
                    className="!bg-red"
                    onClick={clearUsageData}
                    disabled={!dataFetched || loading}
                >
                    Clear
                </button>
            </div>

            {/* Smile */}
            <div className="smile">
                <button onClick={fetchUsageData} disabled={loading}>
                    {loading ? "Loading..." : "Fetch"}
                </button>
            </div>
            <p>Created by FARHAN</p>
        </div>

    );
};

export default BillPage;
