import React from "react";
import BookingDetails from "../components/BookingDetails/index";
import BookedHotelDetails from "../components/BookedHotelDetails/index";
import { Row, Col } from "reactstrap";
import MainContainer from "../layout/MainContainer";
import CustomerRegistration from "../components/CustomerRegistration";
import BookedHotelPrice from "../components/BookedHotelPrice";
import "../styles/layout_styles.scss";

const ConfirmBooking = () => {
  return (
    <MainContainer>
      <Row className="bookingWrapper">
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
