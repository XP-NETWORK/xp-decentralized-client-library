"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValidator = exports.storeValidator = exports.loadHiFromDeployNFT721Collection = exports.storeHiFromDeployNFT721Collection = exports.loadHiFromDeployNFT721Storage = exports.storeHiFromDeployNFT721Storage = exports.loadGetNftData = exports.storeGetNftData = exports.loadReportStaticData = exports.storeReportStaticData = exports.loadGetStaticData = exports.storeGetStaticData = exports.loadExcesses = exports.storeExcesses = exports.loadOwnershipAssigned = exports.storeOwnershipAssigned = exports.loadTransfer = exports.storeTransfer = exports.loadRoyaltyParams = exports.storeRoyaltyParams = exports.loadCollectionData = exports.storeCollectionData = exports.loadReportRoyaltyParams = exports.storeReportRoyaltyParams = exports.loadGetRoyaltyParams = exports.storeGetRoyaltyParams = exports.loadCreatedCollection = exports.storeCreatedCollection = exports.loadDeployNFT721Collection = exports.storeDeployNFT721Collection = exports.loadDeployNFT721Storage = exports.storeDeployNFT721Storage = exports.loadUnlockToken = exports.storeUnlockToken = exports.loadHiFromChild = exports.storeHiFromChild = exports.loadHiFromParent = exports.storeHiFromParent = exports.loadFactoryDeploy = exports.storeFactoryDeploy = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
exports.NftCollection = exports.loadClaimedEvent = exports.storeClaimedEvent = exports.loadUnLock721Event = exports.storeUnLock721Event = exports.loadLockedEvent = exports.storeLockedEvent = exports.loadRewardValidatorEvent = exports.storeRewardValidatorEvent = exports.loadAddNewValidatorEvent = exports.storeAddNewValidatorEvent = exports.loadStakeEvent = exports.storeStakeEvent = exports.loadLock721 = exports.storeLock721 = exports.loadRewardValidator = exports.storeRewardValidator = exports.loadAddValidator = exports.storeAddValidator = exports.loadClaimData = exports.storeClaimData = exports.loadOriginalToDuplicateContractInfo = exports.storeOriginalToDuplicateContractInfo = exports.loadDuplicateToOriginalContractInfo = exports.storeDuplicateToOriginalContractInfo = exports.loadNewValidator = exports.storeNewValidator = exports.loadSignerAndSignature = exports.storeSignerAndSignature = void 0;
const core_1 = require("@ton/core");
function storeStateInit(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
exports.storeStateInit = storeStateInit;
function loadStateInit(slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
exports.loadStateInit = loadStateInit;
function loadTupleStateInit(source) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeContext(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}
exports.storeContext = storeContext;
function loadContext(slice) {
    const sc_0 = slice;
    const _bounced = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef();
    return {
        $$type: 'Context',
        bounced: _bounced,
        sender: _sender,
        value: _value,
        raw: _raw,
    };
}
exports.loadContext = loadContext;
function storeSendParameters(src) {
    return (builder) => {
        const b_0 = builder;
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
    const sc_0 = slice;
    const _bounce = sc_0.loadBit();
    const _to = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return {
        $$type: 'SendParameters',
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
function storeDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeploy = storeDeploy;
function loadDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
exports.loadDeploy = loadDeploy;
function storeDeployOk(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeployOk = storeDeployOk;
function loadDeployOk(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
exports.loadDeployOk = loadDeployOk;
function storeFactoryDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}
exports.storeFactoryDeploy = storeFactoryDeploy;
function loadFactoryDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return {
        $$type: 'FactoryDeploy',
        queryId: _queryId,
        cashback: _cashback,
    };
}
exports.loadFactoryDeploy = loadFactoryDeploy;
function storeHiFromParent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3517475402, 32);
        b_0.storeStringRefTail(src.greeting);
    };
}
exports.storeHiFromParent = storeHiFromParent;
function loadHiFromParent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3517475402) {
        throw Error('Invalid prefix');
    }
    const _greeting = sc_0.loadStringRefTail();
    return { $$type: 'HiFromParent', greeting: _greeting };
}
exports.loadHiFromParent = loadHiFromParent;
function storeHiFromChild(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1237539370, 32);
        b_0.storeUint(src.fromSeqno, 64);
        b_0.storeStringRefTail(src.greeting);
    };
}
exports.storeHiFromChild = storeHiFromChild;
function loadHiFromChild(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1237539370) {
        throw Error('Invalid prefix');
    }
    const _fromSeqno = sc_0.loadUintBig(64);
    const _greeting = sc_0.loadStringRefTail();
    return {
        $$type: 'HiFromChild',
        fromSeqno: _fromSeqno,
        greeting: _greeting,
    };
}
exports.loadHiFromChild = loadHiFromChild;
function storeUnlockToken(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(411326794, 32);
        b_0.storeAddress(src.to);
    };
}
exports.storeUnlockToken = storeUnlockToken;
function loadUnlockToken(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 411326794) {
        throw Error('Invalid prefix');
    }
    const _to = sc_0.loadAddress();
    return { $$type: 'UnlockToken', to: _to };
}
exports.loadUnlockToken = loadUnlockToken;
function storeDeployNFT721Storage(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3440771816, 32);
        b_0.storeAddress(src.collectionAddress);
    };
}
exports.storeDeployNFT721Storage = storeDeployNFT721Storage;
function loadDeployNFT721Storage(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3440771816) {
        throw Error('Invalid prefix');
    }
    const _collectionAddress = sc_0.loadAddress();
    return {
        $$type: 'DeployNFT721Storage',
        collectionAddress: _collectionAddress,
    };
}
exports.loadDeployNFT721Storage = loadDeployNFT721Storage;
function storeDeployNFT721Collection(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(4287560620, 32);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.collection_content);
        const b_1 = new core_1.Builder();
        b_1.store(storeRoyaltyParams(src.royalty_params));
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Collection = storeDeployNFT721Collection;
function loadDeployNFT721Collection(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4287560620) {
        throw Error('Invalid prefix');
    }
    const _owner_address = sc_0.loadAddress();
    const _collection_content = sc_0.loadRef();
    const sc_1 = sc_0.loadRef().beginParse();
    const _royalty_params = loadRoyaltyParams(sc_1);
    return {
        $$type: 'DeployNFT721Collection',
        owner_address: _owner_address,
        collection_content: _collection_content,
        royalty_params: _royalty_params,
    };
}
exports.loadDeployNFT721Collection = loadDeployNFT721Collection;
function storeCreatedCollection(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(41705028, 32);
        b_0.storeAddress(src.collectionAddress);
    };
}
exports.storeCreatedCollection = storeCreatedCollection;
function loadCreatedCollection(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 41705028) {
        throw Error('Invalid prefix');
    }
    const _collectionAddress = sc_0.loadAddress();
    return {
        $$type: 'CreatedCollection',
        collectionAddress: _collectionAddress,
    };
}
exports.loadCreatedCollection = loadCreatedCollection;
function storeGetRoyaltyParams(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeGetRoyaltyParams = storeGetRoyaltyParams;
function loadGetRoyaltyParams(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams', query_id: _query_id };
}
exports.loadGetRoyaltyParams = loadGetRoyaltyParams;
function storeReportRoyaltyParams(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}
exports.storeReportRoyaltyParams = storeReportRoyaltyParams;
function loadReportRoyaltyParams(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    const _numerator = sc_0.loadUintBig(16);
    const _denominator = sc_0.loadUintBig(16);
    const _destination = sc_0.loadAddress();
    return {
        $$type: 'ReportRoyaltyParams',
        query_id: _query_id,
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
}
exports.loadReportRoyaltyParams = loadReportRoyaltyParams;
function storeCollectionData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}
exports.storeCollectionData = storeCollectionData;
function loadCollectionData(slice) {
    const sc_0 = slice;
    const _next_item_index = sc_0.loadIntBig(257);
    const _collection_content = sc_0.loadRef();
    const _owner_address = sc_0.loadAddress();
    return {
        $$type: 'CollectionData',
        next_item_index: _next_item_index,
        collection_content: _collection_content,
        owner_address: _owner_address,
    };
}
exports.loadCollectionData = loadCollectionData;
function loadTupleCollectionData(source) {
    const _next_item_index = source.readBigNumber();
    const _collection_content = source.readCell();
    const _owner_address = source.readAddress();
    return {
        $$type: 'CollectionData',
        next_item_index: _next_item_index,
        collection_content: _collection_content,
        owner_address: _owner_address,
    };
}
function storeRoyaltyParams(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}
exports.storeRoyaltyParams = storeRoyaltyParams;
function loadRoyaltyParams(slice) {
    const sc_0 = slice;
    const _numerator = sc_0.loadIntBig(257);
    const _denominator = sc_0.loadIntBig(257);
    const _destination = sc_0.loadAddress();
    return {
        $$type: 'RoyaltyParams',
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
}
exports.loadRoyaltyParams = loadRoyaltyParams;
function loadTupleRoyaltyParams(source) {
    const _numerator = source.readBigNumber();
    const _denominator = source.readBigNumber();
    const _destination = source.readAddress();
    return {
        $$type: 'RoyaltyParams',
        numerator: _numerator,
        denominator: _denominator,
        destination: _destination,
    };
}
function storeTransfer(src) {
    return (builder) => {
        const b_0 = builder;
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
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}
exports.storeTransfer = storeTransfer;
function loadTransfer(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    const _new_owner = sc_0.loadAddress();
    const _response_destination = sc_0.loadAddress();
    const _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forward_amount = sc_0.loadCoins();
    const _forward_payload = sc_0.asCell();
    return {
        $$type: 'Transfer',
        query_id: _query_id,
        new_owner: _new_owner,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_amount: _forward_amount,
        forward_payload: _forward_payload,
    };
}
exports.loadTransfer = loadTransfer;
function storeOwnershipAssigned(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}
exports.storeOwnershipAssigned = storeOwnershipAssigned;
function loadOwnershipAssigned(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    const _prev_owner = sc_0.loadAddress();
    const _forward_payload = sc_0.asCell();
    return {
        $$type: 'OwnershipAssigned',
        query_id: _query_id,
        prev_owner: _prev_owner,
        forward_payload: _forward_payload,
    };
}
exports.loadOwnershipAssigned = loadOwnershipAssigned;
function storeExcesses(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeExcesses = storeExcesses;
function loadExcesses(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses', query_id: _query_id };
}
exports.loadExcesses = loadExcesses;
function storeGetStaticData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
exports.storeGetStaticData = storeGetStaticData;
function loadGetStaticData(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData', query_id: _query_id };
}
exports.loadGetStaticData = loadGetStaticData;
function storeReportStaticData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeAddress(src.collection);
    };
}
exports.storeReportStaticData = storeReportStaticData;
function loadReportStaticData(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) {
        throw Error('Invalid prefix');
    }
    const _query_id = sc_0.loadUintBig(64);
    const _index_id = sc_0.loadIntBig(257);
    const _collection = sc_0.loadAddress();
    return {
        $$type: 'ReportStaticData',
        query_id: _query_id,
        index_id: _index_id,
        collection: _collection,
    };
}
exports.loadReportStaticData = loadReportStaticData;
function storeGetNftData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.individual_content);
    };
}
exports.storeGetNftData = storeGetNftData;
function loadGetNftData(slice) {
    const sc_0 = slice;
    const _is_initialized = sc_0.loadBit();
    const _index = sc_0.loadIntBig(257);
    const _collection_address = sc_0.loadAddress();
    const _owner_address = sc_0.loadAddress();
    const _individual_content = sc_0.loadRef();
    return {
        $$type: 'GetNftData',
        is_initialized: _is_initialized,
        index: _index,
        collection_address: _collection_address,
        owner_address: _owner_address,
        individual_content: _individual_content,
    };
}
exports.loadGetNftData = loadGetNftData;
function storeHiFromDeployNFT721Storage(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3538995402, 32);
        b_0.storeAddress(src.storageAddress);
    };
}
exports.storeHiFromDeployNFT721Storage = storeHiFromDeployNFT721Storage;
function loadHiFromDeployNFT721Storage(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3538995402) {
        throw Error('Invalid prefix');
    }
    const _storageAddress = sc_0.loadAddress();
    return {
        $$type: 'HiFromDeployNFT721Storage',
        storageAddress: _storageAddress,
    };
}
exports.loadHiFromDeployNFT721Storage = loadHiFromDeployNFT721Storage;
function storeHiFromDeployNFT721Collection(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1567973189, 32);
        b_0.storeAddress(src.collectionAddress);
    };
}
exports.storeHiFromDeployNFT721Collection = storeHiFromDeployNFT721Collection;
function loadHiFromDeployNFT721Collection(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1567973189) {
        throw Error('Invalid prefix');
    }
    const _collectionAddress = sc_0.loadAddress();
    return {
        $$type: 'HiFromDeployNFT721Collection',
        collectionAddress: _collectionAddress,
    };
}
exports.loadHiFromDeployNFT721Collection = loadHiFromDeployNFT721Collection;
function storeValidator(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBit(src.added);
        b_0.storeCoins(src.pendingRewards);
    };
}
exports.storeValidator = storeValidator;
function loadValidator(slice) {
    const sc_0 = slice;
    const _added = sc_0.loadBit();
    const _pendingRewards = sc_0.loadCoins();
    return {
        $$type: 'Validator',
        added: _added,
        pendingRewards: _pendingRewards,
    };
}
exports.loadValidator = loadValidator;
function storeSignerAndSignature(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeRef(src.signature);
        b_0.storeUint(src.key, 256);
    };
}
exports.storeSignerAndSignature = storeSignerAndSignature;
function loadSignerAndSignature(slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadRef();
    const _key = sc_0.loadUintBig(256);
    return {
        $$type: 'SignerAndSignature',
        signature: _signature,
        key: _key,
    };
}
exports.loadSignerAndSignature = loadSignerAndSignature;
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
        const b_0 = builder;
        b_0.storeUint(src.key, 256);
    };
}
exports.storeNewValidator = storeNewValidator;
function loadNewValidator(slice) {
    const sc_0 = slice;
    const _key = sc_0.loadUintBig(256);
    return { $$type: 'NewValidator', key: _key };
}
exports.loadNewValidator = loadNewValidator;
function storeDuplicateToOriginalContractInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeStringRefTail(src.contractAddress);
    };
}
exports.storeDuplicateToOriginalContractInfo = storeDuplicateToOriginalContractInfo;
function loadDuplicateToOriginalContractInfo(slice) {
    const sc_0 = slice;
    const _keyChain = sc_0.loadStringRefTail();
    const _chain = sc_0.loadStringRefTail();
    const _contractAddress = sc_0.loadStringRefTail();
    return {
        $$type: 'DuplicateToOriginalContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
    };
}
exports.loadDuplicateToOriginalContractInfo = loadDuplicateToOriginalContractInfo;
function storeOriginalToDuplicateContractInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeAddress(src.contractAddress);
    };
}
exports.storeOriginalToDuplicateContractInfo = storeOriginalToDuplicateContractInfo;
function loadOriginalToDuplicateContractInfo(slice) {
    const sc_0 = slice;
    const _keyChain = sc_0.loadStringRefTail();
    const _chain = sc_0.loadStringRefTail();
    const _contractAddress = sc_0.loadAddress();
    return {
        $$type: 'OriginalToDuplicateContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
    };
}
exports.loadOriginalToDuplicateContractInfo = loadOriginalToDuplicateContractInfo;
function storeClaimData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(src.tokenId, 256);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeAddress(src.destinationUserAddress);
        b_0.storeStringRefTail(src.sourceNftContractAddress);
        const b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.name);
        b_1.storeStringRefTail(src.symbol);
        b_1.storeUint(src.royalty, 256);
        b_1.storeAddress(src.royaltyReceiver);
        b_1.storeStringRefTail(src.metadata);
        const b_2 = new core_1.Builder();
        b_2.storeStringRefTail(src.transactionHash);
        b_2.storeUint(src.tokenAmount, 256);
        b_2.storeStringRefTail(src.nftType);
        b_2.storeUint(src.fee, 256);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeClaimData = storeClaimData;
