import React, { useState } from "react";
import { Table } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import customerReservationData from "../../data/customerReservations";
import styles from "./index.module.scss";
import Pagination from '../Pagination/index'

const ReservationsForCustomer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = customerReservationData.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(customerReservationData.length / recordsPerPage)

  return (
    <div className={styles.containerOverride}>
      <MainContainer >
        <Table striped>
          <thead>
            <tr>
              <th>Room Id</th>
              <th>Room Count</th>
              <th>Customer Id</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((customerReservation) => {
              return (
                <tr key={customerReservation.RoomId}>
                  <th scope="row">{customerReservation.RoomId}</th>
                  <td>{customerReservation.RoomCount}</td>
                  <td>{customerReservation.CustomerId}</td>
                  <td>{customerReservation.FromDate}</td>
                  <td>{customerReservation.ToDate}</td>
                  <td>{customerReservation.TransactionId}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </MainContainer>
    </div>
  );
};
export default ReservationsForCustomer;
