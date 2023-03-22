const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const constants = require("./constants")
const { SqliteDatabase } = require("../services.base/sqlite-handler");
const { default: DateHelper } = require('../services.helpers/dateHelper');
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
                case constants.RequestSubTypes.IS_REGISTERED_HOTEL:
                    return await this.#isRegisteredHotel();
                case constants.RequestSubTypes.SEARCH_HOTELS_WITH_ROOM:
                    return await this.#getHotelsWithRoomSearch();
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

    /**
     * 
     * @returns {hotel fields....} || null
     */
    async #isRegisteredHotel() {
        let response = {};
        if (!(this.#message.data && this.#message.data.HotelWalletAddress))
            throw ("Invalid request.");

        let query = `SELECT * FROM Hotels WHERE HotelWalletAddress = '${this.#message.data.HotelWalletAddress}' AND IsRegistered = 1`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (res) {
            response.success = res;
        } else {
            response.success = null;
        }

        return response;
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

        // Saving to thequery HFacilities table
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
            if (res && res.length > 0)
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

        response.success = { hotelId: rowId }
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
        let query = `SELECT Hotels.Id, Hotels.HotelWalletAddress, Hotels.HotelNftId, Hotels.OwnerName, Hotels.Name, Hotels.Description, Hotels.AddressLine1, Hotels.AddressLine2, Hotels.City, Hotels.DistanceFromCenter, Hotels.Email, Hotels.ContactNumber1,
                              Images.Id AS ImageId, Images.Url, HotelHFacilities.HFacilityId AS FacilityId
                       FROM Hotels
                       LEFT OUTER JOIN Images
                       ON Hotels.Id = Images.HotelId
                       LEFT OUTER JOIN HotelHFacilities
                       ON Hotels.Id = HotelHFacilities.HotelId
                       WHERE Hotels.IsRegistered = 1 `;  // Ending space is required



        let filterString = "AND ";
        let filters = null;
        if (this.#message.filters) {
            filters = this.#message.filters;

            // join to a string
            for (const key in filters) {
                filterString += `Hotels.${key}=${filters[key]} AND `;
            }
            filterString = filterString.slice(0, -5);
            query = query + filterString;
        }

        let response = {};

        const hotels = await this.#db.runNativeGetAllQuery(query);

        // Creating new object array
        const hotelList = [];
        const hotelNames = [...new Set(hotels.map(h => h.Id))];
        for (let idx in hotelNames) {
            const newHotel = {};
            const imgObjects = [];
            const facilityIds = [];

            (hotels.filter(h => h.Id == hotelNames[idx])).forEach((h, idxx) => {
                if (idxx == 0) {
                    newHotel.Id = h.Id;
                    newHotel.Name = h.Name;
                    newHotel.HotelWalletAddress = h.HotelWalletAddress;
                    newHotel.HotelNftId = h.HotelNftId;
                    newHotel.OwnerName = h.OwnerName;
                    newHotel.Description = h.Description;
                    newHotel.City = h.City;
                    newHotel.AddressLine1 = h.AddressLine1;
                    newHotel.AddressLine2 = h.AddressLine2;
                    newHotel.DistanceFromCenter = h.DistanceFromCenter;
                    newHotel.Email = h.Email;
                    newHotel.ContactNumber1 = h.ContactNumber1;
                    newHotel.ContactNumber2 = h.ContactNumber2 ?? null;
                }

                if (h.ImageId && h.Url) {
                    imgObjects.push({ Id: h.ImageId, Url: h.Url });
                }

                if (h.FacilityId) {
                    facilityIds.push(h.FacilityId);
                }
            });

            newHotel.Images = [...new Map(imgObjects.map((m) => [m.Id, m])).values()];
            newHotel.Facilities = [...new Set(facilityIds)];

            hotelList.push(newHotel);

        }

        response.success = { hotelList: hotelList };
        return response;
    }

    async #getHotelsWithRoomSearch() {
        const response = {};
        if (!this.#message.filters) {
            throw ("Invalid request.");
        }
        const filters = this.#message.filters;

        // Assumption : ( no of  people = no of rooms required)
        const necessaryRoomCount = this.#message.filters.PeopleCount;

        const fromDateFilter = new Date(filters.checkInDate);
        const toDateFilter = new Date(filters.CheckOutDate);
        const filteringDateRange = DateHelper.getDatesArrayInBewtween(fromDateFilter, toDateFilter);


        let query = `SELECT * FROM Hotels WHERE City = '${filters.City}'`;
        let hotelRows = await this.#db.runNativeGetAllQuery(query);
        if (!(hotelRows && hotelRows.length > 0)) {
            response.success = { searchResult: null };
            return response;
        }
        let hotelIdList = hotelRows.map(hr => hr.Id);

        query = `SELECT * FROM Rooms WHERE HotelId IN ${hotelIdList}`;
        const roomsList = await this.#db.runNativeGetAllQuery(query);
        if (!roomsList || roomsList.length < 1) {
            response.success = { searchResult: null };
            return response;
        }
        hotelIdList = [...new Set(roomsList.map(rl => rl.HotelId))];
        hotelRows = hotelRows.filter(hr => hotelIdList.includes(hr.Id));
        let roomIdList = roomsList.map(rl => rl.Id);

        query = `SELECT * from Reservations WHERE RoomId IN ${roomIdList}`;
        const reservationList = await this.#db.runNativeGetAllQuery(query);

        if (!reservationList) {  // No reservation means, all the rooms are free for new reservations
            const resultList = await this.#prepareSearchResultPhase2(hotelRows, roomsList, filteringDateRange.length);
            response.success = { searchResult: resultList };
            return response;
        }

        // Filter avaialble roomList by checking the avaialble reservation dates

        // First, create an array of rooms  with their reservedDates and count as arrays.
        let availableRoomList = [];
        for (let room of roomsList) {
            let roomObj1 = { roomId: room.Id, maxRoomCount: room.MaxRoomCount, ...room, checkedDates: [], roomCounts: [] }
            const reservedDates = [];
            const reservedRoomCounts = [];
            reservationList.forEach(rv => {
                if (rv.RoomId == room.Id) {
                    reservedDates.push({ checkInDate: rv.FromDate, checkOutDate: rv.ToDate })
                    reservedRoomCounts.push(rv.RoomCount);
                }
            });
            roomObj1.checkedDates = reservedDates;
            roomObj1.roomCounts = reservedRoomCounts;
            availableRoomList.push(roomObj1);
        }

        // Second, loop the room objects and their reserved dates for availability check. 
        // If 
        const removingRoomIds = [];
        for (const idx in availableRoomList) {
            const roomObj = availableRoomList[idx];

            if (roomObj.checkedDates.length == 0) {
                continue;
            }

            for (let filterDate of filteringDateRange) {
                let reservedRoomCount = 0;
                for (const dateIdx in roomObj.checkedDates) {
                    const reservedRange = (roomObj.checkedDates)[dateIdx];
                    if (DateHelper.isDateInRange(filterDate, reservedRange.checkInDate, reservedRange.checkOutDate)) {
                        reservedRoomCount += (roomObj.roomCounts)[dateIdx];
                    }
                }

                if ((reservedRoomCount + necessaryRoomCount) > roomObj.maxRoomCount) {
                    removingRoomIds.push(roomId);
                }
            }
        }

        availableRoomList = availableRoomList.filter(ar => !removingRoomIds.includes(ar.roomId));

        hotelIdList = [...new Set(availableRoomList.map(rl => rl.HotelId))];
        hotelRows = hotelRows.filter(hr => hotelIdList.includes(hr.Id));
        const resultList = await this.#prepareSearchResultPhase2(hotelRows, availableRoomList, filteringDateRange.length);

        response.success = { searchResult: resultList };
        return response;
    }

    async #prepareSearchResultPhase2(hotelList, roomList, noOfDays = 0) {
        const resultList = [];

        for(const hotel of hotelList) {
            // Get one image url if exists for the hotel
            let query = `SELECT Id, Url FROM Images WHERE HotelId = ${hotel.Id}`;
            const img = await this.#db.runNativeGetFirstQuery(query);

            const hotelObj = {Id: hotel.Id, city: hotel.City, Name: hotel.Name, noOfDays: noOfDays,  roomDetails: []}
            if(img) {
                hotelObj.ImageUrl = img.Url;
            }
            roomList.forEach(r => {
                if(hotel.Id == r.HotelId) {
                    hotelObj.roomDetails.push(r);
                }
            });

            resultList.push(hotelObj);
        }
        return resultList;
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