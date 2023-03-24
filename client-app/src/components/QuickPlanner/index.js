import React, { useState } from "react";
import style from "./index.module.scss";
import { Button } from "reactstrap";
import { ReactComponent as Beach } from "../../Assets/Icons/QuickPlanner/beach.svg";
import { ReactComponent as Historical } from "../../Assets/Icons/QuickPlanner/historical.svg";
import { ReactComponent as Adventure } from "../../Assets/Icons/QuickPlanner/adventure.svg";
import { ReactComponent as City } from "../../Assets/Icons/QuickPlanner/city.svg";
import { ReactComponent as Romance } from "../../Assets/Icons/QuickPlanner/romance.svg";

import {} from "reactstrap";
import plannerProperties from "../../data/plannerProperties";
import PlannerCard from "../PlannerCard";

function QuickPlanner(props) {
  const [selectedButton, setSelectedButton] = useState("beach");
  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  return (
    <>
      <div>
        <Button
          onClick={() => handleButtonClick("beach")}
          className={
            selectedButton === "beach"
              ? `${style.plannerbutton}`
              : `${style.buttonNotSelected}`
          }
        >
          <Beach
            style={{ paddingRight: "10px" }}
            className={`${style.svg_img}`}
          />
          Beach
        </Button>
        <Button
          onClick={() => handleButtonClick("historical")}
          className={
            selectedButton === "historical"
              ? `${style.plannerbutton}`
              : `${style.buttonNotSelected}`
          }
        >
          <Historical
            className={`${style.svg_img}`}
            style={{ paddingRight: "10px" }}
          />
          Historical
        </Button>
        <Button
          onClick={() => handleButtonClick("adventure")}
          className={
            selectedButton === "adventure"
              ? `${style.plannerbutton}`
              : `${style.buttonNotSelected}`
          }
        >
          <Adventure
            style={{ paddingRight: "10px" }}
            className={`${style.svg_img}`}
          />
          Adventure
        </Button>
        <Button
          onClick={() => handleButtonClick("city")}
          className={
            selectedButton === "city"
              ? `${style.plannerbutton}`
              : `${style.buttonNotSelected}`
          }
        >
          <City
            style={{ paddingRight: "10px" }}
            className={`${style.svg_img}`}
          />
          City
        </Button>
        <Button
          onClick={() => handleButtonClick("romance")}
          className={
            selectedButton === "romance"
              ? `${style.plannerbutton}`
              : `${style.buttonNotSelected}`
          }
        >
          <Romance
            style={{ paddingRight: "10px" }}
            className={`${style.svg_img}`}
          />
          Romance
        </Button>
      </div>
      <div>
        {selectedButton === "beach" && (
          <div className="row">
            {plannerProperties[0].slice(0, 4).map((property, index) => (
              <div className={`col-md-3 ${style.explorecd}`} key={index}>
                <PlannerCard property={property} />
              </div>
            ))}
          </div>
        )}
        {selectedButton === "historical" && (
          <div className="row">
            {plannerProperties[1].slice(0, 4).map((property, index) => (
              <div className={`col-md-3 ${style.explorecd}`} key={index}>
                <PlannerCard property={property} />
              </div>
            ))}
          </div>
        )}
        {selectedButton === "adventure" && (
          <div className="row">
            {plannerProperties[2].slice(0, 4).map((property, index) => (
              <div className={`col-md-3 ${style.explorecd}`} key={index}>
                <PlannerCard property={property} />
              </div>
            ))}
          </div>
        )}
        {selectedButton === "city" && (
          <div className="row">
            {plannerProperties[3].slice(0, 4).map((property, index) => (
              <div className={`col-md-3 ${style.explorecd}`} key={index}>
                <PlannerCard property={property} />
              </div>
            ))}
          </div>
        )}
        {selectedButton === "romance" && (
          <div className="row">
            {plannerProperties[4].slice(0, 4).map((property, index) => (
              <div className={`col-md-3 ${style.explorecd}`} key={index}>
                <PlannerCard property={property} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default QuickPlanner;
