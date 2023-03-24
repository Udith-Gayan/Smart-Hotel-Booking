import MainContainer from "../layout/MainContainer";
import "../components/HotelHomePage/StarRating"
import StarRating from "../components/HotelHomePage/StarRating";
import { FaMapMarkerAlt } from "react-icons/fa";
import HotelImages from "../components/HotelHomePage/HotelImages";
import FacilitiesReadOnly from "../components/HotelHomePage/FacilitiesReadOnly";
import React, { useRef, useState, useEffect } from "react";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import AvailabilitySearchBar from "../components/Availability/AvailabilitySearchBar";
import AvailabilityRooms from "../components/AvailabiityRooms/AvailabilityRooms";
import DateFunctions from "../helpers/DateFunctions";
import HotelService from "../services-domain/hotel-service copy";
import { toast } from "react-hot-toast";

//http://localhost:3000/availability/1?fromDate=2023-03-17&toDate=2023-03-20
function AvailabilityPage() {
    const hotelService = HotelService.instance;
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { id } = useParams();
    let checkInDate = queryParams.get("checkInDate");
    let checkOutDate = queryParams.get("checkOutDate");
    let roomCount = Number(queryParams.get("rooms"));


    const [images, setImages] = useState([
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FHotel%20Kingsberry%2FHotel%20Kingsberry_6dcdd295-12cf-4e01-b4d8-59ab28175e04.png?alt=media&token=0ea7538d-4921-41d9-bb17-e89f6758d465" },
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FHotel%20Kingsberry%2FHotel%20Kingsberry_707f904a-53b5-4ec3-b91d-63c166e0e9d5.jpg?alt=media&token=66c17da2-f4bd-49eb-af19-10b63d995418" },
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FCinnamon%20Red%20Colombo%2FCinnamon%20Red%20Colombo_04281212-dac7-4219-a703-c3315913bd02.jpg?alt=media&token=0a931a94-0045-48b8-86f6-2d9d9e3dc9f5" },
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FCinnamon%20Red%20Colombo%2FCinnamon%20Red%20Colombo_1113c495-b5df-4363-8933-2ac989f6d854.jpg?alt=media&token=5c4e5d8d-4a57-4c7d-b673-fb14ba8e1c32" },
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FCinnamon%20Red%20Colombo%2FCinnamon%20Red%20Colombo_830b0159-9954-4aa4-b3cc-8f0bf5f24f77.jpg?alt=media&token=d695ae4b-6ae2-42c2-8913-83c36227c614" },
        { Url: "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2FCinnamon%20Red%20Colombo%2FCinnamon%20Red%20Colombo_d7a2e347-0e33-446c-a9a4-2c2279d00ef0.jpg?alt=media&token=394ca98e-2f09-4046-9b17-2897f12d166c" }]);

    const [hotelName, setHotelName] = useState("Heritance Kandalama");
    const [address1, setAddress1] = useState("P.O Box 11");
    const [address2, setAddress2] = useState("Heritance Kandalama");
    const [city, setCity] = useState("Sigiriya");
    const [description, setDescription] = useState();
    const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);

    const [roomData, setRoomData] = useState([]);

    const [checkInCheckOutDates, setCheckInCheckOutDates] = useState({
        checkIn: checkInDate,
        checkOut: checkOutDate
    });

    const [selectedRooms, setSelectedRooms] = useState({});

    const [reserveBtnDisabled, setReserveBtnDisabled] = useState(true);

    useEffect(() => {
        getMyHotelRoomDetails();
    }, [])

    async function getMyHotelRoomDetails() {
        try {
            const resObj = await hotelService.getSingleHotelWithRooms(id, checkInDate, checkOutDate, roomCount);
            if (resObj) {
                // set images
                if (resObj.ImageUrls && resObj.ImageUrls.length > 0) {
                    setImages(resObj.ImageUrls.map(im => ({ Url: im.Url })));
                }
                setHotelName(resObj.Name);
                setAddress1(resObj.AddressLine1 ?? '');
                setAddress2(resObj.AddressLine2 ?? '');
                setCity(resObj.City);
                setDescription(resObj.Description);
                setSelectedFacilityIds(resObj.facilityIds?.map(f => f.HFacilityId));

                setRoomData(resObj.RoomDetails.map(rm => {
                    return {
                        Id: Number(rm.Id),
                        RoomName: rm.Name,
                        Description: rm.Description,
                        NumOfRooms: rm.avaialableRoomCount,
                        PricePerNight: rm.CostPerNight,
                        BedType: rm.BedType,
                        NumOfSleeps: rm.NoOfBeds,
                        RoomFacilities: rm.facilityIds?.map(f => f.RFacilityId)
                    }
                }));


            }
        } catch (err) {
            toast.error(err);
        }
    }

    const onChangeSelectedRooms = (room, isAdding) => {
        setSelectedRooms(prevState => {
            let newState = { ...prevState };
            if (!(room.Id in newState))
                newState[room.Id] = { roomData: room, count: 0 };

            newState[room.Id].count = (isAdding ? newState[room.Id].count + 1 : newState[room.Id].count - 1);
            if (newState[room.Id].count < 0)
                newState[room.Id].count = 0;
            else if (newState[room.Id].count > room.NumOfRooms)
                newState[room.Id].count = room.NumOfRooms;

            // For disabling the reserve button
            let countTotal = 0;
            for (const kk in newState) {
                countTotal += newState[kk].count;
            }
            if (countTotal > 0)
                setReserveBtnDisabled(false);
            else
                setReserveBtnDisabled(true)

            return newState;
        })


    }

    const infoSection = useRef(null);
    const facilitiesSection = useRef(null);
    const houseRulesSection = useRef(null);
    const roomLayoutSection = useRef(null);

    const [rooms, setRooms] = useState([]);

    const [activeTab, setActiveTab] = useState(null);
    const onClickInfoSectionButton = () => {
        setActiveTab("info")
        infoSection.current.scrollIntoView({ behavior: 'smooth' });
    };

    const onClickFacilitiesSectionButton = () => {
        setActiveTab("facilities")
        facilitiesSection.current.scrollIntoView({ behavior: 'smooth' });
    };

    const onClickHouseRulesSectionButton = () => {
        setActiveTab("house_rules")
        houseRulesSection.current.scrollIntoView({ behavior: 'smooth' });
    };

    const onClickRoomLayoutSectionButton = () => {
        setActiveTab("room_layout")
        roomLayoutSection.current.scrollIntoView({ behavior: 'smooth' });
    };
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [deletingRoom, setDeletingRoom] = useState(false);
    const [deleteRoomDetails, setDeleteRoomDetails] = useState(null);

    const onCloseCreateRoomModal = () => {
        setCreatingRoom(false);
    }

    const onOpenCreateRoomModal = () => {
        setCreatingRoom(true);
    }


    const onChangeCheckInCheckOutDates = (
        checkIn, checkOut) => {
        let checkInDate = DateFunctions.convertDateObjectToDateOnlyString(new Date(checkIn));
        let checkOutDate = DateFunctions.convertDateObjectToDateOnlyString(new Date(checkOut));

        setCheckInCheckOutDates({ checkIn: checkInDate, checkOut: checkOutDate })
    }

    const getFullAddress = () => {
        let address = address1 ?? '';
        address += address2 ? `, ${address2}` : '';
        address += city ? `, ${city}` : '';

        return address
    }


    const getTotalPrice = () => {
        let pricePerNight = 0;
        for (const [roomId, values] of Object.entries(selectedRooms)) {
            pricePerNight += parseFloat(values.roomData.PricePerNight) * values.count;
        }

        let num_of_days = DateFunctions.getDaysCountInBetween(checkInCheckOutDates.checkIn, checkInCheckOutDates.checkOut);
        console.log(pricePerNight * num_of_days);
        return pricePerNight * num_of_days;

    }

    const onReserve = () => {

        let selectedRoomList = [];
        for (const [roomId, values] of Object.entries(selectedRooms)) {
            console.log(roomId, values);
            let temp = {
                roomId: roomId,
                roomName: values.roomData.RoomName,
                roomCount: values.count,
                costPerRoom: values.roomData.PricePerNight,
            }

            selectedRoomList.push(temp);
        }
        let result = { selections: selectedRoomList }


        console.log(result);

        navigate({
            pathname: "/confirm-booking",
            search: `?${createSearchParams({
                fromDate: checkInCheckOutDates.checkIn,
                toDate: checkInCheckOutDates.checkOut,
                daysCount: DateFunctions.getDaysCountInBetween(checkInCheckOutDates.checkIn, checkInCheckOutDates.checkOut),
                hotelName: hotelName,
                address: getFullAddress(),
                totalPrice: getTotalPrice(),
                selectionDetails: JSON.stringify(result),
            })}`
        });
    }

    return (
        <MainContainer>
            <section>
                <div className={"row"}>
                    <div className={"title_1"} style={{ width: "80%" }}>
                        {hotelName}
                    </div>

                    <div className={"col"} style={{ paddingTop: "10px" }}>
                        <StarRating ratings={3} reviews={726} />
                    </div>
                </div>

                <div className={"row left_div"}>
                    <div style={{ width: "20px" }}>
                        <FaMapMarkerAlt />
                    </div>
                    <div className={"subtext pt-2 col"}>
                        {/*{address1 ?? ''}{address2 ? `, ${address2}` : ``}{city ? `, ${city}` : ``}*/}
                        {getFullAddress()}
                    </div>
                </div>

                <div className={"pt-4 pb-4 center_div"}>
                    <button
                        className={"navigation_button " + (activeTab === "info" ? "navigation_button_active" : "")}
                        onClick={onClickInfoSectionButton}>Info
                    </button>
                    <button
                        className={"navigation_button " + (activeTab === "facilities" ? "navigation_button_active" : "")}
                        onClick={onClickFacilitiesSectionButton}>Facilities
                    </button>
                    <button
                        className={"navigation_button " + (activeTab === "house_rules" ? "navigation_button_active" : "")}
                        onClick={onClickHouseRulesSectionButton}>House rules
                    </button>
                    <button
                        className={"navigation_button " + (activeTab === "room_layout" ? "navigation_button_active" : "")}
                        onClick={onClickRoomLayoutSectionButton}>Room Layout
                    </button>

                </div>

                <HotelImages images={(images.slice(0, 6)).map(i => i.Url)} />
            </section>

            <section ref={infoSection} id="info_section" className={"pt-2"}>
                <div className={"subtext"} style={{ lineHeight: "25px", textAlign: "justify", padding: "0 10px" }}>
                    {description}
                </div>

            </section>

            <FacilitiesReadOnly facilitiesSection={facilitiesSection} selectedFacilityIds={selectedFacilityIds} />

            <section id={"house_rules_section"} ref={houseRulesSection}>
                <div className="title_2 pt-2 pb-2">House Rules</div>

                <div className={"subtext"} style={{ lineHeight: "25px", textAlign: "justify" }}>
                    You are liable for any damage howsoever caused (whether by deliberate, negligent, or reckless
                    act)
                    to the room(s), hotel's premises or property caused by you or any person in your party, whether
                    or
                    not staying at the hotel during your stay. Crest Wave Boutique Hotel reserves the right to
                    retain
                    your credit card and/or debit card details, or forfeit your security deposit of MYR50.00 as
                    presented at registration and charge or debit the credit/debit card such amounts as it shall, at
                    its
                    sole discretion, deem necessary to compensate or make good the cost or expenses incurred or
                    suffered
                    by Crest Wave Boutique Hotel as a result of the aforesaid. Should this damage come to light
                    after
                    the guest has departed, we reserve the right, and you hereby authorize us, to charge your credit
                    or
                    debit card for any damage incurred to your room or the Hotel property during your stay,
                    including
                    and without limitation for all property damage, missing or damaged items, smoking fee, cleaning
                    fee,
                    guest compensation, etc. We will make every effort to rectify any damage internally prior to
                    contracting specialist to make the repairs, and therefore will make every effort to keep any
                    costs
                    that the guest would incur to a minimum.

                    <br />
                    <br />
                    Damage to rooms, fixtures, furnishing and equipment including the removal of electronic
                    equipment,
                    towels, artwork, etc. will be charged at 150% of full and new replacement value plus any
                    shipping
                    and handling charges. Any damage to hotel property, whether accidental or wilful, is the
                    responsibility of the registered guest for each particular room. Any costs associated with
                    repairs
                    and/or replacement will be charged to the credit card of the registered guest. In extreme cases,
                    criminal charges will be pursued.
                </div>
            </section>

            {/* <AvailabilitySearchBar onChangeCheckInCheckOutDates={onChangeCheckInCheckOutDates}
                                   checkInCheckOutDates={checkInCheckOutDates}/> */}
            <AvailabilityRooms roomData={roomData} onReserve={onReserve} selectedRooms={selectedRooms} reserveBtnDisabled={reserveBtnDisabled}
                onChangeSelectedRooms={onChangeSelectedRooms} />
        </MainContainer>
    );
}

export default AvailabilityPage