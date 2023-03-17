import MainContainer from "../layout/MainContainer";
import "../components/HotelHomePage/StarRating"
import StarRating from "../components/HotelHomePage/StarRating";
import {FaMapMarkerAlt} from "react-icons/fa";
import {FaPlusCircle} from "react-icons/fa";
import HotelImages from "../components/HotelHomePage/HotelImages";
import FacilitiesReadOnly from "../components/HotelHomePage/FacilitiesReadOnly";
import React, {useRef, useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import CreateRoomModal from "../components/HotelHomePage/CreateRoomModal";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import RoomDetails from "../components/HotelHomePage/RoomDetails";
import HotelService from "../services-domain/hotel-service copy";

function HotelHomePage() {

    const { id } = useParams();  // hotel id

    // Load room details
    async function getRooms() {
        if (id && id > 0) {
            const res = await HotelService.instance.getMyHotelRoomList(id);
            if(res.roomList && res.roomList.length > 0) {
                setRooms(res.roomList)
            }
        }

    }

    useEffect(() => {
        getRooms();
    });

    const address = "Box 11, Heritance Kandalama, Sigiriya"
    const images = ["https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_0dfddf17-7b17-4788-983e-9be1107df7da.txt?alt=media&token=e18d29ed-8761-4d9c-bccd-a9e3bf28b605",
        "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_2de1f920-0ab8-4911-a5be-3e9f5e70f25c.txt?alt=media&token=c7669d09-5363-4d0c-adaf-eac1cb026ecf",
        "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_85146f5f-f693-4a02-a778-582757acc2b9.txt?alt=media&token=bd165f22-5dd9-44f7-a900-7292bda3b0fc",
        "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_0dfddf17-7b17-4788-983e-9be1107df7da.txt?alt=media&token=e18d29ed-8761-4d9c-bccd-a9e3bf28b605",
        "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_2de1f920-0ab8-4911-a5be-3e9f5e70f25c.txt?alt=media&token=c7669d09-5363-4d0c-adaf-eac1cb026ecf",
        "https://firebasestorage.googleapis.com/v0/b/hotel-management-system-134e8.appspot.com/o/hotel_images%2F1%2F1_85146f5f-f693-4a02-a778-582757acc2b9.txt?alt=media&token=bd165f22-5dd9-44f7-a900-7292bda3b0fc"
    ]
    const infoSection = useRef(null);
    const facilitiesSection = useRef(null);
    const houseRulesSection = useRef(null);
    const roomLayoutSection = useRef(null);

    const [rooms, setRooms] = useState([]);

    const [activeTab, setActiveTab] = useState(null);
    const onClickInfoSectionButton = () => {
        setActiveTab("info")
        infoSection.current.scrollIntoView({behavior: 'smooth'});
    };

    const onClickFacilitiesSectionButton = () => {
        setActiveTab("facilities")
        facilitiesSection.current.scrollIntoView({behavior: 'smooth'});
    };

    const onClickHouseRulesSectionButton = () => {
        setActiveTab("house_rules")
        houseRulesSection.current.scrollIntoView({behavior: 'smooth'});
    };

    const onClickRoomLayoutSectionButton = () => {
        setActiveTab("room_layout")
        roomLayoutSection.current.scrollIntoView({behavior: 'smooth'});
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


    const onSubmitRoom = async (room_data) => {

        // If there is a roomdata,  send a request to submit the room for creation.
        // on successfull return id, call the fetch room query method   
        const res = await HotelService.instance.createRoom(id, room_data);
        if(res.roomId && res.roomId > 0) {
            await getRooms();
            // setRooms(prevState => {
            //     return [...prevState, room_data]
            // })

        }

        setCreatingRoom(false);
    }

    const onDeleteRoom = async () => {

        // delete the room and call to get rooms again
        const res = await HotelService.instance.deleteMyRoom(deleteRoomDetails.Id);
        console.log(res);

        await getRooms();
        // setRooms(prevState => {
        //     return prevState.filter(cur_room => {
        //         return cur_room.Id !== deleteRoomDetails.Id;
        //     })
        // })

        setDeleteRoomDetails(null);
        setDeletingRoom(false);
    }

    const onCloseDeleteRoomModal = () => {
        setDeletingRoom(false);
        setDeleteRoomDetails(null);
    }

    const onOpenDeleteRoomModal = (delete_room_details) => {
        setDeletingRoom(true);
        setDeleteRoomDetails(delete_room_details);
    }

    return (

        <>
            <Modal isOpen={creatingRoom} toggle={onCloseCreateRoomModal} size="lg" centered
                   className={""}
                   style={{maxWidth: '850px', width: '100%'}}>
                <CreateRoomModal onSubmitRoom={onSubmitRoom}/>
            </Modal>

            {deletingRoom && <Modal isOpen={deletingRoom} toggle={onCloseDeleteRoomModal}>
                <ModalHeader toggle={onCloseDeleteRoomModal}>Delete Room "{deleteRoomDetails.Name}"</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete room named "{deleteRoomDetails.Name}" ?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={onDeleteRoom}>Delete</Button>{' '}
                    <Button color="secondary" onClick={onCloseDeleteRoomModal}>Cancel</Button>
                </ModalFooter>
            </Modal>}


            <MainContainer>
                <section>
                    <div className={"row"}>
                        <div className={"title_2"} style={{width: "300px"}}>
                            Heritage Kandalama
                        </div>

                        <div className={"col"} style={{paddingTop: "10px"}}>
                            <StarRating ratings={3} reviews={726}/>
                        </div>
                    </div>

                    <div className={"row left_div"}>
                        <div style={{width: "20px"}}>
                            <FaMapMarkerAlt/>
                        </div>
                        <div className={"subtext pt-2 col"}>
                            {address}
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

                    <HotelImages images={images.slice(0, 6)}/>
                </section>

                <section ref={infoSection} id="info_section" className={"pt-2"}>
                    <div className={"subtext"} style={{lineHeight: "25px", textAlign: "justify", padding: "0 10px"}}>

                        A tranquil retreat perched on hills, Heritance Kandalama offers panoramic views of the Sigiriya
                        Rocks. Boasting a spectacular architecture, this unique design hotel provides 3 impressive pools
                        and exotic
                        activities like bird watching.

                        Kandalama Heritance is a 20-minute drive from UNESCO World Heritage Sites, the 2,000-year-old
                        cave
                        temple at Dambulla and the Sigiriya rock fortress. The 5-star hotel is a 3.5-hour drive from the
                        airport. The spacious rooms are fitted with rattan furniture and timber panels. Each comes with
                        a private
                        bathroom featuring oversized glass walls that allow much natural light in.

                        The hotel features tennis courts, a well-equipped gym and the well-known Coco Spa. To enjoy Sri
                        Lanka’s breathtaking natural landscapes, the hotel offers various excursions like mountain
                        cycling
                        excursions and lake safaris.

                        Start the day with breakfast on the lake or enjoy a memorable dining experience in the nearby
                        cave.
                        The Kanchana Restaurant offers daily themed nights with international cuisine. Views of the
                        Sigiriya
                        citadel and the Kandalama Lake accompany meals.
                    </div>

                </section>

                <FacilitiesReadOnly facilitiesSection={facilitiesSection}/>

                <section id={"house_rules_section"} ref={houseRulesSection}>
                    <div className="title_2 pt-2 pb-2">House Rules</div>

                    <div className={"subtext"} style={{lineHeight: "25px", textAlign: "justify"}}>
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

                        <br/>
                        <br/>
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

                <section id={"room_layout_section"} ref={roomLayoutSection}>
                    <div className="title_2 pt-2 pb-2">Room Layout</div>
                    <div className={"subtext"}>Details about your rooms.</div>

                    <button className={"create_room_button mt-5"} style={{width: "200px"}}
                            onClick={onOpenCreateRoomModal}>
                        <FaPlusCircle size={26}/> <span>&nbsp;Add Room</span>
                    </button>

                    {rooms.length !== 0 && <RoomDetails rooms={rooms} onOpenDeleteRoomModal={onOpenDeleteRoomModal}/>}

                </section>


            </MainContainer>
        </>

    );
}

export default HotelHomePage