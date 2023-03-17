import React from "react";
import { Table } from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import customerReservationData from "../../data/customerReservations";

const ReservationsForCustomer = () => {
  return (
    <div>
      <MainContainer>
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
            {customerReservationData.map((customerReservation) => {
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
      </MainContainer>
    </div>
  );
};
export default ReservationsForCustomer;
