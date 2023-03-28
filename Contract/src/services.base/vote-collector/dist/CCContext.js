"use strict";
// import * as EventEmitter from 'events';
// import { MultiSignedBlobCollector, MultiSigner } from './multi-sign';
// import MessageSerializer from './utils/MessageSerializer';
// import { UnlNode, SignerList, SignerListInfo } from './models';
// import { AllVoteElector } from './vote-electors';
// import * as fs from 'fs';
// class Context {
//     private hpContext;
//     private voteEmitter = new EventEmitter();
//     private serializer;
//     private signerAddressList: string[] = [];
//     private signerListInfo?: SignerListInfo;
//     private sequenceNumberList: number[] = [];
//     private signedBlobs: any[] = [];
//     private nodeAccount?: MultiSigner;
//     private masterAccount?: MultiSigner;
//     public constructor(hpContext: any, options: any = {}) {
//         this.hpContext = hpContext;
//         this.serializer = options.serializer || new MessageSerializer("json");
//     }
//     public feedUnlMessage(sender: UnlNode, msg: Buffer): void {
//         const vote = this.serializer.deserializeVote(msg);
//         vote && this.voteEmitter.emit(vote.election, sender, vote.data);
//     }
//     public async vote(electionName: string, votes: any[], elector: AllVoteElector): Promise<any[]> {
//         // Start the election.
//         const election = elector.election(electionName, this.voteEmitter);
//         // Cast our vote(s).
//         await Promise.all(new Array().concat(votes).map(v => {
//             const msg = this.serializer.serializeVote(electionName, v);
//             return this.hpContext.unl.send(msg);
//         }));
//         // Get election result.
//         return await election;
//     }
//     public async enableMultiSigning(masterKey: string, quorum: number, disableMasterKey: boolean = false, signerList: SignerList[] = []) {
//         this.masterAccount = new MultiSigner(masterKey);
//         // Validation: If the key file exists, the account has already been set
//         const nodeKeyFile = `../${this, this.masterAccount.nodeAddress}.key`;
//         if (fs.existsSync(nodeKeyFile) && signerList.length == 0)
//             return true;
//         if (signerList.length == 0) {
//             const nodeAccount = await MultiSigner.generateAccount(masterKey);   // return the address
//             this.signerAddressList = (await this.vote(`NODE_ADDRESS`, [nodeAccount.address], new AllVoteElector(this.hpContext.npl.count, 2000)))
//                 .map(ob => ob.data);
//             signerList = this.signerAddressList.map(addr => ({ account: addr, weight: 1 }));
//         }
//         // Do set the signing list and disable mastr key if necessary
//         await this.masterAccount.enable(quorum, signerList, disableMasterKey);
//     }
//     public async submitTransaction(tx: any, masterKey: string) {
//         if (!this.masterAccount) {
//             this.masterAccount = new MultiSigner(masterKey);
//         }
//         const filename = `../${this.masterAccount.nodeAddress}.key`;
//         let nodeKey = (await fs.readFileSync(filename)).toString().trim();
//         this.nodeAccount = new MultiSigner(nodeKey);
//         this.signerListInfo = await this.masterAccount.getSignerList();
//         const sequenceNumber: number = await this.getSequenceNumber(masterKey);
//         tx.Sequence = sequenceNumber;
//         const signed_blob = this.nodeAccount.sign(tx);
//         this.signedBlobs = (await this.vote(`SIGNED_BLOB`, [{ blob: signed_blob, account: this.nodeAccount.nodeAddress }],
//             new MultiSignedBlobCollector(this.hpContext.npl.count, this.signerListInfo, 2000)))
//             .map(ob => ob.data);
//         await this.submitSignedBlobs(this.signedBlobs)
//     }
//     private async getSequenceNumber(masterKey: string): Promise<number> {
//         if (!this.masterAccount) {
//             this.masterAccount = new MultiSigner(masterKey);
//         }
//         const seq = await this.masterAccount?.getSequenceNumber();
//         this.sequenceNumberList = (await this.vote(`SEQUENCE`, [seq], new AllVoteElector(this.hpContext.npl.count, 2000))).map(ob => ob.data);
//         // Return the minimum sequence number
//         return Math.min(...this.sequenceNumberList);
//     }
//     private async submitSignedBlobs(signedBlobs: string[]) {
//         return await this.nodeAccount?.submitSignedBlobs(signedBlobs);
//     }
// }
// module.exports = {
//     Context
// }
// >>>>>>> 9fddefb10104f82682ed0a03d5042174c6ece95a
