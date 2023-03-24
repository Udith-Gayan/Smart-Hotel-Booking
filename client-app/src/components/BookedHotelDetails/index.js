import React from "react";
import { Row, Col, Card, Badge } from "reactstrap";
import styles from "./index.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used

const BookedHotelDetails = (props) => {
  return (
    <Card className={styles.bookedHotelCard}>
      <Row>
        <Col md={4}>
          <div className={styles.hotelImg}></div>
        </Col>
        <Col md={8}>
          <h3 className="fontBold">{props.hotelName}</h3>
          <p>{props.hotelAddress}</p>
          <Badge color="warning">4.5 Ratings</Badge>
          <FontAwesomeIcon icon={solid("star")} />
          <FontAwesomeIcon icon={solid("star")} />
          <FontAwesomeIcon icon={solid("star")} />
          <FontAwesomeIcon icon={solid("star")} />

          <div className={styles.facilities}>
            <FontAwesomeIcon
              icon={solid("square-parking")}
              className={styles.facilityIcon}
            />
            <span className={styles.FacilityText}>Parking</span>
            <FontAwesomeIcon
              icon={solid("wifi")}
              className={styles.facilityIcon}
            />
            <span>Free Wifi</span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BookedHotelDetails;
