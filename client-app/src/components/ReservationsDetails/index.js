import React, { useEffect, useState } from "react";
import { Table, Input, Spinner, Row, FormGroup, Label, Col, Button, Form } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import {
  reservationDataForCustomer,
  reservationDataForHotel,
} from "../../data/reservationData";
import styles from "./index.module.scss";
import Pagination from "../Pagination/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import toast from "react-hot-toast";
import XrplService from "../../services-common/xrpl-service";

const ReservationsForCustomer = () => {
  const xrplService = XrplService.xrplInstance;
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [showSecretField, setShowSecretField] = useState(false)
  const [secret, setSecret] = useState("")
  const [customer, setCustomer] = useState(false);
  const [hotelOwner, setHotelOwner] = useState(false);
  const [walletAddress, setWalletAddress] = useState("")

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  let customerRecords = [];
  let hotelOwnerRecords = [];
  let nPages = 0;

  //const isCustomer = localStorage.getItem("customer");
  const isCustomer = customer;

  if (isCustomer) {
    customerRecords = reservationDataForCustomer?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );
    nPages = Math.ceil(reservationDataForCustomer.length / recordsPerPage);
  } else {
    hotelOwnerRecords = reservationDataForHotel?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );
    nPages = Math.ceil(reservationDataForHotel.length / recordsPerPage);
  }

  const [hotelOwnerData, setHotelOwnerData] = useState(hotelOwnerRecords);
  const handleRowSelect = (checkedId) => {
    const listItems = hotelOwnerData.map((item) =>
      item.id === checkedId ? { ...item, checked: !item.checked } : item
    );
    setHotelOwnerData(listItems);
    const body = listItems;

    toast.success("Successfully changed the payment status");
    // Allowing multiple checks by allowing to send the whole body(only the changed page number of items - excluding other paginations items since user has no control over them)
    console.log("body", body);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    const address = await xrplService.generateWalletFromSeed(secret);
    setWalletAddress(address?.classicAddress);
    const body = { walletAddress: address, customer: customer, hotelOwner: hotelOwner }
  }
  return (
    <div className={styles.containerOverride}>
      <MainContainer>
        {walletAddress ? <h2 className={styles.address}>{walletAddress}</h2> : null}

        <Form onSubmit={searchHandler} style={{ marginTop: "30px" }}>
          <FormGroup tag="fieldset">
            <FormGroup check>
              <Input
                name="radio1"
                type="radio"
                value={customer}
                onClick={() => setShowSecretField(true)}
                onChange={(e) => { setHotelOwner(false); setCustomer(e.target.checked) }}
              />
              <Label check>
                I'm a customer. Let's see my reservations.
              </Label>
            </FormGroup>
            <FormGroup check>
              <Input
                name="radio1"
                type="radio"
                onClick={() => setShowSecretField(true)}
                value={hotelOwner}
                onChange={(e) => { setCustomer(false); setHotelOwner(e.target.checked) }}
              />
              <Label check>
                I'm a hotel owner. Let's see my reservations.
              </Label>
            </FormGroup>
          </FormGroup>

          {showSecretField ? <Row style={{ marginBottom: "20px" }}>
            <Col md={4} style={{ paddingRight: "0" }}>
              <Input type="search" className={styles.searchButton} onChange={(e) => setSecret(e.target.value)} value={secret}
              />
            </Col>
            <Col md={8} className="noPadding">
              <Button className="secondaryButton" style={{ borderRadius: "0", height: "38px" }}>
                <FontAwesomeIcon icon={solid("magnifying-glass-arrow-right")} size="xl" />
              </Button>
            </Col>
          </Row>

            : null}
        </Form>
        {(customer && walletAddress) ? (
          <Table striped>
            <thead>
              <tr>
                <th>Hotel Name</th>
                <th>Room Id</th>
                <th>Room Name</th>
                <th>Room Count</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customerRecords.map((reservation, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{reservation.hotelName}</th>
                    <th>{reservation.roomId}</th>
                    <td>{reservation.roomName}</td>
                    <td>{reservation.roomCount}</td>
                    <td>{reservation.fromDate}</td>
                    <td>{reservation.toDate}</td>
                    <td>{reservation.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (hotelOwner && walletAddress) ? (
          <Table striped>
            <thead>
              <tr>
                <th>Customer Id</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Customer Contact No</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Room Name</th>
                <th>Room Count</th>
                <th>
                  <FontAwesomeIcon icon={solid("check")} />
                  Paid
                  <FontAwesomeIcon
                    icon={regular("square")}
                    style={{ marginLeft: "10px" }}
                  />
                  Not Paid
                </th>
              </tr>
            </thead>
            <tbody>
              {hotelOwnerData.map((reservation) => {
                return (
                  <tr key={reservation.id}>
                    <th scope="row">{reservation.customerId}</th>
                    <td>{reservation.customerName}</td>
                    <td>{reservation.customerEmail}</td>
                    <td>{reservation.customerContactNo}</td>
                    <td>{reservation.fromDate}</td>
                    <td>{reservation.toDate}</td>
                    <td>{reservation.roomName}</td>
                    <td>{reservation.roomCount}</td>
                    <td style={{ textAlign: "center" }}>
                      <Input
                        type="checkbox"
                        name="rowSelect"
                        checked={reservation.checked}
                        onChange={() => handleRowSelect(reservation.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          // <Row className="spinnerWrapper">
          //   <Spinner
          //     color="primary"
          //     style={{
          //       height: "3rem",
          //       width: "3rem",
          //     }}
          //     type="grow"
          //   >
          //     Loading...
          //   </Spinner>
          // </Row>
          null
        )}

        {((customer || hotelOwner) && walletAddress) ? (
          <Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ) : null}
      </MainContainer>
    </div>
  );
};
export default ReservationsForCustomer;
