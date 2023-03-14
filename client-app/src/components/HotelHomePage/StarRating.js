import "../../styles/components_styles.scss"
import {useState} from "react";

const StarRating = (props) => {
    return (
        <div style={{display: "inline"}}>
            <div style={{display: "inline"}}>
                {[...Array(6)].map((star, index) => {
                    index += 1;

                    if (index < 6) {
                        return (
                            <span
                                key={index}
                                className={"star" + (index <= props.ratings ? " star_button_on" : " star_button_off")}>
                        &#9733;
                        </span>
                        )
                    } else {
                        return (
                            <span key={index} className={"subtext"} style={{fontSize: "14px"}}> ({props.reviews} reviews)</span>
                        )
                    }
                })}
            </div>


        </div>

    );
};

export default StarRating