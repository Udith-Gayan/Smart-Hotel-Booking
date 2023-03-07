const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const businessConfigurations = require('../settings.json').businessConfigurations;
const constants = require("./constants")
const { SqliteDatabase } = require("../services.base/sqlite-handler")


class RoomService {

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
                case constants.RequestSubTypes.CREATE_ROOM:
                    return await this.#createRoom();
                    break;
                case constants.RequestSubTypes.EDIT_ROOM:
                    return this.#editRoom();
                    break;
                case constants.RequestSubTypes.DELETE_ROOM:
                    return await this.#deleteRoom();
                    break;
                case constants.RequestSubTypes.GET_ROOMS:
                    return await this.#getRooms();  // not yet implemented
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
    async #createRoom() {
        let response = {};
        // Frontend makes a transaction with the amount to the contract wallet. Then , sends the transaction id to the backend.  The contract here checks the transaction Amount to be validated and create a room.
        if (!(this.#message.data && this.#message.data.HotelId && this.#message.data.TransactionId))
            throw ("The required data missing for room creation.");

        const data = this.#message.data;

        // check if Hotelid exists
        let query = `SELECT * from Hotels WHERE Id = ${data.HotelId}`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (!res)
            throw ("Hotel not found.");
        if (res.IsRegistered == 0)
            throw ("Hotel is not registered.");


        // Trasaction Validity
        const txList = (await this.#xrplApi.getAccountTrx(res.HotelWalletAddress)).filter(t => t.TransactionType == "Payment");
        const paidTx = txList.find(tx => tx.hash == data.TransactionId);
        if (!paidTx)
            throw ("Invalid transaction hash.");

        if (Number(paidTx.Amount) < businessConfigurations.ROOM_CREATION_COST)
            throw ("Insuffcient amount paid for room creation.");



        // Save the Room Entity
        const roomEntity = {
            Name: data.Name,
            Description: data.Description,
            MaxRoomCount: data.MaxRoomCount,
            CostPerNight: data.CostPerNight,
            NoOfBeds: data.NoOfBeds,
            HotelId: data.HotelId
        }
        let roomId;
        if (await this.#db.isTableExists('Rooms')) {
            try {
                roomId = (await this.#db.insertValue('Rooms', roomEntity)).lastId;
            } catch (error) {
                throw (`Error occured in saving the room ${roomEntity.Name}`);
            }
        } else {
            throw ("Rooms table not found.");
        }

        // If RFacilityId is present, in each array object, get that and save to m2m tble
        // Otherwise, create a facility record and add it to the m2m table.
        if (data.Facilities && data.Facilities.length > 0) {
            for(const facility of data.Facilities) {
                let rFacilityId = 0;
                if(facility.RFacilityId && facility.RFacilityId > 0) {
                    rFacilityId = facility.RFacilityId;
                } 
                else {
                    // Save RFacility Entity
                    const rFacilityEntity = {
                        Name: facility.Name,
                        Description: facility.Description,
                        Status: constants.FacilityStatuses.AVAILABLE
                    }

                    if(await this.#db.isTableExists('RFacilities')) {
                        try {
                            rFacilityId = (await this.#db.insertValue('RFacilities', rFacilityEntity)).lastId;
                        } catch (error) {
                            throw(`Error occured in saving room Facility ${rFacilityEntity.Name} `);
                        }
                    } else {
                        throw(`Room Facility table not found.`);
                    }
                }

                
                // Save in the m2m table
                const roomFacilityEntity = {
                    RoomId: roomId,
                    RFacilityId: rFacilityId,
                    Quantity: facility.Quantity ?? 1
                }

                if(await this.#db.isTableExists('RoomFacilities')) {
                    try {
                        await this.#db.insertValue('RoomFacilities', roomFacilityEntity);
                    } catch (error) {
                        throw(`Error occured in saving Room-Facility ${roomFacilityEntity.RFacilityId} `);
                    }
                } else {
                    throw(`Room-Facility table not found.`);
                }
            }
        }

        response.success = { roomId: roomId }
        return response;
    }

    async #editRoom() {
        let response = {};

        if (!(this.#message.data && this.#message.data.RoomId && this.#message.data.NewData))
            throw ("Invalid Request.");

        const data = this.#message.data;

        // check if RoomId exists
        let query = `SELECT * from Rooms WHERE Id = ${data.RoomId}`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (!res)
            throw ("Room not found.");
        
        try {
            await this.#db.updateValue('Rooms', data.NewData, { Id: data.RoomId }); 
        } catch (error) {
            console.log(error);
            throw("Error occured in updating the room table.");
        }

        response.success = { roomId: res.Id };
        return response;
    }

    async #deleteRoom() {
        let response = {};

        if(!(this.#message.data && this.#message.data.RoomId ))
            throw("Invalid Request.");
        
        const data = this.#message.data;
        // check if RoomId exists
        let query = `SELECT * from Rooms WHERE Id = ${data.RoomId}`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (!res)
            throw ("Room not found.");
    
        try {
            await this.#db.deleteValues('RoomFacilities', {RoomId: data.RoomId});
            await this.#db.deleteValues('Rooms', {Id: data.RoomId});
        } catch (error) {
            console.log(error);
            throw("Error in deleting the room.")
        }

        response.success = "Room successfullt removed."
        return response;
    }

    async #getRooms() {

    }

}


module.exports = {
    RoomService
}