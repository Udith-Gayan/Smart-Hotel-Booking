import React, { useState } from "react";
import {
    Col,
    Container,
    Row,
    InputGroup,
    Input,
    Button,
    Label,
} from "reactstrap";
import "./../styles/customer_dashboard_styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";
import "@y0c/react-datepicker/assets/styles/calendar.scss";
import OfferCard from "../components/OfferCard/OfferCard";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
// import 'moment/locale/ko';

function CustomerDashboard() {
    const navigate = useNavigate();
    const bestOffers = [
        "Jetwing blue",
        "Koggala Miracles",
        " Heritance Rambukkana",
    ];
    const [open, setOpen] = useState(false);

    const [dateRange, setDateRange] = useState(null);
    const [city, setCity] = useState('');
    const [peopleCount, setPeopleCount] = useState(0);

    const [errorMessage, setErrorMessge] = useState(null);

    const onDateChange = (...args) => {
        setDateRange(args);
    };

    function onSearchSubmit() {
        if (!city || city.length < 3) {
            toast.error("Requires a valid city.");
            //setErrorMessge("Requires a valid city.");
            return;
        }

        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            console.log("Invalid date range.")
            toast.error("Invalid date range.");
            //setErrorMessge("Invalid date range.");
            return;
        }

        if (peopleCount < 1) {
            toast.error("Invalid people count.");
            //setErrorMessge("Invalid people count.");
            return;
        }

        navigate(`/search-hotel?city=${city}&fromDate=${dateRange[0]}&toDate=${dateRange[1]}&peopleCount=${peopleCount}`)
    }

    return (
        <>

            <div className="main-image-div">
                <Container className="main-txt">
                    <h3>Enjoy your next stay in Sri Lanka</h3>
                    <p>Search low prices on hotels, homes and much more</p>
                </Container>
            </div>
            <Container>
                <div className="search_section">
                    <div className="tab-area"></div>
                    <div className="search-area">
                        <Row className="search-wrapper-row">
                            <Col style={{ flex: "1 0" }}>
                                <Label>Where ?</Label>
                                <InputGroup>
                                    <Input placeholder="City" onChange={e => setCity(e.target.value)} />
                                </InputGroup>
                            </Col>
                            <Col style={{ flex: "3 0" }}>
                                <Label>Check in - Check out</Label>
                                <br />
                                <RangeDatePicker
                                    onChange={onDateChange}
                                    startPlaceholder="From date"
                                    endPlaceholder="To date"
                                    dateFormat="YYYY/MM/DD"
                                />
                            </Col>
                            <Col>
                                <Label>No. of rooms</Label>
                                <InputGroup>
                                    <Input placeholder="0" type="number" onChange={e => setPeopleCount(e.target.value)} />
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button className="secondaryButton overrideSearchButton" onClick={onSearchSubmit}>
                                    Search your stay
                                </Button>
                                {errorMessage ? <p style={{ margin: '0px', marginBottom: '-23px', color: 'red' }}>{errorMessage}</p> : ''}
                            </Col>
                        </Row>
                    </div>
                </div>
                <section className="best_offers">
                    <div className="best_offers">
                        <h1 style={{ margin: 0 }}>Best Offers</h1>
                        <p>Promotions, deals and special offers for you</p>
                        <div className="offer_items_flexbox">
                            {bestOffers.map((offer, index) => (
                                <OfferCard key={index} />
                            ))}
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );
}

export default CustomerDashboard;
