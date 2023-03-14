import Card1 from "../../layout/Card";
import React from 'react';

function ContactDetails(props) {
    return (
        <div>
            <section>
                <div className="title_2">Contact details</div>
                <Card1>
                    <div className="title_3">Full Name</div>
                    <input type="text" className="form-control input_full" id="full_name" onChange={e => props.setOwnerName(e.target.value)}
                           style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>

                    <div className="title_3  mt-3">Email</div>
                    <input type="email" className="form-control input_full" id="email" onChange={e => props.setEmail(e.target.value)}
                           style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>

                    <div className={"row mt-3"}>
                        <div className={"col"}>
                            <div className="title_3">Phone Number</div>
                            <input type="text" className="form-control input_half" id="phone_number" onChange={e => props.setContactNumber1(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>
                        </div>

                        <div className={"col"}>
                            <div className="title_3">Alternative Phone Number</div>
                            <input type="text" className="form-control input_half" id="alternative_phone_number" onChange={e => props.setContactNumber2(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>
                        </div>

                    </div>
                    {/*<input type="drop" className="form-control input_half" id="property_name"/>*/}

                </Card1>
            </section>

            <section>
                <Card1>
                    <div className="title_3">Property Location</div>

                    <div className={"row mt-3"}>
                        <div className={"col"}>
                            <div className="title_4">Address line 01</div>
                            <input type="text" className="form-control input_half" id="address_line_1" onChange={e => props.setaddressLine1(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>
                        </div>

                        <div className={"col"}>
                            <div className="title_4">Address line 02</div>
                            <input type="text" className="form-control input_half" id="address_line_2" onChange={e => props.setaddressLine2(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>
                        </div>

                    </div>

                    <div className={"row mt-3"}>
                        <div className={"col"}>
                            <div className="title_4">City</div>
                            <input type="text" className="form-control input_half" id="city" onChange={e => props.setCity(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F"}}/>
                        </div>

                        <div className={"col"}>
                            <div className="title_4">Distance from City (Km)</div>
                            <input type="number" className="form-control input_half" id="distance" onChange={e => props.setDistanceFromCenter(e.target.value)}
                                   style={{backgroundColor: '#ffffff', borderColor: "#908F8F", width: "50%"}}/>
                        </div>

                    </div>
                </Card1>
            </section>
        </div>
    )
}

export default ContactDetails