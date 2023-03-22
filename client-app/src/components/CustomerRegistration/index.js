import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  Row,
  FormGroup,
  Label,
  Button,
  Input,
  FormFeedback,
} from "reactstrap";
import Card1 from "../../layout/Card";
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [secret, setSecret] = useState("");
  const [fullNameInvalid, setFullNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneNoInvalid, setPhoneNoInvalid] = useState(false);
  const [walletAddressInvalid, setWalletAddressInvalid] = useState(false);
  const [secretInvalid, setSecretInvalid] = useState(false);

  const dispatch = useDispatch();

  const validation = (body) => {
    // only when validate, body will pass
    if (
      fullName.length !== 0 &&
      email.length !== 0 &&
      phoneNo.length === 10 &&
      walletAddress.length !== 0 &&
      secret.length !== 0
    ) {
      console.log("body", body);
    }
  };

  const registerCustomer = (e) => {
    e.preventDefault();
    const body = { fullName, email, phoneNo, walletAddress, secret };

    if (fullName.length === 0) {
      setFullNameInvalid(true);
    } else {
      setFullNameInvalid(false);
    }
    if (email.length === 0) {
      setEmailInvalid(true);
    } else {
      setEmailInvalid(false);
    }

    if (phoneNo.length !== 10) {
      setPhoneNoInvalid(true);
    } else {
      setPhoneNoInvalid(false);
    }

    if (walletAddress.length === 0) {
      setWalletAddressInvalid(true);
    } else {
      setWalletAddressInvalid(false);
    }
    if (secret.length === 0) {
      setSecretInvalid(true);
    } else {
      setSecretInvalid(false);
    }

    validation(body);
  };
  return (
    <Card1>
      <Form onSubmit={registerCustomer}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                invalid={fullNameInvalid}
              />
              <FormFeedback invalid={fullNameInvalid.toString()}>
                Name can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={emailInvalid}
              />
              <FormFeedback invalid={emailInvalid.toString()}>
                E-Mail can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="phoneNo">Phone Number</Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                type="number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                invalid={phoneNoInvalid}
              />
              <FormFeedback invalid={phoneNoInvalid.toString()}>
                Phone No should be a 10 digit number
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="walletAddress">Wallet Address</Label>
              <Input
                id="walletAddress"
                name="walletAddress"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                invalid={walletAddressInvalid}
              />
              <FormFeedback invalid={walletAddressInvalid.toString()}>
                Wallet Address can not be empty
              </FormFeedback>
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
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                disabled={registerCustomerVisibility ? false : true}
                invalid={secretInvalid}
              />
              <FormFeedback invalid={secretInvalid.toString()}>
                Secret can not be empty
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <div>
          <Button
            className="secondaryButton smallMarginTopBottom"
            disabled={registerCustomerVisibility ? false : true}
          >
            Confirm Booking
          </Button>
          <Button
            className="secondaryButton smallMargin"
            disabled={registerCustomerVisibility ? false : true}
          >
            Pay at Door
          </Button>
        </div>
      </Form>
    </Card1>
  );
};

export default CustomerRegistration;
