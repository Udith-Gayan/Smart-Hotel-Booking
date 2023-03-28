import React, {useEffect, useState} from "react";
import BookingDetails from "../components/BookingDetails/index";
import BookedHotelDetails from "../components/BookedHotelDetails/index";
import {Row, Col} from "reactstrap";
import MainContainer from "../layout/MainContainer";
import CustomerRegistration from "../components/CustomerRegistration";
import BookedHotelPrice from "../components/BookedHotelPrice";
import "../styles/layout_styles.scss";
import HotelService from "../services-domain/hotel-service copy";
import {useLocation, useNavigate} from "react-router-dom";
import DateFunctions from "../helpers/DateFunctions";
import XrplService from "../services-common/xrpl-service";
import {toast} from "react-hot-toast";
import ToastInnerElement from "../components/ToastInnerElement/ToastInnerElement";

const ConfirmBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hotelService = HotelService.instance;

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [disableConfirm, setDisableConfirm] = useState(true);

    // queryParams
    let checkInDateStr = queryParams.get("fromDate");
    let checkOutDateStr = queryParams.get("toDate");
    let noOfDays = Number(queryParams.get("daysCount"));
    let selectionDetails = JSON.parse(queryParams.get("selectionDetails"));  // { selections: [  {roomId: 1, roomCount: 3, costPerRoom: 25, roomName: "" }, {roomId: 2, roomCount: 3, costPerRoom: 25} ]   }
    let hotelName = queryParams.get("hotelName");
    let hotelAddress = queryParams.get("address");
    let totalPrice = Number(queryParams.get("totalPrice"));


    const [checkinDate, setCheckinDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [selectionStrings, setSelectionStrings] = useState([]);


    useEffect(() => {
        setCheckinDate(DateFunctions.convertDateToMonthDateYear(checkInDateStr));
        setCheckOutDate(DateFunctions.convertDateToMonthDateYear(checkOutDateStr));
        setSelectionStrings(createModifiedSelectionDetailsArray(selectionDetails?.selections));

    }, []);

    const createReservation = async (body) => {
        setConfirmLoading(true);
        setDisableConfirm(true);
        let walletAddress = body.walletAddress;
        if (body.payNow) {
            walletAddress = XrplService.xrplInstance.generateWalletFromSeed(body.secret).address;
        }

        const data = {
            CustomerId: 0,
            FromDate: new Date(checkInDateStr),
            ToDate: new Date(checkOutDateStr),
            CustomerDetails: {
                Name: body.fullName,
                Email: body.email,
                ContactNumber: body.phoneNo,
                WalletAddress: walletAddress
            },
            totalFee: totalPrice,
            payNow: body.payNow,
            secret: body.secret,
            roomSelections: selectionDetails.selections
        }

        try {
            const res = await hotelService.makeReservation(data);
            if(!res) {
                toast(
                    (element) => (
                        <ToastInnerElement message={'Error in booking.'} id={element.id}/>
                    ),
                    {
                        duration: Infinity,
                    }
                );
            }
            setDisableConfirm(false);
            navigate(`/`);
            toast.success(
                "Booking Confirmed.", {
                    duration: 5000
                }
            );
        } catch (e) {
            setConfirmLoading(false);
            setDisableConfirm(false);
            console.log("done error");

            console.log(e);
            toast(
                (element) => (
                    <ToastInnerElement message={"Error in making reservation."} id={element.id}/>
                ),
                {
                    duration: Infinity,
                }
            );
        }
    };

    /**
     *  An array of Strings
     * @param selectionArray
     * @returns {*[]}
     */
    const createModifiedSelectionDetailsArray = (selectionArray = []) => {
        const selection_str_arr = [];
        for (const sel of selectionArray) {
            const strr = `${sel.roomName}  x${sel.roomCount} rooms`;
            selection_str_arr.push(strr);
        }
        return selection_str_arr;
    }


    return (
        <MainContainer>
            <Row>
                <Col md={4}>
                    <BookingDetails checkindate={checkinDate} checkoutdate={checkOutDate} noOfDays={noOfDays}
                                    selections={selectionStrings}/>
                    <BookedHotelPrice totalPrice={totalPrice}/>
                </Col>

                <Col md={8}>
                    <BookedHotelDetails hotelName={hotelName} hotelAddress={hotelAddress}/>
                    <CustomerRegistration createReservation={createReservation} disableConfirm={disableConfirm}
                                          setDisableConfirm={setDisableConfirm} confirmLoading={confirmLoading}
                                          setConfirmLoading={setConfirmLoading}/>
                </Col>
            </Row>
        </MainContainer>
    );
};

export default ConfirmBooking;
