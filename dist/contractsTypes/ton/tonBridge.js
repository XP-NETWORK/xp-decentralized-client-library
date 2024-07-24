"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMintOne = exports.storeMintOne = exports.loadStorageDeploy = exports.storeStorageDeploy = exports.loadCollectionDeploy = exports.storeCollectionDeploy = exports.loadHiFromDeployNFT721Collection = exports.storeHiFromDeployNFT721Collection = exports.loadHiFromDeployNFT721Storage = exports.storeHiFromDeployNFT721Storage = exports.loadGetNftData = exports.storeGetNftData = exports.loadReportStaticData = exports.storeReportStaticData = exports.loadGetStaticData = exports.storeGetStaticData = exports.loadExcesses = exports.storeExcesses = exports.loadOwnershipAssigned = exports.storeOwnershipAssigned = exports.loadTransfer = exports.storeTransfer = exports.loadRoyaltyParams = exports.storeRoyaltyParams = exports.loadCollectionData = exports.storeCollectionData = exports.loadReportRoyaltyParams = exports.storeReportRoyaltyParams = exports.loadGetRoyaltyParams = exports.storeGetRoyaltyParams = exports.loadUnlockToken = exports.storeUnlockToken = exports.loadCreatedCollection = exports.storeCreatedCollection = exports.loadDeployNFT721Collection = exports.storeDeployNFT721Collection = exports.loadDeployNFT721Storage = exports.storeDeployNFT721Storage = exports.loadFactoryDeploy = exports.storeFactoryDeploy = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
exports.Bridge = exports.loadClaimedEvent = exports.storeClaimedEvent = exports.loadUnLock721Event = exports.storeUnLock721Event = exports.loadLockedEvent = exports.storeLockedEvent = exports.loadRewardValidatorEvent = exports.storeRewardValidatorEvent = exports.loadAddNewValidatorEvent = exports.storeAddNewValidatorEvent = exports.loadStakeEvent = exports.storeStakeEvent = exports.loadClaimNFT721 = exports.storeClaimNFT721 = exports.loadLock721 = exports.storeLock721 = exports.loadRewardValidator = exports.storeRewardValidator = exports.loadAddValidator = exports.storeAddValidator = exports.loadToken = exports.storeToken = exports.loadClaimData = exports.storeClaimData = exports.loadClaimData4 = exports.storeClaimData4 = exports.loadClaimData3 = exports.storeClaimData3 = exports.loadClaimData2 = exports.storeClaimData2 = exports.loadClaimData1 = exports.storeClaimData1 = exports.loadOriginalToDuplicateContractInfo = exports.storeOriginalToDuplicateContractInfo = exports.loadDuplicateToOriginalContractInfo = exports.storeDuplicateToOriginalContractInfo = exports.loadValidatorsToRewards = exports.storeValidatorsToRewards = exports.loadNewValidator = exports.storeNewValidator = exports.loadSignerAndSignature = exports.storeSignerAndSignature = exports.loadValidator = exports.storeValidator = exports.loadMint = exports.storeMint = void 0;
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
    return { $$type: "StateInit", code: _code, data: _data };
}
exports.loadStateInit = loadStateInit;
function loadTupleStateInit(source) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: "StateInit", code: _code, data: _data };
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
        },
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
    return {
        $$type: "Context",
        bounced: _bounced,
        sender: _sender,
        value: _value,
        raw: _raw,
    };
}
exports.loadContext = loadContext;
function loadTupleContext(source) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return {
        $$type: "Context",
        bounced: _bounced,
        sender: _sender,
        value: _value,
        raw: _raw,
    };
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
        },
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
    return {
        $$type: "SendParameters",
        bounce: _bounce,
        to: _to,
        value: _value,
        mode: _mode,
        body: _body,
        code: _code,
        data: _data,
    };
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
    return {
        $$type: "SendParameters",
        bounce: _bounce,
        to: _to,
        value: _value,
        mode: _mode,
        body: _body,
        code: _code,
        data: _data,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: "Deploy", queryId: _queryId };
}
exports.loadDeploy = loadDeploy;
function loadTupleDeploy(source) {
    let _queryId = source.readBigNumber();
    return { $$type: "Deploy", queryId: _queryId };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: "DeployOk", queryId: _queryId };
}
exports.loadDeployOk = loadDeployOk;
function loadTupleDeployOk(source) {
    let _queryId = source.readBigNumber();
    return { $$type: "DeployOk", queryId: _queryId };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return {
        $$type: "FactoryDeploy",
        queryId: _queryId,
        cashback: _cashback,
    };
}
exports.loadFactoryDeploy = loadFactoryDeploy;
function loadTupleFactoryDeploy(source) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return {
        $$type: "FactoryDeploy",
        queryId: _queryId,
        cashback: _cashback,
    };
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
        },
    };
}
function storeDeployNFT721Storage(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2631692347, 32);
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
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Storage = storeDeployNFT721Storage;
function loadDeployNFT721Storage(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2631692347) {
        throw Error("Invalid prefix");
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
    return {
        $$type: "DeployNFT721Storage",
        collectionAddress: _collectionAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return {
        $$type: "DeployNFT721Storage",
        collectionAddress: _collectionAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return builder.build();
}
function dictValueParserDeployNFT721Storage() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeDeployNFT721Storage(src)).endCell());
        },
        parse: (src) => {
            return loadDeployNFT721Storage(src.loadRef().beginParse());
        },
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
        throw Error("Invalid prefix");
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
    return {
        $$type: "DeployNFT721Collection",
        collection_content: _collection_content,
        royalty_params: _royalty_params,
        destination_user_address: _destination_user_address,
        source_chain: _source_chain,
        transaction_hash: _transaction_hash,
        metadata: _metadata,
        token_id: _token_id,
        lockTxChain: _lockTxChain,
    };
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
    return {
        $$type: "DeployNFT721Collection",
        collection_content: _collection_content,
        royalty_params: _royalty_params,
        destination_user_address: _destination_user_address,
        source_chain: _source_chain,
        transaction_hash: _transaction_hash,
        metadata: _metadata,
        token_id: _token_id,
        lockTxChain: _lockTxChain,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _collectionAddress = sc_0.loadAddress();
    return {
        $$type: "CreatedCollection",
        collectionAddress: _collectionAddress,
    };
}
exports.loadCreatedCollection = loadCreatedCollection;
function loadTupleCreatedCollection(source) {
    let _collectionAddress = source.readAddress();
    return {
        $$type: "CreatedCollection",
        collectionAddress: _collectionAddress,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _to = sc_0.loadAddress();
    let _token_id = sc_0.loadIntBig(257);
    return { $$type: "UnlockToken", to: _to, token_id: _token_id };
}
exports.loadUnlockToken = loadUnlockToken;
function loadTupleUnlockToken(source) {
    let _to = source.readAddress();
    let _token_id = source.readBigNumber();
    return { $$type: "UnlockToken", to: _to, token_id: _token_id };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: "GetRoyaltyParams", query_id: _query_id };
}
exports.loadGetRoyaltyParams = loadGetRoyaltyParams;
function loadTupleGetRoyaltyParams(source) {
    let _query_id = source.readBigNumber();
    return { $$type: "GetRoyaltyParams", query_id: _query_id };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return {
        $$type: "ReportRoyaltyParams",
        query_id: _query_id,
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
}
exports.loadReportRoyaltyParams = loadReportRoyaltyParams;
function loadTupleReportRoyaltyParams(source) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return {
        $$type: "ReportRoyaltyParams",
        query_id: _query_id,
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
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
        },
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
    return {
        $$type: "CollectionData",
        next_item_index: _next_item_index,
        collection_content: _collection_content,
        owner_address: _owner_address,
    };
}
exports.loadCollectionData = loadCollectionData;
function loadTupleCollectionData(source) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return {
        $$type: "CollectionData",
        next_item_index: _next_item_index,
        collection_content: _collection_content,
        owner_address: _owner_address,
    };
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
        },
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
    return {
        $$type: "RoyaltyParams",
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
}
exports.loadRoyaltyParams = loadRoyaltyParams;
function loadTupleRoyaltyParams(source) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return {
        $$type: "RoyaltyParams",
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.loadRef();
    return {
        $$type: "Transfer",
        query_id: _query_id,
        new_owner: _new_owner,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_amount: _forward_amount,
        forward_payload: _forward_payload,
    };
}
exports.loadTransfer = loadTransfer;
function loadTupleTransfer(source) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return {
        $$type: "Transfer",
        query_id: _query_id,
        new_owner: _new_owner,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_amount: _forward_amount,
        forward_payload: _forward_payload,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _forward_payload = sc_0.loadRef();
    return {
        $$type: "OwnershipAssigned",
        query_id: _query_id,
        prev_owner: _prev_owner,
        forward_payload: _forward_payload,
    };
}
exports.loadOwnershipAssigned = loadOwnershipAssigned;
function loadTupleOwnershipAssigned(source) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell();
    return {
        $$type: "OwnershipAssigned",
        query_id: _query_id,
        prev_owner: _prev_owner,
        forward_payload: _forward_payload,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: "Excesses", query_id: _query_id };
}
exports.loadExcesses = loadExcesses;
function loadTupleExcesses(source) {
    let _query_id = source.readBigNumber();
    return { $$type: "Excesses", query_id: _query_id };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: "GetStaticData", query_id: _query_id };
}
exports.loadGetStaticData = loadGetStaticData;
function loadTupleGetStaticData(source) {
    let _query_id = source.readBigNumber();
    return { $$type: "GetStaticData", query_id: _query_id };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _query_id = sc_0.loadUintBig(64);
    let _index_id = sc_0.loadIntBig(257);
    let _collection = sc_0.loadAddress();
    return {
        $$type: "ReportStaticData",
        query_id: _query_id,
        index_id: _index_id,
        collection: _collection,
    };
}
exports.loadReportStaticData = loadReportStaticData;
function loadTupleReportStaticData(source) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readAddress();
    return {
        $$type: "ReportStaticData",
        query_id: _query_id,
        index_id: _index_id,
        collection: _collection,
    };
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
        },
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
    return {
        $$type: "GetNftData",
        is_initialized: _is_initialized,
        index: _index,
        collection_address: _collection_address,
        owner_address: _owner_address,
        individual_content: _individual_content,
    };
}
exports.loadGetNftData = loadGetNftData;
function loadTupleGetNftData(source) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _individual_content = source.readCell();
    return {
        $$type: "GetNftData",
        is_initialized: _is_initialized,
        index: _index,
        collection_address: _collection_address,
        owner_address: _owner_address,
        individual_content: _individual_content,
    };
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
        },
    };
}
function storeHiFromDeployNFT721Storage(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3787009574, 32);
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
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeHiFromDeployNFT721Storage = storeHiFromDeployNFT721Storage;
function loadHiFromDeployNFT721Storage(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3787009574) {
        throw Error("Invalid prefix");
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
    return {
        $$type: "HiFromDeployNFT721Storage",
        sourceNftContractAddress: _sourceNftContractAddress,
        storageAddress: _storageAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return {
        $$type: "HiFromDeployNFT721Storage",
        sourceNftContractAddress: _sourceNftContractAddress,
        storageAddress: _storageAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return builder.build();
}
function dictValueParserHiFromDeployNFT721Storage() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeHiFromDeployNFT721Storage(src)).endCell());
        },
        parse: (src) => {
            return loadHiFromDeployNFT721Storage(src.loadRef().beginParse());
        },
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
        throw Error("Invalid prefix");
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _newlyDeployCollection = sc_0.loadAddress();
    let _sourceChain = sc_0.loadStringRefTail();
    let _transactionHash = sc_0.loadStringRefTail();
    let _lockTxChain = sc_0.loadStringRefTail();
    return {
        $$type: "HiFromDeployNFT721Collection",
        tokenId: _tokenId,
        newlyDeployCollection: _newlyDeployCollection,
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
        lockTxChain: _lockTxChain,
    };
}
exports.loadHiFromDeployNFT721Collection = loadHiFromDeployNFT721Collection;
function loadTupleHiFromDeployNFT721Collection(source) {
    let _tokenId = source.readBigNumber();
    let _newlyDeployCollection = source.readAddress();
    let _sourceChain = source.readString();
    let _transactionHash = source.readString();
    let _lockTxChain = source.readString();
    return {
        $$type: "HiFromDeployNFT721Collection",
        tokenId: _tokenId,
        newlyDeployCollection: _newlyDeployCollection,
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
        lockTxChain: _lockTxChain,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _newOwner = sc_0.loadAddress();
    let _metadata = sc_0.loadRef();
    let _token_id = sc_0.loadIntBig(257);
    return {
        $$type: "CollectionDeploy",
        newOwner: _newOwner,
        metadata: _metadata,
        token_id: _token_id,
    };
}
exports.loadCollectionDeploy = loadCollectionDeploy;
function loadTupleCollectionDeploy(source) {
    let _newOwner = source.readAddress();
    let _metadata = source.readCell();
    let _token_id = source.readBigNumber();
    return {
        $$type: "CollectionDeploy",
        newOwner: _newOwner,
        metadata: _metadata,
        token_id: _token_id,
    };
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
        },
    };
}
function storeStorageDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3055329217, 32);
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
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeStorageDeploy = storeStorageDeploy;
function loadStorageDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3055329217) {
        throw Error("Invalid prefix");
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
    return {
        $$type: "StorageDeploy",
        sourceNftContractAddress: _sourceNftContractAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return {
        $$type: "StorageDeploy",
        sourceNftContractAddress: _sourceNftContractAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
        nftItemAddress: _nftItemAddress,
    };
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
    return builder.build();
}
function dictValueParserStorageDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeStorageDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadStorageDeploy(src.loadRef().beginParse());
        },
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
        throw Error("Invalid prefix");
    }
    let _new_owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return {
        $$type: "MintOne",
        new_owner: _new_owner,
        content: _content,
    };
}
exports.loadMintOne = loadMintOne;
function loadTupleMintOne(source) {
    let _new_owner = source.readAddress();
    let _content = source.readCell();
    return {
        $$type: "MintOne",
        new_owner: _new_owner,
        content: _content,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _token_id = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return {
        $$type: "Mint",
        token_id: _token_id,
        owner: _owner,
        content: _content,
    };
}
exports.loadMint = loadMint;
function loadTupleMint(source) {
    let _token_id = source.readBigNumber();
    let _owner = source.readAddress();
    let _content = source.readCell();
    return {
        $$type: "Mint",
        token_id: _token_id,
        owner: _owner,
        content: _content,
    };
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
        },
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
    return {
        $$type: "Validator",
        address: _address,
        added: _added,
        pendingRewards: _pendingRewards,
    };
}
exports.loadValidator = loadValidator;
function loadTupleValidator(source) {
    let _address = source.readAddress();
    let _added = source.readBoolean();
    let _pendingRewards = source.readBigNumber();
    return {
        $$type: "Validator",
        address: _address,
        added: _added,
        pendingRewards: _pendingRewards,
    };
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
        },
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
    return {
        $$type: "SignerAndSignature",
        signature: _signature,
        key: _key,
    };
}
exports.loadSignerAndSignature = loadSignerAndSignature;
function loadTupleSignerAndSignature(source) {
    let _signature = source.readCell();
    let _key = source.readBigNumber();
    return {
        $$type: "SignerAndSignature",
        signature: _signature,
        key: _key,
    };
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
        },
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
    return { $$type: "NewValidator", key: _key };
}
exports.loadNewValidator = loadNewValidator;
function loadTupleNewValidator(source) {
    let _key = source.readBigNumber();
    return { $$type: "NewValidator", key: _key };
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
        },
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
    return {
        $$type: "ValidatorsToRewards",
        addresses: _addresses,
        publicKeys: _publicKeys,
        len: _len,
    };
}
exports.loadValidatorsToRewards = loadValidatorsToRewards;
function loadTupleValidatorsToRewards(source) {
    let _addresses = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), source.readCellOpt());
    let _publicKeys = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    let _len = source.readBigNumber();
    return {
        $$type: "ValidatorsToRewards",
        addresses: _addresses,
        publicKeys: _publicKeys,
        len: _len,
    };
}
function storeTupleValidatorsToRewards(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.addresses.size > 0
        ? (0, core_1.beginCell)()
            .storeDictDirect(source.addresses, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address())
            .endCell()
        : null);
    builder.writeCell(source.publicKeys.size > 0
        ? (0, core_1.beginCell)()
            .storeDictDirect(source.publicKeys, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257))
            .endCell()
        : null);
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
        },
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
    return {
        $$type: "DuplicateToOriginalContractInfo",
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
exports.loadDuplicateToOriginalContractInfo = loadDuplicateToOriginalContractInfo;
function loadTupleDuplicateToOriginalContractInfo(source) {
    let _keyChain = source.readString();
    let _chain = source.readString();
    let _contractAddress = source.readCell();
    let _lastIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    return {
        $$type: "DuplicateToOriginalContractInfo",
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
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
        },
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
    return {
        $$type: "OriginalToDuplicateContractInfo",
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
exports.loadOriginalToDuplicateContractInfo = loadOriginalToDuplicateContractInfo;
function loadTupleOriginalToDuplicateContractInfo(source) {
    let _keyChain = source.readString();
    let _chain = source.readString();
    let _contractAddress = source.readAddress();
    let _lastIndex = source.readBigNumber();
    let _collectionContent = source.readCell();
    return {
        $$type: "OriginalToDuplicateContractInfo",
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
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
        },
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
    return {
        $$type: "ClaimData1",
        tokenId: _tokenId,
        sourceChain: _sourceChain,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        tokenAmount: _tokenAmount,
    };
}
exports.loadClaimData1 = loadClaimData1;
function loadTupleClaimData1(source) {
    let _tokenId = source.readBigNumber();
    let _sourceChain = source.readString();
    let _destinationChain = source.readString();
    let _destinationUserAddress = source.readAddress();
    let _tokenAmount = source.readBigNumber();
    return {
        $$type: "ClaimData1",
        tokenId: _tokenId,
        sourceChain: _sourceChain,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        tokenAmount: _tokenAmount,
    };
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
        },
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
    return {
        $$type: "ClaimData2",
        name: _name,
        symbol: _symbol,
        nftType: _nftType,
    };
}
exports.loadClaimData2 = loadClaimData2;
function loadTupleClaimData2(source) {
    let _name = source.readString();
    let _symbol = source.readString();
    let _nftType = source.readString();
    return {
        $$type: "ClaimData2",
        name: _name,
        symbol: _symbol,
        nftType: _nftType,
    };
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
        },
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
    return {
        $$type: "ClaimData3",
        fee: _fee,
        sourceNftContractAddress: _sourceNftContractAddress,
        royaltyReceiver: _royaltyReceiver,
        metadata: _metadata,
    };
}
exports.loadClaimData3 = loadClaimData3;
function loadTupleClaimData3(source) {
    let _fee = source.readBigNumber();
    let _sourceNftContractAddress = source.readCell();
    let _royaltyReceiver = source.readAddress();
    let _metadata = source.readCell();
    return {
        $$type: "ClaimData3",
        fee: _fee,
        sourceNftContractAddress: _sourceNftContractAddress,
        royaltyReceiver: _royaltyReceiver,
        metadata: _metadata,
    };
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
        },
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
    return {
        $$type: "ClaimData4",
        newContent: _newContent,
        transactionHash: _transactionHash,
        royalty: _royalty,
        lockTxChain: _lockTxChain,
    };
}
exports.loadClaimData4 = loadClaimData4;
function loadTupleClaimData4(source) {
    let _newContent = source.readCell();
    let _transactionHash = source.readString();
    const _royalty = loadTupleRoyaltyParams(source.readTuple());
    let _lockTxChain = source.readString();
    return {
        $$type: "ClaimData4",
        newContent: _newContent,
        transactionHash: _transactionHash,
        royalty: _royalty,
        lockTxChain: _lockTxChain,
    };
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
        },
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
    return {
        $$type: "ClaimData",
        data1: _data1,
        data2: _data2,
        data3: _data3,
        data4: _data4,
    };
}
exports.loadClaimData = loadClaimData;
function loadTupleClaimData(source) {
    const _data1 = loadTupleClaimData1(source.readTuple());
    const _data2 = loadTupleClaimData2(source.readTuple());
    const _data3 = loadTupleClaimData3(source.readTuple());
    const _data4 = loadTupleClaimData4(source.readTuple());
    return {
        $$type: "ClaimData",
        data1: _data1,
        data2: _data2,
        data3: _data3,
        data4: _data4,
    };
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
        },
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
    return {
        $$type: "Token",
        tokenId: _tokenId,
        chain: _chain,
        contractAddress: _contractAddress,
    };
}
exports.loadToken = loadToken;
function loadTupleToken(source) {
    let _tokenId = source.readBigNumber();
    let _chain = source.readString();
    let _contractAddress = source.readCell();
    return {
        $$type: "Token",
        tokenId: _tokenId,
        chain: _chain,
        contractAddress: _contractAddress,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _newValidatorPublicKey = loadNewValidator(sc_0);
    let _newValidatorAddress = sc_0.loadAddress();
    let _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    let _len = sc_0.loadUintBig(256);
    return {
        $$type: "AddValidator",
        newValidatorPublicKey: _newValidatorPublicKey,
        newValidatorAddress: _newValidatorAddress,
        sigs: _sigs,
        len: _len,
    };
}
exports.loadAddValidator = loadAddValidator;
function loadTupleAddValidator(source) {
    const _newValidatorPublicKey = loadTupleNewValidator(source.readTuple());
    let _newValidatorAddress = source.readAddress();
    let _sigs = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), source.readCellOpt());
    let _len = source.readBigNumber();
    return {
        $$type: "AddValidator",
        newValidatorPublicKey: _newValidatorPublicKey,
        newValidatorAddress: _newValidatorAddress,
        sigs: _sigs,
        len: _len,
    };
}
function storeTupleAddValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleNewValidator(source.newValidatorPublicKey));
    builder.writeAddress(source.newValidatorAddress);
    builder.writeCell(source.sigs.size > 0
        ? (0, core_1.beginCell)()
            .storeDictDirect(source.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature())
            .endCell()
        : null);
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
        },
    };
}
function storeRewardValidator(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3816415473, 32);
        b_0.store(storeNewValidator(src.validator));
        b_0.storeDict(src.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeRewardValidator = storeRewardValidator;
function loadRewardValidator(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3816415473) {
        throw Error("Invalid prefix");
    }
    let _validator = loadNewValidator(sc_0);
    let _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    let _len = sc_0.loadUintBig(256);
    return {
        $$type: "RewardValidator",
        validator: _validator,
        sigs: _sigs,
        len: _len,
    };
}
exports.loadRewardValidator = loadRewardValidator;
function loadTupleRewardValidator(source) {
    const _validator = loadTupleNewValidator(source.readTuple());
    let _sigs = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), source.readCellOpt());
    let _len = source.readBigNumber();
    return {
        $$type: "RewardValidator",
        validator: _validator,
        sigs: _sigs,
        len: _len,
    };
}
function storeTupleRewardValidator(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleNewValidator(source.validator));
    builder.writeCell(source.sigs.size > 0
        ? (0, core_1.beginCell)()
            .storeDictDirect(source.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature())
            .endCell()
        : null);
    builder.writeNumber(source.len);
    return builder.build();
}
function dictValueParserRewardValidator() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeRewardValidator(src)).endCell());
        },
        parse: (src) => {
            return loadRewardValidator(src.loadRef().beginParse());
        },
    };
}
function storeLock721(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2258979588, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeAddress(src.sourceNftContractAddress);
    };
}
exports.storeLock721 = storeLock721;
function loadLock721(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2258979588) {
        throw Error("Invalid prefix");
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddress = sc_0.loadAddress();
    return {
        $$type: "Lock721",
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
    };
}
exports.loadLock721 = loadLock721;
function loadTupleLock721(source) {
    let _tokenId = source.readBigNumber();
    let _destinationChain = source.readCell();
    let _destinationUserAddress = source.readCell();
    let _sourceNftContractAddress = source.readAddress();
    return {
        $$type: "Lock721",
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
    };
}
function storeTupleLock721(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.tokenId);
    builder.writeCell(source.destinationChain);
    builder.writeCell(source.destinationUserAddress);
    builder.writeAddress(source.sourceNftContractAddress);
    return builder.build();
}
function dictValueParserLock721() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeLock721(src)).endCell());
        },
        parse: (src) => {
            return loadLock721(src.loadRef().beginParse());
        },
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
        throw Error("Invalid prefix");
    }
    let _data = loadClaimData(sc_0);
    let _signatures = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    let _len = sc_0.loadUintBig(256);
    return {
        $$type: "ClaimNFT721",
        data: _data,
        signatures: _signatures,
        len: _len,
    };
}
exports.loadClaimNFT721 = loadClaimNFT721;
function loadTupleClaimNFT721(source) {
    const _data = loadTupleClaimData(source.readTuple());
    let _signatures = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), source.readCellOpt());
    let _len = source.readBigNumber();
    return {
        $$type: "ClaimNFT721",
        data: _data,
        signatures: _signatures,
        len: _len,
    };
}
function storeTupleClaimNFT721(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeTuple(storeTupleClaimData(source.data));
    builder.writeCell(source.signatures.size > 0
        ? (0, core_1.beginCell)()
            .storeDictDirect(source.signatures, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature())
            .endCell()
        : null);
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
        },
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
        throw Error("Invalid prefix");
    }
    let _amount = sc_0.loadCoins();
    let _asd = sc_0.loadStringRefTail();
    return { $$type: "StakeEvent", amount: _amount, asd: _asd };
}
exports.loadStakeEvent = loadStakeEvent;
function loadTupleStakeEvent(source) {
    let _amount = source.readBigNumber();
    let _asd = source.readString();
    return { $$type: "StakeEvent", amount: _amount, asd: _asd };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _validator = sc_0.loadUintBig(256);
    return { $$type: "AddNewValidatorEvent", validator: _validator };
}
exports.loadAddNewValidatorEvent = loadAddNewValidatorEvent;
function loadTupleAddNewValidatorEvent(source) {
    let _validator = source.readBigNumber();
    return { $$type: "AddNewValidatorEvent", validator: _validator };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _validator = sc_0.loadUintBig(256);
    return { $$type: "RewardValidatorEvent", validator: _validator };
}
exports.loadRewardValidatorEvent = loadRewardValidatorEvent;
function loadTupleRewardValidatorEvent(source) {
    let _validator = source.readBigNumber();
    return { $$type: "RewardValidatorEvent", validator: _validator };
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
        },
    };
}
function storeLockedEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(4205190074, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeRef(src.destinationChain);
        b_0.storeRef(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddress);
        b_0.storeUint(src.tokenAmount, 256);
        let b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.nftType);
        b_1.storeStringRefTail(src.sourceChain);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeLockedEvent = storeLockedEvent;
