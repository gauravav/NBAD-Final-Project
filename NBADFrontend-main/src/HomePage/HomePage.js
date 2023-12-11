import React, {useEffect, useState} from 'react';
import './HomePage.css'; // Make sure to create this CSS file
import { useNavigate } from "react-router-dom";
import {auth} from "../firebaseConfig";


function HomePage() {

    let navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(user);
            } else {
                setIsLoggedIn(null);
            }
        });
    }, []);


    function clickSignUp(){
        console.log("Sign Up Clicked");
        navigate('/signup');

    }

    return (
        <div className="homepage">
            <header className="hero">

            </header>

            {/*<section className="features">*/}
            {/*    <div className="feature">*/}
            {/*        <i className="fas fa-chart-pie"></i>*/}
            {/*        <h2>Create Budgets</h2>*/}
            {/*        <p>Define budgets for various aspects of your life.</p>*/}
            {/*    </div>*/}
            {/*    <div className="feature">*/}
            {/*        <i className="fas fa-money-check-alt"></i>*/}
            {/*        <h2>Track Expenses</h2>*/}
            {/*        <p>Keep a close eye on your financial activities.</p>*/}
            {/*    </div>*/}
            {/*    <div className="feature">*/}
            {/*        <i className="fas fa-lightbulb"></i>*/}
            {/*        <h2>Budgeting Tips</h2>*/}
            {/*        <p>Get expert advice on managing your finances.</p>*/}
            {/*    </div>*/}
            {/*</section>*/}

            <div className="hero-content">

                <h1>Master Your Finances with Personal Budget</h1>
                <p>Take control of your financial life, create budgets, and track your expenses.</p>

                {!isLoggedIn && (
                <button onClick={clickSignUp} className="cta-button" >Sign Up</button>
                )}

                {isLoggedIn && (
                <button onClick={() => navigate('/myDashboard')} className="cta-button" >My Dashboard</button>
                )}

            </div>


        </div>
    );
}

export default HomePage;
