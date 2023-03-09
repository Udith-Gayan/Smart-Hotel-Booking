const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const businessConfigurations = require('../settings.json').businessConfigurations;
const constants = require("./constants")
const { SqliteDatabase } = require("../services.base/sqlite-handler")


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
        this.#contractAcc = new evernode.XrplAccount(settings.contractWalletAddress, settings.contractWalletSecret, { xrplApi: this.#xrplApi });
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
                    return await this.#getReservations();  // not yet implemented
                    break;
                default:
                    throw ("Invalid Request");
            }

        } catch (error) {
            return { error: error }
        } finally {
            await this.#xrplApi.disconnect();
            this.#db.close();
        }
    }

    // Create a Room
    async #createReservation() {
        let response = {};
        if (!(this.#message.data && this.#message.data.RoomId && this.#message.data.CustomerId && this.#message.data.TransactionId))
            throw ("Invalid Request.");

        const data = this.#message.data;
        const noOfDays = this.countDaysInBetween(data.FromDate, data.ToDate);

        const query = `SELECT * FROM Rooms WHERE Id=${data.RoomId}`;
        const room = await this.#db.runNativeGetFirstQuery(query);
        const expectedCost = noOfDays * room.CostPerNight * data.RoomCount;

        //Get transaction amount
        const txList = (await this.#xrplApi.getAccountTrx(settings.contractWalletAddress)).filter(t => t.TransactionType == "Payment");
        const paidTx = txList.find(tx => tx.hash == data.TransactionId);

        if (!paidTx)
            throw ("Invalid transaction hash.");

        if (Number(Number(paidTx.Amount)) < expectedCost)
            throw ("Insuffcient amount paid for room reservation.");
        
        const reservationEntity = {
            RoomId: data.RoomId,
            RoomCount: data.RoomCount,
            CustomerId: data.CustomerId,
            FromDate: data.FromDate,
            ToDate: data.ToDate,
            Cost: Number(paidTx.Amount),
            TransactionId: data.TransactionId
        }

        let reservationId;
        if(await this.#db.isTableExists('Reservations')) {
            reservationId = (await this.#db.insertValue('Reservations', reservationEntity)).lastId;
        } else {
            throw("Reservation table not found.");
        }

        response.success = { reservationId: reservationId};
        return response;

    }


    async #deleteReservation() {
        let response = {};

        return response;
    }

    async #getReservations() {

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