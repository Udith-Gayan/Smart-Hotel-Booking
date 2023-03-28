const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const businessConfigurations = require('../settings.json').businessConfigurations;
const constants = require("./constants")
const {SqliteDatabase} = require("../services.base/sqlite-handler");
const { EvernodeContext } = require('../services.base/vote-collector/dist');

const evp = require('../services.base/vote-collector/dist');

class ReservationService {

    #message = null;
    #contractAcc = null;
    #xrplApi = null;
    #db = null;
    #hpContext = null;
    #dbPath = settings.dbPath;

    constructor(message, hpContext = null) {
        this.#hpContext = hpContext;
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
        console.log(JSON.stringify(data));
        const noOfDays = this.countDaysInBetween(data.FromDate, data.ToDate);

        const roomSelections = data.RoomSelections;
        let expectedCost = 0;
        let roomIdList = [];
        roomSelections.forEach(rms => {
            const costOFRoom = rms.roomCount * rms.costPerRoom * noOfDays;
            console.log("Cost of room: ", costOFRoom);
            expectedCost += costOFRoom;
            console.log("expected of room: ", expectedCost);
            roomIdList.push({roomId: rms.roomId, roomCost: costOFRoom});
        });


        //Get transaction amount and do payments to the hotel ( if present)
        if(data.TransactionId) {
            const txList = (await this.#xrplApi.getAccountTrx(settings.contractWalletAddress)).filter(t => t.tx.TransactionType == "Payment");
            const paidTx = txList.find(tx => tx.tx.hash == data.TransactionId);

            if (!paidTx)
                throw ("Invalid transaction hash.");

            if (Number(paidTx.tx.Amount) < expectedCost)
                throw ("Insuffcient amount paid for room reservation.");
            console.log(paidTx.tx.Amount);

            // Pay the rest keeping the commision,  to the hotel address
            let query = `SELECT HotelWalletAddress FROM Hotels WHERE Id=(SELECT HotelId FROM Rooms WHERE Id= ${roomIdList[0].roomId})`;
            const {HotelWalletAddress} = await this.#db.runNativeGetFirstQuery(query);
            if (HotelWalletAddress) {
                const amountToSend = (Number(paidTx.tx.Amount) / 1000000 ) * (100 - businessConfigurations.ROOM_COMMISSION_PERCENTAGE) / 100;

                // Collect the same sequence number and max ledger before paying
                const evernodeContext = new EvernodeContext(this.#hpContext);
                this.#hpContext.unl.onMessage((node, msg) => {
                    evernodeContext.feedUnlMessage(node, msg);
                })
                await evernodeContext.setMultiSigner(this.#contractAcc.address);
                const txSubmitInfo = await evernodeContext.getTransactionSubmissionInfo(2000);
                
                const res = await this.#contractAcc.makePayment(HotelWalletAddress, (amountToSend * 1000000).toString(), "XRP", null, null, {Sequence: txSubmitInfo.sequence, LastLedgerSequence: txSubmitInfo.maxLedgerSequence});
                await evernodeContext.removeMultiSigner();
                if(res.code !== "tesSUCCESS"){
                    throw("Error in sending fee to the Hotel's wallet.")
                }

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

        let lastReservationId = 0;
        
        // old code

            // END of old code

            // new code
            const keyNames = [ "RoomId", "RoomCount", "CustomerId", "FromDate", "ToDate", "Cost", "TransactionId"];
            const valuess = [];
            for (const i in roomSelections) {
                const reservationEntity = {
                    RoomId: Number(roomSelections[i].roomId),
                    RoomCount: roomSelections[i].roomCount,
                    CustomerId: nCustomerId,
                    FromDate: data.FromDate.substr(0,10),
                    ToDate: data.ToDate.substr(0,10),
                    Cost: roomIdList[i].roomCost,
                    TransactionId: data.TransactionId ?? null
                }

                valuess.push(reservationEntity);
            }
            console.log(valuess)

            lastReservationId = (await this.#db.insertMultipleValues('Reservations', keyNames, valuess)).lastId;
            if(!lastReservationId) {
                throw "Error in saving reservations"
            }


        response.success = {lastReservationId: lastReservationId};
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
            query = `SELECT Id FROM Customers WHERE WalletAddress='${walletAddress}'`;
            const {Id} = await this.#db.runNativeGetFirstQuery(query);
            if (Id) {
                query = `
                    SELECT
                        Reservations.Id AS Id,
                        Hotels.Name AS HotelName,
                        Reservations.RoomId AS RoomId,
                        Rooms.Name AS RoomName,
                        Reservations.RoomCount AS RoomCount,
                        Reservations.FromDate AS FromDate,
                        Reservations.ToDate AS ToDate,
                        Reservations.TransactionId AS TransactionId
                    FROM
                        Reservations
                    JOIN Rooms ON Reservations.RoomId = Rooms.Id
                    JOIN Hotels ON Rooms.HotelId = Hotels.Id
                    WHERE
                        Reservations.CustomerId = ${Id};
                `;
                const reservations = await this.#db.runNativeGetAllQuery(query);
                if (!reservations || reservations.length === 0) {
                    response.success = {reservationList: []}
                    return response;
                }
                response.success = {reservationList: reservations}
                return response;
            } else {
                throw("Invalid User");
            }
        } else {

            query = `SELECT Id From Hotels WHERE HotelWalletAddress='${walletAddress}'`;
            const {Id} = await this.#db.runNativeGetFirstQuery(query);
            if (Id) {
                query = `
                    SELECT
                        Reservations.Id AS Id,
                        Customers.Id AS CustomerId,
                        Customers.Name AS CustomerName,
                        Customers.Email AS CustomerEmail,
                        Customers.ContactNumber AS CustomerContactNo,
                        Reservations.FromDate AS FromDate,
                        Reservations.ToDate AS ToDate,
                        Rooms.Name AS RoomName,
                        Reservations.RoomCount AS RoomCount,
                        Reservations.TransactionId AS TransactionId
                    FROM
                        Reservations
                    JOIN Customers ON Reservations.CustomerId = Customers.Id
                    JOIN Rooms ON Reservations.RoomId = Rooms.Id
                    JOIN Hotels ON Rooms.HotelId = Hotels.Id
                    WHERE
                        Hotels.Id = ${Id};
                `;
                const reservations = await this.#db.runNativeGetAllQuery(query);
                if (!reservations || reservations.length === 0) {
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