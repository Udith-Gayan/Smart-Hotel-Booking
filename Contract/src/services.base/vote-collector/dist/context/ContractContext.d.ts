/// <reference types="node" />
import { Buffer } from 'buffer';
import { ContractConfig, Peer } from '../models';
import BaseContext from './BaseContext';
declare class ContractContext extends BaseContext {
    hpContext: any;
    /**
     * HotPocket contract context handler.
     * @param hpContext HotPocket contract context.
     */
    constructor(hpContext: any, options?: any);
    /**
     * Get current contract configuration.
     * @returns Contract configuration.
     */
    getConfig(): Promise<ContractConfig>;
    /**
     * Update contract configuration.
     * @param config Configuration with the values that needed to be updated.
     */
    updateConfig(config: ContractConfig): Promise<void>;
    /**
     * Add public keys to the contract UNL.
     * @param pubKeys List of public keys that needed to be added.
     */
    addUnlNodes(pubKeys: string[]): Promise<void>;
    /**
     * Remove public keys from contract UNL.
     * @param pubKeys Public keys to remove.
     */
    removeUnlNodes(pubKeys: string[]): Promise<void>;
    /**
     * Add peers to the peer list.
     * @param peers Peers to add.
     */
    addPeers(peers: Peer[]): Promise<void>;
    /**
     * Remove peers from the peer list.
     * @param peers Peers to remove.
     */
    removePeers(peers: Peer[]): Promise<void>;
    /**
     * Update the contract binaries with given zip bundle.
     * @param bundle Byte array of the contract bundle zip (Can include: contract binaries, contract.config, install.sh).
     */
    updateContract(bundle: Buffer): Promise<void>;
}
export default ContractContext;
