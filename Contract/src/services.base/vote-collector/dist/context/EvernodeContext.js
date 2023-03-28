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
const ContractContext_1 = require("./ContractContext");
const multi_sign_1 = require("../multi-sign");
const vote_electors_1 = require("../vote/vote-electors");
const xrplCodec = require("xrpl-binary-codec");
class EvernodeContext extends ContractContext_1.default {
    constructor(hpContext, options = {}) {
        super(hpContext, options);
        this.multiSigner = null;
    }
    setMultiSigner(address) {
        return __awaiter(this, void 0, void 0, function* () {
            this.multiSigner = new multi_sign_1.MultiSigner(address);
            yield this.multiSigner.init();
        });
    }
    removeMultiSigner() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.multiSigner) === null || _a === void 0 ? void 0 : _a.deinit());
            this.multiSigner = null;
        });
    }
    getTransactionSubmissionInfo(timeout = 4000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.multiSigner)
                throw 'No multi signer for the context';
            // Decide a sequence number and max ledger sequence to send the same transaction from all the nodes.
            const infos = (yield this.vote(`transactionInfo${this.getUniqueNumber()}`, [{
                    sequence: yield this.multiSigner.getSequence(),
                    maxLedgerSequence: this.multiSigner.getMaxLedgerSequence()
                }], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout))).map(ob => ob.data);
            return {
                sequence: infos.map(i => i.sequence).sort()[0],
                maxLedgerSequence: infos.map(i => i.maxLedgerSequence).sort((a, b) => b - a)[0]
            };
        });
    }
    /**
     * Multi sign and submit a given transaction.
     * @param transaction Transaction to submit.
     * @param timeout Optional timeout for votes to resolve.
     */
    multiSignAndSubmitTransaction(transaction, timeout = 4000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.multiSigner)
                throw 'No multi signer for the context';
            const txSubmitInfo = yield this.getTransactionSubmissionInfo(timeout);
            if (!txSubmitInfo)
                throw 'Could not get transaction submission info';
            transaction.Sequence = txSubmitInfo.sequence;
            transaction.LastLedgerSequence = txSubmitInfo.maxLedgerSequence;
            /////// TODO: This should be handled in js lib. //////
            transaction.Fee = `${10 * (this.hpContext.unl.list().length + 2)}`;
            const signerListInfo = yield this.multiSigner.getSignerList();
            // Sign the transaction and collect the signed blob list.
            const signed = yield this.multiSigner.sign(transaction);
            const decodedTx = JSON.parse(JSON.stringify(xrplCodec.decode(signed)));
            const signature = decodedTx.Signers[0];
            const signatures = (yield this.vote(`sign${this.hpContext.timestamp}`, [signature], new multi_sign_1.MultiSignedBlobCollector(this.hpContext.users.length, signerListInfo, timeout)))
                .map(ob => ob.data);
            transaction.Signers = [...signatures];
            transaction.SigningPubKey = "";
            // Submit the multi-signed transaction.
            const res = yield this.multiSigner.submitMultisignedTx(transaction).catch(console.error);
            if (res.result.engine_result === "tesSUCCESS")
                console.log("Transaction submitted successfully");
            else if (res.result.engine_result === "tefPAST_SEQ" || res.result.engine_result === "tefALREADY")
                console.log("Proceeding with pre-submitted transaction");
            else
                throw `Transaction failed with error ${res.result.engine_result}`;
        });
    }
    renewSignerList(timeout = 4000) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.multiSigner)
                throw 'No multi signer for the context';
            const curSigner = this.multiSigner.getSigner();
            const curSignerList = yield this.multiSigner.getSignerList();
            const curSignerWeight = (_a = curSignerList === null || curSignerList === void 0 ? void 0 : curSignerList.signerList.find(s => s.account === (curSigner === null || curSigner === void 0 ? void 0 : curSigner.account))) === null || _a === void 0 ? void 0 : _a.weight;
            if (curSigner && curSignerWeight) {
                const newSigner = this.multiSigner.generateSigner();
                const newSignerList = (yield this.vote(`signerList${this.getUniqueNumber()}`, [{
                        account: newSigner.account,
                        weight: curSignerWeight
                    }], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout))).map(ob => ob.data);
                const signerListTx = {
                    Flags: 0,
                    TransactionType: "SignerListSet",
                    Account: this.multiSigner.masterAcc.address,
                    SignerQuorum: curSignerList.signerQuorum,
                    SignerEntries: [
                        ...newSignerList.map(signer => ({
                            SignerEntry: {
                                Account: signer.account,
                                SignerWeight: signer.weight
                            }
                        })).sort((a, b) => a.SignerEntry.Account < b.SignerEntry.Account ? -1 : 1)
                    ]
                };
                yield this.multiSignAndSubmitTransaction(signerListTx, timeout);
                // Set the new signer after signer list is successfully set.
                this.multiSigner.setSigner(newSigner);
            }
            else {
                throw `No signers for ${this.multiSigner.masterAcc.address}`;
            }
        });
    }
}
exports.default = EvernodeContext;
