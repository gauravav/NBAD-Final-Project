import React, { useState } from 'react';
import { Chart } from 'chart.js/auto';

function CreateNewBudget() {
    const [budgetName, setBudgetName] = useState('');
    const [budgetItems, setBudgetItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemValue, setItemValue] = useState('');

    // Initialize the chart data
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'red',
                    'blue',
                    'green',
                    'yellow',
                    'orange',
                    'purple',
                    'pink',
                ],
            },
        ],
    });

    // Function to handle adding a new item to the budget
    const addItem = () => {
        if (itemName && itemValue) {
            const newItem = {
                name: itemName,
                value: parseFloat(itemValue),
            };

            // Update budgetItems
            setBudgetItems([...budgetItems, newItem]);

            // Update chartData
            const updatedChartData = {
                labels: [...chartData.labels, itemName],
                datasets: [
                    {
                        data: [...chartData.datasets[0].data, itemValue],
                        backgroundColor: chartData.datasets[0].backgroundColor,
                    },
                ],
            };

            setChartData(updatedChartData);

            // Clear input fields
            setItemName('');
            setItemValue('');
        }
    };

    return (
        <div>
            <h1>Create New Budget</h1>
            <div>
                <label>Budget Name:</label>
                <input
                    type="text"
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                />
            </div>
            <div>
                <label>Item Name:</label>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <label>Item Value:</label>
                <input
                    type="number"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                />
                <button onClick={addItem}>Add Item</button>
            </div>
            <div>
                <h2>Budget Items</h2>
                <ul>
                    {budgetItems.map((item, index) => (
                        <li key={index}>
                            {item.name}: ${item.value}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Budget Chart</h2>
                <canvas id="budgetChart" width="400" height="400"></canvas>
            </div>
        </div>
    );
}

export default CreateNewBudget;
