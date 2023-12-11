import React, {  useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './Training.css';
import closeIcon from '../assets/icon-close.png';
import trashCanIcon from '../assets/trash-can.png';
import loadingIcon from '../assets/loading.gif';
import { toast } from 'react-toastify';

// Import the provided static data
import staticData from '../assets/data.json';

function Training() {
    const [budgetData, setBudgetData] = useState(staticData.budgets);
    const [creatingBudget, setCreatingBudget] = useState(false);
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetTotal, setNewBudgetTotal] = useState('');
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [selectedBudgetItems, setSelectedBudgetItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const [newItemColor, setNewItemColor] = useState(getRandomColor());
    const loading = useState(false);
    const [budgetId, setBudgetId] = useState(4);
    const [itemId, setItemId] = useState(5);





    const calculateTotalItemValue = (items) => {
        return items.reduce((total, item) => total + item.itemValue, 0);
    };

    const totalItemValue = calculateTotalItemValue(selectedBudgetItems);
    // const availableBudget = selectedBudget.totalBudget - totalItemValue;



    const handleDeleteBudgetClick = async () => {
        console.log('Budget Deleted Successfully');
        removeBudgetFromLocalState(selectedBudget.documentId);
        setSelectedBudget(null);
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


                // Budget created successfully, reset the UI state
                setCreatingBudget(false);
                setNewBudgetName('');
                setNewBudgetTotal('');

                const newBudget = {
                    budgetName: newBudgetName,
                    totalBudget: newBudgetTotal,
                    documentId: budgetId,
                    itemList: { items: [] }
                    // Include other properties as needed
                };
                // Add the new budget to the local state
                addBudgetToLocalState(newBudget);
                setBudgetId(budgetId + 1);
                toast.success('Created new budget', {
                    position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                    autoClose: 2000, // Auto close after 3 seconds
                    hideProgressBar: true, // Show progress bar
                    closeOnClick: true, // Close on click
                    pauseOnHover: true, // Pause on hover
                });

    };

    const handleBudgetCardClick = (budget) => {
        // Set the selected budget when a budget card is clicked
        setSelectedBudget(budget);
        setSelectedBudgetItems(budget.itemList.items);
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
        if (
            newItemName.trim() === '' ||
            isNaN(newItemValue) ||
            newItemValue === '0'
        ) {
            // Display an error or return early if input is invalid
            console.error('Invalid input');
            toast.error('Invalid Input Value', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return;
        } else if (newItemValue.includes('.')) {
            setNewItemValue(
                Math.round(parseFloat(newItemValue)).toString()
            );
            toast.success(
                'Item Value rounded to nearest place, saved value is: ' +
                Math.round(parseFloat(newItemValue)).toString(),
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                }
            );
        } else if (
            newItemValue > selectedBudget.totalBudget - totalItemValue
        ) {
            console.error(
                'Cant add item more than available budget'
            );
            toast.error(
                'Cant add item more than available budget',
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                }
            );
            return;
        }

        // Create the item object
        const newItem = {
            itemName: newItemName,
            itemValue: parseInt(newItemValue, 10),
            itemColor: newItemColor,
            documentId: itemId,
        };

        // Update the selected budget with the new item
        const updatedSelectedBudget = {
            ...selectedBudget,
            itemList: {
                items: [...selectedBudgetItems, newItem],
            },
        };

        // Update the local state with the new item and increment itemId
        setItemId(itemId + 1);
        setSelectedBudget(updatedSelectedBudget);
        setSelectedBudgetItems([...selectedBudgetItems, newItem]);

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
        setNewItemColor(getRandomColor);
        toast.success('Successfully added item', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
        });
    };



    const handleDeleteItem = async (index) => {
        // Delete an item from the selected budget
        const updatedItems = [...selectedBudgetItems];

        // Update the selected budget with the updated item list
        const updatedSelectedBudget = {
            ...selectedBudget,
            itemList: { items: updatedItems },
        };


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

    };




    return (
        <div className="dashboard-grid">

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
                            <p>No items</p>
                        )}
                    </div>
                ))

            )}
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
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedBudgetItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>${item.itemValue}</td>
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
                                    onChange={(e) => setNewItemValue(e.target.value)}
                                />
                                <input
                                    type="color"
                                    value={newItemColor} // Default color
                                    onChange={(e) => setNewItemColor(e.target.value)}
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

export default Training;
