"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const bson = require("bson");
class BSONSerializer {
    /**
     * Deserialize bson message to a object.
     * @param msg Bson message buffer.
     * @returns Deserialized object.
     */
    deserialize(msg) {
        return bson.deserialize(msg);
    }
    /**
     * Serialize object to a bson message.
     * @param obj object.
     * @returns Serialized Bson message buffer.
     */
    serialize(obj) {
        return bson.serialize(obj);
    }
}
class JSONSerializer {
    /**
     * Deserialize stringified message buffer to a object.
     * @param msg Stringified message buffer.
     * @returns Deserialized object.
     */
    deserialize(msg) {
        return JSON.parse(msg.toString());
    }
    /**
     * Serialize object to a stringified message buffer.
     * @param obj object.
     * @returns Serialized stringified message buffer.
     */
    serialize(obj) {
        return buffer_1.Buffer.from(JSON.stringify(obj));
    }
}
class MessageSerializer {
    /**
     * Message serializer.
     * @param protocol Message protocol json|bson.
     * @param validator Validator function to validate the object.
     */
    constructor(protocol, validator = (obj) => { return !!obj; }) {
        // Instantiate a serializer for given protocol.
        this.serializer = protocol === 'bson' ? new BSONSerializer() : new JSONSerializer();
        this.validate = validator;
    }
    /**
     * Deserialize buffer to a object.
     * @param msg Serialized buffer.
     * @returns Deserialized object.
     */
    deserializeMessage(msg) {
        try {
            const obj = this.serializer.deserialize(msg);
            if (this.validate(obj))
                return obj;
        }
        catch (_a) {
            console.error('Invalid message format');
        }
        return null;
    }
    /**
     * Serialize object to a buffer.
     * @param data Deserialized object.
     * @returns Serialized buffer.
     */
    serializeMessage(data) {
        try {
            if (this.validate(data))
                return this.serializer.serialize(data);
        }
        catch (_a) {
            console.error('Invalid message format');
        }
        return null;
    }
}
exports.default = MessageSerializer;
