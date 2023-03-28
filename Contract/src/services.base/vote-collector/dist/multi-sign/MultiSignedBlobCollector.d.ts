/// <reference types="node" />
import EventEmitter = require("events");
import { BaseContext } from "../context";
import { SignerListInfo } from "../models";
import { AllVoteElector } from "../vote/vote-electors";
declare class MultiSignedBlobCollector extends AllVoteElector {
    private signerListInfo?;
    constructor(desiredVoteCount: number, signerListInfo: SignerListInfo | undefined, timeout: number);
    election(electionName: string, voteEmitter: EventEmitter, context: BaseContext): Promise<any[]>;
}
export default MultiSignedBlobCollector;
