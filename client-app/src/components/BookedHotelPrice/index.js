import React from 'react'
import { Row, Col, Card } from "reactstrap";
import styles from "./index.module.scss";
const BookedHotelPrice = () => {
    return (
        <Card className={styles.bookedHotelCard}>
            <Row>
                <Col>
                    <h4>Price: $500</h4>
                    <small>Currency Rates: 1XRP = 20USD</small>
                </Col>
            </Row>
        </Card>
    )
}

export default BookedHotelPrice