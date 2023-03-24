import Card1 from "../../layout/Card";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import RoomFacilities from "./RoomFacilities";
import { v4 as uuid } from 'uuid';
import { bed_types } from "../../constants/constants";

function CreateRoomModal(props) {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const [numOfRooms, setNumOfRooms] = useState(0);
    const [bedType, setBedType] = useState("Single");
    const [numOfBeds, setNumOfBeds] = useState(0);
    const [pricePerNight, setPricePerNight] = useState(0.0);
    const [roomCreateDisabled, setRoomCreateDisabled] = useState(true);

    const [checkedFacilities, setCheckedFacilities] = useState([]);

    const onChangeRoomName = (event) => {
        setRoomName(event.target.value);
    }

    const onChangeDescription = (event) => {
        setDescription(event.target.value);
    }

    const onChangeNumOfRooms = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfRooms(event.target.value);
    }

    const onChangeNumOfBeds = (event) => {
        if (event.target.value < 0) {
            return;
        }
        setNumOfBeds(event.target.value);
    }

    const onChangePricePerNight = (event) => {
        let regexp = /^[+]?\d*\.?\d*$/;

        if (!regexp.test(event.target.value)) {
            return;
        }
        setPricePerNight(event.target.value);
    }

    const onChangeFacility = (checked, facility) => {
        if (checked) {
            setCheckedFacilities(prevState => {
                return [...prevState, facility];
            })
        } else {
            setCheckedFacilities(prevState => {
                return prevState.filter(cur_facility => {
                    return cur_facility.Id !== facility.Id;
                })
            })
        }
    }


    const [bedTypeDropDownOpen, setBedTypeDropDownOpen] = useState(false);

    const onSubmitRoom = () => {
        props.onSubmitRoom({
            "Name": roomName,
            "Description": description,
            "MaxRoomCount": numOfRooms,
            "BedType": bedType,
            "NoOfBeds": numOfBeds,
            "CostPerNight": pricePerNight,
            "Facilities": checkedFacilities.map(fc => ({ RFacilityId: fc.Id, ...fc }))
        });
    }

    const toggleBedTypeDropDown = () => {
        setBedTypeDropDownOpen(prevState => !prevState)
    }

    const changeBedType = (value) => {

        setBedType(value);
    }

    //disable create room button logic
    useEffect(() => {
        if (roomName && description && numOfRooms && bedType && numOfBeds && pricePerNight && checkedFacilities.length > 0) {
            setRoomCreateDisabled(false);
        }
        else {
            setRoomCreateDisabled(true);
        }
    }, [roomName, description, numOfRooms, bedType, numOfBeds, pricePerNight, checkedFacilities])

    return (
        <div className={"room_modal pt-0 mt-0"}>
            <Card1 width={"850px"} className={"mt-0"}>

                <div className={"title_2"}>
                    Create Room
                </div>

                <div className="title_3_sub mt-3">Room Name</div>
                <input type="text" className="form-control input_full" id="room_name"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F" }} value={roomName}
                    onChange={onChangeRoomName} />

                <div className="title_3_sub mt-3">Description</div>
                <textarea className={"text_area"} name="description" rows={5} value={description}
                    onChange={onChangeDescription} />

                <div className="title_3_sub mt-3">Number of Rooms</div>
                <input type="number" className="form-control input_half" id="num_of_rooms"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "30%" }} value={numOfRooms}
                    onChange={onChangeNumOfRooms} />

                <div className="title_3 mt-4">Bed Options</div>
                <div className={"subtext"} style={{ lineHeight: "20px" }}>Tell us only about the existing beds in a
                    room (don't include extra
                    beds).
                </div>

                <div className={"row left_div"}>
                    <div className={"col"} style={{ width: "100%" }}>
                        <div className="title_3_sub mt-3">Bed Type</div>
                        <Dropdown isOpen={bedTypeDropDownOpen} toggle={toggleBedTypeDropDown}
                            className={"dropdown_bed_container"} style={{ height: "50px" }}>
                            <DropdownToggle caret
                                className={"dropdown_bed_type"} color={"black"}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <span style={{ textAlign: "left" }} className={"title_3_sub"}>{bedType}</span>

                            </DropdownToggle>
                            <DropdownMenu style={{ width: "100%" }}>

                                {bed_types.map((bed_type, index) => {
                                    return (
                                        <DropdownItem className="dropdown_items" key={index}>
                                            <div onClick={changeBedType.bind(this, bed_type.Name)}>{bed_type.Name}</div>
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className={"col"}>
                        <div className="title_3_sub mt-3">Number of Sleeps</div>
                        <input type="number" className="form-control input_full" id="num_of_beds"
                            style={{ backgroundColor: '#ffffff', borderColor: "#908F8F" }} value={numOfBeds}
                            onChange={onChangeNumOfBeds} />
                    </div>
                </div>

                <div className="title_3 mt-4">Base price per night</div>
                <div className={"subtext"} style={{ lineHeight: "20px" }}>
                    Tell us only about the existing beds in a room (don't include extra beds).
                </div>

                <div className="title_3_sub mt-3">Price for one person per night ($)</div>
                <input type="text" className="form-control input_half" id="price_per_night"
                    style={{ backgroundColor: '#ffffff', borderColor: "#908F8F", width: "50%" }} value={pricePerNight}
                    onChange={onChangePricePerNight} />
                <RoomFacilities onChange={onChangeFacility} />

                <div className={"row center_div pt-3"}>
                    <button className={"create_room_button"} style={{ width: "500px" }} onClick={onSubmitRoom} disabled={roomCreateDisabled}>
                        Create Room
                    </button>
                </div>


            </Card1>
        </div>
    );
}

export default CreateRoomModal