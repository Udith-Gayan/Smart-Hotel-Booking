import React, { useState } from "react";
import style from "./index.module.scss";
import { Button } from "reactstrap";
import { ReactComponent as Apartment } from "../../Assets/Icons/SearchMenu/apartment.svg";
import { ReactComponent as Hotels } from "../../Assets/Icons/SearchMenu/hotels.svg";
import { ReactComponent as Resort } from "../../Assets/Icons/SearchMenu/resort.svg";
import { ReactComponent as Restaurant } from "../../Assets/Icons/SearchMenu/restaurant.svg";
import { ReactComponent as Villa } from "../../Assets/Icons/SearchMenu/villa.svg";

function SearchMenu(props) {
  const [selectedButton, setSelectedButton] = useState("hotels");
  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  return (
    <>
      <div className={`${style.searchButtons}`}>
        <div className={`${style.searchButtonGroup}`}>
          <Button
            onClick={() => handleButtonClick("hotels")}
            className={
              selectedButton === "hotels"
                ? `${style.plannerbutton}`
                : `${style.buttonNotSelected}`
            }
          >
            <Hotels
              style={{ paddingRight: "10px" }}
              className={`${style.svg_img}`}
            />
            Hotels
          </Button>
          <Button
            onClick={() => handleButtonClick("restaurant")}
            className={
              selectedButton === "restaurant"
                ? `${style.plannerbutton}`
                : `${style.buttonNotSelected}`
            }
          >
            <Restaurant
              className={`${style.svg_img}`}
              style={{ paddingRight: "10px" }}
            />
            Restaurant
          </Button>
          <Button
            onClick={() => handleButtonClick("apartment")}
            className={
              selectedButton === "apartment"
                ? `${style.plannerbutton}`
                : `${style.buttonNotSelected}`
            }
          >
            <Apartment
              style={{ paddingRight: "10px" }}
              className={`${style.svg_img}`}
            />
            Apartment
          </Button>
          <Button
            onClick={() => handleButtonClick("villa")}
            className={
              selectedButton === "villa"
                ? `${style.plannerbutton}`
                : `${style.buttonNotSelected}`
            }
          >
            <Villa
              style={{ paddingRight: "10px" }}
              className={`${style.svg_img}`}
            />
            Villa
          </Button>
          <Button
            onClick={() => handleButtonClick("resort")}
            className={
              selectedButton === "resort"
                ? `${style.plannerbutton}`
                : `${style.buttonNotSelected}`
            }
          >
            <Resort
              style={{ paddingRight: "10px" }}
              className={`${style.svg_img}`}
            />
            Resorts
          </Button>
        </div>
      </div>
    </>
  );
}

export default SearchMenu;
