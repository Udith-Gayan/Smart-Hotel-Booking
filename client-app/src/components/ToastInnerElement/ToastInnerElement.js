import {IoMdCloseCircle} from "react-icons/io";
import toast from "react-hot-toast";
import React from "react";

function ToastInnerElement (props) {
    return (
        <div style={{paddingTop: "0"}}>
            <IoMdCloseCircle size={"25px"} color={"red"} onClick={() => toast.dismiss(props.id)}/>
            <span className={"title_4"} style={{paddingLeft: "10px"}}>{props.message}</span>

        </div>
    )
}

export default ToastInnerElement