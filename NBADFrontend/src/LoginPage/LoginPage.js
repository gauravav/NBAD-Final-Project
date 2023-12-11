import React, { useState } from 'react';
import { auth } from "../firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLogo from '../assets/googleIcon.png';
import { sendPasswordResetEmail } from 'firebase/auth';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
    let navigate = useNavigate();

    const EmailSignIn = (e) => {
        e.preventDefault();
        console.log('Sign-in attempt start:', { email, password });

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

             if(user && !user.emailVerified)
                {
                    navigate('/login');
                    auth.signOut();
                    // If email is not verified, show a message to the user
                    toast.warning('Please verify your email before signing in.', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                }

                // Check if the user's email is verified
                else if (user && user.emailVerified) {
                    console.log('Sign-in attempt success:', { user });
                    setIsLoggedIn(user);
                    navigate('/myDashboard');
                    toast.success('Login Successful', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Sign-in attempt error:', { errorCode, errorMessage });

                // Handle other sign-in errors
                toast.error('Login Failed with ' + errorMessage, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    };


    const handleForgotPassword = () => {
        const auth = getAuth();

        if(email === '')
        {
            toast.error('Please enter email and click on forgot password.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent successfully
                toast.success('Password reset email sent. Check your inbox and enter the newly set password', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Password reset error:', { errorCode, errorMessage });
                toast.error('Password reset failed. ' + errorMessage, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    };

    const handleGoogleSignIn = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((userCredential) => {
                // Signed in with Google
                const user = userCredential.user;
                console.log('Google sign-in success:', { user });
                setIsLoggedIn(user);
                navigate('/myDashboard'); // Replace with the actual path
                toast.success('Google Login Successful', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Google sign-in error:', { errorCode, errorMessage });
                toast.error('Google Login Failed with ' + errorMessage, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    };

    function handleDontHaveAnAccount() {
        navigate('/signup');
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={EmailSignIn}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
                <div className="forgot-password" onClick={handleForgotPassword}>
                    Forgot Password?
                </div>
                <div className="forgot-password" onClick={handleDontHaveAnAccount}>
                    Don't have an account?
                </div>
            </form>
            <div className="google-sign-in-button" onClick={handleGoogleSignIn}>
                <img src={GoogleLogo} alt="Google Logo" />
                Sign in with Google
            </div>        </div>
    );
}

export default LoginPage;
