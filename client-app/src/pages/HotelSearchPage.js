import MainContainer from "../layout/MainContainer";
import {useNavigate, useLocation} from "react-router-dom";
import hotelsData from "../data/hotels"
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import React, {useEffect, useState} from "react";
import SearchBar from "../components/HotelSearchPage/SearchBar";
import Filters from "../components/HotelSearchPage/Filters";
import facilitiesData from "../data/facilities"
import roomFacilitiesData from "../data/room_facilities";
import RoomFacilitiesSearch from "../components/HotelSearchPage/RoomFacilitiesSearch";
import {bed_types} from "../constants/constants";
import hotelData from "../data/hotels"
import HotelList from "../components/HotelSearchPage/HotelList";

function HotelSearchPage(props) {
    const history = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city");
    const checkInDate = queryParams.get("check-in-date");
    const checkOutDate = queryParams.get("check-out-date");
    const numOfPeople = queryParams.get("people");

    const [bedRooms, setBedRooms] = useState(1);
    const [searchText, setSearchText] = useState("");

    const [budget, setBudget] = useState("");
    const [distance, setDistance] = useState("");
    const [conveniences, setConveniences] = useState([])
    const [roomFacilities, setRoomFacilities] = useState([])

    const [cancellationPolicy, setCancellationPolicy] = useState("None");
    const [bedTypes, setBedTypes] = useState([]);

    const isFilerDisable = true;

    useEffect(() => {
        let convenienceWithAvailability = facilitiesData.map(facility => {
            return {
                ...facility,
                status: false,
            }
        })

        let quickPlannersWithAvailability = facilitiesData.map(facility => {
            return {
                ...facility,
                status: false,
            }
        })

        let bedTypeAvailability = bed_types.map(bed_type => {
            return {
                ...bed_type,
                status: false,
            }
        })

        let roomFacilityAvailability = roomFacilitiesData.map(room_facility => {
            return {
                ...room_facility,
                status: false,
            }
        })

        setConveniences(convenienceWithAvailability);
        setRoomFacilities(roomFacilityAvailability);
        setBedTypes(bedTypeAvailability);
    }, []);

    const onClickSearch = () => {
        let selected_conveniences = conveniences.filter(convenience => convenience.status);
        let selected_bed_types = bedTypes.filter(bed_type => bed_type.status);
        let selected_room_facilities = roomFacilities.filter(facility => facility.status);
        console.log(
            {
                "Bed Rooms": bedRooms,
                "Search Text": searchText,
                "Budget": budget,
                "Conveniences": selected_conveniences,
                "Distance": distance,
                "Cancellation Policy": cancellationPolicy,
                "Bed Preferences": selected_bed_types,
                "Room Facilities": selected_room_facilities,
            }
        );
    }

    const resetFilters = () => {
        let temp_conveniences = conveniences.map(convenience => {
            return {
                ...convenience, status: false,
            }
        })

        let bed_types = bedTypes.map(bed_type => {
            return {
                ...bed_type, status: false,
            }
        })

        let room_facilities = roomFacilities.map(facility => {
            return {
                ...facility, status: false,
            }
        })
        setBudget("");
        setConveniences(temp_conveniences);
        setDistance("");
        setCancellationPolicy("None");
        setBedTypes(bed_types);
        setRoomFacilities(room_facilities);
    }
    const onChangeConvenience = (Id) => {
        let temp_data = [...conveniences];
        let index = temp_data.findIndex(cur_facility => Id === cur_facility.Id)
        temp_data[index].status = !temp_data[index].status;

        setConveniences(temp_data);
    }

    const onChangeBedType = (Id) => {
        let temp_data = [...bedTypes];
        let index = temp_data.findIndex(bed_type => Id === bed_type.Id)
        temp_data[index].status = !temp_data[index].status;

        setBedTypes(temp_data);
    }


    const onChangeRoomFacility = (Id) => {
        let temp_data = [...roomFacilities];
        let index = temp_data.findIndex(cur_facility => Id === cur_facility.Id)
        temp_data[index].status = !temp_data[index].status;

        setRoomFacilities(temp_data);
    }


    return (
        <MainContainer>

            <SearchBar city={city} checkInDate={checkInDate} checkOutDate={checkOutDate} numOfPeople={numOfPeople}
                       bedRooms={bedRooms} setBedRooms={setBedRooms}
                       searchText={searchText} setSearchText={setSearchText}
                       onClickSearch={onClickSearch}/>

            <div className={"row_fit"} style={{width: "100%"}}>
                <div style={{paddingRight: "30px", paddingBottom: "20px"}}>
                    <Filters city={city} budget={budget} setBudget={setBudget}
                             distance={distance} setDistance={setDistance}
                             conveniences={conveniences} onChangeConvenience={onChangeConvenience}
                             cancellationPolicy={cancellationPolicy} setCancellationPolicy={setCancellationPolicy}
                             bedTypes={bedTypes} onChangeBedType={onChangeBedType}
                             roomFacilities={roomFacilities} onChangeRoomFacility={onChangeRoomFacility}
                             resetFilters={resetFilters} isDisable={isFilerDisable}
                    />
                </div>
                <div className={"col"}>
                    <HotelList data={hotelData} numOfPeople={numOfPeople}/>
                </div>
            </div>

        </MainContainer>
    )
}

//http://localhost:3000/search-hotel?city=Galle&check-in-date=2023/03/17&check-out-date=2023/03/20&people=2
export default HotelSearchPage