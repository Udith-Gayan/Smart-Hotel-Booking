import React, { useState } from "react";
import { Table } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import {
  reservationDataForCustomer,
  reservationDataForHotel,
} from "../../data/reservationData";
import styles from "./index.module.scss";
import Pagination from "../Pagination/index";
import Toggle from "../Toggle/index";

const ReservationsForCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [toggleCheck, setToggleCheck] = useState(false);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  let currentRecords = [];
  let nPages = 0;

  const isCustomer = localStorage.getItem("customer");

  if (isCustomer === "true") {
    currentRecords = reservationDataForCustomer?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );
    nPages = Math.ceil(reservationDataForCustomer.length / recordsPerPage);
  } else {
    currentRecords = reservationDataForHotel?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );
    nPages = Math.ceil(reservationDataForHotel.length / recordsPerPage);
  }

  const handleChange = (id) => {
    const updatedCheckboxes = currentRecords.map((checkbox) => {
      console.log("id", checkbox.id, " ", id);
      if (checkbox.id === id) {
        console.log("first");
        return { ...checkbox, checked: !checkbox.checked };
      }
      return checkbox;
    });
    setToggleCheck(updatedCheckboxes);
  };
  return (
    <div className={styles.containerOverride}>
      <MainContainer>
        {isCustomer === "true" ? (
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
              {currentRecords.map((reservation, index) => {
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
        ) : isCustomer === "false" ? (
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((reservation) => {
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
                    <td>{reservation.checked}</td>
                    <td>
                      <Toggle
                        checked={reservation.checked}
                        text="Paid"
                        size="large"
                        disabled={false}
                        onChange={() => handleChange(reservation.id)}
                        offstyle="btn-danger"
                        onstyle="btn-success"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : null}

        {isCustomer !== "" ? (
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
