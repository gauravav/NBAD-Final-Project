import React, {useEffect, useState} from 'react';
import {Bar, Doughnut, Line, Pie} from 'react-chartjs-2';
import './Monthly.css';
import { auth } from "../firebaseConfig";
import closeIcon from '../assets/icon-close.png';
import loadingIcon from '../assets/loading.gif';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Monthly() {
    const [budgetData, setBudgetData] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTokenExpirationModal, setShowTokenExpirationModal] = useState(false);
    const [time, setTime] = useState(90);
    const [selectedView, setSelectedView] = useState('Years'); // Default view
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to the current year
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedChartType, setSelectedChartType] = useState('Bar'); // Default chart type

    useEffect(() => {
        const timer = setInterval(decreaseTime, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if(time === 30)
        {
            setShowTokenExpirationModal(true);
        }
        else if (time === 0) {
            // Perform any action when the time reaches zero
            console.log('Time has reached zero!');
            logout();
        }
    }, [time]);

    // Function to handle the close modal button
    const handleCloseModal = () => {
        setShowTokenExpirationModal(false);
    }

    // Function to handle the refresh token button
    const handleRefreshToken = async () => {

        try {
            auth.currentUser.getIdToken(true).then((idToken) => {
                // Id token has been refreshed
                console.log('Id token has been refreshed:', { idToken });
                toast.success('Successfully refreshed token', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
                // Reset the token expiration timer
                setTime(90);
                setShowTokenExpirationModal(false);
            }).catch((error) => {
                // Handle error
                console.log('Id token refresh error:', error);
            });

        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    // Function to decrease the time by 1 second
    const decreaseTime = () => {
        setTime(prevTime => Math.max(prevTime - 1, 0));
    };

    const logout = async () => {
        try {
            await auth.signOut();
            navigate('/login'); // Redirect to the login page or another appropriate page
            toast.success('Successfully logged out since no action is taken', {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 5000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        } catch (error) {
            console.error('Error logging out:', error);
            // Handle the error, e.g., show an error message to the user.
        }
    };

    let navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewChange = (event) => {
        setSelectedView(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleChartTypeChange = (event) => {
        setSelectedChartType(event.target.value);
    };

    const handleBudgetCardClick = (budget) => {
        setSelectedBudget(budget);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = await auth.currentUser.getIdToken(true);

            // Use the correct API endpoint for monthly data
            const response = await fetch(`${process.env.REACT_APP_BACKEND_ENDPOINT}/data/getMonthsData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (response.ok) {
                const data = await response.json();
                setBudgetData(data);
                console.log("BudgetData:", budgetData);

                const uniqueYears = Object.keys(data).map((year) => parseInt(year, 10));
                setAvailableYears(uniqueYears);
            } else {
                // Handle error
            }
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        const bubbleData = [];

        const colorPalette = [
            //Have 12 colors for each month
            'rgba(0, 80, 53, 0.2)',   //Color: dark green
            'rgba(75,192,192,0.2)',   //Color: teal
            'rgba(192,75,192,0.2)',   //Color: purple
            'rgba(192,192,75,0.2)',   //Color: yellow
            'rgba(75,192,75,0.2)',    //Color: green
            'rgba(192,75,75,0.2)',    //Color: red
            'rgba(75,75,192,0.2)',    //Color: blue
            'rgba(192,192,192,0.2)',  //Color: grey
            'rgba(255, 99, 132, 0.2)',//Color: red
            'rgba(54, 162, 235, 0.2)',//Color: blue
            'rgba(128, 0, 0, 0.2)', //Color: maroon
            'rgba(0, 0, 128, 0.2)', //Color: navy
            // Add more colors as needed
        ];

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        if (selectedView === 'Years') {
            const yearsData = Object.keys(budgetData).map((year, index) => {
                const totalCost = budgetData[year].reduce((acc, value) => acc + value, 0);
                return totalCost;
            });

            return {
                labels: Object.keys(budgetData),
                datasets: [
                    {
                        label: 'Total Cost',
                        data: yearsData,
                        backgroundColor: colorPalette.slice(0, yearsData.length),
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            };
        } else if (selectedView === 'Months' && budgetData[selectedYear]) {
            const monthsData = budgetData[selectedYear];

            const monthArray = [];

            // Loop through each month and get the items
            for (let i = 0; i < 12; i++) {
                monthArray.push(monthsData[i]);
            }

            return {
                labels: monthNames,
                datasets: [
                    {
                        label: 'Total Cost',
                        data: monthArray,
                        backgroundColor: colorPalette.slice(0, monthArray.length),
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1,
                    },
                ],
            };
        }
    };


    const renderBarChart = () => {
        return (
            <Bar
                data={getChartData()}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                }}
            />
        );
    };

    const renderLineChart = () => {

        return (
            <Line
                data={getChartData()}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                }}
            />
        );
    };

    const renderPieChart = () => {
        const pieChartData = getChartData(); // Replace with your pie chart data

        return (
            <Pie
                data={getChartData()}
                options={{
                    // Add Pie chart options here
                }}
            />
        );
    };

    const renderDoughnutChart = () => {
        const doughnutChartData = getChartData(); // Replace with your doughnut chart data

        return (
            <Doughnut
                data={getChartData()}
                options={{
                    // Add Doughnut chart options here
                }}
            />
        );
    };


    const renderSelectedChart = () => {
        switch (selectedChartType) {
            case 'Bar':
                return renderBarChart();
            case 'Line':
                return renderLineChart();
            case 'Pie':
                return renderPieChart();
            case 'Doughnut':
                return renderDoughnutChart();
            // Add cases for other chart types
            default:
                return null;
        }
    };


    return (
        <div>
            {showTokenExpirationModal && (
                <div className="tutorial-overlay">
                    <p>Your token will expire in {time} seconds.</p>
                    <button onClick={() => handleCloseModal()}>Close</button>
                    <button onClick={() => handleRefreshToken()}>Refresh Token</button>
                </div>
            )}

            <div className="option-bar">
                <div className="chart-type-modal">
                    <label>Select Chart Type: </label>
                    <select value={selectedChartType} onChange={handleChartTypeChange}>
                        <option value="Bar">Bar Chart</option>
                        <option value="Line">Line Chart</option>
                        <option value="Pie">Pie Chart</option>
                        <option value="Doughnut">Doughnut Chart</option>
                    </select>
                </div>
                <div className="view-modal">
                    <label>Show charts by: </label>
                    <select value={selectedView} onChange={handleViewChange}>
                        <option value="Years">Years</option>
                        <option value="Months">Months</option>
                    </select>
                </div>
                {selectedView === 'Months' && (
                    <div className="year-modal">
                        <label>Select Year: </label>
                        <select value={selectedYear} onChange={handleYearChange}>
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedBudget && (
                    <div className="budget-dialog">
                        {/* ... (unchanged) */}
                    </div>
                )}
            </div>
            <div>
                {loading ? (

                    <img src={loadingIcon} alt="Loading" className="loading-icon" />
                ) : (
                    <div className="actual-chart">
                        {renderSelectedChart()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Monthly;
