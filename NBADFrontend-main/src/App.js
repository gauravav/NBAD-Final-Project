import './App.css';
import Menu from "./Menu/Menu";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import Footer from "./Footer/Footer";
import LoginPage from "./LoginPage/LoginPage";
import AboutPage from "./AboutPage/AboutPage";
import SignUpPage from "./SignUp/SignUp";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyDashboard from "./MyDashboard/MyDashboard";
import ViewBudgets from "./ViewBudgets/ViewBudgets";
import ConfigureBudgets from "./ConfigureBudgets/ConfigureBudgets";
import CreateNewBudget from "./CreateNewBudget/CreateNewBudget";
import AccountSettings from "./AccountSettings/AccountSettings";
import Training from "./Training/Training";
import Monthly from "./Monthly/Monthly";
import Status from "./Status/Status";



function App() {

    return (
        <Router>
            <Menu />
            <ToastContainer />
            <div className="mainContainer">
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Define more routes and components here */}

                <Route path='/about' element={<AboutPage />} />

                <Route path='/login' element={<LoginPage />} />

                <Route path='/signup' element={<SignUpPage />} />

                <Route path='/myDashboard' element={<MyDashboard />} />

                <Route path='/monthly' element={<Monthly />} />

                <Route path='/status' element={<Status/>} />

                <Route path='/accountSettings' element={<AccountSettings />} />

                <Route path='/training' element={<Training/>} />

            </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;