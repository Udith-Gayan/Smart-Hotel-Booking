"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const fs = require("fs");
const utils_1 = require("../utils");
const decompress = require("decompress");
const VoteSerializer_1 = require("../vote/VoteSerializer");
const PATCH_CFG = "../patch.cfg";
const HP_POST_EXEC_SCRIPT = "post_exec.sh";
class Context {
    /**
     * HotPocket contract context handler.
     * @param hpContext HotPocket contract context.
     */
    constructor(hpContext, options = {}) {
        this.eventEmitter = new EventEmitter();
        this.hpContext = hpContext;
        this.voteSerializer = options.voteSerializer || new VoteSerializer_1.default();
    }
    /**
     * Deserialize UNL message and feed to the listeners.
     * @param sender UNLNode which has sent the message.
     * @param msg Message received from UNL.
     */
    feedUnlMessage(sender, msg) {
        const vote = this.voteSerializer.deserializeVote(msg);
        vote && this.eventEmitter.emit(vote.election, sender, vote.data);
    }
    /**
     * Send the votes to a election.
     * @param electionName Election identifier to vote for.
     * @param votes Votes for the election.
     * @param elector Elector which evaluates the votes.
     * @returns Evaluated votes as a promise.
     */
    vote(electionName, votes, elector) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start the election.
            const election = elector.election(electionName, this.eventEmitter);
            // Cast our vote(s).
            yield Promise.all(new Array().concat(votes).map(v => {
                const msg = this.voteSerializer.serializeVote(electionName, v);
                return this.hpContext.unl.send(msg);
            }));
            // Get election result.
            return yield election;
        });
    }
    /**
     * Get current contract configuration.
     * @returns Contract configuration.
     */
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the value from contract config and cast to ContractConfig model.
            return utils_1.JSONHelpers.castToModel(yield this.hpContext.getConfig(), ['environment']);
        });
    }
    /**
     * Update contract configuration.
     * @param config Configuration with the values that needed to be updated.
     */
    updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let patchCfg = yield this.getConfig();
            // Take only the non empty not null values since the values are optional.
            if (config.binPath)
                patchCfg.binPath = config.binPath;
            if (config.binArgs)
                patchCfg.binArgs = config.binArgs;
            if (config.environment)
                patchCfg.environment = config.environment;
            if (config.version)
                patchCfg.version = config.version;
            if (config.maxInputLedgerOffset == 0 || config.maxInputLedgerOffset)
                patchCfg.maxInputLedgerOffset = config.maxInputLedgerOffset;
            if (config.unl)
                patchCfg.unl = config.unl;
            if (config.consensus) {
                if (!patchCfg.consensus)
                    patchCfg.consensus = {};
                if (config.consensus.mode)
                    patchCfg.consensus.mode = config.consensus.mode;
                if (config.consensus.roundtime == 0 || config.consensus.roundtime)
                    patchCfg.consensus.roundtime = config.consensus.roundtime;
                if (config.consensus.stageSlice == 0 || config.consensus.stageSlice)
                    patchCfg.consensus.stageSlice = config.consensus.stageSlice;
                if (config.consensus.threshold == 0 || config.consensus.threshold)
                    patchCfg.consensus.threshold = config.consensus.threshold;
            }
            if (config.npl) {
                if (!patchCfg.npl)
                    patchCfg.npl = {};
                if (config.npl.mode)
                    patchCfg.npl.mode = config.npl.mode;
            }
            if (config.roundLimits) {
                if (!patchCfg.roundLimits)
                    patchCfg.roundLimits = {};
                if (config.roundLimits.userInputBytes === 0 || config.roundLimits.userInputBytes)
                    patchCfg.roundLimits.userInputBytes = config.roundLimits.userInputBytes;
                if (config.roundLimits.userOutputBytes === 0 || config.roundLimits.userOutputBytes)
                    patchCfg.roundLimits.userOutputBytes = config.roundLimits.userOutputBytes;
                if (config.roundLimits.nplOutputBytes === 0 || config.roundLimits.nplOutputBytes)
                    patchCfg.roundLimits.nplOutputBytes = config.roundLimits.nplOutputBytes;
                if (config.roundLimits.procCpuSeconds === 0 || config.roundLimits.procCpuSeconds)
                    patchCfg.roundLimits.procCpuSeconds = config.roundLimits.procCpuSeconds;
                if (config.roundLimits.procMemBytes === 0 || config.roundLimits.procMemBytes)
                    patchCfg.roundLimits.procMemBytes = config.roundLimits.procMemBytes;
                if (config.roundLimits.procOfdCount === 0 || config.roundLimits.procOfdCount)
                    patchCfg.roundLimits.procOfdCount = config.roundLimits.procOfdCount;
            }
            // Cast to a snake case object before sending to update.
            yield this.hpContext.updateConfig(utils_1.JSONHelpers.castFromModel(patchCfg, ['environment']));
        });
    }
    /**
     * Add public keys to the contract UNL.
     * @param pubKeys List of public keys that needed to be added.
     */
    addUnlNodes(pubKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = yield this.getConfig();
            if (!config.unl)
                config.unl = [];
            config.unl.push(...pubKeys);
            yield this.hpContext.updateConfig(utils_1.JSONHelpers.castFromModel(config, ['environment']));
        });
    }
    /**
     * Remove public keys from contract UNL.
     * @param pubKeys Public keys to remove.
     */
    removeUnlNodes(pubKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            let config = yield this.getConfig();
            if (config.unl)
                config.unl = config.unl.filter(p => !pubKeys.includes(p));
            yield this.hpContext.updateConfig(utils_1.JSONHelpers.castFromModel(config, ['environment']));
        });
    }
    /**
     * Add peers to the peer list.
     * @param peers Peers to add.
     */
    addPeers(peers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hpContext.updatePeers(peers.map(p => p.toString()), null);
        });
    }
    /**
     * Remove peers from the peer list.
     * @param peers Peers to remove.
     */
    removePeers(peers) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hpContext.updatePeers(null, peers.map(p => p.toString()));
        });
    }
    /**
     * Update the contract binaries with given zip bundle.
     * @param bundle Byte array of the contract bundle zip (Can include: contract binaries, contract.config, install.sh).
     */
    updateContract(bundle) {
        return __awaiter(this, void 0, void 0, function* () {
            const CONFIG = "contract.config";
            const PATCH_CFG_BK = "../patch.cfg.bk";
            const INSTALL_SCRIPT = "install.sh";
            // Create a temporary directory and unzip the bundle into it.
            const tmpDir = `bundle_${this.hpContext.lclHash.substr(0, 10)}`;
            fs.mkdirSync(tmpDir);
            const files = yield new Promise((resolve, reject) => {
                decompress(bundle, tmpDir).then((files) => {
                    resolve(files);
                }).catch((error) => {
                    reject(error);
                });
            });
            // If there's a configuration file inside the bundle update the contract configuration with it.
            const cfgFile = files.find(f => f.path === CONFIG);
            if (cfgFile) {
                const cfg = utils_1.JSONHelpers.castToModel(JSON.parse(cfgFile.data.toString()), ['environment']);
                // Create backup of patch.config before update.
                fs.copyFileSync(PATCH_CFG, PATCH_CFG_BK);
                yield this.updateConfig(cfg);
                fs.rmSync(`${tmpDir}/${CONFIG}`);
            }
            // Prepare the post execution script to place the new contract binaries.
            let postExecScript = `#!/bin/bash`;
            // Run install.sh script if there's one.
            const installScript = files.find(f => f.path === INSTALL_SCRIPT);
            if (installScript) {
                postExecScript += `
chmod +x ${tmpDir}/${INSTALL_SCRIPT}
./${tmpDir}/${INSTALL_SCRIPT}
installcode=$?

rm ${tmpDir}/${INSTALL_SCRIPT}

if [ "$installcode" -eq "0" ]; then
    echo "${INSTALL_SCRIPT} executed successfully."
else
    echo "${INSTALL_SCRIPT} ended with exit code:$installcode"
    rm -r ${tmpDir}
    rm ${PATCH_CFG} && mv ${PATCH_CFG_BK} ${PATCH_CFG}
    rm ${HP_POST_EXEC_SCRIPT}
    exit 1
fi`;
            }
            // If success place contract binaries in state directory, remove temporary directory and patch config backup
            postExecScript += `
mv ${tmpDir}/* ./ && rm -r ${tmpDir}
rm ${PATCH_CFG_BK}
exit 0
`;
            // Create post execution script and change it's permissions.
            fs.writeFileSync(HP_POST_EXEC_SCRIPT, postExecScript);
            fs.chmodSync(HP_POST_EXEC_SCRIPT, 0o777);
        });
    }
}
exports.default = Context;
