import Context from './Context';
import { Signer } from './models';
declare class EvernodeContext extends Context {
    private xrplApi;
    constructor(hpContext: any, options?: any);
    getSequenceNumber(address: string, timeout?: number): Promise<number>;
    /**
     * Set the provided signer list to the master account and disable the master key if necessary. If provided signer lsi is empty, it generates xrpl accounts for each node and set all those accounts as the signer list of the master key.
     * @param quorum Signer quorum
     * @param secret Secret of the master account
     * @param signerList (optional) Signer list for the master account
     * @param timeout  (optional)
     * @param disableMasterKey (optinal) Whether to disable the master key after setting the signr list. Defaults to false.
     */
    prepareMultiSigner(quorum: number, secret: string, signerList?: Signer[], timeout?: number, disableMasterKey?: boolean): Promise<void>;
    /**
     * Submit a transaction with multi signs.
     * @param address Address of the master account
     * @param transaction Transaction object
     * @param timeout (optional) Defaults to 2000 in ms
     */
    submitTransaction(address: string, transaction: any, timeout?: number): Promise<void>;
}
export default EvernodeContext;
