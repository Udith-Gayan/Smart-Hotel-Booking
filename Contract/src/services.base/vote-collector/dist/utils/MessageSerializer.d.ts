/// <reference types="node" />
import { Buffer } from 'buffer';
type Validator = (obj: any) => boolean;
declare class MessageSerializer {
    private serializer;
    private validate;
    /**
     * Message serializer.
     * @param protocol Message protocol json|bson.
     * @param validator Validator function to validate the object.
     */
    constructor(protocol: string, validator?: Validator);
    /**
     * Deserialize buffer to a object.
     * @param msg Serialized buffer.
     * @returns Deserialized object.
     */
    deserializeMessage(msg: Buffer): any;
    /**
     * Serialize object to a buffer.
     * @param data Deserialized object.
     * @returns Serialized buffer.
     */
    serializeMessage(data: any): Buffer | null;
}
export default MessageSerializer;
