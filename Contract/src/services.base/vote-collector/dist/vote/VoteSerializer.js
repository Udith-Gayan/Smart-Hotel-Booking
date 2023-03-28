"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageSerializer_1 = require("../utils/MessageSerializer");
const msgFields = {
    type: '_evpType',
    election: 'election',
    data: 'data'
};
Object.freeze(msgFields);
const msgTypes = {
    vote: 'unlVote'
};
Object.freeze(msgTypes);
class VoteSerializer extends MessageSerializer_1.default {
    constructor() {
        super('json', (obj) => { return obj && obj[msgFields.type] && (!msgTypes.vote || obj[msgFields.type] === msgTypes.vote); });
    }
    /**
     * Deserialize user vote to a object.
     * @param msg Serialized buffer.
     * @returns Deserialized object.
     */
    deserializeVote(msg) {
        return super.deserializeMessage(msg);
    }
    /**
     * Serialize vote message.
     * @param electionName Election name that's voting for.
     * @param data Vote data object.
     * @returns Serialized buffer.
     */
    serializeVote(electionName, data) {
        return super.serializeMessage({
            [msgFields.type]: msgTypes.vote,
            [msgFields.election]: electionName,
            [msgFields.data]: data
        });
    }
}
exports.default = VoteSerializer;
