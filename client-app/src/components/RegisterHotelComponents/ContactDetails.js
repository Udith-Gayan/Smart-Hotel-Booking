import Card1 from "../../layout/Card";
import React from "react";
import { Label, Input } from "reactstrap";

function ContactDetails(props) {
  return (
    <div>
      <section>
        <div className="title_2">Contact details</div>
        <Card1>
          <Label>Full Name</Label>
          <Input
            type="text"
            className="form-control input_full"
            id="full_name"
            onChange={(e) => props.setOwnerName(e.target.value)}
          />

          <Label className="mt-3">Email</Label>
          <Input
            type="email"
            className="form-control input_full"
            id="email"
            onChange={(e) => props.setEmail(e.target.value)}
          />

          <div className={"row mt-3"}>
            <div className={"col"}>
              <Label>Phone Number</Label>
              <Input
                type="text"
                className="form-control input_half"
                id="phone_number"
                onChange={(e) => props.setContactNumber1(e.target.value)}
              />
            </div>

            <div className={"col"}>
              <Label>Alternative Phone Number</Label>
              <Input
                type="text"
                className="form-control input_half"
                id="alternative_phone_number"
                onChange={(e) => props.setContactNumber2(e.target.value)}
              />
            </div>
          </div>
          {/*<input type="drop" className="form-control input_half" id="property_name"/>*/}
        </Card1>
      </section>

      <section>
        <div className="title_2">Property Location</div>
        <Card1>
          <div className={"row"}>
            <div className={"col"}>
              <Label>Address line 01</Label>
              <Input
                type="text"
                className="form-control input_half"
                id="address_line_1"
                onChange={(e) => props.setaddressLine1(e.target.value)}
              />
            </div>

            <div className={"col"}>
              <Label>Address line 02</Label>
              <Input
                type="text"
                className="form-control input_half"
                id="address_line_2"
                onChange={(e) => props.setaddressLine2(e.target.value)}
              />
            </div>
          </div>

          <div className={"row mt-3"}>
            <div className={"col"}>
              <Label>City</Label>
              <Input
                type="text"
                className="form-control input_half"
                id="city"
                onChange={(e) => props.setCity(e.target.value)}
              />
            </div>

            <div className={"col"}>
              <Label>Distance from City (Km)</Label>
              <Input
                type="number"
                className="form-control input_half"
                id="distance"
                onChange={(e) => props.setDistanceFromCenter(e.target.value)}
              />
            </div>
          </div>
        </Card1>
      </section>
    </div>
  );
}

export default ContactDetails;
