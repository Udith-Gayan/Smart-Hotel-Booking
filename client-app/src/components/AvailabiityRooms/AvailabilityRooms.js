import {roomData} from "../../data/room_data";
import React, {useState} from "react";
import "./styles.scss"
import {FaCheck, FaPlus, FaUserAlt, FaWindowMinimize} from "react-icons/fa";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {bed_types} from "../../constants/constants";
import roomFacilitiesData from "../../data/room_facilities";

function AvailabilityRooms(props) {

    const [selectedRooms, setSelectedRooms] = useState({});
    const [roomDetails, setRoomDetails] = useState(roomData);

    const onChangeSelectedRooms = (roomIndex, isAdding, maxRooms) => {
        setSelectedRooms(prevState => {
            let newState = {...prevState};
            if (!(roomIndex in newState))
                newState[roomIndex] = 0;

            newState[roomIndex] = (isAdding ? newState[roomIndex] + 1 : newState[roomIndex] - 1);
            if (newState[roomIndex] < 0)
                newState[roomIndex] = 0;
            else if (newState[roomIndex] > maxRooms)
                newState[roomIndex] = maxRooms;

            return newState;
        })
    }

    const getRoomCount = (roomIndex) => {
        if (roomIndex in selectedRooms) {
            return selectedRooms[roomIndex];
        }
        return 0;
    }


    const getFacilities = (facilitiesIds) => {
        return roomFacilitiesData.filter(facility => {
            return facilitiesIds.includes(facility.Id);
        })
    }

    const onReserve = () => {
        let selectedRoomList = Object.keys(selectedRooms).map(roomId => {
            return {
                Id: roomId,
                Count: selectedRooms[roomId]
            }

        });

        console.log(selectedRoomList);
    }


    return (
        <div className={"availability-room-section"}>
            <table>
                <thead>
                <tr>
                    <th>Room type</th>
                    <th>Sleeps</th>
                    <th>Price for 1 night</th>
                    <th>Select rooms</th>
                </tr>
                </thead>

                <tbody>

                {roomDetails.map(room => {
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
                                        onClick={onChangeSelectedRooms.bind(this, room.Id, false, room.NumOfRooms)}>
                                    <FaWindowMinimize size={12} style={{
                                        marginRight: "10px",
                                        marginTop: "-13px",
                                        paddingRight: "2px",
                                        paddingLeft: "1px"
                                    }}/>
                                </button>
                                <span className={"title_3_sub bedroom_text"}>{getRoomCount(room.Id)}</span>

                                <button className={"decrement_button"}
                                        onClick={onChangeSelectedRooms.bind(this, room.Id, true, room.NumOfRooms)}>
                                    <FaPlus size={12} style={{marginRight: "10px", marginTop: "-7px"}}/>
                                </button>
                                {/*<Dropdown isOpen={selectedRoomCountDropdown === room.Id}*/}
                                {/*          toggle={toggleRoomCountDropdown.bind(this, room.Id)}*/}
                                {/*          className={"dropdown-container"}>*/}
                                {/*    <DropdownToggle caret*/}
                                {/*                    className={"dropdown-toggler"} color={"black"}*/}
                                {/*    >*/}
                                {/*        <span style={{textAlign: "left"}}*/}
                                {/*              className={"title_3_sub"}>{getRoomCount(room.Id)}</span>*/}

                                {/*    </DropdownToggle>*/}
                                {/*    <DropdownMenu className={"dropdownMenu"}>*/}
                                {/*        {*/}
                                {/*            Array(room.NumOfRooms).fill(true).map((_, roomCountIndex) => {*/}
                                {/*                    return (*/}
                                {/*                        <DropdownItem className="dropdownItem" key={roomCountIndex}>*/}
                                {/*                            <div*/}
                                {/*                                onClick={changeSelectedRooms.bind(this, room.Id, roomCountIndex + 1)}>{roomCountIndex + 1}</div>*/}
                                {/*                        </DropdownItem>*/}
                                {/*                    );*/}
                                {/*                }*/}
                                {/*            )*/}
                                {/*        }*/}
                                {/*    </DropdownMenu>*/}
                                {/*</Dropdown>*/}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div className={"mb-3 mt-5 button_container"}>
                <Button className="secondaryButton reserve-button" onClick={onReserve}>
                    I'll Reserve
                </Button>
            </div>
        </div>
    );
}

export default AvailabilityRooms