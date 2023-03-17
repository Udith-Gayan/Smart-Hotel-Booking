import RegisterHotel from "./pages/RegisterHotel";
import './App.scss'
import {Route, Routes} from "react-router-dom";
import ContractService from "./services-common/contract-service";
import HotelHomePage from "./pages/HotelHomePage";
import HotelSearchPage from "./pages/HotelSearchPage";

function App() {
    ContractService.instance.init();

    return (
        <Routes>
            <Route path="/register" element={<RegisterHotel />}/>
            <Route path="/hotel/:id" element={<HotelHomePage />}/>
            <Route path="/search-hotel" element={<HotelSearchPage />}/>
        </Routes>
    );
}

export default App;
