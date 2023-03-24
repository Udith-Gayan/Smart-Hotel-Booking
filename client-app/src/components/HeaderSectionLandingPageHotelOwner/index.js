import React, { useState } from "react";
import { Input, Button } from "reactstrap";
import styles from "./index.module.scss";
import "../../index.scss";
import { useSelector, useDispatch } from "react-redux";
import { show, hide } from "../../features/visibility/visibleSlice";
import { useNavigate } from "react-router-dom";
import XrplService from "../../services-common/xrpl-service";
import HotelService from "../../services-domain/hotel-service copy";
import toast from 'react-hot-toast';

const HeaderSectionLandingPageHotelOwner = () => {
  const navigate = useNavigate();
  const visibility = useSelector((state) => state.visibility.value);
  const dispatch = useDispatch();
  const xrplService = XrplService.xrplInstance;
  const hotelService = HotelService.instance;

  const [secret, setSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  const noSecret = () => {
    dispatch(hide());
    navigate("/register-hotel");
  };

  const submit = async (e) => { 
    e.preventDefault();
    setDisableSubmitBtn(true);
    if (!xrplService.isValidSecret(secret)) {
      //setErrorMessage("Invalid secret.");
      toast(
          (element) => (
              <ToastInnerElement message={"Invalid secret."} id={element.id}/>
          ),
          {
              duration: Infinity,
          }
      );
      setDisableSubmitBtn(false);
      return;
    }

    // Check if registered hotel
    const res = await hotelService.generateHotelWallet(secret);
    if (!res) {
      setErrorMessage("This is not a registered hotel's secret.");
      setDisableSubmitBtn(false);
      return;
    }

    dispatch(hide());
    navigate(`/hotel/${res.Id}`);
  };

  return (
    <div className={styles.heroImage}>
      <div>
        <div className={styles.content}>
          <span className={styles.heading}>Your world</span> <br />
          <hr className="noMargin" />
          <span className={styles.heading}>worth sharing!</span>
          <br />
          <span className={styles.description}>
            type littile description about the hotel booking system for hotel
            owners - Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard
            dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make a type specimen book. It has
            survived not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged.
          </span>
          <div>
            <Button
              className={`primaryButton smallMarginTopBottom ${styles.buttonOverride}`}
              onClick={() => dispatch(show())}
            >
              I have a secret
            </Button>
            <Button
              className="secondaryButton smallMarginTopBottom"
              onClick={() => noSecret()}
            >
              I don't have a secret
            </Button>
          </div>
          {visibility ? (
            <div className={styles.secretWrapper}>
              <Input
                type="text"
                name="secret"
                id="secret"
                placeholder="Secret"
                onChange={(e) => setSecret(e.target.value)}
              />{" "}
              <p style={{ color: "red" }}>{errorMessage}</p>
              <Button
                className="secondaryButton smallMarginTopBottom"
                onClick={(e) => submit(e)}
                disabled={disableSubmitBtn}
              >
                Let's Go
              </Button>
            </div>
          ) : null}
        </div>
        <div className={styles.backgroundShape}></div>
      </div>
    </div>
  );
};

export default HeaderSectionLandingPageHotelOwner;
