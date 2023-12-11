import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import {auth} from "../firebaseConfig";

function AboutPage() {

    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);





    return (
        <div className="about-page">
            <div className="title-line">
                <h2>About</h2>
                <h2 className="app-title">Personal Budget</h2>
            </div>

            <p>Welcome to Personal Budget, your all-in-one personal finance management app. With Personal Budget, you can take control of your finances, create and manage budgets, and track your expenses efficiently.</p>

            <h3>Key Features:</h3>
            <ul>
                <li>Create New Budgets: Define budgets for different aspects of your life, such as groceries, entertainment, travel, and more. Be in charge of your spending and saving goals.</li>
                <li>Add Items to Budgets: Easily add and categorize expenses within each budget to monitor your spending. Stay organized and make informed financial decisions.</li>
                <li>Track Your Expenses: Keep a close eye on your financial activities with detailed insights and reports. Personal Budget helps you stay on top of your financial health.</li>
                <li>User-Friendly Interface: Our app is designed with simplicity and user-friendliness in mind. No more financial jargon; we provide an intuitive experience for users of all levels.</li>
            </ul>

            <h3>Get Started</h3>
            <p>Start your journey to financial well-being with Personal Budget. Whether you're a seasoned pro or new to budgeting, we're here to help. Sign up for an account to access our suite of financial management tools.</p>

            {!isLoggedIn && (
            <div className="cta-buttons">
                <Link to="/signup" className="cta-button sign-up-button">Sign Up</Link>
                <Link to="/login" className="cta-button login-button">Login</Link>
            </div>
            )}



            {isLoggedIn && (
            <div className="cta-buttons-dashboard">
                <Link to="/myDashboard" className="cta-button sign-up-button">My Dashboard</Link>
            </div>
            )}
        </div>
    );
}

export default AboutPage;
