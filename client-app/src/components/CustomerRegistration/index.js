import React from "react";
import { Col, Form, Row, FormGroup, Label, Button, Input } from "reactstrap";
import Card1 from "../../layout/Card";
import MainContainer from "../../layout/MainContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  active,
  show,
} from "../../features/registerCustomer/registerCustomerSlice";

const CustomerRegistration = () => {
  const registerCustomerVisibility = useSelector(
    (state) => state.registerCustomer.registerCustomerVisibility
  );
  const accountGeneratorVisibility = useSelector(
    (state) => state.registerCustomer.accountGeneratorVisibility
  );
  const dispatch = useDispatch();
  return (
    <div>
      <MainContainer>
        <section>
          <div className="title_1">Welcome {}!</div>
          <div className="title_2">Customer details</div>
          <Card1>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" type="text" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">E-Mail</Label>
                    <Input id="email" name="email" type="email" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleAddress">Phone Number</Label>
                    <Input id="phoneNo" name="phoneNo" type="tel" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      name="walletAddress"
                      type="text"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div>
                <Button
                  className="secondaryButton smallMarginTopBottom"
                  onClick={() => dispatch(show())}
                >
                  Click here to generate a account
                </Button>
              </div>
              {accountGeneratorVisibility ? (
                <Row>
                  <Col md={6}>
                    <div>
                      Generate the secret by using the link:{" "}
                      <a
                        href="https://hooks-testnet-v3.xrpl-labs.com/"
                        rel="noreferrer"
                        target="_blank"
                        onClick={() => dispatch(active())}
                      >
                        https://hooks-testnet-v3.xrpl-labs.com/
                      </a>
                    </div>
                  </Col>
                </Row>
              ) : null}

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="secret">Generated Secret</Label>
                    <Input
                      id="secret"
                      name="secret"
                      type="text"
                      disabled={registerCustomerVisibility ? false : true}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div>
                <Button
                  className="secondaryButton smallMarginTopBottom"
                  disabled={registerCustomerVisibility ? false : true}
                >
                  Register Customer
                </Button>
              </div>
            </Form>
          </Card1>
        </section>
      </MainContainer>
    </div>
  );
};

export default CustomerRegistration;
