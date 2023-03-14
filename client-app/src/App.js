import RegisterHotel from "./pages/RegisterHotel";
import './App.scss'
import {Route, Routes} from "react-router-dom";
import ContractService from "./services-common/contract-service";

function App() {
    ContractService.instance.init();

    return (
        <Routes>
            <Route path="/register" element={<RegisterHotel />}/>
        </Routes>
    );
}

export default App;
