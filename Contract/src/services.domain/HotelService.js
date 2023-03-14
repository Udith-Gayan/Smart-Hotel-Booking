const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const constants = require("./constants")
const { SqliteDatabase } = require("../services.base/sqlite-handler")
// import { RequestSubTypes } from 'constants';

class HotelService {

    #message = null;
    #contractAcc = null;
    #xrplApi = null;
    #db = null;
    #registrationURIPrefix = 'HotelReg';
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
                case constants.RequestSubTypes.REQUEST_TOKEN_OFFER:
                    return await this.#registerHotel();
                case constants.RequestSubTypes.REGISTRATION_CONFIRMATION:
                    return await this.#confirmHotelRegistration();
                case constants.RequestSubTypes.GET_HOTELS:
                    return await this.#getHotels();
                case constants.RequestSubTypes.DEREG_HOTEL:
                    return await this.#deregisterHotel();
                case constants.RequestSubTypes.RATE_HOTEL:
                    return await this.#rateHotel();
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

    async #registerHotel() {
        const response = { success: null };

        const data = this.#message.data;

        const hotelEntity = {
            HotelWalletAddress: data.HotelWalletAddress,
            HotelNftId: "",
            OwnerName: data.OwnerName,
            Name: data.Name,
            Description: data.Description,
            AddressLine1: data.AddressLine1,
            AddressLine2: data.AddressLine2,
            City: data.City,
            DistanceFromCenter: data.DistanceFromCenter,
            Email: data.Email,
            ContactNumber1: data.ContactNumber1,
            ContactNumber2: data.ContactNumber2,
            IsRegistered: 0
        }

        //Serch for a free offer
        const availableOffer = await this.#getAnAvailableOffer();
        if (availableOffer != null) {
            hotelEntity.HotelNftId = availableOffer.NFTokenID;

        } else {
            throw ('No available offer for registration.');
        }

        // Saving to the hotel table
        let insertedId;
        if (await this.#db.isTableExists('Hotels')) {
            try {
                insertedId = (await this.#db.insertValue('Hotels', hotelEntity)).lastId;

            } catch (e) {
                throw (`Error occured in hotel registration: ${e}`)
            }
        } else {
            throw ('Table "Hotels" not found.')
        }

        // Saving to the image table
        if (data.ImageUrls && data.ImageUrls.length > 0) {
            for (const url of data.ImageUrls) {
                const imageEntity = {
                    HotelId: insertedId,
                    Url: url
                }

                if (await this.#db.isTableExists('Images')) {
                    try {
                        await this.#db.insertValue('Images', imageEntity);
                    } catch (error) {
                        throw (`Error occured in image saving: ${e}`);
                    }
                } else {
                    throw ('Image table not found.');
                }
            }
        }

        // Saving to the HFacilities table
        if (data.Facilities && data.Facilities.length > 0) {
            for (const facility of data.Facilities) {
                // let facilityId = 0;
                // const facilityEntity = {
                //     Name: facility.Name,
                //     Description: facility.Description,
                //     Status: constants.FacilityStatuses.AVAILABLE
                // }

                // if (await this.#db.isTableExists('HFacilities')) {
                //     try {
                //         facilityId = (await this.#db.insertValue('HFacilities', facilityEntity)).lastId;
                //     } catch (error) {
                //         throw (`Error occured in saving hotel facility ${facility.Name} : ${e}`);
                //     }
                // } else {
                //     throw ('HFacility table not found.');
                // }

                // Saving to M2M table Hotel-Facilities table
                const hotelHfacilityEntity = {
                    HotelId: insertedId,
                    HFacilityId: facility.Id
                }

                if (await this.#db.isTableExists('HotelHFacilities')) {
                    try {
                        await this.#db.insertValue('HotelHFacilities', hotelHfacilityEntity);
                    } catch (error) {
                        throw (`Error occured in saving creating M2M table Hotel and Facilities : ${e}`);
                    }
                } else {
                    throw ('HotelHFacility table not found.');
                }

            }

        }

        response.success = { rowId: insertedId, offerId: availableOffer.index }
        return response;
    }
    
