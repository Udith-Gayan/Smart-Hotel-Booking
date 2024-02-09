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
        this.#xrplApi = new evernode.XrplApi('wss://hooks-testnet-v3.xrpl-labs.com');
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
        if (!(this.#message.data && this.#message.data.Name && this.#message.data.ContactNumber && this.#message.data.Email && this.#message.data.WalletAddress))
            throw ("Invalid Request.");

        const data = this.#message.data;
        const customerEntity = {
            Name: data.Name,
            Email: data.Email,
            ContactNumber: data.ContactNumber,
            WalletAddress: data.WalletAddress
        }

        let customerId;
        if (await this.#db.isTableExists('Customers')) {
            try {
                customerId = (await this.#db.insertValue('Customers', customerEntity)).lastId;
            } catch (error) {
                throw (`Error in saving the customer ${customerEntity.Name}`);
            }
        }
        else {
            throw ('Customer table not found.');
        }

        response.success = { customerId: customerId };
        return response;

    }

    async #editCustomer() {
        let response = {};

        if (!(this.#message.data && this.#message.data.CustomerId && this.#message.data.NewData))
            throw ("Invalid Request.");

        const data = this.#message.data;
        let query = `SELECT * FROM Customers WHERE Id=${data.CustomerId}`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (!res)
            throw (`Customer not found.`);

        try {
            await this.#db.updateValue('Customers', data.NewData, { Id: res.Id })
        } catch (error) {
            console.log(error);
            throw (`Error occured in updating customer ${res.Id}`);
        }

        response.success = { customerId: res.Id };
        return response;

    }

    async #deleteCustomer() {
        let response = {};
        if (!(this.#message.data && this.#message.data.CustomerId))
            throw ("Invalid Request.");
        
        const data = this.#message.data;
        let query = `SELECT * FROM Customers WHERE Id=${data.CustomerId}`;
        const res = await this.#db.runNativeGetFirstQuery(query);
        if (!res)
            throw (`Customer not found.`);
            
        try {
            await this.#db.deleteValues('Customers', data.CustomerId)
        } catch (error) {
          console.log(error);
          throw("Error in deleting customer");
        }

        response.success = "Customer removed successfully.";
        return response;
    }

    async #getCustomers() {

    }

}


module.exports = {
    CustomerService
}