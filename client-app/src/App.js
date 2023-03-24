import RegisterHotel from "./pages/RegisterHotel";
import CustomerDashboard from "./pages/CustomerDashboard";
import './App.scss'
import {Route, Routes} from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import LandingPageForHotelOwner from "./pages/LandingPageForHotelOwner";
import LandingPageForCustomer from "./pages/LandingPageForCustomer";
import RegisterCustomer from "./pages/RegisterCustomer";
import HotelSearchPage from "./pages/HotelSearchPage";
import Reservations from "./pages/Reservations";
import ConfirmBooking from "./pages/ConfirmBooking";
import AvailabilityPage from "./pages/AvailabilityPage";
import { useEffect, useState } from "react";
import { Spinner } from 'reactstrap'

function App() {
    const [isContractInitiated, setIsContractInitiated] = useState(false);


    useEffect(() => {
        ContractService.instance.init().then(res => {
            setIsContractInitiated(true);
        });

        const handleBackButton = () => {
            // Do something when the back button is clicked
            ContractService.instance.init().then(res => {
                setIsContractInitiated(true);
            });
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };


    }, []);




    return (
        <>
            {isContractInitiated && (
                <Routes>
                    <Route path="/" element={<CustomerDashboard />} />
                    <Route path="/list-property" element={<LandingPageForHotelOwner />} exact />
                    <Route path="/register-hotel" element={<RegisterHotel />} exact />
                    <Route path="/register-customer" element={<RegisterCustomer />} exact />
                    <Route path="/hotel/:id" element={<HotelHomePage />} exact />
                    <Route path="/reservations" element={<Reservations />} exact />
                    <Route path="/search-hotel" element={<HotelSearchPage exact />} />
                    <Route path="/confirm-booking" element={<ConfirmBooking exact />} />
                    <Route path="/availability/:id" element={<AvailabilityPage/>} exact />

                </Routes>
            )}
            {!isContractInitiated && (
                <div className="spinnerWrapper">
                    <Spinner
                        color="primary"
                        style={{
                            height: "3rem",
                            width: "3rem",
                        }}
                        type="grow"
                    >
                        Loading...
                    </Spinner>
                </div>
            )}
        </>
    );
}

export default App;
