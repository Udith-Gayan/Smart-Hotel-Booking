import React from "react";
import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";

const BookHotelRoom = (props) => {
  return (
    <div>
      <Card className={styles.bookingDetailCard}>
        <h2>Your booking details</h2>
        <br />
        <Row>
          <Col md={6}>
            <p>Check-in</p>

            <p className="fontBold">{props.checkindate}</p>
            <small className={styles.checkinoutTime}>Before noon</small>
          </Col>
          <Col md={6}>
            <p>Check-out</p>
            <p className="fontBold">{props.checkoutdate}</p>
            <small className={styles.checkinoutTime}>After noon</small>
            <br />
          </Col>
          <p style={{ marginTop:'20px'}}>Total length of stay:</p>
          <p className="fontBold">{`${props.noOfDays - 1} nights, ${props.noOfDays} days`}</p>
        </Row>
        <hr />
        <p>You selected</p>
        {
          props.selections.map((sl, idx) => {
            return (
                <p className="fontBold" key={idx}>{sl}</p>
            );
          })
        }
      </Card>
    </div>
  );
};

export default BookHotelRoom;
