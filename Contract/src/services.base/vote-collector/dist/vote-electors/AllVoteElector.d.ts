/// <reference types="node" />
import * as EventEmitter from 'events';
declare class AllVoteElector {
    desiredVoteCount: number;
    timeout: number;
    constructor(desiredVoteCount: number, timeout: number);
    election(electionName: string, voteEmitter: EventEmitter): Promise<any[]>;
}
export default AllVoteElector;
