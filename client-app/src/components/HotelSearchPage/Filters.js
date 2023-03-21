import "./styles.scss"
import React, {useState} from "react";
import Conveniences from "./Conveniences";
import RoomFacilitiesSearch from "./RoomFacilitiesSearch";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {cancellation_policies} from "../../constants/constants";
import "./styles.scss"

function Filters(props) {
    const onChangeBudget = (event) => {

        let regexp = /^[+]?\d*\.?\d*$/;

        if (!regexp.test(event.target.value)) {
            return;
        }
        props.setBudget(event.target.value);
    }

    const onChangeDistance = (event) => {

        let regexp = /^[+]?\d*\.?\d*$/;

        if (!regexp.test(event.target.value)) {
            return;
        }
        props.setDistance(event.target.value);
    }


    const [cancellationPolicyDropDown, setCancellationPolicyDropDown] = useState(false);
    const toggleCancellationPolicyDropDown = () => {
        setCancellationPolicyDropDown(prevState => !prevState)
    }

    const changeCancellationPolicy = (value) => {
        props.setCancellationPolicy(value);
    }

    return (
        <div className={"filter_card"}>
            <div className={"row_justify"}>
                <div className={"title_2"} style={{fontSize: "23px"}}>Filters</div>
                <button className={"reset_button my_col_right"} onClick={props.resetFilters} disabled={props.isDisable}>
                    <span className={"reset_text"}>Reset</span></button>

            </div>

            <div className={"title_3 mt-3"}>Budget (per night)</div>
            <input type="text" className="form-control input_field" id="budget_per_night" placeholder={"$ Any Price"}
                   onChange={onChangeBudget} value={props.budget}
                   style={{width: "300px"}} disabled={props.isDisable}/>


            <Conveniences conveniences={props.conveniences} onChangeConvenience={props.onChangeConvenience}
                          isDisable={props.isDisable}/>

            <div className={"title_3 mt-3"}>Distance from center of {props.city}</div>
            <input type="text" className="form-control input_field" id="budget_per_night" placeholder={"Any"}
                   onChange={onChangeDistance} value={props.distance} disabled={props.isDisable}
                   style={{width: "300px"}}/>

            <div className={"title_3 mt-3 mb-1"}>Cancellation policy</div>

            <Dropdown isOpen={cancellationPolicyDropDown} toggle={toggleCancellationPolicyDropDown}
                      className={props.isDisable ? "dropdown_container_disabled" : "dropdown_container"}
                      disabled={props.isDisable}>
                <DropdownToggle caret
                                className={"dropdown_toggle"} color={"black"}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                >
                    <span style={{textAlign: "left"}}>{props.cancellationPolicy}</span>

                </DropdownToggle>
                <DropdownMenu style={{width: "100%"}}>
                    {cancellation_policies.map(policy => {
                        return (
                            <DropdownItem className="dropdown_items_custom" key={policy.Id}>
                                <div onClick={changeCancellationPolicy.bind(this, policy.Name)}>{policy.Name}</div>
                            </DropdownItem>
                        )
                    })}
                </DropdownMenu>
            </Dropdown>

            <div className={"title_3 mt-3 mb-1"}>Bed preferences</div>

            <div className={"row_fit"}>
                {props.bedTypes.map((bed_type) => {
                    return (
                        <button
                            className={props.isDisable ? "disabled_box_button" : ("box_button " + (bed_type.status ? "box_button_active" : ""))}
                            onClick={props.onChangeBedType.bind(this, bed_type.Id)} key={bed_type.Id}
                            disabled={props.isDisable}>
                            <span className={"box_text"}>{bed_type.Name}</span>
                        </button>
                    )
                })}
            </div>


            <RoomFacilitiesSearch roomFacilities={props.roomFacilities}
                                  onChangeRoomFacility={props.onChangeRoomFacility} isDisable={props.isDisable}/>
        </div>
    )
}

export default Filters