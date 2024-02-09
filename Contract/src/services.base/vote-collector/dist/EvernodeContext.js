"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("./Context");
const multi_sign_1 = require("./multi-sign");
const vote_electors_1 = require("./vote-electors");
const evernode = require("evernode-js-client");
class EvernodeContext extends Context_1.default {
    constructor(hpContext, options = {}) {
        super(hpContext, options);
        this.xrplApi = new evernode.XrplApi('wss://hooks-testnet-v3.xrpl-labs.com');
    }
    getSequenceNumber(address, timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            const xrplAcc = new evernode.XrplAccount(address, { xrplApi: this.xrplApi });
            yield this.xrplApi.connect();
            try {
                // Decide a sequence number to send the same transaction from all the nodes.
                const sequence = yield xrplAcc.getSequenceNumber();
                const sequences = (yield this.vote(`transactionInfo${this.hpContext.timestamp}`, [sequence], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout))).map(ob => ob.data);
                return sequences.sort()[0];
            }
            finally {
                yield this.xrplApi.disconnect();
            }
        });
    }
    /**
     * Set the provided signer list to the master account and disable the master key if necessary. If provided signer lsi is empty, it generates xrpl accounts for each node and set all those accounts as the signer list of the master key.
     * @param quorum Signer quorum
     * @param secret Secret of the master account
     * @param signerList (optional) Signer list for the master account
     * @param timeout  (optional)
     * @param disableMasterKey (optinal) Whether to disable the master key after setting the signr list. Defaults to false.
     */
    prepareMultiSigner(quorum, secret, signerList = [], timeout = 1000, disableMasterKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const multiSigner = new multi_sign_1.MultiSigner(null, secret);
            yield this.xrplApi.connect();
            try {
                // Generate and collect signer list if signer list isn't provided.
                if (!signerList || !signerList.length) {
                    const signerAddress = multiSigner.generateSigner();
                    const addressList = (yield this.vote(`multiSigner${this.hpContext.timestamp}`, [signerAddress], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout))).map(ob => ob.data);
                    signerList = addressList.map(addr => ({ account: addr, weight: 1 }));
                }
                // Configure multisig for the account.
                yield multiSigner.setSignerList(quorum, signerList, yield this.getSequenceNumber(multiSigner.masterAcc.address));
                if (disableMasterKey)
                    yield multiSigner.disableMasterKey(yield this.getSequenceNumber(multiSigner.masterAcc.address));
            }
            finally {
                yield this.xrplApi.disconnect();
            }
        });
    }
    /**
     * Submit a transaction with multi signs.
     * @param address Address of the master account
     * @param transaction Transaction object
     * @param timeout (optional) Defaults to 2000 in ms
     */
    submitTransaction(address, transaction, timeout = 2000) {
        return __awaiter(this, void 0, void 0, function* () {
            const multiSigner = new multi_sign_1.MultiSigner(address, null);
            yield this.xrplApi.connect();
            try {
                const signerListInfo = yield multiSigner.getSignerList();
                transaction.Sequence = yield this.getSequenceNumber(multiSigner.masterAcc.address);
                // Sign the transaction and collect the signed blob list.
                const signed = multiSigner.sign(transaction);
                const signedBlobs = (yield this.vote(`sign${this.hpContext.timestamp}`, [{ blob: signed, account: multiSigner.signerAcc.address }], new multi_sign_1.MultiSignedBlobCollector(this.hpContext.npl.count, signerListInfo, timeout)))
                    .map(ob => ob.data);
                // Submit the signed blobs.
                yield multiSigner.submitSignedBlobs(signedBlobs.map(sb => sb.blob));
            }
            finally {
                yield this.xrplApi.disconnect();
            }
        });
    }
}
exports.default = EvernodeContext;
