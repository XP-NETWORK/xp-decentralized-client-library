"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMintOne = exports.storeMintOne = exports.loadUnlockToken = exports.storeUnlockToken = exports.loadCreatedCollection = exports.storeCreatedCollection = exports.loadDeployNFT721Collection = exports.storeDeployNFT721Collection = exports.loadDeployNFT721Storage = exports.storeDeployNFT721Storage = exports.loadStorageDeploy = exports.storeStorageDeploy = exports.loadCollectionDeploy = exports.storeCollectionDeploy = exports.loadHiFromDeployNFT721Collection = exports.storeHiFromDeployNFT721Collection = exports.loadHiFromDeployNFT721Storage = exports.storeHiFromDeployNFT721Storage = exports.loadGetNftData = exports.storeGetNftData = exports.loadReportStaticData = exports.storeReportStaticData = exports.loadGetStaticData = exports.storeGetStaticData = exports.loadExcesses = exports.storeExcesses = exports.loadOwnershipAssigned = exports.storeOwnershipAssigned = exports.loadTransfer = exports.storeTransfer = exports.loadRoyaltyParams = exports.storeRoyaltyParams = exports.loadCollectionData = exports.storeCollectionData = exports.loadReportRoyaltyParams = exports.storeReportRoyaltyParams = exports.loadGetRoyaltyParams = exports.storeGetRoyaltyParams = exports.loadFactoryDeploy = exports.storeFactoryDeploy = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
exports.NftItem = exports.loadClaimedEvent = exports.storeClaimedEvent = exports.loadUnLock721Event = exports.storeUnLock721Event = exports.loadLockedEvent = exports.storeLockedEvent = exports.loadRewardValidatorEvent = exports.storeRewardValidatorEvent = exports.loadAddNewValidatorEvent = exports.storeAddNewValidatorEvent = exports.loadStakeEvent = exports.storeStakeEvent = exports.loadClaimNFT721 = exports.storeClaimNFT721 = exports.loadLock721 = exports.storeLock721 = exports.loadRewardValidator = exports.storeRewardValidator = exports.loadAddValidator = exports.storeAddValidator = exports.loadToken = exports.storeToken = exports.loadClaimData = exports.storeClaimData = exports.loadClaimData4 = exports.storeClaimData4 = exports.loadClaimData3 = exports.storeClaimData3 = exports.loadClaimData2 = exports.storeClaimData2 = exports.loadClaimData1 = exports.storeClaimData1 = exports.loadOriginalToDuplicateContractInfo = exports.storeOriginalToDuplicateContractInfo = exports.loadDuplicateToOriginalContractInfo = exports.storeDuplicateToOriginalContractInfo = exports.loadValidatorsToRewards = exports.storeValidatorsToRewards = exports.loadNewValidator = exports.storeNewValidator = exports.loadSignerAndSignature = exports.storeSignerAndSignature = exports.loadValidator = exports.storeValidator = exports.loadMint = exports.storeMint = void 0;
//@ts-nocheck
const core_1 = require("@ton/core");
function storeStateInit(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
exports.storeStateInit = storeStateInit;
function loadStateInit(slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
exports.loadStateInit = loadStateInit;
function loadTupleStateInit(source) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeTupleStateInit(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserStateInit() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    };
}
function storeContext(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}
exports.storeContext = storeContext;
function loadContext(slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
exports.loadContext = loadContext;
function loadTupleContext(source) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
function storeTupleContext(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}
function dictValueParserContext() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    };
}
function storeSendParameters(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
exports.storeSendParameters = storeSendParameters;
function loadSendParameters(slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
exports.loadSendParameters = loadSendParameters;
function loadTupleSendParameters(source) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
function storeTupleSendParameters(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserSendParameters() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    };
}
function storeDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeploy = storeDeploy;
function loadDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
exports.loadDeploy = loadDeploy;
function loadTupleDeploy(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function storeTupleDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployOk(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeployOk = storeDeployOk;
function loadDeployOk(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
exports.loadDeployOk = loadDeployOk;
function loadTupleDeployOk(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function storeTupleDeployOk(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeployOk() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    };
}
function storeFactoryDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}
exports.storeFactoryDeploy = storeFactoryDeploy;
function loadFactoryDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
exports.loadFactoryDeploy = loadFactoryDeploy;
function loadTupleFactoryDeploy(source) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function storeTupleFactoryDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}
function dictValueParserFactoryDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    };
}
function storeGetRoyaltyParams(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeGetRoyaltyParams = storeGetRoyaltyParams;
function loadGetRoyaltyParams(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams', query_id: _query_id };
}
exports.loadGetRoyaltyParams = loadGetRoyaltyParams;
function loadTupleGetRoyaltyParams(source) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams', query_id: _query_id };
}
function storeTupleGetRoyaltyParams(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}
function dictValueParserGetRoyaltyParams() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    };
}
function storeReportRoyaltyParams(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}
exports.storeReportRoyaltyParams = storeReportRoyaltyParams;
function loadReportRoyaltyParams(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'ReportRoyaltyParams', query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}
exports.loadReportRoyaltyParams = loadReportRoyaltyParams;
function loadTupleReportRoyaltyParams(source) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams', query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}
function storeTupleReportRoyaltyParams(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}
function dictValueParserReportRoyaltyParams() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    };
}
function storeCollectionData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}
exports.storeCollectionData = storeCollectionData;
function loadCollectionData(slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadIntBig(257);
    let _collection_content = sc_0.loadRef();
    let _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData', next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}
exports.loadCollectionData = loadCollectionData;
function loadTupleCollectionData(source) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData', next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}
function storeTupleCollectionData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    return builder.build();
}
function dictValueParserCollectionData() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    };
}
function storeRoyaltyParams(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}
exports.storeRoyaltyParams = storeRoyaltyParams;
function loadRoyaltyParams(slice) {
    let sc_0 = slice;
    let _numerator = sc_0.loadIntBig(257);
    let _denominator = sc_0.loadIntBig(257);
    let _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams', numerator: _numerator, denominator: _denominator, destination: _destination };
}
exports.loadRoyaltyParams = loadRoyaltyParams;
function loadTupleRoyaltyParams(source) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams', numerator: _numerator, denominator: _denominator, destination: _destination };
}
function storeTupleRoyaltyParams(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}
function dictValueParserRoyaltyParams() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    };
}
function storeTransfer(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) {
            b_0.storeBit(true).storeRef(src.custom_payload);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeCoins(src.forward_amount);
        b_0.storeRef(src.forward_payload);
    };
}
exports.storeTransfer = storeTransfer;
function loadTransfer(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.loadRef();
    return { $$type: 'Transfer', query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}
exports.loadTransfer = loadTransfer;
function loadTupleTransfer(source) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'Transfer', query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}
function storeTupleTransfer(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}
function dictValueParserTransfer() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    };
}
function storeOwnershipAssigned(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeRef(src.forward_payload);
    };
}
exports.storeOwnershipAssigned = storeOwnershipAssigned;
function loadOwnershipAssigned(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _forward_payload = sc_0.loadRef();
    return { $$type: 'OwnershipAssigned', query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}
exports.loadOwnershipAssigned = loadOwnershipAssigned;
function loadTupleOwnershipAssigned(source) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'OwnershipAssigned', query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}
function storeTupleOwnershipAssigned(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.prev_owner);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}
function dictValueParserOwnershipAssigned() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    };
}
function storeExcesses(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeExcesses = storeExcesses;
function loadExcesses(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses', query_id: _query_id };
}
exports.loadExcesses = loadExcesses;
function loadTupleExcesses(source) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses', query_id: _query_id };
}
function storeTupleExcesses(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}
function dictValueParserExcesses() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    };
}
function storeGetStaticData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeGetStaticData = storeGetStaticData;
function loadGetStaticData(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData', query_id: _query_id };
}
exports.loadGetStaticData = loadGetStaticData;
function loadTupleGetStaticData(source) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData', query_id: _query_id };
}
function storeTupleGetStaticData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}
function dictValueParserGetStaticData() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    };
}
function storeReportStaticData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeAddress(src.collection);
    };
}
exports.storeReportStaticData = storeReportStaticData;
function loadReportStaticData(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _index_id = sc_0.loadIntBig(257);
    let _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData', query_id: _query_id, index_id: _index_id, collection: _collection };
}
exports.loadReportStaticData = loadReportStaticData;
function loadTupleReportStaticData(source) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData', query_id: _query_id, index_id: _index_id, collection: _collection };
}
function storeTupleReportStaticData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeAddress(source.collection);
    return builder.build();
}
function dictValueParserReportStaticData() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    };
}
function storeGetNftData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.individual_content);
    };
}
exports.storeGetNftData = storeGetNftData;
function loadGetNftData(slice) {
    let sc_0 = slice;
    let _is_initialized = sc_0.loadBit();
    let _index = sc_0.loadIntBig(257);
    let _collection_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadAddress();
    let _individual_content = sc_0.loadRef();
    return { $$type: 'GetNftData', is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}
exports.loadGetNftData = loadGetNftData;
function loadTupleGetNftData(source) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _individual_content = source.readCell();
    return { $$type: 'GetNftData', is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}
function storeTupleGetNftData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.is_initialized);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.individual_content);
    return builder.build();
}
function dictValueParserGetNftData() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeGetNftData(src)).endCell());
        },
        parse: (src) => {
            return loadGetNftData(src.loadRef().beginParse());
        }
    };
}
function storeHiFromDeployNFT721Storage(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1017107824, 32);
        b_0.storeAddress(src.sourceNftContractAddress);
        b_0.storeAddress(src.storageAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        let b_1 = new core_1.Builder();
        b_1.storeInt(src.tokenId, 257);
        b_1.storeRef(src.destinationChain);
        b_1.storeRef(src.destinationUserAddress);
        b_1.storeRef(src.sourceNftContractAddressLock);
        let b_2 = new core_1.Builder();
        b_2.storeStringRefTail(src.sourceChain);
        b_2.storeAddress(src.nftItemAddress);
        b_2.storeRef(src.metaDataUri);
        b_2.storeAddress(src.sender);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeHiFromDeployNFT721Storage = storeHiFromDeployNFT721Storage;
function loadHiFromDeployNFT721Storage(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1017107824) {
        throw Error('Invalid prefix');
    }
    let _sourceNftContractAddress = sc_0.loadAddress();
    let _storageAddress = sc_0.loadAddress();
    let _isOriginal = sc_0.loadBit();
    let _key = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _tokenId = sc_1.loadIntBig(257);
    let _destinationChain = sc_1.loadRef();
    let _destinationUserAddress = sc_1.loadRef();
    let _sourceNftContractAddressLock = sc_1.loadRef();
    let sc_2 = sc_1.loadRef().beginParse();
    let _sourceChain = sc_2.loadStringRefTail();
    let _nftItemAddress = sc_2.loadAddress();
    let _metaDataUri = sc_2.loadRef();
    let _sender = sc_2.loadAddress();
    return { $$type: 'HiFromDeployNFT721Storage', sourceNftContractAddress: _sourceNftContractAddress, storageAddress: _storageAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
exports.loadHiFromDeployNFT721Storage = loadHiFromDeployNFT721Storage;
function loadTupleHiFromDeployNFT721Storage(source) {
    let _sourceNftContractAddress = source.readAddress();
    let _storageAddress = source.readAddress();
    let _isOriginal = source.readBoolean();
    let _key = source.readBigNumber();
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddressLock = source.readCell();
    let _sourceChain = source.readString();
    let _nftItemAddress = source.readAddress();
    let _metaDataUri = source.readCell();
    let _sender = source.readAddress();
    return { $$type: 'HiFromDeployNFT721Storage', sourceNftContractAddress: _sourceNftContractAddress, storageAddress: _storageAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
function storeTupleHiFromDeployNFT721Storage(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.sourceNftContractAddress);
    builder.writeAddress(source.storageAddress);
    builder.writeBoolean(source.isOriginal);
    builder.writeNumber(source.key);
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeSlice(source.sourceNftContractAddressLock);
    builder.writeString(source.sourceChain);
    builder.writeAddress(source.nftItemAddress);
    builder.writeCell(source.metaDataUri);
    builder.writeAddress(source.sender);
    return builder.build();
}
function dictValueParserHiFromDeployNFT721Storage() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeHiFromDeployNFT721Storage(src)).endCell());
        },
        parse: (src) => {
            return loadHiFromDeployNFT721Storage(src.loadRef().beginParse());
        }
    };
}
function storeHiFromDeployNFT721Collection(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1037677720, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeAddress(src.newlyDeployCollection);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.transactionHash);
        b_0.storeStringRefTail(src.lockTxChain);
    };
}
exports.storeHiFromDeployNFT721Collection = storeHiFromDeployNFT721Collection;
function loadHiFromDeployNFT721Collection(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1037677720) {
        throw Error('Invalid prefix');
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _newlyDeployCollection = sc_0.loadAddress();
    let _sourceChain = sc_0.loadStringRefTail();
    let _transactionHash = sc_0.loadStringRefTail();
    let _lockTxChain = sc_0.loadStringRefTail();
    return { $$type: 'HiFromDeployNFT721Collection', tokenId: _tokenId, newlyDeployCollection: _newlyDeployCollection, sourceChain: _sourceChain, transactionHash: _transactionHash, lockTxChain: _lockTxChain };
}
exports.loadHiFromDeployNFT721Collection = loadHiFromDeployNFT721Collection;
function loadTupleHiFromDeployNFT721Collection(source) {
    let _tokenId = source.readBigNumber();
    let _newlyDeployCollection = source.readAddress();
    let _sourceChain = source.readString();
    let _transactionHash = source.readString();
    let _lockTxChain = source.readString();
    return { $$type: 'HiFromDeployNFT721Collection', tokenId: _tokenId, newlyDeployCollection: _newlyDeployCollection, sourceChain: _sourceChain, transactionHash: _transactionHash, lockTxChain: _lockTxChain };
}
function storeTupleHiFromDeployNFT721Collection(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeAddress(source.newlyDeployCollection);
    builder.writeString(source.sourceChain);
    builder.writeString(source.transactionHash);
    builder.writeString(source.lockTxChain);
    return builder.build();
}
function dictValueParserHiFromDeployNFT721Collection() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeHiFromDeployNFT721Collection(src)).endCell());
        },
        parse: (src) => {
            return loadHiFromDeployNFT721Collection(src.loadRef().beginParse());
        }
    };
}
function storeCollectionDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(4033579765, 32);
        b_0.storeAddress(src.newOwner);
        b_0.storeRef(src.metadata);
        b_0.storeInt(src.token_id, 257);
    };
}
exports.storeCollectionDeploy = storeCollectionDeploy;
function loadCollectionDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4033579765) {
        throw Error('Invalid prefix');
    }
    let _newOwner = sc_0.loadAddress();
    let _metadata = sc_0.loadRef();
    let _token_id = sc_0.loadIntBig(257);
    return { $$type: 'CollectionDeploy', newOwner: _newOwner, metadata: _metadata, token_id: _token_id };
}
exports.loadCollectionDeploy = loadCollectionDeploy;
function loadTupleCollectionDeploy(source) {
    let _newOwner = source.readAddress();
    let _metadata = source.readCell();
    let _token_id = source.readBigNumber();
    return { $$type: 'CollectionDeploy', newOwner: _newOwner, metadata: _metadata, token_id: _token_id };
}
function storeTupleCollectionDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.newOwner);
    builder.writeCell(source.metadata);
    builder.writeNumber(source.token_id);
    return builder.build();
}
function dictValueParserCollectionDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeCollectionDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionDeploy(src.loadRef().beginParse());
        }
    };
}
function storeStorageDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1498703807, 32);
        b_0.storeAddress(src.sourceNftContractAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        b_0.storeInt(src.tokenId, 257);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddressLock);
        let b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.sourceChain);
        b_1.storeAddress(src.nftItemAddress);
        b_1.storeRef(src.metaDataUri);
        b_1.storeAddress(src.sender);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeStorageDeploy = storeStorageDeploy;
function loadStorageDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1498703807) {
        throw Error('Invalid prefix');
    }
    let _sourceNftContractAddress = sc_0.loadAddress();
    let _isOriginal = sc_0.loadBit();
    let _key = sc_0.loadIntBig(257);
    let _tokenId = sc_0.loadIntBig(257);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddressLock = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _sourceChain = sc_1.loadStringRefTail();
    let _nftItemAddress = sc_1.loadAddress();
    let _metaDataUri = sc_1.loadRef();
    let _sender = sc_1.loadAddress();
    return { $$type: 'StorageDeploy', sourceNftContractAddress: _sourceNftContractAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
exports.loadStorageDeploy = loadStorageDeploy;
function loadTupleStorageDeploy(source) {
    let _sourceNftContractAddress = source.readAddress();
    let _isOriginal = source.readBoolean();
    let _key = source.readBigNumber();
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddressLock = source.readCell();
    let _sourceChain = source.readString();
    let _nftItemAddress = source.readAddress();
    let _metaDataUri = source.readCell();
    let _sender = source.readAddress();
    return { $$type: 'StorageDeploy', sourceNftContractAddress: _sourceNftContractAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
function storeTupleStorageDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.sourceNftContractAddress);
    builder.writeBoolean(source.isOriginal);
    builder.writeNumber(source.key);
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeSlice(source.sourceNftContractAddressLock);
    builder.writeString(source.sourceChain);
    builder.writeAddress(source.nftItemAddress);
    builder.writeCell(source.metaDataUri);
    builder.writeAddress(source.sender);
    return builder.build();
}
function dictValueParserStorageDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeStorageDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadStorageDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployNFT721Storage(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3037136312, 32);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        b_0.storeInt(src.tokenId, 257);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddressLock);
        let b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.sourceChain);
        b_1.storeAddress(src.nftItemAddress);
        b_1.storeRef(src.metaDataUri);
        b_1.storeAddress(src.sender);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Storage = storeDeployNFT721Storage;
