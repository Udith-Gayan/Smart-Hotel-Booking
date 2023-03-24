import React from "react";
import style from "./index.module.scss";
import { CardTitle, Card } from "reactstrap";
import { IoCalendarOutline } from "react-icons/io5";
import dateFormat from "dateformat";

function SearchCard(props) {
  const startDate = dateFormat(new Date(props.search.fromDate), "dS mmm");
  const endDate = dateFormat(new Date(props.search.toDate), "dS mmm");
  return (
    <div className={`${style.card}`}>
      <Card>
        <div className="row ">
          <div className={`${style.imageContainer} col-4`}>
            <img
              src={props.search.image}
              alt="recent search"
              className={`${style.searchImage}`}
              height="100"
              width="99"
            />
          </div>

          <div className={`${style.searchDetails} col-8`}>
            <CardTitle tag="h5" className={`${style.titles} `}>
              {props.search.location}
            </CardTitle>

            <p className={`${style.roomDate} m-0`}>
              {" "}
              <span style={{ fontSize: "20px" }}>
                <IoCalendarOutline />
              </span>{" "}
              {startDate} - {endDate}{" "}
            </p>
            <p className={`${style.room_type}`}>{props.search.roomType} room</p>
            <p className={`${style.room_details}`}>
              {props.search.nights} night, {props.search.adults} adults
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SearchCard;
