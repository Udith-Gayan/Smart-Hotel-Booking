import React from "react";
import {FaMapMarkerAlt} from "react-icons/fa";
import StarRating from "../HotelHomePage/StarRating";

function SearchHotelResult({hotel, numOfPeople, onViewAvailableClicked}) {
    const styles = {
        image: {
            width: "284px",
            height: "241px",
            objectFit: "cover",
            borderRadius: "5px",
        },
    };

    return (
        <div className={"hotel_card mb-3"} style={{width: "684px"}}>
            <div className={"row_fit p-3"}>
                <img
                    key={hotel.Id}
                    src={hotel.imageUrl}
                    alt={"Hotel image"}
                    style={styles.image}
                />

                <div className={"col-md"} style={{paddingLeft: "20px"}}>
                    <div className={"title_2"} style={{fontSize: "22px"}}>{hotel.Name}</div>

                    <div className={"row_fit"}>
                        <div style={{width: "20px"}}>
                            <FaMapMarkerAlt color={"#908F8F"}/>
                        </div>
                        <div className={"subtext col"} style={{paddingTop: "4px"}}>
                            {hotel.City}
                        </div>
                    </div>

                    {/* <div className={"pt-3"}>
                        <StarRating ratings={3} reviews={726}/>
                    </div> */}

                    <div className={"pt-3 subtext row_right"} style={{}}>
                        {hotel.noOfDays - 1} night, {numOfPeople} Rooms
                    </div>
                    <div className={"pt-1 title_3 row_right"} style={{fontSize: "25px"}}>
                        $ {(hotel.roomDetails[0]).CostPerNight * hotel.noOfDays * numOfPeople}
                    </div>
                    <div className={"pt-1 subtext row_right"}>
                        include taxes and charges
                    </div>

                    <div className={"pt-3 row_right"} style={{}}>
                        <button className={"view_availability_button"} style={{width: "200px"}} onClick={() => onViewAvailableClicked(hotel.Id)} >
                            View availability
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default SearchHotelResult;