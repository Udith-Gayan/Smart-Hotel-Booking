const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const businessConfigurations = require('../settings.json').businessConfigurations;
const constants = require("./constants")
const {SqliteDatabase} = require("../services.base/sqlite-handler")

class ReservationService {

    #message = null;
    #contractAcc = null;
    #xrplApi = null;
    #db = null;
    #dbPath = settings.dbPath;

    constructor(message) {
        this.#message = message;
        this.#xrplApi = new evernode.XrplApi('wss://hooks-testnet-v2.xrpl-labs.com');
        evernode.Defaults.set({
            xrplApi: this.#xrplApi,
        });
        this.#contractAcc = new evernode.XrplAccount(settings.contractWalletAddress, settings.contractWalletSecret, {xrplApi: this.#xrplApi});
        this.#db = new SqliteDatabase(this.#dbPath);
    }

    async handleRequest() {
        try {
            this.#db.open();
            await this.#xrplApi.connect();

            switch (this.#message.subType) {
                case constants.RequestSubTypes.CREATE_RESERVATION:
                    return await this.#createReservation();
                    break;
                case constants.RequestSubTypes.DELETE_RESERVATION:
                    return this.#deleteReservation();
                    break;
                case constants.RequestSubTypes.GET_RESERVATIONS:
                    return await this.#getReservations();
                    break;
                default:
                    throw ("Invalid Request");
            }

        } catch (error) {
            return {error: error}
        } finally {
            await this.#xrplApi.disconnect();
            this.#db.close();
        }
    }

