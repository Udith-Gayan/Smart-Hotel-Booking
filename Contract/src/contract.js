const HotPocket = require("hotpocket-nodejs-contract");
const { ApiService } = require('./api-controller');
const { DbService } = require("./services.base/dbService");

// import process from 'process'
const booking_contract = async (ctx) => {
    console.log('Hotel Reservation Smart Contract is running.');
    const isReadOnly = ctx.readonly;

    const apiService = new ApiService();
    await DbService.initializeDatabase();


    for (const user of ctx.users.list()) {

        // Loop through inputs sent by each user.
        for (const input of user.inputs) {
            // Read the data buffer sent by user (this can be any kind of data like string, json or binary data).
            const buf = await ctx.users.read(input);

            // Let's assume all data buffers for this contract are JSON.
            const message = JSON.parse(buf);

            // Pass the JSON message to our application logic component.
            await apiService.handleRequest(user, message, isReadOnly);

        }

    }
}


const hpc = new HotPocket.Contract();
hpc.init(booking_contract);