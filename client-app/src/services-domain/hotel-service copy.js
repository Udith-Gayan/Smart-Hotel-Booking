import ContractService from "../services-common/contract-service";
import XrplService from "../services-common/xrpl-service";
import SharedStateService from "./sharedState-service";

const constants = require('./../constants');


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

  async generateHotelWallet(seed) {
    const hotelWallet = this.#xrplService.generateWalletFromSeed(seed);
    SharedStateService.instance.hotelWallet = hotelWallet;
    return hotelWallet;
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
   * @returns true | false
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

    if (result === "Hotel Registration Successful.")
      return true;
    else
      return false;

  }

  /**
   * 
   * @returns An hotel object || null
   */
  async getMyHotel() {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTELS,
      filters: {
        HotelWalletAddress: SharedStateService.instance.hotelWallet.address
      }
    }
    try {
      const res = await this.contractService.submitReadRequest(submitObject);
      if(res.hotelList && res.hotelList.length > 0){
        return res.hotelList[0];
      } else {
        console.log("No hotel found.");
        return null;
      }
    }
    catch (error) {
      console.log(error);
      throw(error);
    }
  }




}

