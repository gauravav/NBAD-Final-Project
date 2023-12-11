import React, { useState, useEffect } from 'react';

const StatusPage = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/status`);
            const data = await response.text(); // Use text() instead of json()

            // Assuming the API returns a JSON object with a "status" field
            setStatus(data);
            console.log(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching status:', error);
            setStatus('Error');
            setLoading(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchStatus();
        }, 3000);

        // Initial fetch
        fetchStatus();

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once after the initial render

    const getStatusColor = () => {
        if (loading) {
            return 'grey'; // Loading state color
        } else if (status === 'Running') {
            return 'green';
        } else {
            return 'red';
        }
    };

    return (
        <div>
            <h1>Status: {status}</h1>
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(),
                }}
            ></div>
            <p>Page refreshes every 3 seconds</p>
        </div>
    );
};

export default StatusPage;
