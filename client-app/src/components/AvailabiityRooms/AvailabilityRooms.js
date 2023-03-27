import {roomData} from "../../data/room_data";
import React, {useState} from "react";
import "./styles.scss"
import {FaCheck, FaPlus, FaUserAlt, FaWindowMinimize} from "react-icons/fa";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {bed_types} from "../../constants/constants";
import roomFacilitiesData from "../../data/room_facilities";
import {createSearchParams, useNavigate, useParams} from "react-router-dom";

function AvailabilityRooms(props) {

    const [roomDetails, setRoomDetails] = useState(props.roomData);


    const getRoomCount = (roomIndex) => {
        if (roomIndex in props.selectedRooms) {
            return props.selectedRooms[roomIndex].count;
        }
        return 0;
    }

    const getFacilities = (facilitiesIds) => {
        return roomFacilitiesData;
        return roomFacilitiesData.filter(facility => {
            return facilitiesIds.includes(facility.Id);
        })
    }

    return (
        <div className={"availability-room-section"}>
            <table>
                <thead>
                <tr>
                    <th>Room type</th>
                    <th>Sleeps</th>
                    <th>Price for 1 day (per room)</th>
                    <th>Select rooms</th>
                </tr>
                </thead>

                <tbody>

                {props.roomData.map(room => {
                    return (
                        <tr key={room.Id}>
                            <td className={"td-room"}>
                                <div className={"room-name"}>
                                    {room.RoomName} <span className={"available_rooms"}>({room.NumOfRooms} rooms available)</span>
                                </div>

                                <div className={"room-count"}>
                                    {room.BedType} Beds
                                </div>

                                <div className={"facilities"}>
                                    {getFacilities(room.RoomFacilities).map(facility => {
                                        return (
                                            <div className={"facility"} key={facility.Id}>
                                                <FaCheck color={"#004cb8"}/>
                                                <span className={"facility-text"}>{facility.Name}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                            </td>
                            <td className={"td-sleeps"}>
                                {
                                    Array(room.NumOfSleeps).fill(true).map((_, i) => {
                                            return (
                                                <span key={i}><FaUserAlt className={"sleep-icon"}/></span>
                                            );
                                        }
                                    )
                                }

                            </td>
                            <td className={"td-price"}>
                                <div className={"price-text"}>$ {parseFloat(room.PricePerNight).toFixed(2)}</div>
                                <div className={"price-subtext"}>Includes taxes and charges</div>
                            </td>
                            <td className={"td-room-count"}>

                                <button className={"increment_button"}
                                        onClick={ props.onChangeSelectedRooms.bind(this, room, false) }>
                                    <FaWindowMinimize size={12} style={{
                                        marginRight: "10px",
                                        marginTop: "-13px",
                                        paddingRight: "2px",
                                        paddingLeft: "1px"
                                    }}/>
                                </button>
                                <span className={"title_3_sub bedroom_text"}>{getRoomCount(room.Id)}</span>

                                <button className={"decrement_button"}
                                        onClick={ props.onChangeSelectedRooms.bind(this, room, true)}>
                                    <FaPlus size={12} style={{marginRight: "10px", marginTop: "-7px"}}/>
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div className={"mb-3 mt-5 button_container"}>
                <Button className="secondaryButton reserve-button" onClick={props.onReserve} disabled={props.reserveBtnDisabled}>
                    I'll Reserve
                </Button>
            </div>
        </div>
    );
}

export default AvailabilityRooms