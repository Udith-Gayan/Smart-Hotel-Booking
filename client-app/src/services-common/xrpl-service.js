import ECDSA from 'xrpl/dist/npm/ECDSA';

const xrpl = window.xrpl;

const contractWalletAddress = process.env.REACT_APP_CONTRACT_WALLET_ADDRESS;
const xrplServerURL = process.env.REACT_APP_RIPPLED_SERVER || "wss://hooks-testnet-v2.xrpl-labs.com";


export default class XrplService {
    // Provides a singleton instance
    static xrplInstance = XrplService.xrplInstance || new XrplService();

    #xrplClient = null;

    constructor() {
        this.#xrplClient = new xrpl.Client(xrplServerURL)
    };

    isValidSecret(secret) {
        return xrpl.isValidSecret(secret);
    }

    isValidAddress(address) {
        return xrpl.isValidAddress(address);
    }

    /**
     * 
     * @returns An object with these properties {address, seed, publicKey, privateKey}
     */
    async createNewFundedUserWallet() {
        try {
            await this.#xrplClient.connect();
            const new_wallet = xrpl.Wallet.generate(ECDSA.secp256k1);

            await fetch(`http${xrplServerURL.substring(2)}/newcreds?account=${new_wallet.address}`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Keep watching until xrps are received XRP balance.
            let attempts = 0;
            while (attempts >= 0) {
                await new Promise(solve => setTimeout(solve, 1000));
                const balance = await this.#xrplClient.getXrpBalance(new_wallet.address).catch(e => {
                    if (e.message !== 'Account not found.')
                        throw e;
                });

                if (!balance) {
                    if (++attempts <= 20)
                        continue;
                    throw Error("XRP funds not received within timeout.");
                }
                break;
            }

            return new_wallet;


        } catch (error) {
            console.log(`Error in account creation: ${error}`);
            throw (`Error in account creation: ${error}`);
        } finally {
            await this.#xrplClient.disconnect();
        }
    }

    /**
     * 
     * @param {string} seed The seed or the secret of the wallet
     * @returns The wallet object with { address, seed, privateKey, publiockey}
     */
    generateWalletFromSeed(seed) {
        const the_wallet = xrpl.Wallet.fromSeed(seed);
        return the_wallet;
    }

    /**
     * 
     * @param {string} walletAddress 
     * @param {string} uri | The URI expects to be in the tokens
     * @param {string} issuer | The nft issuer address
     * @returns An array of nft objects || undefined || null
     */
    async getNfts(walletAddress, uri = null, issuer = null) {
        try {
            await this.#xrplClient.connect();
            let nftsRes = await this.#xrplClient.request({
                method: "account_nfts",
                account: walletAddress,
            });
            console.log(nftsRes);

            nftsRes = nftsRes.result.account_nfts;

            if (uri != null) {
                nftsRes = nftsRes.filter((t) => xrpl.convertHexToString(t.URI) == uri);
            }

            if (issuer != null) {
                nftsRes = nftsRes.filter((t) => t.Issuer == issuer);
            }

            return nftsRes;
        } catch (error) {
            const errMsg = `Error occured in getting Nfts. ${error} `;
            console.log(errMsg);
            throw (errMsg);
        } finally {
            ;
            await this.#xrplClient.disconnect();
        }

    }


    /**
     * 
     * @param {string} secret | Secret of the sender wallet
     * @param {string} amount | Amount to be sent in drops (string)
     * @param {*} destination | Address of the receiver
     * @returns object { id, code: "tesSUCCESS", details: {}, meta: {}}
     */
    async makePayment(secret, amount, destination) {
        try {
            await this.#xrplClient.connect();
            const _wallet = xrpl.Wallet.fromSeed(secret);
            const prepared = await this.#xrplClient.autofill({
                TransactionType: "Payment",
                Account: _wallet.address,
                Amount: xrpl.xrpToDrops(amount),
                Destination: destination
            });

            const signed = _wallet.sign(prepared);
            const tx = await this.#xrplClient.submitAndWait(signed.tx_blob);
            console.log("Transaction result:", tx.result.meta.TransactionResult);
            return tx.result;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            await this.#xrplClient.disconnect();
        }
    }

    async acceptNftOffer(secret, offerId) {
        try {
            await this.#xrplClient.connect();
            const _wallet = xrpl.Wallet.fromSeed(secret);

            const prepared = await this.#xrplClient.autofill({
                TransactionType: "NFTokenAcceptOffer",
                Account: _wallet.address,
                NFTokenSellOffer: offerId,
                Memos: [],
            });

            const signed = _wallet.sign(prepared);
            const tx = await this.#xrplClient.submitAndWait(signed.tx_blob);
            console.log("Transaction result:", tx.result.meta.TransactionResult);
            return tx.result.meta.TransactionResult;

        } catch (error) {
            console.log(`Error in accepting the offer: `, error);
            throw error;
        } finally {
            await this.#xrplClient.disconnect();
        }
    }



}