function loadDeployNFT721Storage(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3037136312) {
        throw Error('Invalid prefix');
    }
    let _collectionAddress = sc_0.loadAddress();
    let _isOriginal = sc_0.loadBit();
    let _key = sc_0.loadIntBig(257);
    let _tokenId = sc_0.loadIntBig(257);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddressLock = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _sourceChain = sc_1.loadStringRefTail();
    let _nftItemAddress = sc_1.loadAddress();
    let _metaDataUri = sc_1.loadRef();
    let _sender = sc_1.loadAddress();
    return { $$type: 'DeployNFT721Storage', collectionAddress: _collectionAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
exports.loadDeployNFT721Storage = loadDeployNFT721Storage;
function loadTupleDeployNFT721Storage(source) {
    let _collectionAddress = source.readAddress();
    let _isOriginal = source.readBoolean();
    let _key = source.readBigNumber();
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddressLock = source.readCell();
    let _sourceChain = source.readString();
    let _nftItemAddress = source.readAddress();
    let _metaDataUri = source.readCell();
    let _sender = source.readAddress();
    return { $$type: 'DeployNFT721Storage', collectionAddress: _collectionAddress, isOriginal: _isOriginal, key: _key, tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddressLock: _sourceNftContractAddressLock, sourceChain: _sourceChain, nftItemAddress: _nftItemAddress, metaDataUri: _metaDataUri, sender: _sender };
}
function storeTupleDeployNFT721Storage(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.collectionAddress);
    builder.writeBoolean(source.isOriginal);
    builder.writeNumber(source.key);
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeSlice(source.sourceNftContractAddressLock);
    builder.writeString(source.sourceChain);
    builder.writeAddress(source.nftItemAddress);
    builder.writeCell(source.metaDataUri);
    builder.writeAddress(source.sender);
    return builder.build();
}
function dictValueParserDeployNFT721Storage() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDeployNFT721Storage(src)).endCell());
        },
        parse: (src) => {
            return loadDeployNFT721Storage(src.loadRef().beginParse());
        }
    };
}
function storeDeployNFT721Collection(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2399096803, 32);
        b_0.storeRef(src.collection_content);
        b_0.store(storeRoyaltyParams(src.royalty_params));
        let b_1 = new core_1.Builder();
        b_1.storeAddress(src.destination_user_address);
        b_1.storeStringRefTail(src.source_chain);
        b_1.storeStringRefTail(src.transaction_hash);
        b_1.storeRef(src.metadata);
        b_1.storeInt(src.token_id, 257);
        let b_2 = new core_1.Builder();
        b_2.storeStringRefTail(src.lockTxChain);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Collection = storeDeployNFT721Collection;