    async #checkIfHotelExists(walletAddress) {
        const query = `SELECT * FROM HOTELS WHERE HotelWalletAddress = ?`;
        try {
            const res = await this.#db.runNativeGetFirstQuery(query, [walletAddress]);
            if(res && res.length > 0)
                return res;
            else
                return null;
        } catch (error) {
            throw error;
        }
    }


    async #getAnAvailableOffer() {
        try {
            const createdOffers = await this.#contractAcc.getNftOffers();

            let rows = await this.#db.getValues("Hotels", null);
            if (rows.length > 0 && createdOffers && createdOffers.length > 0) {
                let takenNfts = rows.map(r => r.HotelNftId);

                const availableOffers = createdOffers.filter(co => !takenNfts.includes(co.NFTokenID));
                return availableOffers.length == 0 ? null : availableOffers[0];
            }
            else if (createdOffers && createdOffers.length > 0) {
                return createdOffers[0];
            }

            return null;

        } catch (error) {
            throw error;
        }
    }

    async #confirmHotelRegistration() {
        const rowId = this.#message.data.rowId;
        const walletAddress = this.#message.data.hotelWalletAddress;

        let response = {};

        const rows = await this.#db.getValues("Hotels", { Id: rowId });
        if (rows.length != 0) {
            const regNftId = rows[0].HotelNftId;

            // Check for reg nft existence in the account(If nft acceptance is successful)
            if (!(await this.#isNftExists(walletAddress, regNftId)))
                throw ('Registration Nft is absent.');

            await this.#db.updateValue("Hotels", { IsRegistered: 1, HotelWalletAddress: walletAddress }, { Id: rowId });
        } else {
            throw ("Error in confirming registration. Re-register please.");
        }

        response.success = 'Hotel Registration Successful.'
        return response;
    }

    async #isNftExists(walletAddress, nftId) {
        const acc = new evernode.XrplAccount(walletAddress, null, { xrplApi: this.#xrplApi });
        try {
            const nfts = await acc.getNfts();
            return nfts.find(t => t.NFTokenID == nftId);
        } catch (error) {
            throw (error);
        }
        finally {
        }

    }

    async #getHotels() {
        let query = `SELECT Hotels.Id, Hotels.HotelWalletAddress, Hotels.HotelNftId, Hotels.OwnerName, Hotels.Name, Hotels.Description, Hotels.AddressLine1, Hotels.AddressLine2, Hotels.City, Hotels.DistanceFromCenter, Hotels.Email, Hotels.ContactNumber1, Hotels.ContactNumber2,
                              Images.Id AS ImageId, Images.Url
                       FROM Hotels
                       LEFT OUTER JOIN Images
                       ON Hotels.Id = Images.HotelId 
                       WHERE Hotels.IsRegistered = 1 `



        let filters = null;
        if (this.#message.filters) {
            filters = this.#message.filters;
        }

        let response = {};

        const hotels = await this.#db.runNativeGetAllQuery(query);


        response.success = { hotelList: hotels };
        return response;
    }

    async #deregisterHotel() {
        let response = {};

        if (!this.#message.data.HotelNftId)
            throw ("HotelNftId is absent in the request");

        const query = `SELECT HotelNftId FROM Hotels WHERE HotelNftId = "${this.#message.data.HotelNftId}"`;
        const row = await this.#db.runNativeGetFirstQuery(query);
        if (!row)
            throw ("The relevant Hotel token Id not found.");

        // burn the record
        await this.#contractAcc.burnNft(row.HotelNftId, row.HotelWalletAddress);

        // Delete the record
        await this.#db.deleteValues('Hotels', { HotelNftId: row.HotelNftId });

        response.success = `Hotel ${row.Name} deregistered successfully.`;
        return response;
    }

    async #rateHotel() {
        let response = {};
        if (!(this.#message.data && this.#message.data.HotelId && this.#message.data.CustomerId))
            throw ("Invalid Request.");
        const data = this.#message.data;

        // Thnking the hotelId and CustomerId records exists
        const rateEntity = {
            RatingScore: data.RatingScore,
            CustomerId: data.CustomerId,
            HotelId: data.HotelId,
            RatingDate: data.RatingDate
        }

        let rateId;
        if (await this.#db.isTableExists('Ratings')) {
            rateId = (await this.#db.insertValue('Ratings', rateEntity)).lastId;
        } else {
            throw ("Ratings table not found.")
        }

        response.success = { rateId: rateId };
        return response;
    }


}



module.exports = {
    HotelService
}