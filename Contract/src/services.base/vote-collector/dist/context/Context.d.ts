/// <reference types="node" />
import { Buffer } from 'buffer';
import { ContractConfig, Peer } from '../models';
import { UnlNode } from '../models';
import { AllVoteElector } from '../vote/vote-electors';
declare class Context {
    hpContext: any;
    private eventEmitter;
    private voteSerializer;
    /**
     * HotPocket contract context handler.
     * @param hpContext HotPocket contract context.
     */
    constructor(hpContext: any, options?: any);
    /**
     * Deserialize UNL message and feed to the listeners.
     * @param sender UNLNode which has sent the message.
     * @param msg Message received from UNL.
     */
    feedUnlMessage(sender: UnlNode, msg: Buffer): void;
    /**
     * Send the votes to a election.
     * @param electionName Election identifier to vote for.
     * @param votes Votes for the election.
     * @param elector Elector which evaluates the votes.
     * @returns Evaluated votes as a promise.
     */
    vote(electionName: string, votes: any[], elector: AllVoteElector): Promise<any[]>;
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
export default Context;
