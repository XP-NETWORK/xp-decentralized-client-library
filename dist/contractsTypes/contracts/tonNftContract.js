"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValidator = exports.storeValidator = exports.loadHiFromDeployNFT721Collection = exports.storeHiFromDeployNFT721Collection = exports.loadHiFromDeployNFT721Storage = exports.storeHiFromDeployNFT721Storage = exports.loadGetNftData = exports.storeGetNftData = exports.loadReportStaticData = exports.storeReportStaticData = exports.loadGetStaticData = exports.storeGetStaticData = exports.loadExcesses = exports.storeExcesses = exports.loadOwnershipAssigned = exports.storeOwnershipAssigned = exports.loadTransfer = exports.storeTransfer = exports.loadRoyaltyParams = exports.storeRoyaltyParams = exports.loadCollectionData = exports.storeCollectionData = exports.loadReportRoyaltyParams = exports.storeReportRoyaltyParams = exports.loadGetRoyaltyParams = exports.storeGetRoyaltyParams = exports.loadCreatedCollection = exports.storeCreatedCollection = exports.loadDeployNFT721Collection = exports.storeDeployNFT721Collection = exports.loadDeployNFT721Storage = exports.storeDeployNFT721Storage = exports.loadUnlockToken = exports.storeUnlockToken = exports.loadHiFromChild = exports.storeHiFromChild = exports.loadHiFromParent = exports.storeHiFromParent = exports.loadFactoryDeploy = exports.storeFactoryDeploy = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
exports.NftItem = exports.loadClaimedEvent = exports.storeClaimedEvent = exports.loadUnLock721Event = exports.storeUnLock721Event = exports.loadLockedEvent = exports.storeLockedEvent = exports.loadRewardValidatorEvent = exports.storeRewardValidatorEvent = exports.loadAddNewValidatorEvent = exports.storeAddNewValidatorEvent = exports.loadStakeEvent = exports.storeStakeEvent = exports.loadLock721 = exports.storeLock721 = exports.loadRewardValidator = exports.storeRewardValidator = exports.loadAddValidator = exports.storeAddValidator = exports.loadClaimData = exports.storeClaimData = exports.loadOriginalToDuplicateContractInfo = exports.storeOriginalToDuplicateContractInfo = exports.loadDuplicateToOriginalContractInfo = exports.storeDuplicateToOriginalContractInfo = exports.loadNewValidator = exports.storeNewValidator = exports.loadSignerAndSignature = exports.storeSignerAndSignature = void 0;
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
function loadTupleGetNftData(source) {
    const _is_initialized = source.readBoolean();
    const _index = source.readBigNumber();
    const _collection_address = source.readAddress();
    const _owner_address = source.readAddress();
    const _individual_content = source.readCell();
    return {
        $$type: 'GetNftData',
        is_initialized: _is_initialized,
        index: _index,
        collection_address: _collection_address,
        owner_address: _owner_address,
        individual_content: _individual_content,
    };
}
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
function initNftItem_init_args(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.item_index, 257);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.individual_content);
    };
}
async function NftItem_init(collection_address, item_index, owner, individual_content) {
    const __code = core_1.Cell.fromBase64('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');
    const __system = core_1.Cell.fromBase64('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');
    const builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftItem_init_args({
        $$type: 'NftItem_init_args',
        collection_address,
        item_index,
        owner,
        individual_content,
    })(builder);
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
const NftItem_types = [
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
const NftItem_getters = [
    {
        name: 'get_nft_data',
        arguments: [],
        returnType: { kind: 'simple', type: 'GetNftData', optional: false },
    },
];
const NftItem_receivers = [
    { receiver: 'internal', message: { kind: 'typed', type: 'Transfer' } },
    { receiver: 'internal', message: { kind: 'typed', type: 'GetStaticData' } },
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
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'Transfer') {
            body = (0, core_1.beginCell)().store(storeTransfer(message)).endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'GetStaticData') {
            body = (0, core_1.beginCell)().store(storeGetStaticData(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getGetNftData(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('get_nft_data', builder.build()))
            .stack;
        const result = loadTupleGetNftData(source);
        return result;
    }
}
exports.NftItem = NftItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uTmZ0Q29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvY29udHJhY3RzL3Rvbk5mdENvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxvQ0FrQm1CO0FBUW5CLFNBQWdCLGNBQWMsQ0FBQyxHQUFjO0lBQ3pDLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDeEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQztBQUNOLENBQUM7QUFORCx3Q0FNQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxLQUFZO0lBQ3RDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBb0IsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN0RSxDQUFDO0FBTEQsc0NBS0M7QUFVRCxTQUFnQixZQUFZLENBQUMsR0FBWTtJQUNyQyxPQUFPLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNwQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7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