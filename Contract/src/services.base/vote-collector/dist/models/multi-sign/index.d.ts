export interface Signer {
    account: string;
    secret: string;
    weight: number;
}
export interface SignerListInfo {
    signerQuorum: number;
    signerList: Signer[];
}
export interface Signature {
    Signer: {
        SigningPubKey: string;
        TxnSignature: string;
        Account: string;
    };
}
export interface TransactionSubmissionInfo {
    sequence: number;
    maxLedgerSequence: number;
}
