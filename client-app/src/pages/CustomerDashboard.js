import React, { useState } from "react";
import {
  Col,
  Container,
  Row,
  InputGroup,
  Input,
  Button,
  Label,
  Card,
} from "reactstrap";
import "./../styles/customer_dashboard_styles.scss";
import { RangeDatePicker } from "@y0c/react-datepicker";
import "@y0c/react-datepicker/assets/styles/calendar.scss";
import OfferCard from "../components/OfferCard/OfferCard";
import { useNavigate } from "react-router-dom";
import topRatedHotels from "../data/topRatedHotels";
import properties from "../data/properties";
import TopHotelCard from "../components/TopHotelCard";
import Ellipse from "../Assets/Icons/ellipse.svg";
import ExploreCard from "../components/ExploreCard";
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
  const [city, setCity] = useState("");
  const [peopleCount, setPeopleCount] = useState(0);

  const [errorMessage, setErrorMessge] = useState(null);

  const onDateChange = (...args) => {
    setDateRange(args);
  };

  function onSearchSubmit() {
    if (!city || city.length < 3) {
      setErrorMessge("Requires a valid city.");
      return;
    }

    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      console.log("Invalid date range.");
      setErrorMessge("Invalid date range.");
      return;
    }

    if (peopleCount < 1) {
      setErrorMessge("Invalid people count.");
      return;
    }

    navigate(
      `/search-hotel?city=${city}&fromDate=${dateRange[0]}&toDate=${dateRange[1]}&peopleCount=${peopleCount}`
    );
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
                <Label>Where to go?</Label>
                <InputGroup>
                  <Input
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                  />
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
                  <Input
                    placeholder="0"
                    type="number"
                    onChange={(e) => setPeopleCount(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col>
                <Button
                  className="secondaryButton overrideSearchButton"
                  onClick={onSearchSubmit}
                >
                  Search your stay
                </Button>
                {errorMessage ? (
                  <p
                    style={{
                      margin: "0px",
                      marginBottom: "-23px",
                      color: "red",
                    }}
                  >
                    {errorMessage}
                  </p>
                ) : (
                  ""
                )}
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
        <section>
          <div className="top_rated_hotels">
            <h1 className="headline">Top Rated in Sri Lanka</h1>
            <div className="hotel_items_flexbox">
              {topRatedHotels.slice(0, 8).map((topRatedHotel, index) => (
                <div className="hotel_card">
                  <TopHotelCard key={index} hotel={topRatedHotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="explore">
          <div className="row">
            <div className="col-3 exploreTitle">
              <div className="row-9 title">
                Explore
                <br />
                Sri Lanka
              </div>
              <div className="row-3">
                {" "}
                <Button className="secondaryButton exploreBtn">
                  Explore more
                </Button>
              </div>
            </div>
            <div className="col-9 exploreCards">
              <div className="row ">
                <div className="col-1 ellipse">
                  <img src={Ellipse} />
                </div>
                <div className="col-10">
                  <div className="row">
                    {properties.slice(0, 3).map((property, index) => (
                      <div className="col-md-4 explorecd">
                        <ExploreCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-1 ellipse">
                  <img src={Ellipse} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

export default CustomerDashboard;
