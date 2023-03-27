import React, {useEffect, useState} from "react";
import {Table, Input, Spinner, Row, FormGroup, Label, Col, Button, Form} from "reactstrap";
import MainContainer from "../../layout/MainContainer";
import styles from "./index.module.scss";
import Pagination from "../Pagination/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IoMdCloseCircle} from "react-icons/io";
import {solid, regular} from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import toast from "react-hot-toast";
import XrplService from "../../services-common/xrpl-service";
import HotelService from "../../services-domain/hotel-service copy";
import ToastInnerElement from "../ToastInnerElement/ToastInnerElement";

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

    const [isDataLoading, setIsDataLoading] = useState(true);
    const [customerData, setCustomerData] = useState([]);
    const [hotelOwnerData, setHotelOwnerData] = useState(hotelOwnerRecords);

    if (customer) {
        customerRecords = customerData?.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );
        nPages = Math.ceil(customerData.length / recordsPerPage);
    } else {
        hotelOwnerRecords = hotelOwnerData?.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );
        nPages = Math.ceil(hotelOwnerData.length / recordsPerPage);
    }

    const handleRowSelect = (checkedId) => {
        const listItems = hotelOwnerData.map((item) =>
            item.Id === checkedId ? {...item, TransactionId: item.TransactionId ? null : item.Id} : item
        );
        setHotelOwnerData(listItems);
        toast.success("Successfully changed the payment status");
        // Allowing multiple checks by allowing to send the whole body(only the changed page number of items - excluding other paginations items since user has no control over them)
    };

    const searchHandler = async (e) => {
        setIsDataLoading(true);

        e.preventDefault();
        if (!customer && !hotelOwner)
            return;

        try {
            const address = await xrplService.generateWalletFromSeed(secret);
            setWalletAddress(address?.classicAddress);

            try {
                const res = await HotelService.instance.getReservations(customer, address?.classicAddress);
                if (!res) {
                    toast(
                        (element) => (
                            <ToastInnerElement message={"Error occurred !"} id={element.id}/>
                        ),
                        {
                            duration: Infinity,
                        }
                    );
                }
                if (customer) {
                    setCustomerData([...res]);
                } else {
                    setHotelOwnerData([...res]);
                }
                setIsDataLoading(false);
            } catch (error) {
                console.log(error);
                setIsDataLoading(false);

                toast(
                    (element) => (
                        <ToastInnerElement message={"User not found."} id={element.id}/>
                    ),
                    {
                        duration: Infinity,
                    }
                );
            }
        } catch (error) {
            toast(
                (element) => (
                    <ToastInnerElement message={"Invalid Secret"} id={element.id}/>
                ),
                {
                    duration: Infinity,
                }
            );
        }


    }

    return (
        <div className={styles.containerOverride}>
            <MainContainer>
                {walletAddress ? <h2 className={styles.address}>{walletAddress}</h2> : null}

                <Form onSubmit={searchHandler} style={{marginTop: "30px"}}>
                    <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Input
                                name="radio1"
                                type="radio"
                                value={customer}
                                onClick={() => setShowSecretField(true)}
                                onChange={(e) => {
                                    setHotelOwner(false);
                                    setCustomer(e.target.checked)
                                }}
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
                                onChange={(e) => {
                                    setCustomer(false);
                                    setHotelOwner(e.target.checked)
                                }}
                            />
                            <Label check>
                                I'm a hotel owner. Let's see my reservations.
                            </Label>
                        </FormGroup>
                    </FormGroup>

                    {showSecretField ? <Row style={{marginBottom: "20px"}}>
                            <Col md={4} style={{paddingRight: "0"}}>
                                <Input type="search" className={styles.searchButton}
                                       onChange={(e) => setSecret(e.target.value.trim())} value={secret}
                                />
                            </Col>
                            <Col md={8} className="noPadding">
                                <Button className="secondaryButton" style={{borderRadius: "0", height: "38px"}}>
                                    <FontAwesomeIcon icon={solid("magnifying-glass-arrow-right")} size="xl"/>
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
                            <th>Room Name</th>
                            <th>Room Count</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {customerRecords.map((reservation) => {
                            return (
                                <tr key={reservation.Id}>
                                    <th scope="row">{reservation.HotelName}</th>
                                    <td>{reservation.RoomName}</td>
                                    <td>{reservation.RoomCount}</td>
                                    <td>{reservation.FromDate}</td>
                                    <td>{reservation.ToDate}</td>
                                    <td>{reservation.TransactionId ? "Paid" : "Pending"}</td>
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
                                <th>Paid Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {hotelOwnerRecords.map((reservation) => {
                                return (
                                    <tr key={reservation.Id}>
                                        <th scope="row">{reservation.CustomerId}</th>
                                        <td>{reservation.CustomerName}</td>
                                        <td>{reservation.CustomerEmail}</td>
                                        <td>{reservation.CustomerContactNo}</td>
                                        <td>{reservation.FromDate}</td>
                                        <td>{reservation.ToDate}</td>
                                        <td>{reservation.RoomName}</td>
                                        <td>{reservation.RoomCount}</td>
                                        <td style={{textAlign: "center"}}>
                                            <Input
                                                type="checkbox"
                                                name="rowSelect"
                                                checked={reservation.TransactionId !== null}
                                                onChange={() => handleRowSelect(reservation.Id)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    ) :
                    null
                }

                <div style={{marginTop: "30px"}}>
                    {((customer || hotelOwner) && walletAddress) ? (
                        <Pagination
                            nPages={nPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    ) : null}
                </div>

            </MainContainer>
        </div>
    );
};
export default ReservationsForCustomer;
