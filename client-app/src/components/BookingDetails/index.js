import React from "react";
import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";

const BookHotelRoom = () => {
  return (
    <div>
      <Card className={styles.bookingDetailCard}>
        <h2>Your booking details</h2>
        <br />
        <Row>
          <Col md={6}>
            <p>Check-in</p>

            <p className="fontBold">Mon, Mar 20, 2023</p>
            <small className={styles.checkinoutTime}>3.00 PM - 8.00 PM</small>
          </Col>
          <Col md={6}>
            <p>Check-in</p>
            <p className="fontBold">Tuesday, Mar 21, 2023</p>
            <small className={styles.checkinoutTime}>11.00 PM - 1.30 PM</small>
            <br />
          </Col>
          <p>Total length of stay:</p>
          <p className="fontBold">2 nights</p>
        </Row>
        <hr />
        <p>You selected</p>
        <p className="fontBold">1 room for 2 adults</p>
      </Card>
    </div>
  );
};

export default BookHotelRoom;
