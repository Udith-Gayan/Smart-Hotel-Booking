import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import { IoCalendarOutline } from "react-icons/io5";
import { IoMdBed } from "react-icons/io";
import "./styles.scss";
import dateFormat from "dateformat";
import StarRatings from "react-star-ratings";
function OfferCard(props) {
  const startDate = dateFormat(new Date(props.offer.fromDate), "dS mmm");
  const endDate = dateFormat(new Date(props.offer.toDate), "dS mmm");
  return (
    <Card className="offer_card">
      <div style={{ padding: "10px" }} className="row">
        <img
          src={props.offer.image}
          alt="offer"
          width="300"
          height="200"
          className="offerImage"
        ></img>
        <div className="col-6 cardDetails">
          <CardBody style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <CardTitle tag="h5">{props.offer.name}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {props.offer.location}
            </CardSubtitle>
            <p className="m-0 offer-details">
              {" "}
              <span style={{ fontSize: "20px" }}>
                <IoCalendarOutline />
              </span>{" "}
              {startDate} - {endDate}{" "}
            </p>
            <div className="m-0 offer-details row">
              <span style={{ fontSize: "20px" }} className="bedIcon col-auto">
                <IoMdBed />
              </span>
              <div className="room_wrapper col-auto">
                {" "}
                <p className="room_type"> {props.offer.roomType} room</p>
                <p className="room_details">
                  {" "}
                  {props.offer.nights} night, {props.offer.adults} adults
                </p>
              </div>
            </div>
          </CardBody>
        </div>
        <div className="col-6 card-body card-body-right">
          <div className="stars">
            <StarRatings
              rating={props.offer.rating}
              starRatedColor="gold"
              starSpacing="1px"
              starDimension="16px"
              numberOfStars={5}
              name="rating"
            />
          </div>
          <div className="original_price">{props.offer.originalPrice}$</div>
          <div className="discounted_price">{props.offer.discountedPrice}$</div>
          <Button className="secondaryButton dealButton">View Deal</Button>
        </div>
      </div>
    </Card>
  );
}

export default OfferCard;
