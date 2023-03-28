import ContractService from "../services-common/contract-service";
import XrplService from "../services-common/xrpl-service";
import SharedStateService from "./sharedState-service";


const constants = require('./../constants');
const contractWalletAddress = process.env.REACT_APP_CONTRACT_WALLET_ADDRESS;
const roomCreationCost = process.env.REACT_APP_ROOM_CREATION_COST;

export default class HotelService {
    static instance = HotelService.instance || new HotelService();

    #registrationURI = "SMBOOKING";

    contractService = ContractService.instance;
    #xrplService = XrplService.xrplInstance;


    async createNewHotelWallet() {
        const newHotelWallet = await this.#xrplService.createNewFundedUserWallet();
        SharedStateService.instance.hotelWallet = newHotelWallet;
        return newHotelWallet;
    }


    /**
     *
     * @param {string} seed
     * @returns | hotelWallet object || null
     */
    async generateHotelWallet(seed) {
        const hotelWallet = this.#xrplService.generateWalletFromSeed(seed);
        // Validate if a registered hotel
        const resObj = {
            type: constants.RequestTypes.HOTEL,
            subType: constants.RequestSubTypes.IS_REGISTERED_HOTEL,
            data: {
                HotelWalletAddress: hotelWallet.address
            }
        }
        const res = await this.contractService.submitReadRequest(resObj);

        if (res && res.Id && res.Id > 0) {
            localStorage.setItem("seed", hotelWallet.seed);
            SharedStateService.instance.currentHotelId = res.Id;
            SharedStateService.instance.hotelWallet = hotelWallet;
            return res;
        } else {
            // if the hotel is not registered
            return null;
        }
    }


    /**
     *
     * @param {object} data | Object with hotel details
     * @returns true | false
     */
    async registerHotel(data) {
        const submitObject = {
            type: constants.RequestTypes.HOTEL,
            subType: constants.RequestSubTypes.REQUEST_TOKEN_OFFER,
            data: data
        }

        let result;
        try {
            result = await this.contractService.submitInputToContract(submitObject);
            // result: { {"rowId":4,"offerId":"266BF70C1E820CCD8597B99B1A31E682E7E883D4C0C2385CE71A3405C180DF79"} }
            console.log(result);

            SharedStateService.instance.currentHotelId = result.rowId;
            //accepting the NFT offer...
            result = await this.#acceptHotelRegistrationOffer(result);
        } catch (error) {
            console.log(error);
            throw error;
        }

        return result;
    }


    /**
     *
     * @param {object} resObject | {rowId, offerId}
     * @returns {hotelId: 1} | false
     */
    async #acceptHotelRegistrationOffer(resObject) {
        let result;
        try {
            result = await this.#xrplService.acceptNftOffer(SharedStateService.instance.hotelWallet.seed, resObject.offerId);
            if (result !== "tesSUCCESS")
                throw ("Hotel Registration offer not accepted successfully.");

            const submitObject = {
                type: constants.RequestTypes.HOTEL,
                subType: constants.RequestSubTypes.REGISTRATION_CONFIRMATION,
                data: {
                    hotelWalletAddress: SharedStateService.instance.hotelWallet.address,
                    rowId: resObject.rowId
                }
            }

            result = await this.contractService.submitInputToContract(submitObject);
        } catch (error) {
            throw (error);
        }

