import Card1 from "../../layout/Card";
import {FaTrashAlt} from "react-icons/fa";
import React from "react";

function RoomDetails(props) {
    return (
        <Card1 className={"pt-4 pb-2"}>

            {props.rooms.map(room => {
                return (
                    <div className={"row mb-3"} key={room.Id}>
                        <div className={"col-3 offset-1 title_4"}>
                            <span>{room.Name} ({room.MaxRoomCount})</span>
                        </div>
                        <div className={"col-3 title_4"}>{room.BedType} Bed ({room.NoOfBeds})</div>
                        <div className={"col-3 title_4"}> {parseFloat(room.CostPerNight).toFixed(2)} $ </div>
                        <div className={"col-2 title_4"}>
                            <button className={"delete_button"} onClick={props.onOpenDeleteRoomModal.bind(this, room)}>
                                <span>
                                <FaTrashAlt size={22}/> <span className={"title_4"}>&nbsp;Delete</span>
                            </span>
                            </button>
                        </div>

                    </div>
                )
            })}


        </Card1>

    );
}

export default RoomDetails;