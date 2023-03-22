import React from "react";
import style from "./index.module.scss";

import { Card, CardBody, CardTitle, CardSubtitle,CardImg,Button } from "reactstrap";
import { IoCalendarOutline, FaBed } from "react-icons/io5";
import { IoMdBed } from "react-icons/io";
import StarRatings from 'react-star-ratings';


function TopHotelCard(props) {

    return (
        <Card className="style.offer_card">
            <div style={{ padding: '10px' }}>
                <CardImg src={props.hotel.image} alt="offer" height="200" className="image" ></CardImg>
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px"}}>
                    <CardTitle tag="h5">
                        {props.hotel.name}
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {props.hotel.location}
                    </CardSubtitle>
                    <p  className={`m-0 ${style.price}`}>  from ${props.hotel.price} per night </p>
                        <div className = {` ${style.stars}`}>
                        <StarRatings
                        
                            rating={props.hotel.rating}
                            starRatedColor="gold"
                            starSpacing="1px"
                            starDimension="16px"
                            numberOfStars={5}
                            name='rating'
                            />
                            </div>
                        <p className={` ${style.rating_count} ${style.rating}`}>{props.hotel.ratingCount} ratings</p>

                    <Button className={`secondaryButton ${style.dealButton}`}>View Deal</Button>
                    
                </CardBody>
            </div>
        </Card>
    )
}

export default TopHotelCard;