import { getAuth, signInWithPopup, GoogleAuthProvider,signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "./firebaseConfig";
import React, { useState } from 'react';
import App from "./App";

function temp(){

    function signin() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setIsLoggedIn(user);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                console.log(user);
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
    // const EmailSignIn = async (e) => {
    //     e.preventDefault();
    //     console.log('Sign-in attempt start:', { email, password });
    //
    //     try {
    //         const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT+'/auth/login?username=' + email + '&password=' + password);
    //
    //         if (response.status === 200) {
    //             const token = await response.text();
    //             console.log('Sign-in attempt success. Token:', token);
    //             // Now you can use the 'token' for further communication.
    //             // For example, you can store it in localStorage, state, or a cookie.
    //         } else {
    //             const errorMessage = await response.text();
    //             console.log('Sign-in attempt error:', errorMessage);
    //             // Handle the error appropriately, e.g., show an error message to the user.
    //         }
    //     } catch (error) {
    //         console.error('Error occurred while signing in:', error);
    //         // Handle network or other errors here.
    //     }
    // };

    const EmailSignIn = (e) => {
        e.preventDefault();
        console.log('Sign-in attempt start:', { email, password });
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('Sign-in attempt success:', { userCredential });
                setIsLoggedIn(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Sign-in attempt error:', { errorCode, errorMessage });
            });
    }

    function SignOutFunction() {
        auth.signOut().then(() => {
            // Sign-out successful.
            console.log('Sign-out successful');
            setIsLoggedIn(null);
        }).catch((error) => {
            // An error happened.
            console.log('Sign-out error:', error);
        });
    }

    function refreshToken() {
        auth.currentUser.getIdToken(true).then((idToken) => {
            // Id token has been refreshed
            console.log('Id token has been refreshed:', { idToken });
        }).catch((error) => {
            // Handle error
            console.log('Id token refresh error:', error);
        });
    }

    //make a backend call to get user email by sending the token as request body
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
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Authentication failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div>
            {isLoggedIn && (
                <div>
                    <h1>Welcome {isLoggedIn.email}</h1>
                    <button onClick={() => SignOutFunction()}>Sign Out</button>
                    <button onClick={() => refreshToken()}>Refresh Token</button>
                    <button onClick={() => checkToken()}>Log User</button>
                </div>
            )}
            {!isLoggedIn && (
                <div>
                    <div>
                        <h1>Not Signed In</h1>
                    </div>
                    <button onClick={signin}> Google Sign in</button>

                    <div className="signin-page">
                        <h2>Sign In</h2>
                        <form onSubmit={EmailSignIn}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button  type="submit">Sign In</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );



}

export default temp;
