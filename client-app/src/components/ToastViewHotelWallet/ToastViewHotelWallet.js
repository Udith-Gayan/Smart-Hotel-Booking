import "./index.module.scss"
import {FaUserSecret} from "react-icons/fa"
import toast from "react-hot-toast";
import React from "react";
import {Button} from "reactstrap";

function ToastViewHotelWallet(props) {
    return (

        <div style={{paddingTop: "0"}} >
            <FaUserSecret size={"25px"} color={"maroon"} />
            <span className={"title_4"} style={{paddingLeft: "10px", paddingRight: "10px", fontWeight:"600", fontSize: "20px"}}>Save safely</span>
            <br />
            <div style={{ marginTop: "30px"}}>
                <p>Secret: &nbsp;&nbsp;&nbsp;&nbsp;{props.walletSecret}</p>
                <p>Address:&nbsp; {props.walletAddress}</p>

            </div>
            <hr />
            <p>{props.warningMessage}</p>
            <Button className="primaryButton" onClick={() => toast.dismiss(props.id)}> Close</Button>

        </div>
    )
}

export default ToastViewHotelWallet;