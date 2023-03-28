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
const uuid_1 = require("uuid");
const EventEmitter = require("events");
const VoteSerializer_1 = require("../vote/VoteSerializer");
const vote_electors_1 = require("../vote/vote-electors");
class BaseContext {
    /**
     * HotPocket contract context handler.
     * @param hpContext HotPocket contract context.
     */
    constructor(hpContext, options = {}) {
        this.eventEmitter = new EventEmitter();
        this.uniqueNumber = 0;
        this.voteCollection = {};
        this.hpContext = hpContext;
        this.voteSerializer = options.voteSerializer || new VoteSerializer_1.default();
    }
    /**
     * Gives an unique number every time this method is called.
     * @returns An unique number.
     */
    getUniqueNumber() {
        return this.uniqueNumber++;
    }
    /**
     * Deserialize UNL message and feed to the listeners.
     * @param sender UNLNode which has sent the message.
     * @param msg Message received from UNL.
     */
    feedUnlMessage(sender, msg) {
        const vote = this.voteSerializer.deserializeVote(msg);
        if (vote) {
            const data = vote.data;
            if (this.voteCollection[vote.election])
                this.voteCollection[vote.election].push({ sender, data });
            else
                this.voteCollection[vote.election] = [{ sender, data }];
            this.eventEmitter.emit(vote.election, this.voteCollection[vote.election]);
        }
    }
    /**
     * Send the votes to a election.
     * @param electionName Election identifier to vote for.
     * @param votes Votes for the election.
     * @param elector Elector which evaluates the votes.
     * @returns Evaluated votes as a promise.
     */
    vote(electionName, votes, elector) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start the election.
            const election = elector.election(electionName, this.eventEmitter, this);
            // Cast our vote(s).
            yield Promise.all(new Array().concat(votes).map(v => {
                const msg = this.voteSerializer.serializeVote(electionName, v);
                return this.hpContext.unl.send(msg);
            }));
            // Get election result.
            return yield election;
        });
    }
    resolveVotes(electionName) {
        const votes = this.voteCollection[electionName];
        delete this.voteCollection[electionName];
        return votes !== null && votes !== void 0 ? votes : [];
    }
    /**
     * Generates a random number.
     * @param timeout Maximum timeout to generate a random number.
     * @returns A random number between 0-1.
     */
    random(timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate a random number.
            // Vote for the random number each node has generated.
            const number = Math.random();
            const rn = yield this.vote(`randomNumber${this.getUniqueNumber()}`, [number], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout));
            // Take the minimum random number.
            return rn.length ? Math.min(...rn.map(v => v.data)) : null;
        });
    }
    /**
     * Generates an uuid string.
     * @param timeout Maximum timeout to generate an uuid.
     * @returns An uuid.
     */
    uuid4(timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate an uuid.
            // Vote for the uuid each node has generated.
            const uuid = (0, uuid_1.v4)();
            const uuids = yield this.vote(`uuid4${this.getUniqueNumber()}`, [uuid], new vote_electors_1.AllVoteElector(this.hpContext.unl.list().length, timeout));
            // Take the first ascending uuid.
            return uuids.length ? uuids.map(v => v.data).sort()[0] : null;
        });
    }
}
exports.default = BaseContext;
