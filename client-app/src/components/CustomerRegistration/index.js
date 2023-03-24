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
  show,
  hide,
} from "../../features/registerCustomer/registerCustomerSlice";
import XrplService from "../../services-common/xrpl-service";

const CustomerRegistration = (props) => {
  const xrplService = XrplService.xrplInstance;

  const generatedSecretVisibility = useSelector(
    (state) => state.registerCustomer.generatedSecretVisibility
  );

  const [disableConfirm, setDisableConfirm] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [secret, setSecret] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [payNow, setPayNow] = useState(false);
  const [payAtDoor, setPayAtDoor] = useState(false);
  const [fullNameInvalid, setFullNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneNoInvalid, setPhoneNoInvalid] = useState(false);
  const [secretInvalid, setSecretInvalid] = useState(false);
  const [walletAddressInvalid, setWalletAddressInvalid] = useState(false);

  // const [disableAll, setdisableAll] = useState(true);

  const dispatch = useDispatch();

  // disable confirm button logic
  useEffect(() => {
    if (fullName && email && phoneNo && walletAddress && ((payNow && secret) || payAtDoor)) {
      setDisableConfirm(false)
    }
    else {
      setDisableConfirm(true)
    }

  }, [fullName, email, phoneNo, walletAddress, payNow, secret, payAtDoor])
  const validation = (body) => {
    // only when validate, body will pass
    if (
      fullName.length !== 0 &&
      email.length !== 0 &&
      phoneNo.length === 10 && walletAddress.length !== 0 &&
      ((payNow && secret.length !== 0 && xrplService.isValidSecret(secret)) || payAtDoor)
    ) {
      console.log("body", body);
      return true;
    }

    return false;
  };

  const registerCustomer = async (e) => {
    e.preventDefault();
    // setdisableAll(true);
    const body = { fullName, email, phoneNo, secret, payNow, walletAddress };

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

    if (walletAddress.length === 0)
      setWalletAddressInvalid(true);
    else
      setWalletAddressInvalid(false);

    if (secret.length === 0) {
      setSecretInvalid(true);
    } else {
      setSecretInvalid(false);
    }
    if (validation(body)) {
      await props.createReservation(body)
    }
    // setdisableAll(false);
    return;
  };

  const payNowHandler = (e) => {
    setPayAtDoor(false);
    setPayNow(e.target.checked);
  };
  const payAtDoorHandler = (e) => {
    setPayNow(false);
    setSecret("");
    setPayAtDoor(e.target.checked);
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
                Phone Number should be a 10 digit number
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="phoneNo">Wallet Address</Label>
              <Input
                id="walletAddress"
                name="walletAddress"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                invalid={walletAddressInvalid}
              />
              <FormFeedback invalid={walletAddressInvalid.toString()}>
                Wallet address is required.
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <div>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Input
                name="radio1"
                type="radio"
                onChange={(e) => payNowHandler(e)}
                onClick={() => dispatch(show())}
                value={payNow}
              />
              <Label check>Pay Now</Label>
            </FormGroup>
            <FormGroup check>
              <Input
                name="radio1"
                type="radio"
                onChange={(e) => payAtDoorHandler(e)}
                onClick={() => dispatch(hide())}
                value={payAtDoor}
              />
              <Label check>Pay At Door</Label>
            </FormGroup>
          </FormGroup>
        </div>
        {generatedSecretVisibility ? (
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
                  invalid={secretInvalid}
                />
                <FormFeedback invalid={secretInvalid.toString()}>
                  Secret can not be empty
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        ) : null}

        <div>
          <Button className="secondaryButton smallMarginTopBottom" disabled={disableConfirm}>
            Confirm Booking
          </Button>
        </div>
      </Form>
    </Card1>
  );
};

export default CustomerRegistration;
