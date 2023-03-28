/// <reference types="node" />
import { Buffer } from 'buffer';
declare class MessageSerializer {
    private deserializeMessage;
    deserializeVote(msg: Buffer): any;
    serializeVote(electionName: string, data: any): string;
}
export default MessageSerializer;
