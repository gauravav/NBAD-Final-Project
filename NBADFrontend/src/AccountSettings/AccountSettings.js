import React, {useEffect, useState} from 'react';
import './AccountSettings.css'; // Reuse the existing CSS styles
import { auth } from "../firebaseConfig";
import { updatePassword, updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

function AccountSettingsPage() {
    const [name, setName] = useState(auth.currentUser.displayName || '');
    const [email, setEmail] = useState(auth.currentUser.email || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [showTokenExpirationModal, setShowTokenExpirationModal] = useState(false);
    const [time, setTime] = useState(90);

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



    let navigate = useNavigate();


    const changeName = (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        updateProfile(user, {
            displayName: name,
        })
            .then(() => {
                toast.success('Name updated successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
            .catch((error) => {
                console.error('Error updating user display name:', error);
                toast.error('Failed to update name', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    };

    const changePassword = (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        updatePassword(user, newPassword)
            .then(() => {
                toast.success('Password updated successfully', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setPassword('');
                setNewPassword('');
            })
            .catch((error) => {
                console.error('Error updating user password:', error);
                toast.error('Failed to update password', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    };

    const changeEmail = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        // Reauthenticate the user
        const credentials = EmailAuthProvider.credential(user.email, emailPassword);

        try {
            await reauthenticateWithCredential(user, credentials);

            // If reauthentication is successful, update the email
            await updateEmail(user, email);

            toast.success('Email updated successfully', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            setPassword('');

        } catch (error) {
            console.error('Error reauthenticating user:', error);
            toast.error('Failed to update email. Please check your current password.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };


    return (
        <div className="login-container">
            <h1>Account Settings</h1>
            <form className="login-form" onSubmit={changeName}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Name new name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Name</button>
            </form>
            <form className="login-form" onSubmit={changeEmail}>
                <div className="form-group">
                    <label htmlFor="email">New Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter new email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Current Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Current Password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Email</button>
            </form>
            <form className="login-form" onSubmit={changePassword}>
                <div className="form-group">
                    <label htmlFor="password">Current Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Current Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}

export default AccountSettingsPage;
