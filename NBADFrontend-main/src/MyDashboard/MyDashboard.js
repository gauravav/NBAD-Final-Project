import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './MyDashboard.css';
import { auth } from "../firebaseConfig";
//import close icon from assets
import closeIcon from '../assets/icon-close.png';
import trashCanIcon from '../assets/trash-can.png';
import addIcon from '../assets/add.png';
import loadingIcon from '../assets/loading.gif';
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";



function MyDashboard() {
    const [budgetData, setBudgetData] = useState([]);
    const [creatingBudget, setCreatingBudget] = useState(false);
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetTotal, setNewBudgetTotal] = useState('');
    const [selectedBudget, setSelectedBudget] = useState(null); // Track the selected budget for the dialog
    const [selectedBudgetItems, setSelectedBudgetItems] = useState([]); // Track selected budget items
    const [newItemName, setNewItemName] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const initialItemColor = getRandomColor();
    const [newItemColor, setNewItemColor] = useState(initialItemColor);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set initial date to today
    const [loading, setLoading] = useState(false);
    const [showTokenExpirationModal, setShowTokenExpirationModal] = useState(false);
    const [time, setTime] = useState(90);
    let navigate = useNavigate();


    useEffect(() => {
            fetchData();
        }
        , []);

    // useEffect to update the time every second
    useEffect(() => {
        const timer = setInterval(decreaseTime, 1000);

        // Clean up the timer when the component unmounts or when time reaches zero
        return () => {
            clearInterval(timer);
        };
    }, []);

    // useEffect to check if the time has reached zero
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
            // Perform the token refresh logic on the server-side
            // Call your backend API to refresh the token

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










    const calculateTotalItemValue = (items) => {
        return items.reduce((total, item) => total + item.itemValue, 0);
    };

    const totalItemValue = calculateTotalItemValue(selectedBudgetItems);


    const handleDeleteBudgetClick = async () => {

        try {
            const token = await auth.currentUser.getIdToken(true);

            // Create an object with the payload data
            const payload = {
                token: token,
                budgetDocumentId: selectedBudget.documentId
            };

            // Send a DELETE request to your endpoint
            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/data/deleteBudget', {
                method: 'POST', // Use the DELETE HTTP method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Budget deleted successfully, handle the response or UI state update
                console.log('Budget Deleted Successfully');
                removeBudgetFromLocalState(selectedBudget.documentId);
                setSelectedBudget(null);
            } else {
                // Handle the case where the deletion was not successful
                console.error('Failed to delete budget');
                // You can show an error message to the user or handle it as needed.
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            // Handle the error, e.g., show an error message to the user.
        }
    };

    const removeBudgetFromLocalState = (budgetId) => {
        // Create a copy of the budgetData array without the budget that has the specified ID
        const updatedBudgetData = budgetData.filter((budget) => budget.documentId !== budgetId);
        setBudgetData(updatedBudgetData);
    };


    const handleCreateBudgetClick = () => {
        // Show the form for creating a new budget
        setCreatingBudget(true);
    };

    const addBudgetToLocalState = (newBudget) => {
        setBudgetData([...budgetData, newBudget]);
        console.log("Budget Data:", budgetData);
    };


    const handleCreateButtonClick = async () => {
        // Send a request to create the new budget
        try {
            const token = await auth.currentUser.getIdToken(true);
            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/data/addBudget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    budgetName: newBudgetName,
                    totalBudget: newBudgetTotal,
                }),
            });

            if (response.ok) {
                // Budget created successfully, reset the UI state
                setCreatingBudget(false);
                setNewBudgetName('');
                setNewBudgetTotal('');
                const BudgetInfo = await response.json();
                console.log("Document ID:", BudgetInfo.documentId);

                // Fetch updated data (you may need to update your fetchData function)
                // fetchData();
                // Construct the new budget object locally
                const newBudget = {
                    budgetName: newBudgetName,
                    totalBudget: newBudgetTotal,
                    documentId: BudgetInfo.documentId,
                    itemList: { items: [] }
                    // Include other properties as needed
                };
                // Add the new budget to the local state
                addBudgetToLocalState(newBudget);
                toast.success('Created new budget', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
            } else {
                console.error('Failed to create budget');
                toast.error('Failed to create budget', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast.error('Error creating budget: '+error, {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        }
    };

    const handleBudgetCardClick = (budget) => {
        // Set the selected budget when a budget card is clicked
        setSelectedBudget(budget);
        console.log("Selected Budget:", budget);
        setSelectedBudgetItems(budget.itemList.items);
        console.log("Selected Budget Items:", budget.itemList.items);
    };

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color;
        const existingColors = selectedBudgetItems.map((item) => item.itemColor);

        // Generate random colors until a unique one is found
        do {
            color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (existingColors.includes(color));
        return color;
    }

    const handleAddItem = async () => {
        if (newItemName.trim() === '' || isNaN(newItemValue) || newItemValue === '0' || newItemValue < 0) {
            // Display an error or return early if input is invalid
            console.error('Invalid input');
            toast.error('Invalid Input Value', {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
            return;
        }
        //Check if decimal is entered and if so, round it to nearest integer
        else if(newItemValue.includes('.')){
            setNewItemValue(Math.round(parseFloat(newItemValue)).toString());
            toast.success('Item Value rounded to nearest place, saved value is: '+Math.round(parseFloat(newItemValue)).toString(), {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        }
            else if (newItemValue > (selectedBudget.totalBudget - totalItemValue)) {
                console.error('Cant add item more than available budget');
                toast.error('Cant add item more than available budget', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
                return;
        }

        // Create the item object
        const newItem = {
            itemName: newItemName,
            itemValue: newItemValue,
            itemColor: newItemColor,
            date: date,
        };

        try {
            const token = await auth.currentUser.getIdToken(true);

            // Send a request to add the item
            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/data/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    budgetId: selectedBudget.documentId, // Make sure to include the budgetId
                    itemName: newItemName,
                    itemValue: newItemValue.toString(),
                    itemColor: newItemColor,
                    date: date,
                }),
            });

            if (response.ok) {
                toast.success('Successfully added item', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
                // Item added successfully on the server

                // Parse the response to get the item with the returned documentId
                const addedItem = await response.json();

                // Add the new item to the selected budget locally
                const updatedItems = [...selectedBudgetItems, addedItem];
                const updatedSelectedBudget = {
                    ...selectedBudget,
                    itemList: { items: updatedItems },
                };
                setSelectedBudget(updatedSelectedBudget);
                setSelectedBudgetItems(updatedItems);

                // Update the budgetData to reflect the changes in the selected budget
                const updatedBudgetData = budgetData.map((budget) => {
                    if (budget.budgetName === selectedBudget.budgetName) {
                        return updatedSelectedBudget;
                    } else {
                        return budget;
                    }
                });
                setBudgetData(updatedBudgetData);

                // Clear the input fields
                setNewItemName('');
                setNewItemValue('');
                // setNewItemColor('#000000'); // Reset to the default color
                setNewItemColor(getRandomColor); // Reset to the default color
            } else {
                console.error('Failed to add item');
                toast.error('Failed to add item', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
            }
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Error adding item: '+error, {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        }
    };

    const formatDate = (inputDate) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return  new Date(inputDate).toLocaleDateString('en-US', options);
    }



    const handleDeleteItem = async (index) => {
        console.log("Delete Item Clicked", index);
        // Delete an item from the selected budget
        const updatedItems = [...selectedBudgetItems];
        const deletedItem = updatedItems.splice(index, 1)[0]; // Remove and capture the deleted item
        console.log("Deleting document ID for item:",deletedItem);

        // Update the selected budget with the updated item list
        const updatedSelectedBudget = {
            ...selectedBudget,
            itemList: { items: updatedItems },
        };

        // Send a request to delete the item on the server
        try {
            const token = await auth.currentUser.getIdToken(true);
            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/data/deleteItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    budgetId: selectedBudget.documentId, // Pass the selected budget's documentId
                    itemDocumentId: deletedItem.documentId, // Pass the deleted item's documentId
                }),
            });

            if (response.ok) {
                toast.success('Successfully deleted item', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
                // Request was successful, update the local state
                setSelectedBudget(updatedSelectedBudget);
                setSelectedBudgetItems(updatedItems);
                const updatedBudgetData = budgetData.map((budget) => {
                    if (budget.budgetName === selectedBudget.budgetName) {
                        return updatedSelectedBudget;
                    } else {
                        return budget;
                    }
                });
                setBudgetData(updatedBudgetData);
            } else {
                console.error('Failed to delete the item');
                toast.error('Failed to delete the item', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
            }
        } catch (error) {
            console.error('Error deleting the item:', error);
            toast.error('Error deleting the item: '+error, {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        }
    };







    async function fetchData() {
        try {
            setLoading(true); // Set loading to true when fetching starts

            const token = await auth.currentUser.getIdToken(true);

            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/data/getAllBudgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (response.ok) {
                const data = await response.json();
                setBudgetData(data.budgets);
            } else {
                console.error('Failed to fetch budget data');
                toast.error('Failed to fetch budget data', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });
            }
        } catch (error) {
            console.error('Error fetching budget data:', error);
            toast.error('Failed to fetch budget data: '+error, {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        } finally {
            setLoading(false); // Set loading to false when fetching is complete
        }
    }



    return (
        <div className="dashboard-grid">
            {showTokenExpirationModal && (
                <div className="tutorial-overlay">
                    <p>Your token will expire in {time} seconds.</p>
                    <button onClick={() => handleCloseModal()}>Close</button>
                    <button onClick={() => handleRefreshToken()}>Refresh Token</button>
                </div>
            )}
            <div className="budget-card empty-card" onClick={handleCreateBudgetClick}>
                {creatingBudget ? (
                    <div className="budget-card">
                        <h2>Enter Budget Details</h2>
                        <input
                            type="text"
                            placeholder="Budget Name"
                            value={newBudgetName}
                            onChange={(e) => setNewBudgetName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Total Budget"
                            value={newBudgetTotal}
                            step="100"
                            onChange={(e) => setNewBudgetTotal(e.target.value)}
                        />
                        <button onClick={handleCreateButtonClick}>Create</button>
                    </div>
                ) : (
                    <h2>Create New Budget</h2>
                )}
            </div>
            {loading ? ( // Show loading icon if loading is true
                <img src={loadingIcon} alt="Loading" className="loading-icon" />
            ) : (

                (budgetData.length === 0) ? (

                    <p className="no-budgets-message">You dont have any budgets created. Click "Create New Budget" to start.</p>

                ) :
                    (

                budgetData.map((budget, index) => (
                    <div key={index} className="budget-card" onClick={() => handleBudgetCardClick(budget)}>
                        <h2>{budget.budgetName}</h2>
                        {budget.itemList && budget.itemList.items && budget.itemList.items.length > 0 ? (
                            <>
                                <Doughnut
                                    data={{
                                        labels: budget.itemList.items.map((item) => item.itemName),
                                        datasets: [
                                            {
                                                data: budget.itemList.items.map((item) => item.itemValue),
                                                backgroundColor: budget.itemList.items.map((item) => item.itemColor),
                                            },
                                        ],
                                    }}
                                />
                                <div className="total-budget">
                                    Total Budget: ${budget.totalBudget}
                                </div>
                            </>
                        ) : (
                            <div className="no-items">
                            <p>No items.</p>
                            <p>Click on this card to add expenses into this budget.</p>
                            </div>
                        )}
                    </div>
                ))
                    )




            )
            }
            {selectedBudget && (
                <div className="budget-dialog">
                    <img
                        src={closeIcon}
                        alt="Close"
                        className="close-icon"
                        onClick={() => setSelectedBudget(null)}
                    />
                    <h2>{selectedBudget.budgetName}</h2>
                    <div className="dialog-content">
                        <div className="chart-container">
                            {selectedBudget.itemList && selectedBudget.itemList.items && selectedBudget.itemList.items.length > 0 ? (
                                <Doughnut
                                    data={{
                                        labels: selectedBudget.itemList.items.map((item) => item.itemName),
                                        datasets: [
                                            {
                                                data: selectedBudget.itemList.items.map((item) => item.itemValue),
                                                backgroundColor: selectedBudget.itemList.items.map((item) => item.itemColor),
                                            },
                                        ],
                                    }}
                                />
                            ) : (
                                <p>No items</p>
                            )}
                        </div>
                        <div className="item-list">
                            <table>
                                <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Item Value</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedBudgetItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>${item.itemValue}</td>

                                        <td>{formatDate(item.date.split("T")[0])}</td>
                                        <td>
                                            <img
                                                src={trashCanIcon}
                                                alt="Delete"
                                                className="trash-can-icon"
                                                onClick={() => handleDeleteItem(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div>
                                <input
                                    type="text"
                                    placeholder="New Item Name"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="New Item Value"
                                    value={newItemValue}
                                    //increment by 10
                                    step="10"
                                    onChange={(e) => setNewItemValue(e.target.value)}
                                />
                                <input
                                    type="color"
                                    value={newItemColor} // Default color
                                    onChange={(e) => setNewItemColor(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />

                                <button onClick={() => handleAddItem()}>Add Item</button>
                            </div>
                        </div>

                    </div>

                    <div className="deleteButtonContainer">
                        <div className="budget-details">
                            <div>
                                <strong>Total Budget:</strong> ${selectedBudget.totalBudget}
                            </div>
                            <div>
                                <strong>Available Budget:</strong> ${selectedBudget.totalBudget - totalItemValue}
                            </div>
                        </div>
                        <button className="deleteButton" onClick={() => handleDeleteBudgetClick()}>
                            Delete Budget
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyDashboard;
