import React, {useState} from "react";
import {
    Col,
    Container,
    Row,
    InputGroup,
    Input,
    Button,
    Label,
} from "reactstrap";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "./../styles/customer_dashboard_styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";
import "@y0c/react-datepicker/assets/styles/calendar.scss";
import OfferCard from "../components/OfferCard/OfferCard";
import { useNavigate } from "react-router";
// import 'moment/locale/ko';


function CustomerDashboard() {
    const bestOffers = [
        "Jetwing blue",
        "Koggala Miracles",
        " Heritance Rambukkana",
    ];
    const navigate = useNavigate();

    const [dates, setDates] = useState(null);
    const [open, setOpen] = useState(false);


    const onDateChange = (...args) => console.log(args);

    const goToListProperty = () => {
        navigate("/listProperty");
    }



    return (
        <>
            <NavBar style={{ position: "fixed" }} goToListProperty={goToListProperty} />
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
                                <Label>Where to go?</Label>
                                <InputGroup>
                                    <Input placeholder="City" />
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
                                <Label>No. of people</Label>
                                <InputGroup>
                                    <Input placeholder="0" type="number" />
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button className="secondaryButton overrideSearchButton">
                                    Search your stay
                                </Button>
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
            <Footer />
        </>
    );
}

export default CustomerDashboard;
