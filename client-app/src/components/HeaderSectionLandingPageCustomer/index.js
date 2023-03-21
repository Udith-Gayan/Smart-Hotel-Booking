import React from "react";
import { Input, Button } from "reactstrap";
import styles from "./index.module.scss";
import "../../index.scss";
import { useSelector, useDispatch } from "react-redux";
import { show, hide } from "../../features/visibility/visibleSlice";
import { useNavigate } from "react-router-dom";

const HeaderSectionLandingPageCustomer = () => {
    const navigate = useNavigate();
    const visibility = useSelector((state) => state.visibility.value);
    const dispatch = useDispatch();

    const noSecret = () => {
        dispatch(hide());
        navigate("/register-customer");
    };

    const submit = () => {
        dispatch(hide());
        navigate("/register-customer");
    };
    return (
        <div className={styles.heroImage}>
            <div>
                <div className={styles.content}>
                    <span className={styles.heading}>Enjoy your</span> <br />
                    <hr className="noMargin" />
                    <span className={styles.heading}>dream vacation!</span>
                    <br />
                    <span className={styles.description}>
                        type littile description about the hotel booking system for customers - Lorem Ipsum is simply dummy text of the printing and
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
                            />{" "}
                            <Button
                                className="secondaryButton smallMarginTopBottom"
                                onClick={() => submit()}
                            >
                                Submit
                            </Button>
                        </div>
                    ) : null}
                </div>
                <div className={styles.backgroundShape}></div>
            </div>
        </div>
    );
};

export default HeaderSectionLandingPageCustomer;