    // Create a Room
    async #createReservation() {
        let response = {};
        if (!(this.#message.data))
            throw ("Invalid Request.");

        const data = this.#message.data;
        const noOfDays = this.countDaysInBetween(data.FromDate, data.ToDate);

        const roomSelections = data.RoomSelections;
        let expectedCost = 0;
        let roomIdList = [];

        roomSelections.forEach(rms => {
            const costOFRoom = rms.roomCount * rms.costPerRoom * noOfDays;
            expectedCost += costOFRoom;
            roomIdList.push({roomId: rms.roomId, roomCost: costOFRoom});
        });


        //Get transaction amount and do payments to the hotel ( if present)
        if (data.TransactionId) {
            const txList = (await this.#xrplApi.getAccountTrx(settings.contractWalletAddress)).filter(t => t.TransactionType == "Payment");
            const paidTx = txList.find(tx => tx.hash == data.TransactionId);

            if (!paidTx)
                throw ("Invalid transaction hash.");

            if (Number(paidTx.Amount) < expectedCost)
                throw ("Insuffcient amount paid for room reservation.");

            // Pay the rest keeping the commision,  to the hotel address
            let query = `SELECT HotelWalletAddress FROM Hotels WHERE Id=(SELECT HotelId FROM Rooms WHERE Id= ${roomIdList[0].roomId})`;
            const hotelWalletAddress = await this.#db.runNativeGetFirstQuery(query);
            if (hotelWalletAddress) {
                const amountToSend = (Number(paidTx.Amount) / 1000000) * (100 - businessConfigurations.ROOM_COMMISSION_PERCENTAGE) / 100;
                const res = await this.#contractAcc.makePayment(hotelWalletAddress, (amountToSend * 1000000).toString(), "XRP", null);
                if (res.code !== "tesSUCCESS")
                    throw("Error in sending fee to the Hotel's wallet.")

            }
        }

        // Save the customer ( if customerId = 0 and CustomerDetails present
        let nCustomerId = 0;
        if (data.CustomerId == 0) {
            const customerDetails = data.CustomerDetails;
            let query = `SELECT * FROM Customers WHERE WalletAddress='${customerDetails.WalletAddress}'`;
            const res = await this.#db.runNativeGetFirstQuery(query);
            if (res) {
                nCustomerId = res.Id;
            } else {
                // save the customer
                const customerEntity = {
                    Name: customerDetails.Name,
                    Email: customerDetails.Email,
                    ContactNumber: customerDetails.ContactNumber,
                    WalletAddress: customerDetails.WalletAddress
                }
                nCustomerId = (await this.#db.insertValue('Customers', customerEntity)).lastId;
            }
        }

        const reservationIdList = [];
        for (const i in roomSelections) {
            const reservationEntity = {
                RoomId: roomSelections[i].roomId,
                RoomCount: roomSelections[i].roomCount,
                CustomerId: nCustomerId,
                FromDate: data.FromDate,
                ToDate: data.ToDate,
                Cost: roomIdList[i].roomCost,
                TransactionId: data.TransactionId ?? null
            }

            let reservationId;
            if (await this.#db.isTableExists('Reservations')) {
                reservationId = (await this.#db.insertValue('Reservations', reservationEntity)).lastId;
            } else {
                throw("Reservation table not found.");
            }

            reservationIdList.push(reservationId);

        }

        response.success = {reservationIds: reservationIdList};
        return response;

    }


    async #deleteReservation() {
        let response = {};

        return response;
    }

    async #getReservations() {
        const response = {}
        const filters = this.#message.filters.Filters;

        const walletAddress = filters.walletAddress;
        let query;
        if (filters.isCustomer) {
            // query = `SELECT Id FROM Customers WHERE WalletAddress='${walletAddress}'`;
            // const customerId = await this.#db.runNativeGetFirstQuery(query);
            const customerId = 1;

            if (customerId) {
                let result = [
                    {
                        Id: 1,
                        HotelName: "Grandbell Hotel Colombo",
                        RoomId: 1,
                        RoomName: "Deluxe",
                        RoomCount: 5,
                        FromDate: "2023-03-24",
                        ToDate: "2023-03-26",
                        TransactionId: 10,
                    },
                    {
                        Id: 1,
                        HotelName: "Grandbell Hotel Colombo",
                        RoomId: 2,
                        RoomName: "Deluxe",
                        RoomCount: ``,
                        FromDate: "2023-03-27",
                        ToDate: "2023-03-27",
                        TransactionId: null,
                    },
                    {
                        Id: 1,
                        HotelName: "Heritage",
                        RoomId: 5,
                        RoomName: "Deluxe",
                        RoomCount: 8,
                        FromDate: "2023-03-28",
                        ToDate: "2023-03-28",
                        TransactionId: null,
                    },
                ];

                // query = `
                //     SELECT
                //         Reservations.Id AS Id,
                //         Hotels.Name AS HotelName,
                //         Reservations.RoomId AS RoomId,
                //         Rooms.Name AS RoomName,
                //         Reservations.RoomCount AS RoomCount,
                //         Reservations.FromDate AS FromDate,
                //         Reservations.ToDate AS ToDate,
                //         Reservations.TransactionId AS TransactionId
                //     FROM
                //         Reservations
                //     JOIN Rooms ON Reservations.RoomId = Rooms.Id
                //     JOIN Hotels ON Rooms.HotelId = Hotels.Id
                //     WHERE
                //         Reservations.CustomerId = ${customerId};
                // `;
                // const reservations = await this.#db.runNativeGetAllQuery(query);
                const reservations = result;
                if (!reservations || reservations.length == 0) {
                    response.success = {reservationList: []}
                    return response;
                }
                response.success = {reservationList: reservations}
                return response;
            } else {
                throw("Invalid User");
            }
        } else {
            console.log("Owner Executing");
            let result = [
                {
                    Id: 1,
                    CustomerId: 1,
                    CustomerName: "Jack Holland",
                    CustomerEmail: "jack@gmail.com",
                    CustomerContactNo: "0766821877",
                    FromDate: "2023-03-24",
                    ToDate: "2023-03-26",
                    RoomName: "Deluxe",
                    RoomCount: 2,
                    TransactionId: 10,
                },
                {
                    Id: 2,
                    CustomerId: 2,
                    CustomerName: "Peter Smith",
                    CustomerEmail: "peter@gmail.com",
                    CustomerContactNo: "0766431877",
                    FromDate: "2023-03-24",
                    ToDate: "2023-03-26",
                    RoomName: "Deluxe",
                    RoomCount: 3,
                    TransactionId: null,
                },
                {
                    Id: 3,
                    CustomerId: 3,
                    CustomerName: "Mary Rich",
                    CustomerEmail: "jack@gmail.com",
                    CustomerContactNo: "0766821877",
                    FromDate: "2023-03-24",
                    ToDate: "2023-03-26",
                    RoomName: "Deluxe",
                    RoomCount: 2,
                    TransactionId: 10,
                }
            ];

            // query = `SELECT Id From Hotels WHERE HotelWalletAddress='${walletAddress}'`;
            // const hotelId = await this.#db.runNativeGetFirstQuery(query);
            const hotelId = 1;
            if (hotelId) {
                // query = `
                //     SELECT
                //         Reservations.Id AS Id,
                //         Customers.Id AS CustomerId,
                //         Customers.Name AS CustomerName,
                //         Customers.Email AS CustomerEmail,
                //         Customers.ContactNumber AS CustomerContactNo,
                //         Reservations.FromDate AS FromDate,
                //         Reservations.ToDate AS ToDate,
                //         Rooms.Name AS RoomName,
                //         Reservations.RoomCount AS RoomCount,
                //         Reservations.TransactionId AS TransactionId
                //     FROM
                //         Reservations
                //     JOIN Customers ON Reservations.CustomerId = Customers.Id
                //     JOIN Rooms ON Reservations.RoomId = Rooms.Id
                //     JOIN Hotels ON Rooms.HotelId = Hotels.Id
                //     WHERE
                //         Hotels.Id = ${hotelId};
                // `;
                // const reservations = await this.#db.runNativeGetAllQuery(query);
                const reservations = result;
                if (!reservations || reservations.length == 0) {
                    response.success = {reservationList: []}
                    return response;
                }
                response.success = {reservationList: reservations}
                return response;
            } else {
                throw("Invalid User");
            }
        }
    }


    countDaysInBetween(startDate, endDate) {
        const diffInMs = new Date(endDate) - new Date(startDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays;
    }

}


module.exports = {
    ReservationService
}