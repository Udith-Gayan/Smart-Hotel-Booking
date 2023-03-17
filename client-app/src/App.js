import RegisterHotel from "./pages/RegisterHotel";
import CustomerDashboard from "./pages/CustomerDashboard";
import './App.scss'
import { Route, Routes } from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import LandingPageForHotelOwner from "./pages/LandingPageForHotelOwner";
import LandingPageForCustomer from "./pages/LandingPageForCustomer";
import RegisterCustomer from "./pages/RegisterCustomer";

function App() {
    ContractService.instance.init();

    return (
        <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/listProperty" element={<LandingPageForHotelOwner />} />
            <Route path="/landing-page-for-customer" element={<LandingPageForCustomer />} />
            <Route path="/register" element={<RegisterHotel />} />
            <Route path="/register-customer" element={<RegisterCustomer />} />
            <Route path="/hotel/:id" element={<HotelHomePage />} />
        </Routes>
    );
}

export default App;
