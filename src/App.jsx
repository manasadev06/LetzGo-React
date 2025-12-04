import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OfferRide from "./pages/OfferRide";
import BookRide from "./pages/BookRide";
import Confirmation from "./pages/Confirmation";
import DriverRegistration from "./pages/DriverRegistration";
import DriverDashboard from "./pages/DriverDashboard";
import Profile from "./pages/Profile";
import Maps from "./pages/Maps";
import RideDetail from "./pages/RideDetail";
import DriverConfirmation from "./pages/DriverConfirmation";
import MyBookings from "./pages/MyBookings";
import Dashboard from "./pages/Dashboard";




// Add this CSS to ensure proper layout with fixed header and footer
const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyles = {
  flex: 1,
  paddingTop: '80px', // Space for the fixed header
  paddingBottom: '60px', // Space for the footer
  paddingLeft: '16px',
  paddingRight: '16px',
  maxWidth: '1400px',
  width: '100%',
  margin: '0 auto',
};

export default function App(){

  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);

useEffect(() => {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}, [theme]);


  return (
    <BrowserRouter>
      <div className="app" style={appStyles}>
        <Header theme={theme} setTheme={setTheme} />

        <main className="main" style={mainStyles}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/offer" element={<OfferRide />} />
            <Route path="/book" element={<BookRide />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/maps" element={<Maps />} />
             <Route path="/rides/:rideId" element={<RideDetail />} />
            <Route path="/driver-confirmation" element={<DriverConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/dashboard" element={<Dashboard />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