function loadDeployNFT721Collection(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2399096803) {
        throw Error('Invalid prefix');
    }
    let _collection_content = sc_0.loadRef();
    let _royalty_params = loadRoyaltyParams(sc_0);
    let sc_1 = sc_0.loadRef().beginParse();
    let _destination_user_address = sc_1.loadAddress();
    let _source_chain = sc_1.loadStringRefTail();
    let _transaction_hash = sc_1.loadStringRefTail();
    let _metadata = sc_1.loadRef();
    let _token_id = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _lockTxChain = sc_2.loadStringRefTail();
    return { $$type: 'DeployNFT721Collection', collection_content: _collection_content, royalty_params: _royalty_params, destination_user_address: _destination_user_address, source_chain: _source_chain, transaction_hash: _transaction_hash, metadata: _metadata, token_id: _token_id, lockTxChain: _lockTxChain };
}
exports.loadDeployNFT721Collection = loadDeployNFT721Collection;
function loadTupleDeployNFT721Collection(source) {
    let _collection_content = source.readCell();
    const _royalty_params = loadTupleRoyaltyParams(source.readTuple());
    let _destination_user_address = source.readAddress();
    let _source_chain = source.readString();
    let _transaction_hash = source.readString();
    let _metadata = source.readCell();
    let _token_id = source.readBigNumber();
    let _lockTxChain = source.readString();
    return { $$type: 'DeployNFT721Collection', collection_content: _collection_content, royalty_params: _royalty_params, destination_user_address: _destination_user_address, source_chain: _source_chain, transaction_hash: _transaction_hash, metadata: _metadata, token_id: _token_id, lockTxChain: _lockTxChain };
}
function storeTupleDeployNFT721Collection(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.collection_content);
    builder.writeTuple(storeTupleRoyaltyParams(source.royalty_params));
    builder.writeAddress(source.destination_user_address);
    builder.writeString(source.source_chain);
    builder.writeString(source.transaction_hash);
    builder.writeCell(source.metadata);
    builder.writeNumber(source.token_id);
    builder.writeString(source.lockTxChain);
    return builder.build();
}
function dictValueParserDeployNFT721Collection() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDeployNFT721Collection(src)).endCell());
        },
        parse: (src) => {
            return loadDeployNFT721Collection(src.loadRef().beginParse());
        }
    };
}
function storeCreatedCollection(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(41705028, 32);
        b_0.storeAddress(src.collectionAddress);
    };
}
exports.storeCreatedCollection = storeCreatedCollection;
function loadCreatedCollection(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 41705028) {
        throw Error('Invalid prefix');
    }
    let _collectionAddress = sc_0.loadAddress();
    return { $$type: 'CreatedCollection', collectionAddress: _collectionAddress };
}
exports.loadCreatedCollection = loadCreatedCollection;
function loadTupleCreatedCollection(source) {
    let _collectionAddress = source.readAddress();
    return { $$type: 'CreatedCollection', collectionAddress: _collectionAddress };
}
function storeTupleCreatedCollection(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.collectionAddress);
    return builder.build();
}
function dictValueParserCreatedCollection() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeCreatedCollection(src)).endCell());
        },
        parse: (src) => {
            return loadCreatedCollection(src.loadRef().beginParse());
        }
    };
}
function storeUnlockToken(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2585927731, 32);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.token_id, 257);
    };
}
exports.storeUnlockToken = storeUnlockToken;
function loadUnlockToken(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2585927731) {
        throw Error('Invalid prefix');
    }
    let _to = sc_0.loadAddress();
    let _token_id = sc_0.loadIntBig(257);
    return { $$type: 'UnlockToken', to: _to, token_id: _token_id };
}
exports.loadUnlockToken = loadUnlockToken;
function loadTupleUnlockToken(source) {
    let _to = source.readAddress();
    let _token_id = source.readBigNumber();
    return { $$type: 'UnlockToken', to: _to, token_id: _token_id };
}
function storeTupleUnlockToken(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.to);
    builder.writeNumber(source.token_id);
    return builder.build();
}
function dictValueParserUnlockToken() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeUnlockToken(src)).endCell());
        },
        parse: (src) => {
            return loadUnlockToken(src.loadRef().beginParse());
        }
    };
}
function storeMintOne(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3338267266, 32);
        b_0.storeAddress(src.new_owner);
        b_0.storeRef(src.content);
    };
}
exports.storeMintOne = storeMintOne;
function loadMintOne(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3338267266) {
        throw Error('Invalid prefix');
    }
    let _new_owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return { $$type: 'MintOne', new_owner: _new_owner, content: _content };
}
exports.loadMintOne = loadMintOne;
function loadTupleMintOne(source) {
    let _new_owner = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'MintOne', new_owner: _new_owner, content: _content };
}
function storeTupleMintOne(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.new_owner);
    builder.writeCell(source.content);
    return builder.build();
}
function dictValueParserMintOne() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeMintOne(src)).endCell());
        },
        parse: (src) => {
            return loadMintOne(src.loadRef().beginParse());
        }
    };
}
function storeMint(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1355444520, 32);
        b_0.storeInt(src.token_id, 257);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
    };
}
exports.storeMint = storeMint;
function loadMint(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1355444520) {
        throw Error('Invalid prefix');
    }
    let _token_id = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return { $$type: 'Mint', token_id: _token_id, owner: _owner, content: _content };
}
exports.loadMint = loadMint;
function loadTupleMint(source) {
    let _token_id = source.readBigNumber();
    let _owner = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'Mint', token_id: _token_id, owner: _owner, content: _content };
}
function storeTupleMint(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.token_id);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    return builder.build();
}
function dictValueParserMint() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    };
}
function storeValidator(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeBit(src.added);
        b_0.storeCoins(src.pendingRewards);
    };
}
exports.storeValidator = storeValidator;
function loadValidator(slice) {
    let sc_0 = slice;
    let _address = sc_0.loadAddress();
    let _added = sc_0.loadBit();
    let _pendingRewards = sc_0.loadCoins();
    return { $$type: 'Validator', address: _address, added: _added, pendingRewards: _pendingRewards };
}
exports.loadValidator = loadValidator;
function loadTupleValidator(source) {
    let _address = source.readAddress();
    let _added = source.readBoolean();
    let _pendingRewards = source.readBigNumber();
    return { $$type: 'Validator', address: _address, added: _added, pendingRewards: _pendingRewards };
}
function storeTupleValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.address);
    builder.writeBoolean(source.added);
    builder.writeNumber(source.pendingRewards);
    return builder.build();
}
function dictValueParserValidator() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeValidator(src)).endCell());
        },
        parse: (src) => {
            return loadValidator(src.loadRef().beginParse());
        }
    };
}
function storeSignerAndSignature(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.signature);
        b_0.storeUint(src.key, 256);
    };
}
exports.storeSignerAndSignature = storeSignerAndSignature;
function loadSignerAndSignature(slice) {
    let sc_0 = slice;
    let _signature = sc_0.loadRef();
    let _key = sc_0.loadUintBig(256);
    return { $$type: 'SignerAndSignature', signature: _signature, key: _key };
}
exports.loadSignerAndSignature = loadSignerAndSignature;
function loadTupleSignerAndSignature(source) {
    let _signature = source.readCell();
    let _key = source.readBigNumber();
    return { $$type: 'SignerAndSignature', signature: _signature, key: _key };
}
function storeTupleSignerAndSignature(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeSlice(source.signature);
    builder.writeNumber(source.key);
    return builder.build();
}
function dictValueParserSignerAndSignature() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeSignerAndSignature(src)).endCell());
        },
        parse: (src) => {
            return loadSignerAndSignature(src.loadRef().beginParse());
        }
    };
}
function storeNewValidator(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.key, 256);
    };
}
exports.storeNewValidator = storeNewValidator;
function loadNewValidator(slice) {
    let sc_0 = slice;
    let _key = sc_0.loadUintBig(256);
    return { $$type: 'NewValidator', key: _key };
}
exports.loadNewValidator = loadNewValidator;
function loadTupleNewValidator(source) {
    let _key = source.readBigNumber();
    return { $$type: 'NewValidator', key: _key };
}
function storeTupleNewValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.key);
    return builder.build();
}
function dictValueParserNewValidator() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeNewValidator(src)).endCell());
        },
        parse: (src) => {
            return loadNewValidator(src.loadRef().beginParse());
        }
    };
}
function storeValidatorsToRewards(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeDict(src.addresses, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
        b_0.storeDict(src.publicKeys, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
        b_0.storeInt(src.len, 257);
    };
}
exports.storeValidatorsToRewards = storeValidatorsToRewards;
function loadValidatorsToRewards(slice) {
    let sc_0 = slice;
    let _addresses = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), sc_0);
    let _publicKeys = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), sc_0);
    let _len = sc_0.loadIntBig(257);
    return { $$type: 'ValidatorsToRewards', addresses: _addresses, publicKeys: _publicKeys, len: _len };
}
exports.loadValidatorsToRewards = loadValidatorsToRewards;
function loadTupleValidatorsToRewards(source) {
    let _addresses = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), source.readCellOpt());
    let _publicKeys = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    let _len = source.readBigNumber();
    return { $$type: 'ValidatorsToRewards', addresses: _addresses, publicKeys: _publicKeys, len: _len };
}
function storeTupleValidatorsToRewards(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.addresses.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.addresses, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address()).endCell() : null);
    builder.writeCell(source.publicKeys.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.publicKeys, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.len);
    return builder.build();
}
function dictValueParserValidatorsToRewards() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeValidatorsToRewards(src)).endCell());
        },
        parse: (src) => {
            return loadValidatorsToRewards(src.loadRef().beginParse());
        }
    };
}
function storeDuplicateToOriginalContractInfo(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeRef(src.contractAddress);
        b_0.storeInt(src.lastIndex, 257);
        let b_1 = new core_1.Builder();
        b_1.storeRef(src.collectionContent);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDuplicateToOriginalContractInfo = storeDuplicateToOriginalContractInfo;
function loadDuplicateToOriginalContractInfo(slice) {
    let sc_0 = slice;
    let _keyChain = sc_0.loadStringRefTail();
    let _chain = sc_0.loadStringRefTail();
    let _contractAddress = sc_0.loadRef();
    let _lastIndex = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _collectionContent = sc_1.loadRef();
    return { $$type: 'DuplicateToOriginalContractInfo', keyChain: _keyChain, chain: _chain, contractAddress: _contractAddress, lastIndex: _lastIndex, collectionContent: _collectionContent };
}
exports.loadDuplicateToOriginalContractInfo = loadDuplicateToOriginalContractInfo;
function loadTupleDuplicateToOriginalContractInfo(source) {
    let _keyChain = source.readString();
    let _chain = source.readString();
    let _contractAddress = source.readCell();
    let _lastIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    return { $$type: 'DuplicateToOriginalContractInfo', keyChain: _keyChain, chain: _chain, contractAddress: _contractAddress, lastIndex: _lastIndex, collectionContent: _collectionContent };
}
function storeTupleDuplicateToOriginalContractInfo(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeString(source.keyChain);
    builder.writeString(source.chain);
    builder.writeSlice(source.contractAddress);
    builder.writeNumber(source.lastIndex);
    builder.writeCell(source.collectionContent);
    return builder.build();
}
function dictValueParserDuplicateToOriginalContractInfo() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDuplicateToOriginalContractInfo(src)).endCell());
        },
        parse: (src) => {
            return loadDuplicateToOriginalContractInfo(src.loadRef().beginParse());
        }
    };
}
function storeOriginalToDuplicateContractInfo(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeAddress(src.contractAddress);
        b_0.storeInt(src.lastIndex, 257);
        b_0.storeRef(src.collectionContent);
    };
}
exports.storeOriginalToDuplicateContractInfo = storeOriginalToDuplicateContractInfo;
function loadOriginalToDuplicateContractInfo(slice) {
    let sc_0 = slice;
    let _keyChain = sc_0.loadStringRefTail();
    let _chain = sc_0.loadStringRefTail();
    let _contractAddress = sc_0.loadAddress();
    let _lastIndex = sc_0.loadIntBig(257);
    let _collectionContent = sc_0.loadRef();
    return { $$type: 'OriginalToDuplicateContractInfo', keyChain: _keyChain, chain: _chain, contractAddress: _contractAddress, lastIndex: _lastIndex, collectionContent: _collectionContent };
}
exports.loadOriginalToDuplicateContractInfo = loadOriginalToDuplicateContractInfo;
function loadTupleOriginalToDuplicateContractInfo(source) {
    let _keyChain = source.readString();
    let _chain = source.readString();
    let _contractAddress = source.readAddress();
    let _lastIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    return { $$type: 'OriginalToDuplicateContractInfo', keyChain: _keyChain, chain: _chain, contractAddress: _contractAddress, lastIndex: _lastIndex, collectionContent: _collectionContent };
}
function storeTupleOriginalToDuplicateContractInfo(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeString(source.keyChain);
    builder.writeString(source.chain);
    builder.writeAddress(source.contractAddress);
    builder.writeNumber(source.lastIndex);
    builder.writeCell(source.collectionContent);
    return builder.build();
}
function dictValueParserOriginalToDuplicateContractInfo() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeOriginalToDuplicateContractInfo(src)).endCell());
        },
        parse: (src) => {
            return loadOriginalToDuplicateContractInfo(src.loadRef().beginParse());
        }
    };
}
function storeClaimData1(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.tokenId, 64);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeAddress(src.destinationUserAddress);
        b_0.storeUint(src.tokenAmount, 64);
    };
}
exports.storeClaimData1 = storeClaimData1;
function loadClaimData1(slice) {
    let sc_0 = slice;
    let _tokenId = sc_0.loadUintBig(64);
    let _sourceChain = sc_0.loadStringRefTail();
    let _destinationChain = sc_0.loadStringRefTail();
    let _destinationUserAddress = sc_0.loadAddress();
    let _tokenAmount = sc_0.loadUintBig(64);
    return { $$type: 'ClaimData1', tokenId: _tokenId, sourceChain: _sourceChain, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, tokenAmount: _tokenAmount };
}
exports.loadClaimData1 = loadClaimData1;
function loadTupleClaimData1(source) {
    let _tokenId = source.readBigNumber();
    let _sourceChain = source.readString();
    let _destinationChain = source.readString();
    let _destinationUserAddress = source.readAddress();
    let _tokenAmount = source.readBigNumber();
    return { $$type: 'ClaimData1', tokenId: _tokenId, sourceChain: _sourceChain, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, tokenAmount: _tokenAmount };
}
function storeTupleClaimData1(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeString(source.sourceChain);
    builder.writeString(source.destinationChain);
    builder.writeAddress(source.destinationUserAddress);
    builder.writeNumber(source.tokenAmount);
    return builder.build();
}
function dictValueParserClaimData1() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimData1(src)).endCell());
        },
        parse: (src) => {
            return loadClaimData1(src.loadRef().beginParse());
        }
    };
}
function storeClaimData2(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
        b_0.storeStringRefTail(src.nftType);
    };
}
exports.storeClaimData2 = storeClaimData2;
function loadClaimData2(slice) {
    let sc_0 = slice;
    let _name = sc_0.loadStringRefTail();
    let _symbol = sc_0.loadStringRefTail();
    let _nftType = sc_0.loadStringRefTail();
    return { $$type: 'ClaimData2', name: _name, symbol: _symbol, nftType: _nftType };
}
exports.loadClaimData2 = loadClaimData2;
function loadTupleClaimData2(source) {
    let _name = source.readString();
    let _symbol = source.readString();
    let _nftType = source.readString();
    return { $$type: 'ClaimData2', name: _name, symbol: _symbol, nftType: _nftType };
}
function storeTupleClaimData2(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeString(source.name);
    builder.writeString(source.symbol);
    builder.writeString(source.nftType);
    return builder.build();
}
function dictValueParserClaimData2() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimData2(src)).endCell());
        },
        parse: (src) => {
            return loadClaimData2(src.loadRef().beginParse());
        }
    };
}
function storeClaimData3(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.fee, 64);
        b_0.storeRef(src.sourceNftContractAddress);
        b_0.storeAddress(src.royaltyReceiver);
        b_0.storeRef(src.metadata);
    };
}
exports.storeClaimData3 = storeClaimData3;
function loadClaimData3(slice) {
    let sc_0 = slice;
    let _fee = sc_0.loadUintBig(64);
    let _sourceNftContractAddress = sc_0.loadRef();
    let _royaltyReceiver = sc_0.loadAddress();
    let _metadata = sc_0.loadRef();
    return { $$type: 'ClaimData3', fee: _fee, sourceNftContractAddress: _sourceNftContractAddress, royaltyReceiver: _royaltyReceiver, metadata: _metadata };
}
exports.loadClaimData3 = loadClaimData3;
function loadTupleClaimData3(source) {
    let _fee = source.readBigNumber();
    let _sourceNftContractAddress = source.readCell();
    let _royaltyReceiver = source.readAddress();
    let _metadata = source.readCell();
    return { $$type: 'ClaimData3', fee: _fee, sourceNftContractAddress: _sourceNftContractAddress, royaltyReceiver: _royaltyReceiver, metadata: _metadata };
}
function storeTupleClaimData3(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.fee);
    builder.writeSlice(source.sourceNftContractAddress);
    builder.writeAddress(source.royaltyReceiver);
    builder.writeCell(source.metadata);
    return builder.build();
}
function dictValueParserClaimData3() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimData3(src)).endCell());
        },
        parse: (src) => {
            return loadClaimData3(src.loadRef().beginParse());
        }
    };
}
function storeClaimData4(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.newContent);
        b_0.storeStringRefTail(src.transactionHash);
        b_0.store(storeRoyaltyParams(src.royalty));
        b_0.storeStringRefTail(src.lockTxChain);
    };
}
exports.storeClaimData4 = storeClaimData4;
function loadClaimData4(slice) {
    let sc_0 = slice;
    let _newContent = sc_0.loadRef();
    let _transactionHash = sc_0.loadStringRefTail();
    let _royalty = loadRoyaltyParams(sc_0);
    let _lockTxChain = sc_0.loadStringRefTail();
    return { $$type: 'ClaimData4', newContent: _newContent, transactionHash: _transactionHash, royalty: _royalty, lockTxChain: _lockTxChain };
}
exports.loadClaimData4 = loadClaimData4;
function loadTupleClaimData4(source) {
    let _newContent = source.readCell();
    let _transactionHash = source.readString();
    const _royalty = loadTupleRoyaltyParams(source.readTuple());
    let _lockTxChain = source.readString();
    return { $$type: 'ClaimData4', newContent: _newContent, transactionHash: _transactionHash, royalty: _royalty, lockTxChain: _lockTxChain };
}
function storeTupleClaimData4(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.newContent);
    builder.writeString(source.transactionHash);
    builder.writeTuple(storeTupleRoyaltyParams(source.royalty));
    builder.writeString(source.lockTxChain);
    return builder.build();
}
function dictValueParserClaimData4() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimData4(src)).endCell());
        },
        parse: (src) => {
            return loadClaimData4(src.loadRef().beginParse());
        }
    };
}
function storeClaimData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.store(storeClaimData1(src.data1));
        let b_1 = new core_1.Builder();
        b_1.store(storeClaimData2(src.data2));
        let b_2 = new core_1.Builder();
        b_2.store(storeClaimData3(src.data3));
        let b_3 = new core_1.Builder();
        b_3.store(storeClaimData4(src.data4));
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeClaimData = storeClaimData;
function loadClaimData(slice) {
    let sc_0 = slice;
    let _data1 = loadClaimData1(sc_0);
    let sc_1 = sc_0.loadRef().beginParse();
    let _data2 = loadClaimData2(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _data3 = loadClaimData3(sc_2);
    let sc_3 = sc_2.loadRef().beginParse();
    let _data4 = loadClaimData4(sc_3);
    return { $$type: 'ClaimData', data1: _data1, data2: _data2, data3: _data3, data4: _data4 };
}
exports.loadClaimData = loadClaimData;
function loadTupleClaimData(source) {
    const _data1 = loadTupleClaimData1(source.readTuple());
    const _data2 = loadTupleClaimData2(source.readTuple());
    const _data3 = loadTupleClaimData3(source.readTuple());
    const _data4 = loadTupleClaimData4(source.readTuple());
    return { $$type: 'ClaimData', data1: _data1, data2: _data2, data3: _data3, data4: _data4 };
}
function storeTupleClaimData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleClaimData1(source.data1));
    builder.writeTuple(storeTupleClaimData2(source.data2));
    builder.writeTuple(storeTupleClaimData3(source.data3));
    builder.writeTuple(storeTupleClaimData4(source.data4));
    return builder.build();
}
function dictValueParserClaimData() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimData(src)).endCell());
        },
        parse: (src) => {
            return loadClaimData(src.loadRef().beginParse());
        }
    };
}
function storeToken(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeInt(src.tokenId, 257);
        b_0.storeStringRefTail(src.chain);
        b_0.storeRef(src.contractAddress);
    };
}
exports.storeToken = storeToken;
function loadToken(slice) {
    let sc_0 = slice;
    let _tokenId = sc_0.loadIntBig(257);
    let _chain = sc_0.loadStringRefTail();
    let _contractAddress = sc_0.loadRef();
    return { $$type: 'Token', tokenId: _tokenId, chain: _chain, contractAddress: _contractAddress };
}
exports.loadToken = loadToken;
function loadTupleToken(source) {
    let _tokenId = source.readBigNumber();
    let _chain = source.readString();
    let _contractAddress = source.readCell();
    return { $$type: 'Token', tokenId: _tokenId, chain: _chain, contractAddress: _contractAddress };
}
function storeTupleToken(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeString(source.chain);
    builder.writeSlice(source.contractAddress);
    return builder.build();
}
function dictValueParserToken() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeToken(src)).endCell());
        },
        parse: (src) => {
            return loadToken(src.loadRef().beginParse());
        }
    };
}
function storeAddValidator(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3868963206, 32);
        b_0.store(storeNewValidator(src.newValidatorPublicKey));
        b_0.storeAddress(src.newValidatorAddress);
        b_0.storeDict(src.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeAddValidator = storeAddValidator;
function loadAddValidator(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3868963206) {
        throw Error('Invalid prefix');
    }
    let _newValidatorPublicKey = loadNewValidator(sc_0);
    let _newValidatorAddress = sc_0.loadAddress();
    let _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    let _len = sc_0.loadUintBig(256);
    return { $$type: 'AddValidator', newValidatorPublicKey: _newValidatorPublicKey, newValidatorAddress: _newValidatorAddress, sigs: _sigs, len: _len };
}
exports.loadAddValidator = loadAddValidator;
function loadTupleAddValidator(source) {
    const _newValidatorPublicKey = loadTupleNewValidator(source.readTuple());
    let _newValidatorAddress = source.readAddress();
    let _sigs = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), source.readCellOpt());
    let _len = source.readBigNumber();
    return { $$type: 'AddValidator', newValidatorPublicKey: _newValidatorPublicKey, newValidatorAddress: _newValidatorAddress, sigs: _sigs, len: _len };
}
function storeTupleAddValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleNewValidator(source.newValidatorPublicKey));
    builder.writeAddress(source.newValidatorAddress);
    builder.writeCell(source.sigs.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature()).endCell() : null);
    builder.writeNumber(source.len);
    return builder.build();
}
function dictValueParserAddValidator() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeAddValidator(src)).endCell());
        },
        parse: (src) => {
            return loadAddValidator(src.loadRef().beginParse());
        }
    };
}
function storeRewardValidator(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1316982074, 32);
        b_0.store(storeNewValidator(src.validator));
    };
}
exports.storeRewardValidator = storeRewardValidator;
function loadRewardValidator(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1316982074) {
        throw Error('Invalid prefix');
    }
    let _validator = loadNewValidator(sc_0);
    return { $$type: 'RewardValidator', validator: _validator };
}
exports.loadRewardValidator = loadRewardValidator;
function loadTupleRewardValidator(source) {
    const _validator = loadTupleNewValidator(source.readTuple());
    return { $$type: 'RewardValidator', validator: _validator };
}
function storeTupleRewardValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleNewValidator(source.validator));
    return builder.build();
}
function dictValueParserRewardValidator() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeRewardValidator(src)).endCell());
        },
        parse: (src) => {
            return loadRewardValidator(src.loadRef().beginParse());
        }
    };
}
function storeLock721(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(62791907, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeAddress(src.sourceNftContractAddress);
        b_0.storeRef(src.metaDataUri);
    };
}
exports.storeLock721 = storeLock721;
function loadLock721(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 62791907) {
        throw Error('Invalid prefix');
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddress = sc_0.loadAddress();
    let _metaDataUri = sc_0.loadRef();
    return { $$type: 'Lock721', tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddress: _sourceNftContractAddress, metaDataUri: _metaDataUri };
}
exports.loadLock721 = loadLock721;
function loadTupleLock721(source) {
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddress = source.readAddress();
    let _metaDataUri = source.readCell();
    return { $$type: 'Lock721', tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddress: _sourceNftContractAddress, metaDataUri: _metaDataUri };
}
function storeTupleLock721(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeAddress(source.sourceNftContractAddress);
    builder.writeCell(source.metaDataUri);
    return builder.build();
}
function dictValueParserLock721() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeLock721(src)).endCell());
        },
        parse: (src) => {
            return loadLock721(src.loadRef().beginParse());
        }
    };
}
function storeClaimNFT721(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2933783886, 32);
        b_0.store(storeClaimData(src.data));
        b_0.storeDict(src.signatures, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeClaimNFT721 = storeClaimNFT721;
function loadClaimNFT721(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2933783886) {
        throw Error('Invalid prefix');
    }
    let _data = loadClaimData(sc_0);
    let _signatures = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    let _len = sc_0.loadUintBig(256);
    return { $$type: 'ClaimNFT721', data: _data, signatures: _signatures, len: _len };
}
exports.loadClaimNFT721 = loadClaimNFT721;
function loadTupleClaimNFT721(source) {
    const _data = loadTupleClaimData(source.readTuple());
    let _signatures = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), source.readCellOpt());
    let _len = source.readBigNumber();
    return { $$type: 'ClaimNFT721', data: _data, signatures: _signatures, len: _len };
}
function storeTupleClaimNFT721(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleClaimData(source.data));
    builder.writeCell(source.signatures.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.signatures, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature()).endCell() : null);
    builder.writeNumber(source.len);
    return builder.build();
}
function dictValueParserClaimNFT721() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimNFT721(src)).endCell());
        },
        parse: (src) => {
            return loadClaimNFT721(src.loadRef().beginParse());
        }
    };
}
function storeStakeEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1284335502, 32);
        b_0.storeCoins(src.amount);
        b_0.storeStringRefTail(src.asd);
    };
}
exports.storeStakeEvent = storeStakeEvent;
function loadStakeEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1284335502) {
        throw Error('Invalid prefix');
    }
    let _amount = sc_0.loadCoins();
    let _asd = sc_0.loadStringRefTail();
    return { $$type: 'StakeEvent', amount: _amount, asd: _asd };
}
exports.loadStakeEvent = loadStakeEvent;
function loadTupleStakeEvent(source) {
    let _amount = source.readBigNumber();
    let _asd = source.readString();
    return { $$type: 'StakeEvent', amount: _amount, asd: _asd };
}
function storeTupleStakeEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeString(source.asd);
    return builder.build();
}
function dictValueParserStakeEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeStakeEvent(src)).endCell());
        },
        parse: (src) => {
            return loadStakeEvent(src.loadRef().beginParse());
        }
    };
}
function storeAddNewValidatorEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3100755976, 32);
        b_0.storeUint(src.validator, 256);
    };
}
exports.storeAddNewValidatorEvent = storeAddNewValidatorEvent;
function loadAddNewValidatorEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3100755976) {
        throw Error('Invalid prefix');
    }
    let _validator = sc_0.loadUintBig(256);
    return { $$type: 'AddNewValidatorEvent', validator: _validator };
}
exports.loadAddNewValidatorEvent = loadAddNewValidatorEvent;
function loadTupleAddNewValidatorEvent(source) {
    let _validator = source.readBigNumber();
    return { $$type: 'AddNewValidatorEvent', validator: _validator };
}
function storeTupleAddNewValidatorEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.validator);
    return builder.build();
}
function dictValueParserAddNewValidatorEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeAddNewValidatorEvent(src)).endCell());
        },
        parse: (src) => {
            return loadAddNewValidatorEvent(src.loadRef().beginParse());
        }
    };
}
function storeRewardValidatorEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2049240067, 32);
        b_0.storeUint(src.validator, 256);
    };
}
exports.storeRewardValidatorEvent = storeRewardValidatorEvent;
function loadRewardValidatorEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2049240067) {
        throw Error('Invalid prefix');
    }
    let _validator = sc_0.loadUintBig(256);
    return { $$type: 'RewardValidatorEvent', validator: _validator };
}
exports.loadRewardValidatorEvent = loadRewardValidatorEvent;
function loadTupleRewardValidatorEvent(source) {
    let _validator = source.readBigNumber();
    return { $$type: 'RewardValidatorEvent', validator: _validator };
}
function storeTupleRewardValidatorEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.validator);
    return builder.build();
}
function dictValueParserRewardValidatorEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeRewardValidatorEvent(src)).endCell());
        },
        parse: (src) => {
            return loadRewardValidatorEvent(src.loadRef().beginParse());
        }
    };
}
function storeLockedEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2105076052, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddress);
        b_0.storeUint(src.tokenAmount, 256);
        let b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.nftType);
        b_1.storeStringRefTail(src.sourceChain);
        b_1.storeRef(src.metaDataUri);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeLockedEvent = storeLockedEvent;
function loadLockedEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2105076052) {
        throw Error('Invalid prefix');
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddress = sc_0.loadRef();
    let _tokenAmount = sc_0.loadUintBig(256);
    let sc_1 = sc_0.loadRef().beginParse();
    let _nftType = sc_1.loadStringRefTail();
    let _sourceChain = sc_1.loadStringRefTail();
    let _metaDataUri = sc_1.loadRef();
    return { $$type: 'LockedEvent', tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddress: _sourceNftContractAddress, tokenAmount: _tokenAmount, nftType: _nftType, sourceChain: _sourceChain, metaDataUri: _metaDataUri };
}
exports.loadLockedEvent = loadLockedEvent;
function loadTupleLockedEvent(source) {
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddress = source.readCell();
    let _tokenAmount = source.readBigNumber();
    let _nftType = source.readString();
    let _sourceChain = source.readString();
    let _metaDataUri = source.readCell();
    return { $$type: 'LockedEvent', tokenId: _tokenId, destinationChain: _destinationChain, destinationUserAddress: _destinationUserAddress, sourceNftContractAddress: _sourceNftContractAddress, tokenAmount: _tokenAmount, nftType: _nftType, sourceChain: _sourceChain, metaDataUri: _metaDataUri };
}
function storeTupleLockedEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeSlice(source.sourceNftContractAddress);
    builder.writeNumber(source.tokenAmount);
    builder.writeString(source.nftType);
    builder.writeString(source.sourceChain);
    builder.writeCell(source.metaDataUri);
    return builder.build();
}
function dictValueParserLockedEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeLockedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadLockedEvent(src.loadRef().beginParse());
        }
    };
}
function storeUnLock721Event(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2428616504, 32);
        b_0.storeAddress(src.to);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeAddress(src.contractAddress);
    };
}
exports.storeUnLock721Event = storeUnLock721Event;
function loadUnLock721Event(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2428616504) {
        throw Error('Invalid prefix');
    }
    let _to = sc_0.loadAddress();
    let _tokenId = sc_0.loadUintBig(256);
    let _contractAddress = sc_0.loadAddress();
    return { $$type: 'UnLock721Event', to: _to, tokenId: _tokenId, contractAddress: _contractAddress };
}
exports.loadUnLock721Event = loadUnLock721Event;
function loadTupleUnLock721Event(source) {
    let _to = source.readAddress();
    let _tokenId = source.readBigNumber();
    let _contractAddress = source.readAddress();
    return { $$type: 'UnLock721Event', to: _to, tokenId: _tokenId, contractAddress: _contractAddress };
}
function storeTupleUnLock721Event(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.to);
    builder.writeNumber(source.tokenId);
    builder.writeAddress(source.contractAddress);
    return builder.build();
}
function dictValueParserUnLock721Event() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeUnLock721Event(src)).endCell());
        },
        parse: (src) => {
            return loadUnLock721Event(src.loadRef().beginParse());
        }
    };
}
function storeClaimedEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2421062321, 32);
        b_0.storeStringRefTail(src.lockTxChain);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeAddress(src.newlyDeployCollection);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.transactionHash);
    };
}
exports.storeClaimedEvent = storeClaimedEvent;
function loadClaimedEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2421062321) {
        throw Error('Invalid prefix');
    }
    let _lockTxChain = sc_0.loadStringRefTail();
    let _tokenId = sc_0.loadUintBig(256);
    let _newlyDeployCollection = sc_0.loadAddress();
    let _sourceChain = sc_0.loadStringRefTail();
    let _transactionHash = sc_0.loadStringRefTail();
    return { $$type: 'ClaimedEvent', lockTxChain: _lockTxChain, tokenId: _tokenId, newlyDeployCollection: _newlyDeployCollection, sourceChain: _sourceChain, transactionHash: _transactionHash };
}
exports.loadClaimedEvent = loadClaimedEvent;
function loadTupleClaimedEvent(source) {
    let _lockTxChain = source.readString();
    let _tokenId = source.readBigNumber();
    let _newlyDeployCollection = source.readAddress();
    let _sourceChain = source.readString();
    let _transactionHash = source.readString();
    return { $$type: 'ClaimedEvent', lockTxChain: _lockTxChain, tokenId: _tokenId, newlyDeployCollection: _newlyDeployCollection, sourceChain: _sourceChain, transactionHash: _transactionHash };
}
function storeTupleClaimedEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeString(source.lockTxChain);
    builder.writeNumber(source.tokenId);
    builder.writeAddress(source.newlyDeployCollection);
    builder.writeString(source.sourceChain);
    builder.writeString(source.transactionHash);
    return builder.build();
}
function dictValueParserClaimedEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeClaimedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadClaimedEvent(src.loadRef().beginParse());
        }
    };
}
function initNftItem_init_args(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.item_index, 257);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.individual_content);
    };
}
async function NftItem_init(collection_address, item_index, owner, individual_content) {
    const __code = core_1.Cell.fromBase64('te6ccgECGQEABZEAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVFNs88uCCEwQFAgFYDxADyAGSMH/gcCHXScIflTAg1wsf3iCCEMb56oK6jrIw0x8BghDG+eqCuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1FlsEuAgghBfzD0UuuMCghAvyyaiuuMCMHAGBwgArsj4QwHMfwHKAFVAUFQg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYSgQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEszKAMntVAG0MzOCAME9+EFvJBAjXwNSYMcF8vT4QW8kE18D+CdvECGhggnJw4BmtgihggnJw4CgoYEiAAKzEvL0fyNxgQGkyAGCENUydttYyx/LP8kQNhAkf1UwbW3bPAJ/DQOsMNs8bBYy+EFvJIIAwIBRw8cFHPL0IPgnbxAhoYIJycOAZrYIoYIJycOAoKEpwACOol8GMzR/cIBCA8gBghDVMnbbWMsfyz/JEDRBQH9VMG1t2zzjDn8JDQoBwtMfAYIQL8smorry4IHTPwEx+EFvJBAjXwNwgEB/VDSJyFUgghCLdxc1UATLHxLLP4EBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskQNEEwFEMwbW3bPH8NAMTTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi+gDUAdAWFRRDMAPGU3TCAI7JclOkcArIVSCCEAUTjZFQBMsfEss/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFshYzxbJAczJJxBLA1CZFEMwbW3bPJI2N+JVAgrbPBOhIW6zk1s0MOMNDQsMAGRsMfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igw+gAxcdch+gAx+gAwpwOrAAE8UAahcQPIAYIQ1TJ221jLH8s/yRA2QWB/VTBtbds8DQHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAOAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAgEgERICAUgXGAIRtfn7Z5tnjYqwExQAubd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHME4ECrgDcAzscpnLB1XI5LZYcE4DepO98qiy3jjqenvAqzhk0E4TsunLVmnZbmdB0s2yjN0UkAHI7UTQ1AH4Y9IAAY5M+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NIAVUBsFeD4KNcLCoMJuvLgiRUAClRwNFNUAZz6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcA+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHUVTAE0VUC2zwWAAgxUiBwABGwr7tRNDSAAGAAdbJu40NWlwZnM6Ly9RbWE0NVBkVEhUWGlFblU4ZVlSNU0yM2lMbkJTQ2hUMVlHaW5QaHQ4R1E5VXUzgg');
    const __system = core_1.Cell.fromBase64('te6cckECGwEABZsAAQHAAQEFoPPVAgEU/wD0pBP0vPLICwMCAWIEEAN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRTbPPLgghMFDwPIAZIwf+BwIddJwh+VMCDXCx/eIIIQxvnqgrqOsjDTHwGCEMb56oK68uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHUWWwS4CCCEF/MPRS64wKCEC/LJqK64wIwcAYHDAG0MzOCAME9+EFvJBAjXwNSYMcF8vT4QW8kE18D+CdvECGhggnJw4BmtgihggnJw4CgoYEiAAKzEvL0fyNxgQGkyAGCENUydttYyx/LP8kQNhAkf1UwbW3bPAJ/DQOsMNs8bBYy+EFvJIIAwIBRw8cFHPL0IPgnbxAhoYIJycOAZrYIoYIJycOAoKEpwACOol8GMzR/cIBCA8gBghDVMnbbWMsfyz/JEDRBQH9VMG1t2zzjDn8IDQkAxNMfAYIQX8w9FLry4IHTP/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSAAGR1JJtAeL6ANQB0BYVFEMwA8ZTdMIAjslyU6RwCshVIIIQBRONkVAEyx8Syz8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyFjPFskBzMknEEsDUJkUQzBtbds8kjY34lUCCts8E6EhbrOTWzQw4w0NCgsAZGwx+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDD6ADFx1yH6ADH6ADCnA6sAATxQBqFxA8gBghDVMnbbWMsfyz/JEDZBYH9VMG1t2zwNAcLTHwGCEC/LJqK68uCB0z8BMfhBbyQQI18DcIBAf1Q0ichVIIIQi3cXNVAEyx8Syz+BAQHPAAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJEDRBMBRDMG1t2zx/DQHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAOAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAK7I+EMBzH8BygBVQFBUINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEoEBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhLMygDJ7VQCAVgRGAIBIBIXAhG1+ftnm2eNirATFgHI7UTQ1AH4Y9IAAY5M+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NIAVUBsFeD4KNcLCoMJuvLgiRQBnPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdRVMATRVQLbPBUACDFSIHAAClRwNFNUALm3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOA3qTvfKost446np7wKs4ZNBOE7Lpy1Zp2W5nQdLNsozdFJACAUgZGgARsK+7UTQ0gABgAHWybuNDVpcGZzOi8vUW1hNDVQZFRIVFhpRW5VOGVZUjVNMjNpTG5CU0NoVDFZR2luUGh0OEdROVV1M4IIr+iBk=');
    let builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftItem_init_args({ $$type: 'NftItem_init_args', collection_address, item_index, owner, individual_content })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const NftItem_errors = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    2361: { message: `data.fee LESS THAN sent amount!` },
    5637: { message: `No rewards available` },
    8704: { message: `already initialized` },
    8733: { message: `Only Storage Contract can call` },
    9414: { message: `Invalid destination chain!` },
    16053: { message: `Only owner can call` },
    35976: { message: `Only the owner can call this function` },
    36476: { message: `Validator does not exist!` },
    43094: { message: `Invalid fees` },
    43570: { message: `Data already processed!` },
    49280: { message: `not owner` },
    49469: { message: `not from collection` },
    52185: { message: `Threshold not reached!` },
    52761: { message: `Only collection deployer can call this message` },
    54233: { message: `Invalid bridge state` },
    54339: { message: `Invalid NFT type!` },
    54615: { message: `Insufficient balance` },
    62521: { message: `Must have signatures!` },
    62742: { message: `non-sequential NFTs` },
};
const NftItem_types = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "GetRoyaltyParams", "header": 1765620048, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "ReportRoyaltyParams", "header": 2831876269, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "numerator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "denominator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 16 } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "CollectionData", "header": null, "fields": [{ "name": "next_item_index", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "collection_content", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "owner_address", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "RoyaltyParams", "header": null, "fields": [{ "name": "numerator", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "denominator", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "Transfer", "header": 1607220500, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "new_owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "custom_payload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forward_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "OwnershipAssigned", "header": 85167505, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "prev_owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Excesses", "header": 3576854235, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "GetStaticData", "header": 801842850, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "ReportStaticData", "header": 2339837749, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "index_id", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "collection", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "GetNftData", "header": null, "fields": [{ "name": "is_initialized", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "index", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "collection_address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "owner_address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "individual_content", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "HiFromDeployNFT721Storage", "header": 1017107824, "fields": [{ "name": "sourceNftContractAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "storageAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "isOriginal", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "key", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "tokenId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sourceNftContractAddressLock", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "nftItemAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metaDataUri", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "HiFromDeployNFT721Collection", "header": 1037677720, "fields": [{ "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "newlyDeployCollection", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "transactionHash", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "lockTxChain", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "CollectionDeploy", "header": 4033579765, "fields": [{ "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metadata", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "token_id", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "StorageDeploy", "header": 1498703807, "fields": [{ "name": "sourceNftContractAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "isOriginal", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "key", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "tokenId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sourceNftContractAddressLock", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "nftItemAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metaDataUri", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "DeployNFT721Storage", "header": 3037136312, "fields": [{ "name": "collectionAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "isOriginal", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "key", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "tokenId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sourceNftContractAddressLock", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "nftItemAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metaDataUri", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "DeployNFT721Collection", "header": 2399096803, "fields": [{ "name": "collection_content", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "royalty_params", "type": { "kind": "simple", "type": "RoyaltyParams", "optional": false } }, { "name": "destination_user_address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "source_chain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "transaction_hash", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "metadata", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "token_id", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "lockTxChain", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "CreatedCollection", "header": 41705028, "fields": [{ "name": "collectionAddress", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "UnlockToken", "header": 2585927731, "fields": [{ "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "token_id", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "MintOne", "header": 3338267266, "fields": [{ "name": "new_owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "content", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Mint", "header": 1355444520, "fields": [{ "name": "token_id", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "content", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Validator", "header": null, "fields": [{ "name": "address", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "added", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "pendingRewards", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "SignerAndSignature", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "key", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "NewValidator", "header": null, "fields": [{ "name": "key", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "ValidatorsToRewards", "header": null, "fields": [{ "name": "addresses", "type": { "kind": "dict", "key": "int", "value": "address" } }, { "name": "publicKeys", "type": { "kind": "dict", "key": "int", "value": "int" } }, { "name": "len", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "DuplicateToOriginalContractInfo", "header": null, "fields": [{ "name": "keyChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "chain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "contractAddress", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "lastIndex", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "collectionContent", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "OriginalToDuplicateContractInfo", "header": null, "fields": [{ "name": "keyChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "chain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "contractAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "lastIndex", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "collectionContent", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "ClaimData1", "header": null, "fields": [{ "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "tokenAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "ClaimData2", "header": null, "fields": [{ "name": "name", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "symbol", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "nftType", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "ClaimData3", "header": null, "fields": [{ "name": "fee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "sourceNftContractAddress", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "royaltyReceiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metadata", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "ClaimData4", "header": null, "fields": [{ "name": "newContent", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "transactionHash", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "royalty", "type": { "kind": "simple", "type": "RoyaltyParams", "optional": false } }, { "name": "lockTxChain", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "ClaimData", "header": null, "fields": [{ "name": "data1", "type": { "kind": "simple", "type": "ClaimData1", "optional": false } }, { "name": "data2", "type": { "kind": "simple", "type": "ClaimData2", "optional": false } }, { "name": "data3", "type": { "kind": "simple", "type": "ClaimData3", "optional": false } }, { "name": "data4", "type": { "kind": "simple", "type": "ClaimData4", "optional": false } }] },
    { "name": "Token", "header": null, "fields": [{ "name": "tokenId", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "chain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "contractAddress", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "AddValidator", "header": 3868963206, "fields": [{ "name": "newValidatorPublicKey", "type": { "kind": "simple", "type": "NewValidator", "optional": false } }, { "name": "newValidatorAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "sigs", "type": { "kind": "dict", "key": "int", "value": "SignerAndSignature", "valueFormat": "ref" } }, { "name": "len", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "RewardValidator", "header": 1316982074, "fields": [{ "name": "validator", "type": { "kind": "simple", "type": "NewValidator", "optional": false } }] },
    { "name": "Lock721", "header": 62791907, "fields": [{ "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sourceNftContractAddress", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "metaDataUri", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "ClaimNFT721", "header": 2933783886, "fields": [{ "name": "data", "type": { "kind": "simple", "type": "ClaimData", "optional": false } }, { "name": "signatures", "type": { "kind": "dict", "key": "int", "value": "SignerAndSignature", "valueFormat": "ref" } }, { "name": "len", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "StakeEvent", "header": 1284335502, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "asd", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "AddNewValidatorEvent", "header": 3100755976, "fields": [{ "name": "validator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "RewardValidatorEvent", "header": 2049240067, "fields": [{ "name": "validator", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "LockedEvent", "header": 2105076052, "fields": [{ "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "destinationChain", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "destinationUserAddress", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "sourceNftContractAddress", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "tokenAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "nftType", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "metaDataUri", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "UnLock721Event", "header": 2428616504, "fields": [{ "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "contractAddress", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ClaimedEvent", "header": 2421062321, "fields": [{ "name": "lockTxChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "tokenId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "newlyDeployCollection", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "sourceChain", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "transactionHash", "type": { "kind": "simple", "type": "string", "optional": false } }] },
];
const NftItem_getters = [
    { "name": "get_nft_data", "arguments": [], "returnType": { "kind": "simple", "type": "GetNftData", "optional": false } },
];
const NftItem_receivers = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "MintOne" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Transfer" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "GetStaticData" } },
];
class NftItem {
    static async init(collection_address, item_index, owner, individual_content) {
        return await NftItem_init(collection_address, item_index, owner, individual_content);
    }
    static async fromInit(collection_address, item_index, owner, individual_content) {
        const init = await NftItem_init(collection_address, item_index, owner, individual_content);
        const address = (0, core_1.contractAddress)(0, init);
        return new NftItem(address, init);
    }
    static fromAddress(address) {
        return new NftItem(address);
    }
    constructor(address, init) {
        this.abi = {
            types: NftItem_types,
            getters: NftItem_getters,
            receivers: NftItem_receivers,
            errors: NftItem_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'MintOne') {
            body = (0, core_1.beginCell)().store(storeMintOne(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Transfer') {
            body = (0, core_1.beginCell)().store(storeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'GetStaticData') {
            body = (0, core_1.beginCell)().store(storeGetStaticData(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getGetNftData(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('get_nft_data', builder.build())).stack;
        const result = loadTupleGetNftData(source);
        return result;
    }
}
exports.NftItem = NftItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uTmZ0Q29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvdG9uL3Rvbk5mdENvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxhQUFhO0FBQ2Isb0NBb0JtQjtBQVFuQixTQUFnQixjQUFjLENBQUMsR0FBYztJQUN6QyxPQUFPLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1FBQ3hCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNsQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUM7QUFDTixDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFnQixhQUFhLENBQUMsS0FBWTtJQUN0QyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMzQixPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQW9CLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDdEUsQ0FBQztBQUxELHNDQUtDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxNQUFtQjtJQUMzQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBb0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN0RSxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxNQUFpQjtJQUMxQyxJ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RUQsTUFBTSxhQUFhLEdBQWM7SUFDN0IsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDN0wsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDaFcsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsSUFBSSxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ25rQixFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLENBQUMsRUFBQztJQUN2SSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLENBQUMsRUFBQztJQUN6SSxFQUFDLE1BQU0sRUFBQyxlQUFlLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQzdOLEVBQUMsTUFBTSxFQUFDLGtCQUFrQixFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDbEosRUFBQyxNQUFNLEVBQUMscUJBQXFCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDM1osRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsZUFBZSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQzNULEVBQUMsTUFBTSxFQUFDLGVBQWUsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ3ZULEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLHNCQUFzQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLElBQUksRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDN2pCLEVBQUMsTUFBTSxFQUFDLG1CQUFtQixFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDdFQsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDMUksRUFBQyxNQUFNLEVBQUMsZUFBZSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDOUksRUFBQyxNQUFNLEVBQUMsa0JBQWtCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUMzVCxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLG9CQUFvQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxlQUFlLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLG9CQUFvQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ3hkLEVBQUMsTUFBTSxFQUFDLDJCQUEyQixFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLHdCQUF3QixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyw4QkFBOEIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDaGtDLEVBQUMsTUFBTSxFQUFDLDhCQUE4QixFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLHVCQUF1QixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGlCQUFpQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDamYsRUFBQyxNQUFNLEVBQUMsa0JBQWtCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDN1MsRUFBQyxNQUFNLEVBQUMsZUFBZSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLDhCQUE4QixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGdCQUFnQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUMvOUIsRUFBQyxNQUFNLEVBQUMscUJBQXFCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsOEJBQThCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQzk5QixFQUFDLE1BQU0sRUFBQyx3QkFBd0IsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLG9CQUFvQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxlQUFlLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUM3dUIsRUFBQyxNQUFNLEVBQUMsbUJBQW1CLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUNqSixFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ3ROLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQzVNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUM3UixFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxFQUFDLENBQUMsRUFBQztJQUN2UyxFQUFDLE1BQU0sRUFBQyxvQkFBb0IsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDeE4sRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDcEksRUFBQyxNQUFNLEVBQUMscUJBQXFCLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDM1IsRUFBQyxNQUFNLEVBQUMsaUNBQWlDLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUM5ZCxFQUFDLE1BQU0sRUFBQyxpQ0FBaUMsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLG1CQUFtQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ2hlLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDcGUsRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUNqUixFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGlCQUFpQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDaFksRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLGVBQWUsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDdFgsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ3pXLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGlCQUFpQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQy9SLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLHVCQUF1QixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsYUFBYSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDemEsRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDOUksRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGtCQUFrQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUNuZSxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLGFBQWEsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ2hVLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUM7SUFDeE4sRUFBQyxNQUFNLEVBQUMsc0JBQXNCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLENBQUMsRUFBQztJQUN4SixFQUFDLE1BQU0sRUFBQyxzQkFBc0IsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsQ0FBQyxFQUFDO0lBQ3hKLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLDBCQUEwQixFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUNqdUIsRUFBQyxNQUFNLEVBQUMsZ0JBQWdCLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLENBQUMsRUFBQztJQUMvUyxFQUFDLE1BQU0sRUFBQyxjQUFjLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBQyxhQUFhLEVBQUMsTUFBTSxFQUFDLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBQyxFQUFDLE1BQU0sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLEVBQUMsRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxFQUFDLEVBQUMsRUFBQyxNQUFNLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMs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