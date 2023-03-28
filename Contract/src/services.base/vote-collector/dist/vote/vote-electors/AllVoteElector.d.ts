/// <reference types="node" />
import * as EventEmitter from 'events';
import { BaseContext } from '../../context';
declare class AllVoteElector {
    desiredVoteCount: number;
    timeout: number;
    constructor(desiredVoteCount: number, timeout: number);
    /**
     * Evaluate the election.
     * @param electionName Election identifier.
     * @param voteEmitter Event emitter which the votes are fed into,
     * @returns Evaluated votes as a promise.
     */
    election(electionName: string, voteEmitter: EventEmitter, context: BaseContext): Promise<any[]>;
}
export default AllVoteElector;
