import { RoomService } from "./services.domain/RoomService";
import { CustomerService } from "./services.domain/CustomerService";
import {ReservationService} from "./services.domain/ReservationService";

const { SqliteDatabase } = require("./services.base/sqlite-handler")
// const { TransactionService } = require('./transaction-service');
const { HotelService } = require('./services.domain/HotelService');
const settings = require('./settings.json').settings;
const constants = require("./services.domain/constants")

export class ApiService {

    dbPath = settings.dbPath;

    constructor() {
        this.db = new SqliteDatabase(this.dbPath);
    }

    async handleRequest(user, message, isReadOnly) {
        // TODO: Request Authentication and Authorization must be handled here before proceeding
        
    
        // this.#transactionService = new TransactionService(message);

        let result = {};
        
        if (message.type === constants.RequestTypes.HOTEL) {                                     //------------------- Hotel Related Api ------------------------------------
            result = await new HotelService(message).handleRequest();
        }
        else if (message.type === constants.RequestTypes.ROOM) {                                             //--------------------- Room related Api -----------------------
            result = await new RoomService(message).handleRequest();
        }
        else if (message.type === constants.RequestTypes.CUSTOMER) {                                            //------------------- Customer related Api --------------------------------------
            result = await new CustomerService(message).handleRequest();
        }
        else if (message.type === constants.RequestTypes.RESERVATION) {                                        //-------------------- Reservation related Api-------------------------
            result = await new ReservationService(message).handleRequest();
        }


        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, message.promiseId ? {promiseId: message.promiseId, ...result} : result);
        }
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }

}

// module.exports = {
//     ApiService
// }