import React from "react";
import Card1 from "../../layout/Card";
import { Label, Input, FormGroup, FormFeedback } from "reactstrap";

function ContactDetails(props) {

  return (
    <div>
      <section>
        <div className="title_2">Contact details</div>
        <Card1>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              className="form-control input_full"
              id="full_name"
              onChange={(e) => props.setOwnerName(e.target.value)}
              invalid={props.ownerNameInvaid}
            />
            <FormFeedback>
              Full name is required!
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label className="mt-3" for="email">Email</Label>
            <Input
              type="email"
              className="form-control input_full"
              id="email"
              name="email"
              invalid={props.emailInvaid}
              onChange={(e) => props.setEmail(e.target.value)}
            />
            <FormFeedback>
              Email should be in valid format!
            </FormFeedback>
          </FormGroup>
          <div className={"row mt-3"}>
            <div className={"col"}>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="phone_number"
                  invalid={props.contactNumber1Invaid}
                  onChange={(e) => props.setContactNumber1(e.target.value)}
                />
                <FormFeedback>
                  Phone Number should be a 10 digit number!
                </FormFeedback>
              </FormGroup>
            </div>

            <div className={"col"}>
              <FormGroup>
                <Label>Alternative Phone Number</Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="alternative_phone_number"
                  onChange={(e) => props.setContactNumber2(e.target.value)}
                />
              </FormGroup>
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
              <FormGroup>
                <Label>Address line 01</Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="address_line_1"
                  invalid={props.addressLine1Invaid}
                  onChange={(e) => props.setaddressLine1(e.target.value)}
                />
                <FormFeedback>
                  Address line 01 is required!
                </FormFeedback>
              </FormGroup>
            </div>

            <div className={"col"}>
              <FormGroup>
                <Label>Address line 02</Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="address_line_2"
                  onChange={(e) => props.setaddressLine2(e.target.value)}
                />
              </FormGroup>
            </div>
          </div>

          <div className={"row mt-3"}>
            <div className={"col"}>
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  className="form-control input_half"
                  id="city"
                  invalid={props.cityInvaid}
                  onChange={(e) => props.setCity(e.target.value)}
                />
                <FormFeedback>
                  City required!
                </FormFeedback>
              </FormGroup>
            </div>

            <div className={"col"}>
              <FormGroup>
                <Label>Distance from City (Km)</Label>
                <Input
                  type="number"
                  className="form-control input_half"
                  id="distance"
                  invalid={props.distanceFromCenterInvaid}
                  onChange={(e) => props.setDistanceFromCenter(e.target.value)}
                />
                <FormFeedback>
                  Distance from City is required!
                </FormFeedback>
              </FormGroup>
            </div>
          </div>
        </Card1>
      </section>
    </div>
  );
}

export default ContactDetails;
