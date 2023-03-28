"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AllVoteElector {
    constructor(desiredVoteCount, timeout) {
        this.desiredVoteCount = desiredVoteCount;
        this.timeout = timeout;
    }
    /**
     * Evaluate the election.
     * @param electionName Election identifier.
     * @param voteEmitter Event emitter which the votes are fed into,
     * @returns Evaluated votes as a promise.
     */
    election(electionName, voteEmitter, context) {
        return new Promise((resolve) => {
            // Fire up the timeout if we didn't receive enough votes.
            const timer = setTimeout(() => resolve(context.resolveVotes(electionName)), this.timeout);
            voteEmitter.on(electionName, (collected) => {
                // Resolve immediately if we have the required no. of messages.
                if (collected.length === this.desiredVoteCount) {
                    clearTimeout(timer);
                    resolve(context.resolveVotes(electionName));
                }
            });
        });
    }
}
exports.default = AllVoteElector;
