import Context from './ContractContext';
import { TransactionSubmissionInfo } from '../models';
declare class EvernodeContext extends Context {
    private multiSigner;
    constructor(hpContext: any, options?: any);
    setMultiSigner(address: string): Promise<void>;
    removeMultiSigner(): Promise<void>;
    getTransactionSubmissionInfo(timeout?: number): Promise<TransactionSubmissionInfo>;
    /**
     * Multi sign and submit a given transaction.
     * @param transaction Transaction to submit.
     * @param timeout Optional timeout for votes to resolve.
     */
    multiSignAndSubmitTransaction(transaction: any, timeout?: number): Promise<void>;
    renewSignerList(timeout?: number): Promise<void>;
}
export default EvernodeContext;
