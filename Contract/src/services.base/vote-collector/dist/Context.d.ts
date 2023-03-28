/// <reference types="node" />
/// <reference types="node" />
import * as EventEmitter from 'events';
import MessageSerializer from './MessageSerializer';
import { UnlNode } from './models/common';
import AllVoteElector from './vote-electors/AllVoteElector';
import { Buffer } from 'buffer';
declare class Context {
    hpContext: any;
    voteEmitter: EventEmitter;
    serializer: MessageSerializer;
    constructor(hpContext: any, options?: any);
    feedUnlMessage(sender: UnlNode, msg: Buffer): void;
    vote(electionName: string, votes: any[], elector: AllVoteElector): Promise<any[]>;
}
export default Context;