function loadLockedEvent(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4205190074) {
        throw Error("Invalid prefix");
    }
    let _tokenId = sc_0.loadUintBig(256);
    let _destinationChain = sc_0.loadRef();
    let _destinationUserAddress = sc_0.loadRef();
    let _sourceNftContractAddress = sc_0.loadRef();
    let _tokenAmount = sc_0.loadUintBig(256);
    let sc_1 = sc_0.loadRef().beginParse();
    let _nftType = sc_1.loadStringRefTail();
    let _sourceChain = sc_1.loadStringRefTail();
    return {
        $$type: "LockedEvent",
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
        tokenAmount: _tokenAmount,
        nftType: _nftType,
        sourceChain: _sourceChain,
    };
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
    return {
        $$type: "LockedEvent",
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
        tokenAmount: _tokenAmount,
        nftType: _nftType,
        sourceChain: _sourceChain,
    };
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
    return builder.build();
}
function dictValueParserLockedEvent() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, core_1.beginCell)().store(storeLockedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadLockedEvent(src.loadRef().beginParse());
        },
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
        throw Error("Invalid prefix");
    }
    let _to = sc_0.loadAddress();
    let _tokenId = sc_0.loadUintBig(256);
    let _contractAddress = sc_0.loadAddress();
    return {
        $$type: "UnLock721Event",
        to: _to,
        tokenId: _tokenId,
        contractAddress: _contractAddress,
    };
}
exports.loadUnLock721Event = loadUnLock721Event;
function loadTupleUnLock721Event(source) {
    let _to = source.readAddress();
    let _tokenId = source.readBigNumber();
    let _contractAddress = source.readAddress();
    return {
        $$type: "UnLock721Event",
        to: _to,
        tokenId: _tokenId,
        contractAddress: _contractAddress,
    };
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
        },
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
        throw Error("Invalid prefix");
    }
    let _lockTxChain = sc_0.loadStringRefTail();
    let _tokenId = sc_0.loadUintBig(256);
    let _newlyDeployCollection = sc_0.loadAddress();
    let _sourceChain = sc_0.loadStringRefTail();
    let _transactionHash = sc_0.loadStringRefTail();
    return {
        $$type: "ClaimedEvent",
        lockTxChain: _lockTxChain,
        tokenId: _tokenId,
        newlyDeployCollection: _newlyDeployCollection,
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
    };
}
exports.loadClaimedEvent = loadClaimedEvent;
function loadTupleClaimedEvent(source) {
    let _lockTxChain = source.readString();
    let _tokenId = source.readBigNumber();
    let _newlyDeployCollection = source.readAddress();
    let _sourceChain = source.readString();
    let _transactionHash = source.readString();
    return {
        $$type: "ClaimedEvent",
        lockTxChain: _lockTxChain,
        tokenId: _tokenId,
        newlyDeployCollection: _newlyDeployCollection,
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
    };
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
        },
    };
}
function initBridge_init_args(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeInt(src.validatorPublicKey, 257);
        b_0.storeAddress(src.validatorAddress);
        b_0.storeStringRefTail(src.chainType);
    };
}
async function Bridge_init(validatorPublicKey, validatorAddress, chainType) {
    const __code = core_1.Cell.fromBase64("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");
    const __system = core_1.Cell.fromBase64("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yAhYyx/L/8lvcQL8IoEBASNZ9A1voZIwbd8gbpIwbZzQ1AHQAdP/WWwSbwLiIG7y0IBvIibIAQHL/8n5AFQQIvkQDxEVDw4RFA4NERMNDBESDAsREQsKERAKCREVCQgRFAgHERMHBhESBgUREQUEERAEAxEVAwIRFAIREwHbPCBu8tCAbyMwMRET4nAAZJNwVxPfERKVERKkERLeEROkDRETDQwREgwLERELChEQChCfEI4QfRBsEFsQShA5SAcGADTIgljAAAAAAAAAAAAAAAABActnzMlw+wAQvgT2ggD0OSHCAPL0DhERDg0REA0QzwsREQsKERAKEJ8IEREIBxEQBxBvBRERBQQREAQQPwIREQIBERABD1YR2zwgbvLQgG8jggCOfCLy9HAgERSK5FcTVxOCAMvZLqoAc6kEpAEREwG+ARESAfL0VeBWEts8IG7y0IBvI2wh4nPidQL+VhSBAQFWFVn0DW+hkjBt3yBukjBtnNDUAdAB0/9ZbBJvAuIgbvLQgG8iVhfIAQHL/8n5AFQQIvkQDxEUDw4REw4NERINDBERDAsREAsKERQKCRETCQgREggHEREHBhEQBgURFAUEERMEAxESAwIREQIREAHbPCBu8tCAbyMwMeJ0AEQREJNwVxDfD5MPpA/eEROkERMNERINDBERDAsREAsQr1VJAOgBERABERGBAQERE8hVIFog10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYSygAB+gLJED4CERECARESASBulTBZ9FowlEEz9BXi+CdvEPhBbyQTXwOhggiYloChHrYIggDVVwHCAPL0EM4QnRCMEHtVNgIQMNs8bBrbPH93eQHS0x8BghDhuS4muvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSAIEBAdcA1AHQgQEB1wDU1NQB0AHUMNDUAdABeABQ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDEQahBpEGgQZwP2+EP4KFKw2zxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiIEiHfhBbyQQI18DWMcF8vQHjhsBERABgQEBVBBo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");
    let builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initBridge_init_args({
        $$type: "Bridge_init_args",
        validatorPublicKey,
        validatorAddress,
        chainType,
    })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const Bridge_errors = {
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
const Bridge_types = [
    {
        name: "StateInit",
        header: null,
        fields: [
            { name: "code", type: { kind: "simple", type: "cell", optional: false } },
            { name: "data", type: { kind: "simple", type: "cell", optional: false } },
        ],
    },
    {
        name: "Context",
        header: null,
        fields: [
            {
                name: "bounced",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "sender",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "value",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            { name: "raw", type: { kind: "simple", type: "slice", optional: false } },
        ],
    },
    {
        name: "SendParameters",
        header: null,
        fields: [
            {
                name: "bounce",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "to",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "value",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "mode",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            { name: "body", type: { kind: "simple", type: "cell", optional: true } },
            { name: "code", type: { kind: "simple", type: "cell", optional: true } },
            { name: "data", type: { kind: "simple", type: "cell", optional: true } },
        ],
    },
    {
        name: "Deploy",
        header: 2490013878,
        fields: [
            {
                name: "queryId",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "DeployOk",
        header: 2952335191,
        fields: [
            {
                name: "queryId",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "FactoryDeploy",
        header: 1829761339,
        fields: [
            {
                name: "queryId",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "cashback",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "DeployNFT721Storage",
        header: 2631692347,
        fields: [
            {
                name: "collectionAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "isOriginal",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "key",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "tokenId",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "sourceNftContractAddressLock",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "nftItemAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "DeployNFT721Collection",
        header: 2399096803,
        fields: [
            {
                name: "collection_content",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "royalty_params",
                type: { kind: "simple", type: "RoyaltyParams", optional: false },
            },
            {
                name: "destination_user_address",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "source_chain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "transaction_hash",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "metadata",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "token_id",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "lockTxChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "CreatedCollection",
        header: 41705028,
        fields: [
            {
                name: "collectionAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "UnlockToken",
        header: 2585927731,
        fields: [
            {
                name: "to",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "token_id",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
        ],
    },
    {
        name: "GetRoyaltyParams",
        header: 1765620048,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "ReportRoyaltyParams",
        header: 2831876269,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "numerator",
                type: { kind: "simple", type: "uint", optional: false, format: 16 },
            },
            {
                name: "denominator",
                type: { kind: "simple", type: "uint", optional: false, format: 16 },
            },
            {
                name: "destination",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "CollectionData",
        header: null,
        fields: [
            {
                name: "next_item_index",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "collection_content",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "owner_address",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "RoyaltyParams",
        header: null,
        fields: [
            {
                name: "numerator",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "denominator",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "destination",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "Transfer",
        header: 1607220500,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "new_owner",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "response_destination",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "custom_payload",
                type: { kind: "simple", type: "cell", optional: true },
            },
            {
                name: "forward_amount",
                type: {
                    kind: "simple",
                    type: "uint",
                    optional: false,
                    format: "coins",
                },
            },
            {
                name: "forward_payload",
                type: { kind: "simple", type: "slice", optional: false },
            },
        ],
    },
    {
        name: "OwnershipAssigned",
        header: 85167505,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "prev_owner",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "forward_payload",
                type: { kind: "simple", type: "slice", optional: false },
            },
        ],
    },
    {
        name: "Excesses",
        header: 3576854235,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "GetStaticData",
        header: 801842850,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "ReportStaticData",
        header: 2339837749,
        fields: [
            {
                name: "query_id",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "index_id",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "collection",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "GetNftData",
        header: null,
        fields: [
            {
                name: "is_initialized",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "index",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "collection_address",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "owner_address",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "individual_content",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "HiFromDeployNFT721Storage",
        header: 3787009574,
        fields: [
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "storageAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "isOriginal",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "key",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "tokenId",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "sourceNftContractAddressLock",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "nftItemAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "HiFromDeployNFT721Collection",
        header: 1037677720,
        fields: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "newlyDeployCollection",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "transactionHash",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "lockTxChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "CollectionDeploy",
        header: 4033579765,
        fields: [
            {
                name: "newOwner",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "metadata",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "token_id",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
        ],
    },
    {
        name: "StorageDeploy",
        header: 3055329217,
        fields: [
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "isOriginal",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "key",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "tokenId",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "sourceNftContractAddressLock",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "nftItemAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "MintOne",
        header: 3338267266,
        fields: [
            {
                name: "new_owner",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "content",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "Mint",
        header: 1355444520,
        fields: [
            {
                name: "token_id",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "owner",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "content",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "Validator",
        header: null,
        fields: [
            {
                name: "address",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "added",
                type: { kind: "simple", type: "bool", optional: false },
            },
            {
                name: "pendingRewards",
                type: {
                    kind: "simple",
                    type: "uint",
                    optional: false,
                    format: "coins",
                },
            },
        ],
    },
    {
        name: "SignerAndSignature",
        header: null,
        fields: [
            {
                name: "signature",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "key",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "NewValidator",
        header: null,
        fields: [
            {
                name: "key",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "ValidatorsToRewards",
        header: null,
        fields: [
            {
                name: "addresses",
                type: { kind: "dict", key: "int", value: "address" },
            },
            { name: "publicKeys", type: { kind: "dict", key: "int", value: "int" } },
            {
                name: "len",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
        ],
    },
    {
        name: "DuplicateToOriginalContractInfo",
        header: null,
        fields: [
            {
                name: "keyChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "chain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "contractAddress",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "lastIndex",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "collectionContent",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "OriginalToDuplicateContractInfo",
        header: null,
        fields: [
            {
                name: "keyChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "chain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "contractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "lastIndex",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "collectionContent",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "ClaimData1",
        header: null,
        fields: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "tokenAmount",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
        ],
    },
    {
        name: "ClaimData2",
        header: null,
        fields: [
            {
                name: "name",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "symbol",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "nftType",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "ClaimData3",
        header: null,
        fields: [
            {
                name: "fee",
                type: { kind: "simple", type: "uint", optional: false, format: 64 },
            },
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "royaltyReceiver",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "metadata",
                type: { kind: "simple", type: "cell", optional: false },
            },
        ],
    },
    {
        name: "ClaimData4",
        header: null,
        fields: [
            {
                name: "newContent",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "transactionHash",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "royalty",
                type: { kind: "simple", type: "RoyaltyParams", optional: false },
            },
            {
                name: "lockTxChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "ClaimData",
        header: null,
        fields: [
            {
                name: "data1",
                type: { kind: "simple", type: "ClaimData1", optional: false },
            },
            {
                name: "data2",
                type: { kind: "simple", type: "ClaimData2", optional: false },
            },
            {
                name: "data3",
                type: { kind: "simple", type: "ClaimData3", optional: false },
            },
            {
                name: "data4",
                type: { kind: "simple", type: "ClaimData4", optional: false },
            },
        ],
    },
    {
        name: "Token",
        header: null,
        fields: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "chain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "contractAddress",
                type: { kind: "simple", type: "slice", optional: false },
            },
        ],
    },
    {
        name: "AddValidator",
        header: 3868963206,
        fields: [
            {
                name: "newValidatorPublicKey",
                type: { kind: "simple", type: "NewValidator", optional: false },
            },
            {
                name: "newValidatorAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "sigs",
                type: {
                    kind: "dict",
                    key: "int",
                    value: "SignerAndSignature",
                    valueFormat: "ref",
                },
            },
            {
                name: "len",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "RewardValidator",
        header: 3816415473,
        fields: [
            {
                name: "validator",
                type: { kind: "simple", type: "NewValidator", optional: false },
            },
            {
                name: "sigs",
                type: {
                    kind: "dict",
                    key: "int",
                    value: "SignerAndSignature",
                    valueFormat: "ref",
                },
            },
            {
                name: "len",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "Lock721",
        header: 2258979588,
        fields: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "ClaimNFT721",
        header: 2933783886,
        fields: [
            {
                name: "data",
                type: { kind: "simple", type: "ClaimData", optional: false },
            },
            {
                name: "signatures",
                type: {
                    kind: "dict",
                    key: "int",
                    value: "SignerAndSignature",
                    valueFormat: "ref",
                },
            },
            {
                name: "len",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "StakeEvent",
        header: 1284335502,
        fields: [
            {
                name: "amount",
                type: {
                    kind: "simple",
                    type: "uint",
                    optional: false,
                    format: "coins",
                },
            },
            {
                name: "asd",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "AddNewValidatorEvent",
        header: 3100755976,
        fields: [
            {
                name: "validator",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "RewardValidatorEvent",
        header: 2049240067,
        fields: [
            {
                name: "validator",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
        ],
    },
    {
        name: "LockedEvent",
        header: 4205190074,
        fields: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "destinationChain",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "destinationUserAddress",
                type: { kind: "simple", type: "cell", optional: false },
            },
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "slice", optional: false },
            },
            {
                name: "tokenAmount",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "nftType",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
    {
        name: "UnLock721Event",
        header: 2428616504,
        fields: [
            {
                name: "to",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "contractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
    },
    {
        name: "ClaimedEvent",
        header: 2421062321,
        fields: [
            {
                name: "lockTxChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "tokenId",
                type: { kind: "simple", type: "uint", optional: false, format: 256 },
            },
            {
                name: "newlyDeployCollection",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "transactionHash",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
    },
];
const Bridge_getters = [
    {
        name: "Original721Mapping",
        arguments: [
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
        returnType: { kind: "simple", type: "address", optional: true },
    },
    {
        name: "Duplicate721Mapping",
        arguments: [
            {
                name: "contractAddress",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
        returnType: { kind: "simple", type: "address", optional: true },
    },
    {
        name: "OriginalToDuplicate",
        arguments: [
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
        ],
        returnType: {
            kind: "simple",
            type: "OriginalToDuplicateContractInfo",
            optional: true,
        },
    },
    {
        name: "DuplicateToOriginal",
        arguments: [
            {
                name: "key",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
        returnType: {
            kind: "simple",
            type: "DuplicateToOriginalContractInfo",
            optional: true,
        },
    },
    {
        name: "TokenInfo",
        arguments: [
            {
                name: "key",
                type: { kind: "simple", type: "address", optional: false },
            },
        ],
        returnType: { kind: "simple", type: "Token", optional: true },
    },
    {
        name: "TokenInfoSelf",
        arguments: [
            {
                name: "tokenId",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
            {
                name: "sourceChain",
                type: { kind: "simple", type: "string", optional: false },
            },
            {
                name: "sourceNftContractAddress",
                type: { kind: "simple", type: "slice", optional: false },
            },
        ],
        returnType: { kind: "simple", type: "address", optional: true },
    },
    {
        name: "Validator",
        arguments: [
            {
                name: "key",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
        ],
        returnType: { kind: "simple", type: "Validator", optional: true },
    },
    {
        name: "ValidatorsCount",
        arguments: [],
        returnType: { kind: "simple", type: "int", optional: true, format: 257 },
    },
    {
        name: "CollectionDeployer",
        arguments: [],
        returnType: { kind: "simple", type: "address", optional: true },
    },
    {
        name: "StorageDeployer",
        arguments: [],
        returnType: { kind: "simple", type: "address", optional: true },
    },
    {
        name: "Collections",
        arguments: [
            {
                name: "key",
                type: { kind: "simple", type: "int", optional: false, format: 257 },
            },
        ],
        returnType: { kind: "simple", type: "address", optional: true },
    },
];
const Bridge_receivers = [
    { receiver: "internal", message: { kind: "typed", type: "Excesses" } },
    { receiver: "internal", message: { kind: "text", text: "Deploy" } },
    { receiver: "internal", message: { kind: "typed", type: "AddValidator" } },
    { receiver: "internal", message: { kind: "typed", type: "RewardValidator" } },
    {
        receiver: "internal",
        message: { kind: "typed", type: "HiFromDeployNFT721Storage" },
    },
    {
        receiver: "internal",
        message: { kind: "typed", type: "HiFromDeployNFT721Collection" },
    },
    {
        receiver: "internal",
        message: { kind: "typed", type: "OwnershipAssigned" },
    },
    { receiver: "internal", message: { kind: "typed", type: "ClaimNFT721" } },
    { receiver: "internal", message: { kind: "empty" } },
];
class Bridge {
    static async init(validatorPublicKey, validatorAddress, chainType) {
        return await Bridge_init(validatorPublicKey, validatorAddress, chainType);
    }
    static async fromInit(validatorPublicKey, validatorAddress, chainType) {
        const init = await Bridge_init(validatorPublicKey, validatorAddress, chainType);
        const address = (0, core_1.contractAddress)(0, init);
        return new Bridge(address, init);
    }
    static fromAddress(address) {
        return new Bridge(address);
    }
    constructor(address, init) {
        this.abi = {
            types: Bridge_types,
            getters: Bridge_getters,
            receivers: Bridge_receivers,
            errors: Bridge_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "Excesses") {
            body = (0, core_1.beginCell)().store(storeExcesses(message)).endCell();
        }
        if (message === "Deploy") {
            body = (0, core_1.beginCell)().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "AddValidator") {
            body = (0, core_1.beginCell)().store(storeAddValidator(message)).endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "RewardValidator") {
            body = (0, core_1.beginCell)().store(storeRewardValidator(message)).endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "HiFromDeployNFT721Storage") {
            body = (0, core_1.beginCell)()
                .store(storeHiFromDeployNFT721Storage(message))
                .endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "HiFromDeployNFT721Collection") {
            body = (0, core_1.beginCell)()
                .store(storeHiFromDeployNFT721Collection(message))
                .endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "OwnershipAssigned") {
            body = (0, core_1.beginCell)().store(storeOwnershipAssigned(message)).endCell();
        }
        if (message &&
            typeof message === "object" &&
            !(message instanceof core_1.Slice) &&
            message.$$type === "ClaimNFT721") {
            body = (0, core_1.beginCell)().store(storeClaimNFT721(message)).endCell();
        }
        if (message === null) {
            body = new core_1.Cell();
        }
        if (body === null) {
            throw new Error("Invalid message type");
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getOriginal721Mapping(provider, sourceNftContractAddress, sourceChain) {
        let builder = new core_1.TupleBuilder();
        builder.writeAddress(sourceNftContractAddress);
        builder.writeString(sourceChain);
        let source = (await provider.get("Original721Mapping", builder.build()))
            .stack;
        let result = source.readAddressOpt();
        return result;
    }
    async getDuplicate721Mapping(provider, contractAddress) {
        let builder = new core_1.TupleBuilder();
        builder.writeAddress(contractAddress);
        let source = (await provider.get("Duplicate721Mapping", builder.build()))
            .stack;
        let result = source.readAddressOpt();
        return result;
    }
    async getOriginalToDuplicate(provider, sourceNftContractAddress, sourceChain) {
        let builder = new core_1.TupleBuilder();
        builder.writeString(sourceNftContractAddress);
        builder.writeString(sourceChain);
        let source = (await provider.get("OriginalToDuplicate", builder.build()))
            .stack;
        const result_p = source.readTupleOpt();
        const result = result_p
            ? loadTupleOriginalToDuplicateContractInfo(result_p)
            : null;
        return result;
    }
    async getDuplicateToOriginal(provider, key) {
        let builder = new core_1.TupleBuilder();
        builder.writeAddress(key);
        let source = (await provider.get("DuplicateToOriginal", builder.build()))
            .stack;
        const result_p = source.readTupleOpt();
        const result = result_p
            ? loadTupleDuplicateToOriginalContractInfo(result_p)
            : null;
        return result;
    }
    async getTokenInfo(provider, key) {
        let builder = new core_1.TupleBuilder();
        builder.writeAddress(key);
        let source = (await provider.get("TokenInfo", builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleToken(result_p) : null;
        return result;
    }
    async getTokenInfoSelf(provider, tokenId, sourceChain, sourceNftContractAddress) {
        let builder = new core_1.TupleBuilder();
        builder.writeNumber(tokenId);
        builder.writeString(sourceChain);
        builder.writeSlice(sourceNftContractAddress);
        let source = (await provider.get("TokenInfoSelf", builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    async getValidator(provider, key) {
        let builder = new core_1.TupleBuilder();
        builder.writeNumber(key);
        let source = (await provider.get("Validator", builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleValidator(result_p) : null;
        return result;
    }
    async getValidatorsCount(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get("ValidatorsCount", builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    async getCollectionDeployer(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get("CollectionDeployer", builder.build()))
            .stack;
        let result = source.readAddressOpt();
        return result;
    }
    async getStorageDeployer(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get("StorageDeployer", builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    async getCollections(provider, key) {
        let builder = new core_1.TupleBuilder();
        builder.writeNumber(key);
        let source = (await provider.get("Collections", builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
}
exports.Bridge = Bridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uQnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL3Rvbi90b25CcmlkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLGFBQWE7QUFDYixvQ0FvQm1CO0FBUW5CLFNBQWdCLGNBQWMsQ0FBQyxHQUFjO0lBQzNDLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDMUIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFORCx3Q0FNQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxLQUFZO0lBQ3hDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNCLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBb0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNwRSxDQUFDO0FBTEQsc0NBS0M7QUFFRCxTQUFTLGtCQUFrQixDQUFDLE1BQW1CO0lBQzdDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFvQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3BFLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE1BQWlCO0lBQzVDLElBQUksT0FBTyxH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