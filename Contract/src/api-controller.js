const { SqliteDatabase } = require("./services.base/sqlite-handler")
// const { TransactionService } = require('./transaction-service');
const { HotelService } = require('./services.domain/HotelService');
const settings = require('./settings.json').settings;

export class ApiService {

    dbPath = settings.dbPath;
    #transactionService = null;

    constructor() {
        this.db = new SqliteDatabase(this.dbPath);
    }

    async handleRequest(user, message, isReadOnly) {

        // TODO: Request Authentication and Authorization must be handled here before proceeding
        
        
        
        this.db.open();
        // this.#transactionService = new TransactionService(message);

        let result = {};
    
        if (message.type == RequestTypes.HOTEL_REGISTRATION) {                                     //------------------- Register Hotel (hotelRegRequest, hotelRegConfirm) ------------------------------------
            result = await new HotelService(message).handleRequest();
        }
        // else if (message.type == 'getHotels') {                                             //---------------------Get hotels(with filters)-----------------------
        //     result = await this.#transactionService.getHotels();
        // }
        // else if (message.type == 'createRoom') {                                            //------------------- Create Room --------------------------------------
        //     result = await this.#transactionService.createRoom();
        // }
        // else if (message.type == 'getRoomsByHotel') {                                        //-------------------- Get rooms of a hotel-------------------------
        //     const hotelId = message.data.hotelId;
        //     result = await this.#transactionService.getRoomsByHotel(hotelId);
        // }
        // else if (message.type == 'makeBooking') {                                        //--------------------Make a booking-----------------------------
        //     result = await this.#transactionService.makeReservation(user.publicKey);
        // }
        // else if (message.type == 'getAllBookings') {                                     //------------------ Get all bookings (with filters)----------------------------------
        //     result = await this.#transactionService.getAllBookings();
        // }
        // else if (message.type == 'getAllBookingsByUser') {                                     //------------------ Get all bookings of a User----------------------------------
        //     result = await this.#transactionService.getAllBookings(user.publicKey);
        // }
        // else if (message.type == 'transactions') {                                      //---------------------- Transaction Handler----------------------------
        //      result = await this.#transactionService.handleTransaction();
        // }

        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, {promiseId: message.promiseId, ...result});
        }

        this.db.close();
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }

}

// module.exports = {
//     ApiService
// }