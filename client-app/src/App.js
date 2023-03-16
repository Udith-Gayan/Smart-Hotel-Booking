import RegisterHotel from "./pages/RegisterHotel";
import CustomerDashboard from "./pages/CustomerDashboard";
import './App.scss'
import { Route, Routes } from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import LandingPageForHotelOwner from "./pages/LandingPageForHotelOwner";

function App() {
    ContractService.instance.init();

    return (
        <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/landingPageForHotelOwner" element={<LandingPageForHotelOwner />} />
            <Route path="/register" element={<RegisterHotel />} />
            <Route path="/hotel/:id" element={<HotelHomePage />} />
        </Routes>
    );
}

export default App;
