import React, { useState } from 'react';
import './SignUp.css';
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
    let navigate = useNavigate();

    const EmailSignUp = (e) => {
        e.preventDefault();
        console.log('Sign-up attempt start:', { name, email, password });

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed up successfully
                const user = userCredential.user;
                console.log('Sign-up attempt success:', {userCredential});
                await sendEmailVerification(user);


                // You can update the user's display name with the provided 'name'
                updateProfile(user, {
                    displayName: name,
                })
                    .then(() => {
                        console.log('User display name updated successfully');

                        // Set the 'name' state and update 'isLoggedIn'
                        auth.signOut();
                        navigate('/login');
                        toast.success('Sign up Successful. Please click on link sent to your email for verification', {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    })
                    .catch((error) => {
                        console.error('Error updating user display name:', error);
                    });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign-up attempt error:', { errorCode, errorMessage });
                toast.error('Sign Up Failed with ' + errorMessage, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            });
    }


    function handleAlreadyHaveAnAccount() {
        navigate('/login');
    }

    return (
        <div className="login-container">
            <h1>Sign Up</h1>
            <form className="login-form" onSubmit={EmailSignUp}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Sign Up</button>
                <div className="forgot-password" onClick={handleAlreadyHaveAnAccount}>
                    Already have an account?
                </div>
            </form>

        </div>
    );
}

export default SignUpPage;
