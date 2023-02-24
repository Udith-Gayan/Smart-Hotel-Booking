// import evernode from 'evernode-js-client';
const evernode = require('evernode-js-client')
const settings = require('../settings.json').settings;

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
                case RequestSubTypes.REQUEST_TOKEN_OFFER:
                    return await this.#registerHotel();
                    break;
                case RequestSubTypes.REGISTRATION_CONFIRMATION:
                    return this.#confirmHotelRegistration();
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

    async #registerHotel() {
        const response = { success: null };

        const data = this.#message.data;

        const hotelEntity = {
            HotelWalletAddress: data.HotelWalletAddress,
            HotelNftId: "",
            OwnerName: data.OwnerName,
            Name: data.Name,
            AddressLine1: data.AddressLine1,
            AddressLine2: data.AddressLine2,
            DistanceFromCenter: data.DistanceFromCenter,
            Email: data.Email,
            ContactNumber1: data.ContactNumber1,
            ContactNumber2: data.ContactNumber2,
            IsRegistered: 0
        }

        //Serch for a free offer
        const availableOffer = await this.#getAnAvailableOffer();
        console.log('Avaialble offer: ');
        console.log(availableOffer);
        if (availableOffer != null) {
            hotelEntity.HotelNftId = availableOffer.NFTokenID;

        } else {
            throw ('No available offer for registration.');
        }

        // Saving to the hotel table
        let insertedId;
        if (await this.#db.isTableExists('Hotels')) {
            try {
                insertedId = (await this.#db.insertValue('Hotels', data)).lastId;

            } catch (e) {
                console.log(`Error occured in hotel registration: ${e}`);
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

        response.success = { rowId: insertedId, offerId: availableOffer.index }
    }

    async #getAnAvailableOffer() {
        try {
            const createdOffers = await this.#contractAcc.getNftOffers();
            console.log(createdOffers);

            let rows = await this.#db.getValues("Hotels", null);
            let takenNfts = rows.map(r => r.HotelNftId);

            const availableOffers = createdOffers.filter(co => !takenNfts.includes(co.NFTokenID));
            return availableOffers.length == 0 ? null : availableOffers[0];

        } catch (error) {
            throw error;
        }
    }

    async #confirmHotelRegistration() {
        const rowId = this.#message.data.rowId;
        const walletAddress = this.#message.data.hotelWalletAddress;

        let response = {};

        const rows = await this.#db.getValues("Hotels", { id: rowId });
        if (rows.length != 0) {
            const regNftId = rows[0].HotelNftId;

            // Check for reg nft existence in the account(If nft acceptance is successful)
            if (!this.#isNftExists(walletAddress, regNftId))
                throw ('Registration Nft is absent.');

            await this.#db.updateValue("Hotels", { isRegistered: 1, hotelWalletAddress: walletAddress }, { id: rowId });

        } else {
            throw ("Error in confirming registration. Re-register please.");
        }
        response.success = 'Hotel Registration Successful.'


        return response;
    }

    async #isNftExists(walletAddress, nftId) {
        const acc = new evernode.XrplAccount(walletAddress);
        const nfts = await acc.getNfts();
        return nfts.find(t => t.NFTokenID == nftId);
    }


}



module.exports = {
    HotelService
}