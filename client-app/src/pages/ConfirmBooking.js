import React, {useEffect, useState} from "react";
import BookingDetails from "../components/BookingDetails/index";
import BookedHotelDetails from "../components/BookedHotelDetails/index";
import { Row, Col } from "reactstrap";
import MainContainer from "../layout/MainContainer";
import CustomerRegistration from "../components/CustomerRegistration";
import BookedHotelPrice from "../components/BookedHotelPrice";
import "../styles/layout_styles.scss";
import HotelService from "../services-domain/hotel-service copy";
import {useLocation, useNavigate} from "react-router-dom";
import DateFunctions from "../helpers/DateFunctions";

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hotelService = HotelService.instance;
  const [isDataLoading, setIsDataLoading] = useState(false);

  // queryParams
  let checkInDateStr = queryParams.get("fromDate");
  let checkOutDateStr = queryParams.get("toDate");
  let noOfDays = Number(queryParams.get("daysCount"));
  let selectionDetails = JSON.parse(queryParams.get("selectionDetails"));  // { selections: [  {roomId: 1, roomCount: 3, costPerRoom: 25}, {roomId: 2, roomCount: 3, costPerRoom: 25} ]   }
  let hotelName = queryParams.get("hotelName");
  let hotelAddress = queryParams.get("address");
  let totalPrice = Number(queryParams.get("totalPrice"));


  const [checkinDate, setCheckinDate ]= useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);


  useEffect(() => {
    setCheckinDate(DateFunctions.convertDateToMonthDateYear(checkInDateStr));
    setCheckOutDate(DateFunctions.convertDateToMonthDateYear(checkOutDateStr));

  }, []);

  const createReservation = async () => {};

  const createSelectionDetailsArrray = () => {

  }


  return (
    <MainContainer>
      <Row>
        <Col md={4}>
          <BookingDetails />
          <BookedHotelPrice />
        </Col>

        <Col md={8}>
          <BookedHotelDetails />
          <CustomerRegistration />
        </Col>
      </Row>
    </MainContainer>
  );
};

export default ConfirmBooking;
