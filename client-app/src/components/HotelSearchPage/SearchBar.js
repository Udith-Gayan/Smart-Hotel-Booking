import hotelsData from "../../data/hotels";
import {Dropdown, DropdownToggle, Input} from "reactstrap";
import React, {useState} from "react";
import DateFunctions, {convertDateMonthDate} from "../../helpers/DateFunctions";
import {FaCalendarAlt, FaPlusCircle, FaPlus, FaWindowMinimize} from "react-icons/fa";
import "./styles.scss"

function SearchBar(props) {


    const onChangeBedRooms = (isAdding) => {
        props.setBedRooms(prevState => {
            return (isAdding ? prevState + 1 : prevState - 1) >= 0 ? (isAdding ? prevState + 1 : prevState - 1) : 0;
        })
    }

    const onChangeSearchText = (event) => {
        props.setSearchText(event.target.value);
    }

    
    return (
        <section>
            <div className={"title_2"}>{props.hotelsData ? props.hotelsData.length : `No `} Hotels in {props.city}</div>
            <div className={"subtext"} style={{lineHeight: "15px"}}>Book your next stay at one of our properties</div>

            <div className={"row mt-4"}>
                <div className={"mb-3"} style={{width: "auto"}}>
                    <Input value={props.searchCity} onChange={e => props.onCitySearchChanged(e.target.value)}></Input>
                    {/* <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 city_text"}>{props.city}</span>
                        <DropdownToggle caret
                                        style={{
                                            textAlign: "right",
                                            backgroundColor: '#ffffff',
                                            width: "50%",
                                            border: "none"
                                        }}
                                        color={"black"}
                                        disabled>

                        </DropdownToggle>
                    </Dropdown> */}
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                            <span
                                className={"title_4 date_range_text"}>{DateFunctions.convertDateMonthDate(props.checkInDate)} - {DateFunctions.convertDateMonthDate(props.checkOutDate)}
                            </span>

                        <FaCalendarAlt size={22} className={"mt-2"} style={{marginRight: "10px"}} color={"#908F8F"}/>

                    </Dropdown>
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 people_text"}>{props.numOfPeople} Rooms</span>

                        <DropdownToggle caret
                                        style={{
                                            textAlign: "right",
                                            backgroundColor: '#ffffff',
                                            width: "50%",
                                            border: "none"
                                        }}
                                        color={"black"}
                                        disabled>

                        </DropdownToggle>
                    </Dropdown>
                </div>

                <div className={"mb-3"} style={{width: "auto"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 people_text"}>Hotel</span>

                        <DropdownToggle caret
                                        style={{
                                            textAlign: "right",
                                            backgroundColor: '#ffffff',
                                            width: "50%",
                                            border: "none"
                                        }}
                                        color={"black"}
                                        disabled>

                        </DropdownToggle>
                    </Dropdown>
                </div>

                {/* <div className={"mb-3"} style={{width: "225px"}}>
                    <Dropdown group style={{border: "1px solid #908F8F", height: "40px"}}>
                        <span className={"title_4 people_text"}>Bedroom</span>

                        <button className={"increment_button"} onClick={onChangeBedRooms.bind(this, false)}>
                            <FaWindowMinimize size={12} style={{
                                marginRight: "10px",
                                marginTop: "-13px",
                                paddingRight: "2px",
                                paddingLeft: "1px"
                            }}/>
                        </button>
                        <span className={"title_3_sub bedroom_text"}>{props.bedRooms}</span>

                        <button className={"decrement_button"}  onClick={onChangeBedRooms.bind(this, true)}>
                            <FaPlus size={12} style={{marginRight: "10px", marginTop: "-7px"}}/>
                        </button>

                    </Dropdown>
                </div> */}
            </div>

            <div className={"row mt-1"}>
                <div className={"col mb-3"}  style={{minWidth: "500px"}}>
                    <input type="text" placeholder={"Search"} className="form-control title_4" id="search-text"
                           onChange={onChangeSearchText} value={props.searchText}
                           style={{backgroundColor: '#ffffff', borderColor: "#908F8F", height: "38px", paddingLeft: "40px", fontWeight: "500"}}/>
                </div>

                <div className={"col-md-2 col-sm-3 mb-3"}  style={{width: "auto"}}>
                    <button className={"clear_button"} style={{maxWidth: "200px"}} onClick={props.onClearSearchText}>
                        <span className={"title_4"}>Clear</span>
                    </button>
                </div>

                <div className={"col-md-2 col-sm-3 mb-3"}  style={{width: "auto"}}>
                    <button className={"search_button"} style={{maxWidth: "200px"}} onClick={props.onClickSearch}>
                        <span className={"title_4"}>Search</span>
                    </button>
                </div>

            </div>


        </section>
    )
}

export default SearchBar