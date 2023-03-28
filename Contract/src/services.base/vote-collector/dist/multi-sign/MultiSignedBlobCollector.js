"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vote_electors_1 = require("../vote/vote-electors");
class MultiSignedBlobCollector extends vote_electors_1.AllVoteElector {
    constructor(desiredVoteCount, signerListInfo, timeout) {
        super(desiredVoteCount, timeout);
        this.signerListInfo = signerListInfo;
    }
    election(electionName, voteEmitter, context) {
        return new Promise((resolve) => {
            // Fire up the timeout if we didn't receive enough votes.
            const timer = setTimeout(() => resolve(context.resolveVotes(electionName)), this.timeout);
            voteEmitter.on(electionName, (collected) => {
                var _a;
                const currSignerWeight = collected.reduce((total, co) => {
                    var _a;
                    const signer = (_a = this.signerListInfo) === null || _a === void 0 ? void 0 : _a.signerList.find((ob) => ob.account == co.data.account);
                    if (signer)
                        return total + signer.weight;
                    else
                        return 0;
                }, 0);
                // If signer Quorum is satisfied, submit the transaction
                if (currSignerWeight == ((_a = this.signerListInfo) === null || _a === void 0 ? void 0 : _a.signerQuorum)) {
                    clearTimeout(timer);
                    resolve(context.resolveVotes(electionName));
                }
            });
        });
    }
}
exports.default = MultiSignedBlobCollector;
