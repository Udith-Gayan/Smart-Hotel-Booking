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
const EventEmitter = require("events");
const MessageSerializer_1 = require("./MessageSerializer");
class Context {
    constructor(hpContext, options = {}) {
        this.voteEmitter = new EventEmitter();
        this.hpContext = hpContext;
        this.serializer = options.serializer || new MessageSerializer_1.default();
    }
    feedUnlMessage(sender, msg) {
        const vote = this.serializer.deserializeVote(msg);
        vote && this.voteEmitter.emit(vote.election, sender, vote.data);
    }
    vote(electionName, votes, elector) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start the election.
            const election = elector.election(electionName, this.voteEmitter);
            // Cast our vote(s).
            yield Promise.all(new Array().concat(votes).map(v => {
                const msg = this.serializer.serializeVote(electionName, v);
                return this.hpContext.unl.send(msg);
            }));
            // Get election result.
            return yield election;
        });
    }
}
exports.default = Context;