        if (result.hotelId && result.hotelId > 0)
            return result;
        else
            return false;

    }

    /**
     *
     * @returns An hotel object || null
     */
    async getMyHotel(id) {
        const submitObject = {
            type: constants.RequestTypes.HOTEL,
            subType: constants.RequestSubTypes.GET_HOTELS,
            filters: {
                Id: id
            }
        }
        try {
            const res = await this.contractService?.submitReadRequest(submitObject);
            if (res.hotelList && res.hotelList.length > 0) {
                return res.hotelList[0];
            } else {
                console.log("No hotel found.");
                return null;
            }
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }


    /**
     *
     * @param {Object} filterObj
     * @returns An array of objects || []
     */
    async getRoomHotelList(filterObj) {
        const submitObject = {
            type: constants.RequestTypes.HOTEL,
            subType: constants.RequestSubTypes.SEARCH_HOTELS_WITH_ROOM,
            filters: filterObj
        }

        try {
            console.log(submitObject)
            const res = await this.contractService.submitReadRequest(submitObject);
            if (res && res.searchResult && res.searchResult.length > 0) {
                console.log(res.searchResult)
                return res.searchResult;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    /**
     *
     * @param {number} hotelId | Hotel Id
     * @returns | An array of rooms || []
     */
    async getMyHotelRoomList(hotelId) {
        const submitObject = {
            type: constants.RequestTypes.ROOM,
            subType: constants.RequestSubTypes.GET_ROOMS_BY_HOTELID,
            filters: {HotelId: hotelId}
        };

    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  }

  async getSingleHotelWithRooms(hotelId, fromDateStr, toDateStr, roomCount) {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_SINGLE_HOTEL_WITH_ROOMS,
      filters: {
        HotelId: hotelId,
        CheckInDate: fromDateStr,
        CheckOutDate: toDateStr,
        RoomCount: roomCount
      }
    };

    let result;
    try {
      result = await this.contractService.submitReadRequest(submitObject);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result.searchResult;

  }

    /**
     *
     * @param {number} roomId |  roomId
     * @returns | A meessage string "Room deleted successfully."
     */
    async deleteMyRoom(roomId) {
        const submitObject = {
            type: constants.RequestTypes.ROOM,
            subType: constants.RequestSubTypes.DELETE_ROOM,
            data: {RoomId: roomId}
        };

        let result;
        try {
            result = await this.contractService.submitInputToContract(submitObject);
        } catch (error) {
            console.log(error);
            throw error;
        }
        return result;
    }

    /**
     *
     * @param {number} hotelId
     * @param {object} data |
     * @returns A object { roomId: 2}
     */
    async createRoom(hotelId, data) {
        const submitObject = {
            type: constants.RequestTypes.ROOM,
            subType: constants.RequestSubTypes.CREATE_ROOM,
            data: {
                HotelId: hotelId,
                ...data

            }
        }

        // make the transaction and set the transaction id to the object before sending
        const hotelSeed = localStorage.getItem("seed");
        const res = await this.#xrplService.makePayment(hotelSeed, roomCreationCost, contractWalletAddress);

        if (res.meta.TransactionResult === "tesSUCCESS") {
            submitObject.data.TransactionId = res.hash;
            let result;
            try {
                result = await this.contractService.submitInputToContract(submitObject);
                console.log(result)
            } catch (error) {
                console.log(error);
                throw error;
            }
            console.log(result)
            return result;

        } else {

        }
    }

  async makeReservation(data) {

    const submitData =  {
      CustomerId: data.CustomerId,
      FromDate: data.FromDate,
      ToDate: data.ToDate,
      CustomerDetails: data.CustomerDetails,
      RoomSelections: data.roomSelections  //  [  {roomId: 1, roomCount: 3, costPerRoom: 25, roomName: "" }, {roomId: 2, roomCount: 3, costPerRoom: 25} ]
    }
    if(data.payNow){
      const res = await this.#xrplService.makePayment(data.secret, data.totalFee.toString(), contractWalletAddress);
      if(res.meta.TransactionResult == "tesSUCCESS") {
        submitData.TransactionId = res.hash;
      }
    }

    const submitObj = {
      type: constants.RequestTypes.RESERVATION,
      subType: constants.RequestSubTypes.CREATE_RESERVATION,
      data: submitData
    }


        let result;
        try {
            // {lastReservationId: 34}
            result = await this.contractService.submitInputToContract(submitObj);
        } catch (e) {
            console.log(e);
            throw e;
        }

        return result
    }

    /**
     *
     * @param {Object} filterObj
     * @returns An array of objects || []
     */
    async getReservations(isCustomer, walletAddress) {
        const submitObject = {
            type: constants.RequestTypes.RESERVATION,
            subType: constants.RequestSubTypes.GET_RESERVATIONS,
            filters: {
                "Filters": {
                    "walletAddress": walletAddress,
                    "isCustomer": isCustomer
                }
            }
        }

        try {
            const res = await this.contractService.submitReadRequest(submitObject);
            if (res && res.reservationList && res.reservationList.length > 0) {
                return res.reservationList;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
}

