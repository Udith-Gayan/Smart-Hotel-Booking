import { Signer } from "../models";
declare class MultiSigner {
    private xrplApi;
    private keyPath;
    private signer;
    masterAcc: any;
    signerAcc: any;
    constructor(address?: string | null);
    /**
     * Initialize multi signer object.
     */
    init(): Promise<void>;
    /**
     * De-Initialize multi signer object.
     */
    deinit(): Promise<void>;
    getSequence(): Promise<number>;
    getMaxLedgerSequence(): number;
    /**
     * Get the signer.
     * @returns Signer info.
     */
    getSigner(): Signer | null;
    /**
     * Set the signer.
     * @param signer Signer to set.
    */
    setSigner(signer: Signer): void;
    /**
     * Generate a key for the node and save the node key in a file named by (../\<master address\>.key).
     * @returns Generated signer info.
     */
    generateSigner(): Signer;
    /**
     * Returns the signer list of the account
     * @returns An object in the form of {signerQuorum: <1> , signerList: [{account: "rawweeeere3e3", weight: 1}, {}, ...]} || undefined
     */
    getSignerList(): Promise<{
        signerQuorum: number;
        signerList: Signer[];
    } | undefined>;
    /**
     *
     * @param tx Transaction in json
     * @returns The signed transaction blob
     */
    sign(tx: any): Promise<string>;
    /**
     *
     * @param tx Multi-signed transaction
     * @returns response
     */
    submitMultisignedTx(tx: any): Promise<any>;
}
export default MultiSigner;
