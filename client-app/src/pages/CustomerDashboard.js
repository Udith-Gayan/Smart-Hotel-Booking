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
import "./../styles/customer_dashboard_styles.scss";
import {RangeDatePicker} from "@y0c/react-datepicker";
import "@y0c/react-datepicker/assets/styles/calendar.scss";
import OfferCard from "../components/OfferCard/OfferCard";
import { useNavigate } from "react-router-dom";
import topRatedHotels from "../data/topRatedHotels";
import properties from "../data/properties";
import TopHotelCard from "../components/TopHotelCard";
import Ellipse from "../Assets/Icons/ellipse.svg";
import ExploreCard from "../components/ExploreCard";
import QuickPlanner from "../components/QuickPlanner";
import searches from "../data/searches";
import SearchCard from "../components/SearchCard";
import SearchMenu from "../components/SearchMenu";
import bestOffers from "../data/bestOffers";
import toast from "react-hot-toast";
import ToastInnerElement from "../components/ToastInnerElement/ToastInnerElement";
// import 'moment/locale/ko';

function CustomerDashboard() {
  const navigate = useNavigate();

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
            toast(
                (element) => (
                    <ToastInnerElement message={"Requires a valid city."} id={element.id}/>
                ),
                {
                    duration: Infinity,
                }
            );
            //setErrorMessge("Requires a valid city.");
            return;
        }

        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            console.log("Invalid date range.")
            toast(
                (element) => (
                    <ToastInnerElement message={"Invalid date range."} id={element.id}/>
                ),
                {
                    duration: Infinity,
                }
            );
            //setErrorMessge("Invalid date range.");
            return;
        }

        if (peopleCount < 1) {
            toast(
                (element) => (
                    <ToastInnerElement message={"Invalid people count."} id={element.id}/>
                ),
                {
                    duration: Infinity,
                }
            );
            //setErrorMessge("Invalid people count.");
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
          <div className="tab-area">
            <SearchMenu />
          </div>
          <div className="search-area">
            <Row className="search-wrapper-row">
              <Col style={{ flex: "1 0" }}>
                <Label>Destination</Label>
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
                <Label>No. of rooms</Label>
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
            <p className="titleParagraph">
              Promotions, deals and special offers for you
            </p>
            <div className="offer_items_flexbox">
              {bestOffers.slice(0, 3).map((offer, index) => (
                <OfferCard key={index} offer={offer} />
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="top_rated_hotels">
            <h1 className="headline">Top Rated in Sri Lanka</h1>
            <div className="hotel_items_flexbox">
              {topRatedHotels.slice(0, 8).map((topRatedHotel, index) => (
                <div className="hotel_card" key={index}>
                  <TopHotelCard hotel={topRatedHotel} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="explore">
          <div className="row ">
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
                  <img src={Ellipse} alt="" />
                </div>
                <div className="col-10">
                  <div className="row">
                    {properties.slice(0, 3).map((property, index) => (
                      <div className="col-md-4 explorecd" key={index}>
                        <ExploreCard property={property} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-1 ellipse">
                  <img src={Ellipse} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="planner">
            <h1 className="headline">Easy & Quick Planner</h1>
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3 searchDestination">
                <Input
                  placeholder="Search your destination"
                  className="input"
                ></Input>
              </div>
            </div>

            <QuickPlanner className="quickPlanner" />
          </div>
        </section>
        <section className="connect">
          <div className=" wrapper">
            <div className="row">
              <div className="col-6">
                <div className="row-4">
                  <h1 className="connectTitle">
                    Connect with <br />
                    other travellers
                  </h1>
                </div>
                <div className="row-4">
                  <p className="connectDesc">
                    The Pearl of the Indian Ocean’ or the ‘teardrop of India’.
                    Sri Lanka has many names – and they all encompass its
                    beauty. Make the birthplace of cinnamon your next
                    destination with advice from other travellers.
                  </p>
                </div>
                <div className="row-4">
                  <div className="connectButton">
                    <Button className="connectButtonInside">View more</Button>
                  </div>
                </div>
              </div>
              <div className="col-6"></div>
            </div>
          </div>
        </section>
        <section className="recent_searches">
          <h1 className="headline">Your recent Searches</h1>
          <div className="row">
            {searches.slice(0, 3).map((search, index) => (
              <div className="col-md-4 explorecd" key={index}>
                <SearchCard search={search} />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}

export default CustomerDashboard;
