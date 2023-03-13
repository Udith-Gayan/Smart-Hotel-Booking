import MainContainer from "../layout/MainContainer";
import Card1 from "../layout/Card";
import '../styles/text_styles.scss';
import React, {useState} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label} from "reactstrap";
import Facilities from "../components/register_hotel_components/Facilities";
import ContactDetails from "../components/register_hotel_components/ContactDetails";
import PropertyPhotos from "../components/register_hotel_components/PropertyPhotos";
import '../styles/layout_styles.scss';

function RegisterHotel() {
    let user = "User";
    const [dropDownOpen, setDropDownOpen] = useState(false);

    const toggleDropDown = () => {
        setDropDownOpen(prevState => !prevState)
    }

    return (
        <MainContainer>
            <section>
                <div className="title_1">Welcome {user}!</div>
                <Card1 width={"850px"}>
                    <div className="title_3">Name of Your Property</div>
                    <div className="subtext">Guests will see this name when they search for a place to stay.
                    </div>
                    <input type="text" className="form-control input_half" id="property_name"
                           style={{backgroundColor: '#ffffff', borderColor: "#908F8F", marginTop: "15px"}}/>

                    <div className="title_3 mt-3">Star Rating</div>
                    <Dropdown isOpen={dropDownOpen} toggle={toggleDropDown}>
                        <DropdownToggle caret
                                        style={{textAlign: "right", backgroundColor: '#ffffff', borderColor: "#908F8F"}}
                                        className={"dropdown_1"} color={"black"}>

                        </DropdownToggle>
                        <DropdownMenu style={{width: "50%"}}>
                            <DropdownItem className="dropdown_items">1 Star</DropdownItem>
                            <DropdownItem className="dropdown_items">2 Star</DropdownItem>
                            <DropdownItem className="dropdown_items">3 Star</DropdownItem>
                            <DropdownItem className="dropdown_items">4 Star</DropdownItem>
                            <DropdownItem className="dropdown_items">5 Star</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Card1>
            </section>

            <ContactDetails/>

            <Facilities/>

            <PropertyPhotos/>

            <section>
                <div className={"title_3"} style={{lineHeight: "25px"}}>
                    You’re almost done.<br/>
                    To complete your registration, check the boxes below:
                </div>


                <div className={"pt-3"} style={{marginLeft: "20px"}}>
                    <FormGroup check inline>
                        <Input type="checkbox" style={{width: 25, height: 25}}/>
                        &nbsp;&nbsp;&nbsp;
                        <Label check style={{lineHeight: "20px"}}>
                            <div className={"title_4"}>

                                I certify that this is a legitimate accommodation business with all necessary licenses
                                and permits, which can be shown upon first request.<br/> VoyageLanka reserves the
                                right to verify and investigate any details provided in this registration.
                            </div>
                        </Label>
                    </FormGroup>
                </div>


                <div className={"pt-3"} style={{marginLeft: "20px"}}>
                    <FormGroup check inline>
                        <Input type="checkbox" style={{width: 25, height: 25}}/>
                        &nbsp;&nbsp;&nbsp;
                        <Label check>
                            <div className={"title_4"}>
                                I have read, accepted, and agreed to the Terms & Policies.
                            </div>
                        </Label>
                    </FormGroup>
                </div>
            </section>

            <div className={"row center_div pt-3"}>
                <button className={"complete_registration_button"} style={{width: "650px"}}>Complete registration</button>
            </div>
        </MainContainer>
    );
}

export default RegisterHotel;
