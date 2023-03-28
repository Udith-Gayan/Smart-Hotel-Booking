"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AllVoteElector {
    constructor(desiredVoteCount, timeout) {
        this.desiredVoteCount = desiredVoteCount;
        this.timeout = timeout;
    }
    election(electionName, voteEmitter) {
        return new Promise((resolve) => {
            const collected = [];
            // Fire up the timeout if we didn't receive enough votes.
            const timer = setTimeout(() => resolve(collected), this.timeout);
            voteEmitter.on(electionName, (sender, data) => {
                collected.push({ sender, data });
                // Resolve immediately if we have the required no. of messages.
                if (collected.length === this.desiredVoteCount) {
                    clearTimeout(timer);
                    resolve(collected);
                }
            });
        });
    }
}
exports.default = AllVoteElector;
