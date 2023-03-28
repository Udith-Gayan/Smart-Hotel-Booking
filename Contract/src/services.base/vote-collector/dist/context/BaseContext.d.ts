/// <reference types="node" />
import { Buffer } from 'buffer';
import { UnlNode } from '../models';
import { AllVoteElector } from '../vote/vote-electors';
declare class BaseContext {
    protected hpContext: any;
    private eventEmitter;
    private voteSerializer;
    private uniqueNumber;
    private voteCollection;
    /**
     * HotPocket contract context handler.
     * @param hpContext HotPocket contract context.
     */
    constructor(hpContext: any, options?: any);
    /**
     * Gives an unique number every time this method is called.
     * @returns An unique number.
     */
    protected getUniqueNumber(): number;
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
    resolveVotes(electionName: string): any[];
    /**
     * Generates a random number.
     * @param timeout Maximum timeout to generate a random number.
     * @returns A random number between 0-1.
     */
    random(timeout?: number): Promise<number | null>;
    /**
     * Generates an uuid string.
     * @param timeout Maximum timeout to generate an uuid.
     * @returns An uuid.
     */
    uuid4(timeout?: number): Promise<string | null>;
}
export default BaseContext;
