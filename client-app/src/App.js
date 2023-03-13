import RegisterHotel from "./pages/RegisterHotel";
import './App.scss'
import {Route, Routes} from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/register" element={<RegisterHotel />}/>
        </Routes>
    );
}

export default App;