function loadClaimData(slice) {
    const sc_0 = slice;
    const _tokenId = sc_0.loadUintBig(256);
    const _sourceChain = sc_0.loadStringRefTail();
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadAddress();
    const _sourceNftContractAddress = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _name = sc_1.loadStringRefTail();
    const _symbol = sc_1.loadStringRefTail();
    const _royalty = sc_1.loadUintBig(256);
    const _royaltyReceiver = sc_1.loadAddress();
    const _metadata = sc_1.loadStringRefTail();
    const sc_2 = sc_1.loadRef().beginParse();
    const _transactionHash = sc_2.loadStringRefTail();
    const _tokenAmount = sc_2.loadUintBig(256);
    const _nftType = sc_2.loadStringRefTail();
    const _fee = sc_2.loadUintBig(256);
    return {
        $$type: 'ClaimData',
        tokenId: _tokenId,
        sourceChain: _sourceChain,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
        name: _name,
        symbol: _symbol,
        royalty: _royalty,
        royaltyReceiver: _royaltyReceiver,
        metadata: _metadata,
        transactionHash: _transactionHash,
        tokenAmount: _tokenAmount,
        nftType: _nftType,
        fee: _fee,
    };
}
exports.loadClaimData = loadClaimData;
function storeAddValidator(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3417513985, 32);
        b_0.store(storeNewValidator(src.newValidatorPublicKey));
        b_0.storeDict(src.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeAddValidator = storeAddValidator;
function loadAddValidator(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3417513985) {
        throw Error('Invalid prefix');
    }
    const _newValidatorPublicKey = loadNewValidator(sc_0);
    const _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    const _len = sc_0.loadUintBig(256);
    return {
        $$type: 'AddValidator',
        newValidatorPublicKey: _newValidatorPublicKey,
        sigs: _sigs,
        len: _len,
    };
}
exports.loadAddValidator = loadAddValidator;
function storeRewardValidator(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3816415473, 32);
        b_0.store(storeNewValidator(src.validator));
        b_0.storeDict(src.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeRewardValidator = storeRewardValidator;
function loadRewardValidator(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3816415473) {
        throw Error('Invalid prefix');
    }
    const _validator = loadNewValidator(sc_0);
    const _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    const _len = sc_0.loadUintBig(256);
    return {
        $$type: 'RewardValidator',
        validator: _validator,
        sigs: _sigs,
        len: _len,
    };
}
exports.loadRewardValidator = loadRewardValidator;
function storeLock721(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1748230570, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeStringRefTail(src.destinationUserAddress);
        b_0.storeAddress(src.sourceNftContractAddress);
    };
}
exports.storeLock721 = storeLock721;
function loadLock721(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1748230570) {
        throw Error('Invalid prefix');
    }
    const _tokenId = sc_0.loadUintBig(256);
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadStringRefTail();
    const _sourceNftContractAddress = sc_0.loadAddress();
    return {
        $$type: 'Lock721',
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddress: _sourceNftContractAddress,
    };
}
exports.loadLock721 = loadLock721;
function storeStakeEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1284335502, 32);
        b_0.storeCoins(src.amount);
        b_0.storeStringRefTail(src.asd);
    };
}
exports.storeStakeEvent = storeStakeEvent;
function loadStakeEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1284335502) {
        throw Error('Invalid prefix');
    }
    const _amount = sc_0.loadCoins();
    const _asd = sc_0.loadStringRefTail();
    return { $$type: 'StakeEvent', amount: _amount, asd: _asd };
}
exports.loadStakeEvent = loadStakeEvent;
function storeAddNewValidatorEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3100755976, 32);
        b_0.storeUint(src.validator, 256);
    };
}
exports.storeAddNewValidatorEvent = storeAddNewValidatorEvent;
function loadAddNewValidatorEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3100755976) {
        throw Error('Invalid prefix');
    }
    const _validator = sc_0.loadUintBig(256);
    return { $$type: 'AddNewValidatorEvent', validator: _validator };
}
exports.loadAddNewValidatorEvent = loadAddNewValidatorEvent;
function storeRewardValidatorEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2049240067, 32);
        b_0.storeUint(src.validator, 256);
    };
}
exports.storeRewardValidatorEvent = storeRewardValidatorEvent;
function loadRewardValidatorEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2049240067) {
        throw Error('Invalid prefix');
    }
    const _validator = sc_0.loadUintBig(256);
    return { $$type: 'RewardValidatorEvent', validator: _validator };
}
exports.loadRewardValidatorEvent = loadRewardValidatorEvent;
function storeLockedEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2534710387, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeStringRefTail(src.destinationUserAddress);
        b_0.storeStringRefTail(src.sourceNftContractAddress);
        b_0.storeUint(src.tokenAmount, 256);
        const b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.nftType);
        b_1.storeStringRefTail(src.sourceChain);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeLockedEvent = storeLockedEvent;
function loadLockedEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2534710387) {
        throw Error('Invalid prefix');
    }
    const _tokenId = sc_0.loadUintBig(256);
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadStringRefTail();
    const _sourceNftContractAddress = sc_0.loadStringRefTail();
    const _tokenAmount = sc_0.loadUintBig(256);
    const sc_1 = sc_0.loadRef().beginParse();
    const _nftType = sc_1.loadStringRefTail();
    const _sourceChain = sc_1.loadStringRefTail();
    return {
        $$type: 'LockedEvent',
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
function storeUnLock721Event(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3340679482, 32);
        b_0.storeAddress(src.to);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeAddress(src.contractAddr);
    };
}
exports.storeUnLock721Event = storeUnLock721Event;
function loadUnLock721Event(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3340679482) {
        throw Error('Invalid prefix');
    }
    const _to = sc_0.loadAddress();
    const _tokenId = sc_0.loadUintBig(256);
    const _contractAddr = sc_0.loadAddress();
    return {
        $$type: 'UnLock721Event',
        to: _to,
        tokenId: _tokenId,
        contractAddr: _contractAddr,
    };
}
exports.loadUnLock721Event = loadUnLock721Event;
function storeClaimedEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1639470925, 32);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.transactionHash);
    };
}
exports.storeClaimedEvent = storeClaimedEvent;
function loadClaimedEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1639470925) {
        throw Error('Invalid prefix');
    }
    const _sourceChain = sc_0.loadStringRefTail();
    const _transactionHash = sc_0.loadStringRefTail();
    return {
        $$type: 'ClaimedEvent',
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
    };
}
exports.loadClaimedEvent = loadClaimedEvent;
function initNftCollection_init_args(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.collection_content);
        const b_1 = new core_1.Builder();
        b_1.store(storeRoyaltyParams(src.royalty_params));
        b_0.storeRef(b_1.endCell());
    };
}
async function NftCollection_init(owner_address, collection_content, royalty_params) {
    const __code = core_1.Cell.fromBase64('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');
    const __system = core_1.Cell.fromBase64('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');
    const builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftCollection_init_args({
        $$type: 'NftCollection_init_args',
        owner_address,
        collection_content,
        royalty_params,
    })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const NftCollection_errors = {
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
    9414: { message: `Invalid destination chain!` },
    16053: { message: `Only owner can call` },
    35976: { message: `Only the owner can call this function` },
    36476: { message: `Validator does not exist!` },
    49280: { message: `not owner` },
    52185: { message: `Threshold not reached!` },
    54615: { message: `Insufficient balance` },
    62521: { message: `Must have signatures!` },
    62742: { message: `non-sequential NFTs` },
};
const NftCollection_types = [
    {
        name: 'StateInit',
        header: null,
        fields: [
            {
                name: 'code',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
            {
                name: 'data',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
        ],
    },
    {
        name: 'Context',
        header: null,
        fields: [
            {
                name: 'bounced',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'sender',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'value',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'raw',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
        ],
    },
    {
        name: 'SendParameters',
        header: null,
        fields: [
            {
                name: 'bounce',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'to',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'value',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'mode',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'body',
                type: { kind: 'simple', type: 'cell', optional: true },
            },
            {
                name: 'code',
                type: { kind: 'simple', type: 'cell', optional: true },
            },
            {
                name: 'data',
                type: { kind: 'simple', type: 'cell', optional: true },
            },
        ],
    },
    {
        name: 'Deploy',
        header: 2490013878,
        fields: [
            {
                name: 'queryId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
        ],
    },
    {
        name: 'DeployOk',
        header: 2952335191,
        fields: [
            {
                name: 'queryId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
        ],
    },
    {
        name: 'FactoryDeploy',
        header: 1829761339,
        fields: [
            {
                name: 'queryId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'cashback',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'HiFromParent',
        header: 3517475402,
        fields: [
            {
                name: 'greeting',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'HiFromChild',
        header: 1237539370,
        fields: [
            {
                name: 'fromSeqno',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'greeting',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'UnlockToken',
        header: 411326794,
        fields: [
            {
                name: 'to',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'DeployNFT721Storage',
        header: 3440771816,
        fields: [
            {
                name: 'collectionAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'DeployNFT721Collection',
        header: 4287560620,
        fields: [
            {
                name: 'owner_address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'collection_content',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
            {
                name: 'royalty_params',
                type: {
                    kind: 'simple',
                    type: 'RoyaltyParams',
                    optional: false,
                },
            },
        ],
    },
    {
        name: 'CreatedCollection',
        header: 41705028,
        fields: [
            {
                name: 'collectionAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'GetRoyaltyParams',
        header: 1765620048,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
        ],
    },
    {
        name: 'ReportRoyaltyParams',
        header: 2831876269,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'numerator',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 16,
                },
            },
            {
                name: 'denominator',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 16,
                },
            },
            {
                name: 'destination',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'CollectionData',
        header: null,
        fields: [
            {
                name: 'next_item_index',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'collection_content',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
            {
                name: 'owner_address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'RoyaltyParams',
        header: null,
        fields: [
            {
                name: 'numerator',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'denominator',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'destination',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'Transfer',
        header: 1607220500,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'new_owner',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'response_destination',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'custom_payload',
                type: { kind: 'simple', type: 'cell', optional: true },
            },
            {
                name: 'forward_amount',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 'coins',
                },
            },
            {
                name: 'forward_payload',
                type: {
                    kind: 'simple',
                    type: 'slice',
                    optional: false,
                    format: 'remainder',
                },
            },
        ],
    },
    {
        name: 'OwnershipAssigned',
        header: 85167505,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'prev_owner',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'forward_payload',
                type: {
                    kind: 'simple',
                    type: 'slice',
                    optional: false,
                    format: 'remainder',
                },
            },
        ],
    },
    {
        name: 'Excesses',
        header: 3576854235,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
        ],
    },
    {
        name: 'GetStaticData',
        header: 801842850,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
        ],
    },
    {
        name: 'ReportStaticData',
        header: 2339837749,
        fields: [
            {
                name: 'query_id',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'index_id',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'collection',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'GetNftData',
        header: null,
        fields: [
            {
                name: 'is_initialized',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'index',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'collection_address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'owner_address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'individual_content',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
        ],
    },
    {
        name: 'HiFromDeployNFT721Storage',
        header: 3538995402,
        fields: [
            {
                name: 'storageAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'HiFromDeployNFT721Collection',
        header: 1567973189,
        fields: [
            {
                name: 'collectionAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'Validator',
        header: null,
        fields: [
            {
                name: 'added',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'pendingRewards',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 'coins',
                },
            },
        ],
    },
    {
        name: 'SignerAndSignature',
        header: null,
        fields: [
            {
                name: 'signature',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'NewValidator',
        header: null,
        fields: [
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'DuplicateToOriginalContractInfo',
        header: null,
        fields: [
            {
                name: 'keyChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'chain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'contractAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'OriginalToDuplicateContractInfo',
        header: null,
        fields: [
            {
                name: 'keyChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'chain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'contractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'ClaimData',
        header: null,
        fields: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'destinationChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'destinationUserAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'name',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'symbol',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'royalty',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'royaltyReceiver',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'metadata',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'transactionHash',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'tokenAmount',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'nftType',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'fee',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'AddValidator',
        header: 3417513985,
        fields: [
            {
                name: 'newValidatorPublicKey',
                type: { kind: 'simple', type: 'NewValidator', optional: false },
            },
            {
                name: 'sigs',
                type: {
                    kind: 'dict',
                    key: 'int',
                    value: 'SignerAndSignature',
                    valueFormat: 'ref',
                },
            },
            {
                name: 'len',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'RewardValidator',
        header: 3816415473,
        fields: [
            {
                name: 'validator',
                type: { kind: 'simple', type: 'NewValidator', optional: false },
            },
            {
                name: 'sigs',
                type: {
                    kind: 'dict',
                    key: 'int',
                    value: 'SignerAndSignature',
                    valueFormat: 'ref',
                },
            },
            {
                name: 'len',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'Lock721',
        header: 1748230570,
        fields: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'destinationChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'destinationUserAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'StakeEvent',
        header: 1284335502,
        fields: [
            {
                name: 'amount',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 'coins',
                },
            },
            {
                name: 'asd',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'AddNewValidatorEvent',
        header: 3100755976,
        fields: [
            {
                name: 'validator',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'RewardValidatorEvent',
        header: 2049240067,
        fields: [
            {
                name: 'validator',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
        ],
    },
    {
        name: 'LockedEvent',
        header: 2534710387,
        fields: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'destinationChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'destinationUserAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'tokenAmount',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'nftType',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'UnLock721Event',
        header: 3340679482,
        fields: [
            {
                name: 'to',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 256,
                },
            },
            {
                name: 'contractAddr',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'ClaimedEvent',
        header: 1639470925,
        fields: [
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'transactionHash',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
];
const NftCollection_getters = [
    {
        name: 'get_collection_data',
        arguments: [],
        returnType: { kind: 'simple', type: 'CollectionData', optional: false },
    },
    {
        name: 'get_nft_address_by_index',
        arguments: [
            {
                name: 'item_index',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
        ],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'getNftItemInit',
        arguments: [
            {
                name: 'item_index',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
        ],
        returnType: { kind: 'simple', type: 'StateInit', optional: false },
    },
    {
        name: 'get_nft_content',
        arguments: [
            {
                name: 'index',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'individual_content',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
        ],
        returnType: { kind: 'simple', type: 'cell', optional: false },
    },
    {
        name: 'royalty_params',
        arguments: [],
        returnType: { kind: 'simple', type: 'RoyaltyParams', optional: false },
    },
];
const NftCollection_receivers = [
    { receiver: 'internal', message: { kind: 'text', text: 'Mint' } },
    {
        receiver: 'internal',
        message: { kind: 'typed', type: 'GetRoyaltyParams' },
    },
];
class NftCollection {
    static async init(owner_address, collection_content, royalty_params) {
        return await NftCollection_init(owner_address, collection_content, royalty_params);
    }
    static async fromInit(owner_address, collection_content, royalty_params) {
        const init = await NftCollection_init(owner_address, collection_content, royalty_params);
        const address = (0, core_1.contractAddress)(0, init);
        return new NftCollection(address, init);
    }
    static fromAddress(address) {
        return new NftCollection(address);
    }
    constructor(address, init) {
        this.abi = {
            types: NftCollection_types,
            getters: NftCollection_getters,
            receivers: NftCollection_receivers,
            errors: NftCollection_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message === 'Mint') {
            body = (0, core_1.beginCell)()
                .storeUint(0, 32)
                .storeStringTail(message)
                .endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'GetRoyaltyParams') {
            body = (0, core_1.beginCell)().store(storeGetRoyaltyParams(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getGetCollectionData(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_collection_data', builder.build())).stack;
        const result = loadTupleCollectionData(source);
        return result;
    }
    async getGetNftAddressByIndex(provider, item_index) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(item_index);
        const source = (await provider.get('get_nft_address_by_index', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getGetNftItemInit(provider, item_index) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(item_index);
        const source = (await provider.get('getNftItemInit', builder.build()))
            .stack;
        const result = loadTupleStateInit(source);
        return result;
    }
    async getGetNftContent(provider, index, individual_content) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(individual_content);
        const source = (await provider.get('get_nft_content', builder.build()))
            .stack;
        const result = source.readCell();
        return result;
    }
    async getRoyaltyParams(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('royalty_params', builder.build()))
            .stack;
        const result = loadTupleRoyaltyParams(source);
        return result;
    }
}
exports.NftCollection = NftCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uTmZ0Q29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cmFjdHNUeXBlcy90b24vdG9uTmZ0Q29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsb0NBa0JtQjtBQVFuQixTQUFnQixjQUFjLENBQUMsR0FBYztJQUN6QyxPQUFPLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUM7QUFDTixDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFnQixhQUFhLENBQUMsS0FBWTtJQUN0QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQW9CLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDdEUsQ0FBQztBQUxELHNDQUtDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxNQUFtQjtJQUMzQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBb0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN0RSxDQUFDO0FBVUQsU0FBZ0IsWUFBWSxDQUFDLEdBQVk7SUFDckMsT0FBTyxDQUFD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