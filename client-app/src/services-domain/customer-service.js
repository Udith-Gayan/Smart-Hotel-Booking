import ContractService from "../services-common/contract-service";
import XrplService from "../services-common/xrpl-service";
import SharedStateService from "./sharedState-service";

const constants = require('../constants');


export default class CustomerService {
  static instance = CustomerService.instance || new CustomerService();

  contractService = ContractService.instance;
  #xrplService = XrplService.xrplInstance;


  /**
   * Get all the registered hotels
   * @returns A list of objects of hotels || null
   */
  async getAllHotels() {
    const submitObject = {
      type: constants.RequestTypes.HOTEL,
      subType: constants.RequestSubTypes.GET_HOTELS,
      filters: {
        IsRegistered: 1
      }
    }
    try {
      const res = await this.contractService.submitReadRequest(submitObject);
      if(res.hotelList && res.hotelList.length > 0){
        return res.hotelList;
      } else {
        console.log("No hotels found.");
        return null;
      }
    }
    catch (error) {
      console.log(error);
      throw(error);
    }
  }
}

