import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
    const [user, setUser] = useState('Account');
    let navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(user);
                if (user.displayName === null) setUser('Account');
                else setUser(user.displayName);
            } else {
                setIsLoggedIn(null);
            }
        });
    }, []);

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    useEffect(() => {
        if (!isLoggedIn) {
            setIsOpen(false);
        }
    }, [isLoggedIn]);


    function SignOutFunction() {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log('Sign-out successful');
            setIsLoggedIn(null);
            toast.success('Successfully signed out', {
                position: toast.POSITION.BOTTOM_RIGHT, // Set toast position
                autoClose: 2000, // Auto close after 3 seconds
                hideProgressBar: true, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
            navigate('/');

        }).catch((error) => {
            // An error happened.
            console.log('Sign-out error:', error);
        });
    }

    async function checkToken() {
        try {
            const token = await auth.currentUser.getIdToken(true);
            console.log('Token:', token);
            const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + '/auth/checkToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response as JSON
                console.log('Response Data from Backend:', data);
            } else {
                console.error('Authentication failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function goToHome() {
        navigate('/');
    }

    function refreshToken() {
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
        }).catch((error) => {
            // Handle error
            console.log('Id token refresh error:', error);
        });
    }

    function goToAccountSettings() {
        navigate('/accountSettings');
    }

    return (
        <nav
            role="navigation"
            aria-label="Main menu"
            itemScope
            itemType="http://www.schema.org/SiteNavigationElement"
        >
            <div className="app-title" onClick={goToHome}>Personal Budget</div> {/* Add the app name */}

            <ul className="left-links">
                <li><Link itemProp="url" to="/">Home</Link></li>
                <li><Link itemProp="url" to="/about">About</Link></li>
                {/*<li><Link itemProp="url" to="/training">Demo</Link></li>*/}
                {isLoggedIn && (
                    <ul>

                    <li><Link itemProp="url" to="/myDashboard">Dashboard</Link></li>
                        <li><Link itemProp="url" to="/monthly">Charts</Link></li>
                     {/*<li><Link itemProp="url" to="/viewBudgets">View Budgets</Link></li>*/}
                     {/*<li><Link itemProp="url" to="/configureBudgets">Configure Budgets</Link></li>*/}
                     {/*<li><Link itemProp="url" to="/createNewBudget">Create New Budget</Link></li>*/}
                    </ul>
                )}
            </ul>
            {!isLoggedIn && (
                    <ul className="right-links">
                    <li><Link itemProp="url" to="/login">Login</Link></li>
                    <li><Link itemProp="url" to="/signup">Sign Up</Link></li>
                    </ul>
                )}
                {isLoggedIn && (
                    <ul className="right-links">
                    <li>
                        <div className="dropdown">
                            <button className="dropdown-toggle" onClick={toggleDropdown}>
                                {user}
                            </button>
                            {isOpen && (
                                <ul className="dropdown-menu">
                                    <li onClick={SignOutFunction}>Sign Out</li>
                                    <li onClick={refreshToken}>Refresh Token</li>
                                    {/*<li onClick={checkToken}>Verify Token Backend</li>*/}

                                    <li onClick={goToAccountSettings}>Account Settings</li>
                                </ul>
                            )}
                        </div>
                    </li>
                    </ul>
                )}
        </nav>

        // <nav
        //     role="navigation"
        //     aria-label="Main menu"
        //     itemScope
        //     itemType="http://www.schema.org/SiteNavigationElement"
        // >
        //     <div className="app-title" onClick={goToHome}>
        //         Personal Budget
        //     </div>
        //
        //     <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        //         <div className="bar"></div>
        //         <div className="bar"></div>
        //         <div className="bar"></div>
        //     </div>
        //
        //     <ul className={`links ${isOpen ? 'open' : ''}`}>
        //         <li>
        //             <Link to="/">Home</Link>
        //         </li>
        //         <li>
        //             <Link to="/about">About</Link>
        //         </li>
        //
        //         {isLoggedIn && (
        //             <React.Fragment>
        //                 <li>
        //                     <Link to="/myDashboard">Dashboard</Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/monthly">Charts</Link>
        //                 </li>
        //             </React.Fragment>
        //         )}
        //
        //         {/* ... Other links ... */}
        //
        //         {!isLoggedIn && (
        //             <React.Fragment>
        //                 <ul className="right-links">
        //                 <li>
        //                     <Link to="/login">Login</Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/signup">Sign Up</Link>
        //                 </li>
        //                 </ul>
        //             </React.Fragment>
        //         )}
        //
        //         {isLoggedIn && (
        //             <li>
        //                 <div className="dropdown">
        //                     <button className="dropdown-toggle" onClick={toggleDropdown}>
        //                         {user}
        //                     </button>
        //                     {isOpen && (
        //                         <ul className="dropdown-menu">
        //                             <li onClick={SignOutFunction}>Sign Out</li>
        //                             <li onClick={refreshToken}>Refresh Token</li>
        //                             <li onClick={goToAccountSettings}>Account Settings</li>
        //                         </ul>
        //                     )}
        //                 </div>
        //             </li>
        //         )}
        //     </ul>
        // </nav>
    );
}

export default Menu;
