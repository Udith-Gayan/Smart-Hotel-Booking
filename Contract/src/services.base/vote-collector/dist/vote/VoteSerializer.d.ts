/// <reference types="node" />
import { Buffer } from 'buffer';
import MessageSerializer from '../utils/MessageSerializer';
declare class VoteSerializer extends MessageSerializer {
    constructor();
    /**
     * Deserialize user vote to a object.
     * @param msg Serialized buffer.
     * @returns Deserialized object.
     */
    deserializeVote(msg: Buffer): any;
    /**
     * Serialize vote message.
     * @param electionName Election name that's voting for.
     * @param data Vote data object.
     * @returns Serialized buffer.
     */
    serializeVote(electionName: string, data: any): Buffer | null;
}
export default VoteSerializer;
