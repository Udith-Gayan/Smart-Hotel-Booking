import React from 'react'
import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";
const BookedHotelPrice = (props) => {
    return (
        <Card className={styles.bookedHotelCard}>
            <Row>
                <Col>
                    <h4>Price: {props.totalPrice} $</h4>
                    <small>Currency Rates: 1XRP = 1USD</small>
                </Col>
            </Row>
        </Card>
    )
}

export default BookedHotelPrice