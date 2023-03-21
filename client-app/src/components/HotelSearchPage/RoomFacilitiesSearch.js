import React from "react";
import "./styles.scss"

function RoomFacilitiesSearch(props) {
    return (
        <>
            <div className={"title_3 mt-4"}>Room facilities</div>

            <div className={"row_fit"}>
                {props.roomFacilities.map(facility => {
                    return (
                        <button
                            className={props.isDisable ? "disabled_box_button" : ("box_button " + (facility.status ? "box_button_active" : ""))}
                            onClick={props.onChangeRoomFacility.bind(this, facility.Id)} key={facility.Id}>
                            <span className={"box_text"}>{facility.Name}</span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default RoomFacilitiesSearch