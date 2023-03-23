import React from "react";
import style from "./index.module.scss";

import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  Button,
} from "reactstrap";
import { IoCalendarOutline, FaBed } from "react-icons/io5";
import { IoMdBed } from "react-icons/io";
import StarRatings from "react-star-ratings";

function PlannerCard(props) {
  return (
    <div className={`${style.card}`}>
      <img
        src={props.property.image}
        alt="offer"
        className="logo"
        width={243}
        height={268}
      />
      <CardTitle tag="h5">{props.property.name}</CardTitle>
      <CardSubtitle className="mb-2 text-muted" tag="h6">
        {props.property.number}km away from
      </CardSubtitle>
    </div>
  );
}

export default PlannerCard;
