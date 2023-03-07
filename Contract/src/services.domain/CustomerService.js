const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;
const businessConfigurations = require('../settings.json').businessConfigurations;
const constants = require("./constants")
const { SqliteDatabase } = require("../services.base/sqlite-handler")


class CustomerService {

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
                case constants.RequestSubTypes.CREATE_CUSTOMER:
                    return await this.#createCustomer();
                    break;
                case constants.RequestSubTypes.EDIT_CUSTOMER:
                    return this.#editCustomer();
                    break;
                case constants.RequestSubTypes.DELETE_CUSTOMER:
                    return await this.#deleteCustomer();
                    break;
                case constants.RequestSubTypes.GET_CUSTOMERS:
                    return await this.#getCustomers();  // not yet implemented
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
    async #createCustomer() {
        let response = {};
      
    }

    async #editCustomer() {
        let response = {};

       
    }

    async #deleteCustomer() {
        let response = {};

    }

    async #getCustomers() {

    }

}


module.exports = {
    RoomService
}