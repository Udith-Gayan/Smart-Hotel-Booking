import React from "react";
import "./styles.scss"

function Conveniences(props) {
    return (
        <>
            <div className={"title_3 mt-4"}>Conveniences</div>

            <div className={"row_fit"}>
                {props.conveniences.map(facility => {
                    return (
                        <button
                            className={props.isDisable ? "disabled_box_button" : ("box_button " + (facility.status ? "box_button_active" : ""))}
                            onClick={props.onChangeConvenience.bind(this, facility.Id)} key={facility.Id}
                            disabled={props.isDisable}>
                            <span className={"box_text"}>{facility.Name}</span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default Conveniences