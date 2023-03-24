import React, {useEffect, useState} from "react";
import {RangeDatePicker} from "@y0c/react-datepicker";
import {FaCalendarAlt, FaPlus, FaWindowMinimize} from "react-icons/fa";
import {Button, Dropdown, DropdownToggle, Input, InputGroup} from "reactstrap";
import DateFunctions from "../../helpers/DateFunctions";
import {useLocation, useNavigate} from "react-router-dom";
import "./styles.scss"


// http://localhost:3000/availability?check-in-date=2023/03/23&check-out-date=2023/03/25&people=3&rooms=2
function AvailabilitySearchBar(props) {
    const history = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    const [checkInDate, setCheckInDate] = useState(queryParams.get("checkInDate"));
    const [checkOutDate, setCheckOutDate] = useState(queryParams.get("checkOutDate"));
    const [numOfRooms, setNumOfRooms] = useState(queryParams.get("rooms") ? queryParams.get("rooms") : 0);


    const onChangeRooms = (isAdding) => {
        setNumOfRooms(prevState => {
            return (isAdding ? prevState + 1 : prevState - 1) >= 0 ? (isAdding ? prevState + 1 : prevState - 1) : 0;
        })
    }

    return (
        <>
            <div className="title_2 pt-2 pb-2">Availability</div>


            <div className={"row_fit availability_section mt-2"}>
                <RangeDatePicker
                    startPlaceholder="From date"
                    endPlaceholder="To date"
                    dateFormat="DD/MMM/YYYY"
                    onChange={props.onChangeCheckInCheckOutDates}
                    hide={true}
                    value={props.checkInCheckOutDates}
                    initialStartDate={new Date(checkInDate)}
                    initialEndDate={new Date(checkOutDate)}

                />

                <div className={"mb-3"} style={{width: "225px"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 people_text"}>Rooms</span>

                        <button className={"increment_button"} onClick={onChangeRooms.bind(this, false)}>
                            <FaWindowMinimize size={12} style={{
                                marginRight: "10px",
                                marginTop: "-13px",
                                paddingRight: "2px",
                                paddingLeft: "1px"
                            }}/>
                        </button>
                        <span className={"title_3_sub bedroom_text"}>{numOfRooms}</span>

                        <button className={"decrement_button"} onClick={onChangeRooms.bind(this, true)}>
                            <FaPlus size={12} style={{marginRight: "10px", marginTop: "-7px"}}/>
                        </button>

                    </Dropdown>
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Button className="secondaryButton overrideSearchButton">
                        Change Search
                    </Button>
                </div>
            </div>

        </>
    )
}

export default AvailabilitySearchBar