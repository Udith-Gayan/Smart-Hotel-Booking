"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = exports.ContractConfig = exports.UnlNode = void 0;
class UnlNode {
}
exports.UnlNode = UnlNode;
class ContractConfig {
}
exports.ContractConfig = ContractConfig;
class Peer {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }
    toString() {
        if (!this.ip || !this.port)
            throw 'IP and Port cannot be empty.';
        return `${this.ip}:${this.port}`;
    }
}
exports.Peer = Peer;
