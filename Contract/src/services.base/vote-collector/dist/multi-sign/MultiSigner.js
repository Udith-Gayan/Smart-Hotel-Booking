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
const evernode = require("evernode-js-client");
const fs = require("fs");
const kp = require("ripple-keypairs");
const utils_1 = require("../utils");
class MultiSigner {
    constructor(address = null) {
        this.signer = null;
        this.xrplApi = new evernode.XrplApi();
        this.masterAcc = new evernode.XrplAccount(address, null, { xrplApi: this.xrplApi });
        this.keyPath = `../${this.masterAcc.address}.key`;
        if (fs.existsSync(this.keyPath)) {
            this.signer = utils_1.JSONHelpers.castToModel(JSON.parse(fs.readFileSync(this.keyPath).toString()));
            this.signerAcc = new evernode.XrplAccount(this.signer.account, this.signer.secret, { xrplApi: this.xrplApi });
        }
    }
    /**
     * Initialize multi signer object.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xrplApi.connect();
        });
    }
    /**
     * De-Initialize multi signer object.
     */
    deinit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.xrplApi.disconnect();
        });
    }
    getSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.masterAcc.getSequence();
        });
    }
    getMaxLedgerSequence() {
        return Math.ceil((this.xrplApi.ledgerIndex + 30) / 10) * 10; // Get nearest 10th
    }
    /**
     * Get the signer.
     * @returns Signer info.
     */
    getSigner() {
        return this.signer;
    }
    /**
     * Set the signer.
     * @param signer Signer to set.
    */
    setSigner(signer) {
        this.signer = signer;
        this.signerAcc = new evernode.XrplAccount(this.signer.account, this.signer.secret, { xrplApi: this.xrplApi });
        fs.writeFileSync(this.keyPath, JSON.stringify(utils_1.JSONHelpers.castFromModel(this.signer)));
    }
    /**
     * Generate a key for the node and save the node key in a file named by (../\<master address\>.key).
     * @returns Generated signer info.
     */
    generateSigner() {
        const nodeSecret = kp.generateSeed({ algorithm: "ecdsa-secp256k1" });
        const keypair = kp.deriveKeypair(nodeSecret);
        return {
            account: kp.deriveAddress(keypair.publicKey),
            secret: nodeSecret
        };
    }
    /**
     * Returns the signer list of the account
     * @returns An object in the form of {signerQuorum: <1> , signerList: [{account: "rawweeeere3e3", weight: 1}, {}, ...]} || undefined
     */
    getSignerList() {
        return __awaiter(this, void 0, void 0, function* () {
            const accountObjects = yield this.masterAcc.getAccountObjects({ type: "signer_list" });
            if (accountObjects.length > 0) {
                const signerObject = accountObjects.filter((ob) => ob.LedgerEntryType === 'SignerList')[0];
                const signerList = signerObject.SignerEntries.map((signer) => ({ account: signer.SignerEntry.Account, weight: signer.SignerEntry.SignerWeight }));
                const res = { signerQuorum: signerObject.SignerQuorum, signerList: signerList };
                return res;
            }
            else
                return undefined;
        });
    }
    /**
     *
     * @param tx Transaction in json
     * @returns The signed transaction blob
     */
    sign(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signerAcc)
                throw `No signer for ${this.masterAcc.address}`;
            const signedObj = yield this.signerAcc.sign(tx, true);
            return signedObj.tx_blob;
        });
    }
    /**
     *
     * @param tx Multi-signed transaction
     * @returns response
     */
    submitMultisignedTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.xrplApi.submitMultisigned(tx);
            return res;
        });
    }
}
exports.default = MultiSigner;
