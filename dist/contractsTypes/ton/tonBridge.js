"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValidator = exports.storeValidator = exports.loadStorageDeploy = exports.storeStorageDeploy = exports.loadCollectionDeploy = exports.storeCollectionDeploy = exports.loadHiFromDeployNFT721Collection = exports.storeHiFromDeployNFT721Collection = exports.loadHiFromDeployNFT721Storage = exports.storeHiFromDeployNFT721Storage = exports.loadGetNftData = exports.storeGetNftData = exports.loadReportStaticData = exports.storeReportStaticData = exports.loadGetStaticData = exports.storeGetStaticData = exports.loadExcesses = exports.storeExcesses = exports.loadOwnershipAssigned = exports.storeOwnershipAssigned = exports.loadTransfer = exports.storeTransfer = exports.loadRoyaltyParams = exports.storeRoyaltyParams = exports.loadCollectionData = exports.storeCollectionData = exports.loadReportRoyaltyParams = exports.storeReportRoyaltyParams = exports.loadGetRoyaltyParams = exports.storeGetRoyaltyParams = exports.loadUnlockToken = exports.storeUnlockToken = exports.loadCreatedCollection = exports.storeCreatedCollection = exports.loadDeployNFT721Collection = exports.storeDeployNFT721Collection = exports.loadDeployNFT721Storage = exports.storeDeployNFT721Storage = exports.loadFactoryDeploy = exports.storeFactoryDeploy = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
exports.Bridge = exports.loadClaimedEvent = exports.storeClaimedEvent = exports.loadUnLock721Event = exports.storeUnLock721Event = exports.loadLockedEvent = exports.storeLockedEvent = exports.loadRewardValidatorEvent = exports.storeRewardValidatorEvent = exports.loadAddNewValidatorEvent = exports.storeAddNewValidatorEvent = exports.loadStakeEvent = exports.storeStakeEvent = exports.loadClaimNFT721 = exports.storeClaimNFT721 = exports.loadLock721 = exports.storeLock721 = exports.loadRewardValidator = exports.storeRewardValidator = exports.loadAddValidator = exports.storeAddValidator = exports.loadToken = exports.storeToken = exports.loadClaimData = exports.storeClaimData = exports.loadClaimData4 = exports.storeClaimData4 = exports.loadClaimData3 = exports.storeClaimData3 = exports.loadClaimData2 = exports.storeClaimData2 = exports.loadClaimData1 = exports.storeClaimData1 = exports.loadOriginalToDuplicateContractInfo = exports.storeOriginalToDuplicateContractInfo = exports.loadDuplicateToOriginalContractInfo = exports.storeDuplicateToOriginalContractInfo = exports.loadValidatorsToRewards = exports.storeValidatorsToRewards = exports.loadNewValidator = exports.storeNewValidator = exports.loadSignerAndSignature = exports.storeSignerAndSignature = void 0;
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
function storeDeployNFT721Storage(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1900501884, 32);
        b_0.storeAddress(src.collectionAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        b_0.storeInt(src.tokenId, 257);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeStringRefTail(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddressLock);
        const b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.sourceChain);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Storage = storeDeployNFT721Storage;
function loadDeployNFT721Storage(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1900501884) {
        throw Error('Invalid prefix');
    }
    const _collectionAddress = sc_0.loadAddress();
    const _isOriginal = sc_0.loadBit();
    const _key = sc_0.loadIntBig(257);
    const _tokenId = sc_0.loadIntBig(257);
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadStringRefTail();
    const _sourceNftContractAddressLock = sc_0.loadRef();
    const sc_1 = sc_0.loadRef().beginParse();
    const _sourceChain = sc_1.loadStringRefTail();
    return {
        $$type: 'DeployNFT721Storage',
        collectionAddress: _collectionAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
    };
}
exports.loadDeployNFT721Storage = loadDeployNFT721Storage;
function storeDeployNFT721Collection(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(4012005997, 32);
        b_0.storeRef(src.collection_content);
        b_0.store(storeRoyaltyParams(src.royalty_params));
        const b_1 = new core_1.Builder();
        b_1.storeAddress(src.destination_user_address);
        b_1.storeStringRefTail(src.source_chain);
        b_1.storeStringRefTail(src.transaction_hash);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDeployNFT721Collection = storeDeployNFT721Collection;
function loadDeployNFT721Collection(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4012005997) {
        throw Error('Invalid prefix');
    }
    const _collection_content = sc_0.loadRef();
    const _royalty_params = loadRoyaltyParams(sc_0);
    const sc_1 = sc_0.loadRef().beginParse();
    const _destination_user_address = sc_1.loadAddress();
    const _source_chain = sc_1.loadStringRefTail();
    const _transaction_hash = sc_1.loadStringRefTail();
    return {
        $$type: 'DeployNFT721Collection',
        collection_content: _collection_content,
        royalty_params: _royalty_params,
        destination_user_address: _destination_user_address,
        source_chain: _source_chain,
        transaction_hash: _transaction_hash,
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
function storeHiFromDeployNFT721Storage(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1515353638, 32);
        b_0.storeAddress(src.sourceNftContractAddress);
        b_0.storeAddress(src.storageAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        const b_1 = new core_1.Builder();
        b_1.storeInt(src.tokenId, 257);
        b_1.storeStringRefTail(src.destinationChain);
        b_1.storeStringRefTail(src.destinationUserAddress);
        b_1.storeRef(src.sourceNftContractAddressLock);
        const b_2 = new core_1.Builder();
        b_2.storeStringRefTail(src.sourceChain);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeHiFromDeployNFT721Storage = storeHiFromDeployNFT721Storage;
function loadHiFromDeployNFT721Storage(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1515353638) {
        throw Error('Invalid prefix');
    }
    const _sourceNftContractAddress = sc_0.loadAddress();
    const _storageAddress = sc_0.loadAddress();
    const _isOriginal = sc_0.loadBit();
    const _key = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _tokenId = sc_1.loadIntBig(257);
    const _destinationChain = sc_1.loadStringRefTail();
    const _destinationUserAddress = sc_1.loadStringRefTail();
    const _sourceNftContractAddressLock = sc_1.loadRef();
    const sc_2 = sc_1.loadRef().beginParse();
    const _sourceChain = sc_2.loadStringRefTail();
    return {
        $$type: 'HiFromDeployNFT721Storage',
        sourceNftContractAddress: _sourceNftContractAddress,
        storageAddress: _storageAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
    };
}
exports.loadHiFromDeployNFT721Storage = loadHiFromDeployNFT721Storage;
function storeHiFromDeployNFT721Collection(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1062806393, 32);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.transactionHash);
    };
}
exports.storeHiFromDeployNFT721Collection = storeHiFromDeployNFT721Collection;
function loadHiFromDeployNFT721Collection(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1062806393) {
        throw Error('Invalid prefix');
    }
    const _sourceChain = sc_0.loadStringRefTail();
    const _transactionHash = sc_0.loadStringRefTail();
    return {
        $$type: 'HiFromDeployNFT721Collection',
        sourceChain: _sourceChain,
        transactionHash: _transactionHash,
    };
}
exports.loadHiFromDeployNFT721Collection = loadHiFromDeployNFT721Collection;
function storeCollectionDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2783573850, 32);
        b_0.storeAddress(src.newOwner);
    };
}
exports.storeCollectionDeploy = storeCollectionDeploy;
function loadCollectionDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2783573850) {
        throw Error('Invalid prefix');
    }
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'CollectionDeploy', newOwner: _newOwner };
}
exports.loadCollectionDeploy = loadCollectionDeploy;
function storeStorageDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2356437903, 32);
        b_0.storeAddress(src.sourceNftContractAddress);
        b_0.storeBit(src.isOriginal);
        b_0.storeInt(src.key, 257);
        b_0.storeInt(src.tokenId, 257);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeStringRefTail(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddressLock);
        const b_1 = new core_1.Builder();
        b_1.storeStringRefTail(src.sourceChain);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeStorageDeploy = storeStorageDeploy;
function loadStorageDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2356437903) {
        throw Error('Invalid prefix');
    }
    const _sourceNftContractAddress = sc_0.loadAddress();
    const _isOriginal = sc_0.loadBit();
    const _key = sc_0.loadIntBig(257);
    const _tokenId = sc_0.loadIntBig(257);
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadStringRefTail();
    const _sourceNftContractAddressLock = sc_0.loadRef();
    const sc_1 = sc_0.loadRef().beginParse();
    const _sourceChain = sc_1.loadStringRefTail();
    return {
        $$type: 'StorageDeploy',
        sourceNftContractAddress: _sourceNftContractAddress,
        isOriginal: _isOriginal,
        key: _key,
        tokenId: _tokenId,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        sourceNftContractAddressLock: _sourceNftContractAddressLock,
        sourceChain: _sourceChain,
    };
}
exports.loadStorageDeploy = loadStorageDeploy;
function storeValidator(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.address);
        b_0.storeBit(src.added);
        b_0.storeCoins(src.pendingRewards);
    };
}
exports.storeValidator = storeValidator;
function loadValidator(slice) {
    const sc_0 = slice;
    const _address = sc_0.loadAddress();
    const _added = sc_0.loadBit();
    const _pendingRewards = sc_0.loadCoins();
    return {
        $$type: 'Validator',
        address: _address,
        added: _added,
        pendingRewards: _pendingRewards,
    };
}
exports.loadValidator = loadValidator;
function loadTupleValidator(source) {
    const _address = source.readAddress();
    const _added = source.readBoolean();
    const _pendingRewards = source.readBigNumber();
    return {
        $$type: 'Validator',
        address: _address,
        added: _added,
        pendingRewards: _pendingRewards,
    };
}
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
function storeValidatorsToRewards(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeDict(src.addresses, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
        b_0.storeDict(src.publicKeys, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
        b_0.storeInt(src.len, 257);
    };
}
exports.storeValidatorsToRewards = storeValidatorsToRewards;
function loadValidatorsToRewards(slice) {
    const sc_0 = slice;
    const _addresses = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), sc_0);
    const _publicKeys = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), sc_0);
    const _len = sc_0.loadIntBig(257);
    return {
        $$type: 'ValidatorsToRewards',
        addresses: _addresses,
        publicKeys: _publicKeys,
        len: _len,
    };
}
exports.loadValidatorsToRewards = loadValidatorsToRewards;
function storeDuplicateToOriginalContractInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeRef(src.contractAddress);
        b_0.storeInt(src.lastIndex, 257);
        const b_1 = new core_1.Builder();
        b_1.storeRef(src.collectionContent);
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeDuplicateToOriginalContractInfo = storeDuplicateToOriginalContractInfo;
function loadDuplicateToOriginalContractInfo(slice) {
    const sc_0 = slice;
    const _keyChain = sc_0.loadStringRefTail();
    const _chain = sc_0.loadStringRefTail();
    const _contractAddress = sc_0.loadRef();
    const _lastIndex = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _collectionContent = sc_1.loadRef();
    return {
        $$type: 'DuplicateToOriginalContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
exports.loadDuplicateToOriginalContractInfo = loadDuplicateToOriginalContractInfo;
function loadTupleDuplicateToOriginalContractInfo(source) {
    const _keyChain = source.readString();
    const _chain = source.readString();
    const _contractAddress = source.readCell();
    const _lastIndex = source.readBigNumber();
    const _collectionContent = source.readCell();
    return {
        $$type: 'DuplicateToOriginalContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
function storeOriginalToDuplicateContractInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.keyChain);
        b_0.storeStringRefTail(src.chain);
        b_0.storeAddress(src.contractAddress);
        b_0.storeInt(src.lastIndex, 257);
        b_0.storeRef(src.collectionContent);
    };
}
exports.storeOriginalToDuplicateContractInfo = storeOriginalToDuplicateContractInfo;
function loadOriginalToDuplicateContractInfo(slice) {
    const sc_0 = slice;
    const _keyChain = sc_0.loadStringRefTail();
    const _chain = sc_0.loadStringRefTail();
    const _contractAddress = sc_0.loadAddress();
    const _lastIndex = sc_0.loadIntBig(257);
    const _collectionContent = sc_0.loadRef();
    return {
        $$type: 'OriginalToDuplicateContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
exports.loadOriginalToDuplicateContractInfo = loadOriginalToDuplicateContractInfo;
function loadTupleOriginalToDuplicateContractInfo(source) {
    const _keyChain = source.readString();
    const _chain = source.readString();
    const _contractAddress = source.readAddress();
    const _lastIndex = source.readBigNumber();
    const _collectionContent = source.readCell();
    return {
        $$type: 'OriginalToDuplicateContractInfo',
        keyChain: _keyChain,
        chain: _chain,
        contractAddress: _contractAddress,
        lastIndex: _lastIndex,
        collectionContent: _collectionContent,
    };
}
function storeClaimData1(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(src.tokenId, 64);
        b_0.storeStringRefTail(src.sourceChain);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeAddress(src.destinationUserAddress);
        b_0.storeUint(src.tokenAmount, 64);
    };
}
exports.storeClaimData1 = storeClaimData1;
function loadClaimData1(slice) {
    const sc_0 = slice;
    const _tokenId = sc_0.loadUintBig(64);
    const _sourceChain = sc_0.loadStringRefTail();
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadAddress();
    const _tokenAmount = sc_0.loadUintBig(64);
    return {
        $$type: 'ClaimData1',
        tokenId: _tokenId,
        sourceChain: _sourceChain,
        destinationChain: _destinationChain,
        destinationUserAddress: _destinationUserAddress,
        tokenAmount: _tokenAmount,
    };
}
exports.loadClaimData1 = loadClaimData1;
function storeClaimData2(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.name);
        b_0.storeStringRefTail(src.symbol);
        b_0.storeStringRefTail(src.nftType);
    };
}
exports.storeClaimData2 = storeClaimData2;
function loadClaimData2(slice) {
    const sc_0 = slice;
    const _name = sc_0.loadStringRefTail();
    const _symbol = sc_0.loadStringRefTail();
    const _nftType = sc_0.loadStringRefTail();
    return {
        $$type: 'ClaimData2',
        name: _name,
        symbol: _symbol,
        nftType: _nftType,
    };
}
exports.loadClaimData2 = loadClaimData2;
function storeClaimData3(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(src.fee, 64);
        b_0.storeRef(src.sourceNftContractAddress);
        b_0.storeAddress(src.royaltyReceiver);
        b_0.storeStringRefTail(src.metadata);
    };
}
exports.storeClaimData3 = storeClaimData3;
function loadClaimData3(slice) {
    const sc_0 = slice;
    const _fee = sc_0.loadUintBig(64);
    const _sourceNftContractAddress = sc_0.loadRef();
    const _royaltyReceiver = sc_0.loadAddress();
    const _metadata = sc_0.loadStringRefTail();
    return {
        $$type: 'ClaimData3',
        fee: _fee,
        sourceNftContractAddress: _sourceNftContractAddress,
        royaltyReceiver: _royaltyReceiver,
        metadata: _metadata,
    };
}
exports.loadClaimData3 = loadClaimData3;
function storeClaimData4(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeRef(src.newContent);
        b_0.storeStringRefTail(src.transactionHash);
        b_0.store(storeRoyaltyParams(src.royalty));
    };
}
exports.storeClaimData4 = storeClaimData4;
function loadClaimData4(slice) {
    const sc_0 = slice;
    const _newContent = sc_0.loadRef();
    const _transactionHash = sc_0.loadStringRefTail();
    const _royalty = loadRoyaltyParams(sc_0);
    return {
        $$type: 'ClaimData4',
        newContent: _newContent,
        transactionHash: _transactionHash,
        royalty: _royalty,
    };
}
exports.loadClaimData4 = loadClaimData4;
function storeClaimData(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.store(storeClaimData1(src.data1));
        const b_1 = new core_1.Builder();
        b_1.store(storeClaimData2(src.data2));
        const b_2 = new core_1.Builder();
        b_2.store(storeClaimData3(src.data3));
        const b_3 = new core_1.Builder();
        b_3.store(storeClaimData4(src.data4));
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}
exports.storeClaimData = storeClaimData;
function loadClaimData(slice) {
    const sc_0 = slice;
    const _data1 = loadClaimData1(sc_0);
    const sc_1 = sc_0.loadRef().beginParse();
    const _data2 = loadClaimData2(sc_1);
    const sc_2 = sc_1.loadRef().beginParse();
    const _data3 = loadClaimData3(sc_2);
    const sc_3 = sc_2.loadRef().beginParse();
    const _data4 = loadClaimData4(sc_3);
    return {
        $$type: 'ClaimData',
        data1: _data1,
        data2: _data2,
        data3: _data3,
        data4: _data4,
    };
}
exports.loadClaimData = loadClaimData;
function storeToken(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.tokenId, 257);
        b_0.storeStringRefTail(src.chain);
        b_0.storeRef(src.contractAddress);
    };
}
exports.storeToken = storeToken;
function loadToken(slice) {
    const sc_0 = slice;
    const _tokenId = sc_0.loadIntBig(257);
    const _chain = sc_0.loadStringRefTail();
    const _contractAddress = sc_0.loadRef();
    return {
        $$type: 'Token',
        tokenId: _tokenId,
        chain: _chain,
        contractAddress: _contractAddress,
    };
}
exports.loadToken = loadToken;
function loadTupleToken(source) {
    const _tokenId = source.readBigNumber();
    const _chain = source.readString();
    const _contractAddress = source.readCell();
    return {
        $$type: 'Token',
        tokenId: _tokenId,
        chain: _chain,
        contractAddress: _contractAddress,
    };
}
function storeAddValidator(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(3868963206, 32);
        b_0.store(storeNewValidator(src.newValidatorPublicKey));
        b_0.storeAddress(src.newValidatorAddress);
        b_0.storeDict(src.sigs, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeAddValidator = storeAddValidator;
function loadAddValidator(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3868963206) {
        throw Error('Invalid prefix');
    }
    const _newValidatorPublicKey = loadNewValidator(sc_0);
    const _newValidatorAddress = sc_0.loadAddress();
    const _sigs = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    const _len = sc_0.loadUintBig(256);
    return {
        $$type: 'AddValidator',
        newValidatorPublicKey: _newValidatorPublicKey,
        newValidatorAddress: _newValidatorAddress,
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
function storeClaimNFT721(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1653459629, 32);
        b_0.store(storeClaimData(src.data));
        b_0.storeDict(src.signatures, core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature());
        b_0.storeUint(src.len, 256);
    };
}
exports.storeClaimNFT721 = storeClaimNFT721;
function loadClaimNFT721(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1653459629) {
        throw Error('Invalid prefix');
    }
    const _data = loadClaimData(sc_0);
    const _signatures = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserSignerAndSignature(), sc_0);
    const _len = sc_0.loadUintBig(256);
    return {
        $$type: 'ClaimNFT721',
        data: _data,
        signatures: _signatures,
        len: _len,
    };
}
exports.loadClaimNFT721 = loadClaimNFT721;
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
        b_0.storeUint(3571773646, 32);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeStringRefTail(src.destinationChain);
        b_0.storeStringRefTail(src.destinationUserAddress);
        b_0.storeRef(src.sourceNftContractAddress);
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
    if (sc_0.loadUint(32) !== 3571773646) {
        throw Error('Invalid prefix');
    }
    const _tokenId = sc_0.loadUintBig(256);
    const _destinationChain = sc_0.loadStringRefTail();
    const _destinationUserAddress = sc_0.loadStringRefTail();
    const _sourceNftContractAddress = sc_0.loadRef();
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
        b_0.storeUint(2428616504, 32);
        b_0.storeAddress(src.to);
        b_0.storeUint(src.tokenId, 256);
        b_0.storeAddress(src.contractAddress);
    };
}
exports.storeUnLock721Event = storeUnLock721Event;
function loadUnLock721Event(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2428616504) {
        throw Error('Invalid prefix');
    }
    const _to = sc_0.loadAddress();
    const _tokenId = sc_0.loadUintBig(256);
    const _contractAddress = sc_0.loadAddress();
    return {
        $$type: 'UnLock721Event',
        to: _to,
        tokenId: _tokenId,
        contractAddress: _contractAddress,
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
function initBridge_init_args(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.validatorPublicKey, 257);
        b_0.storeAddress(src.validatorAddress);
        b_0.storeStringRefTail(src.chainType);
    };
}
async function Bridge_init(validatorPublicKey, validatorAddress, chainType) {
    const __code = core_1.Cell.fromBase64('te6ccgECfgEAICoAART/APSkE/S88sgLAQIBYgIDA6bQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zwOERAOEN9VHNs88uCCyPhDAcx/AcoAVeDbPMntVHgGBwIBIAQFAgFYVlcCASBjZATy7aLt+wGSMH/gcCHXScIflTAg1wsf3iCCENUydtu6jhQw0x8BghDVMnbbuvLggdM/ATEwf+AgghDmm7GGuuMCIIIQ43ng8bqOnTDTHwGCEON54PG68uCB0/8BAfQE0/9VIGwT2zx/4CCCEFpSdia64wIgghA/WSN5uggJCgsB9FDv9AAc9AAKyPQAGcv/F/QAFfQAA8j0ABL0APQAAsj0AMhQBM8WyVADzBPMyMhQBs8WyVAFzFAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJWMzJJAF6MNMfAYIQ5puxhrry4IHT/wEB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH0BNP/VTBsFNs8fwwE9oIA9DkhwgDy9A4REQ4NERANEM8LERELChEQChCfCBERCAcREAcQbwUREQUEERAEED8CERECAREQAQ9WEds8IG7y0IBvI4IAjnwi8vRwIBEUiuRXE1cTggDL2S6qAHOpBKQBERMBvgEREgHy9FXgVhLbPCBu8tCAbyNsIW8QbxECgjDbPGwZBo4YAREQAYEBAVQQVyBulTBZ9FowlEEz9BTijhcfgQEBVBBXIG6VMFn0WjCUQTP0FOIOD+JPH1A02zx/Ey0D1I5MMNMfAYIQP1kjebry4IHUAdAB1AHQEmwSyFmCEGG4V01QA8sfyFjPFskBzMhYzxbJAczJyIJYwAAAAAAAAAAAAAAAAQHLZ8zJcPsAf+AgghBoM+GquuMCIIIQYo3KrbrjAsAAkTDjDXAUFRYC6IIA9DkhwgDy9HBSAorkbCGCAMvZL6oAc6kEpBK+8vSBAQEBf3DIVSBaINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEsoAAfoCyQIREQJWEQEgbpUwWfRaMJRBM/QV4gykD8gBghC40cgIWMsfy//JDQ4C/CKBAQEjWfQNb6GSMG3fIG6SMG2c0NQB0AHT/1lsEm8C4iBu8tCAbyImyAEBy//J+QBUECL5EA8RFQ8OERQODRETDQwREgwLERELChEQCgkRFQkIERQIBxETBwYREgYFEREFBBEQBAMRFQMCERQCERMB2zwgbvLQgG8jMDERE28PADTIgljAAAAAAAAAAAAAAAABActnzMlw+wAQvgBkk3BXE98REpUREqQREt4RE6QNERMNDBESDAsREQsKERAKEJ8QjhB9EGwQWxBKEDlIBwYC/lYUgQEBVhVZ9A1voZIwbd8gbpIwbZzQ1AHQAdP/WWwSbwLiIG7y0IBvIlYXyAEBy//J+QBUECL5EA8RFA8OERMODRESDQwREQwLERALChEUCgkREwkIERIIBxERBwYREAYFERQFBBETBAMREgMCERECERAB2zwgbvLQgG8jMDFvEgDoAREQARERgQEBERPIVSBaINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WEsoAAfoCyRA+AhERAgEREgEgbpUwWfRaMJRBM/QV4vgnbxD4QW8kE18DoYIImJaAoR62CIIA1VcBwgDy9BDOEJ0QjBB7VTYARBEQk3BXEN8Pkw+kD94RE6QREw0REg0MEREMCxEQCxCvVUkA7NMfAYIQWlJ2Jrry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gCBAQHXANQB0IEBAdcA1AHQAdQB0AHUAdAB1DDQ1DDQEFkQWBBXEFYBfjDTHwGCEGgz4aq68uCB0//UAdAB1AHQAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgUQzBsFNs8fyUCYDDTHwGCEGKNyq268uCB2zwREfQE0/8RE1lXExERERIREREQEREREA8REA9VDts8fxcYAVr5AYLwhdKIOEwAQ0WLAoA8siBZ9ogDxVPDZWNENGRo2slh8ka6joXbPH/bMeAcAebTP9QB0AHUAdAB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHTP1VABdQB0NQB0AHUAdAB1AHQQzAD1DDQ0z/UAdAB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHUAdAUQzAE1DDQGQT2KQ4RIg4NESENDBEgDAsRHwsKER4KCREdCQgRHAgHERsHBhEaBgURGQUEERgEAxEXAwIRFgIBERUBERRWEds8EN4QzhC+EK4QnhCOEH4QbiIQbxBfEE8QP1mCANRDERDbPFXgViLbPAEREAEB+QAB+QC6AREQAfL0VhMHGigoGwCK1NQB0AGBAQHXAIEBAdcA+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiEMwEDUQNDUMEREMEKsQmhB4EGcQVlUDAaKBJMYlDxERD149DBEQDAsREQsKERAKCRERCQgREAgHEREHBhEQBgUREQUEERAEAxERAwIREAIBEREBERDbPAEREAEB+QAB+QC6AREQAfL0VRwoAvxWEwcGERMGVhIGBRESBQQRJQQDESQDAhEjAlYiAlYiAgERIgERIVYgViBWIFYgViDIEREREFXg2zzJ+QCCAKoyJYEBASNxQTP0DG+hlAHXADCSW23ibvL0BIEBASV/cSFulVtZ9FowmMgBzwBBM/RC4gYREQYFERAFDxA+TcAvMATEW/hD+CjbPFxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiIIQBCwdgHJ/iCYQRVJiEDYQNFnbPPhD+CgdHlMfAPYB0PQEMG0hgS3GAYAQ9A9vofLghwGBLcYiAoAQ9BciggCiJQGAEPQPb6Hy4IeCAKIlAQKAEPQXAoF56gGAEPQPb6Hy4IcSgXnqAQKAEPQXyAHI9ADJAcxwAcoAWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskALAAAAABDb2xsZWN0aW9uRGVwbG95ZXIEtNs8XHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIghAELB2Acn+IJhBFUmIQNhA0Wds8WiAhUyIAyAHQ9AQwbSGBar4BgBD0D2+h8uCHAYFqviICgBD0FwKCAMTgAYAQ9A9vofLghxKCAMTgAQKAEPQXyAHI9ADJAcxwAcoAWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskAJgAAAABTdG9yYWdlRGVwbG95ZXIBhHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIWSMAgnBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIABJQA8zJAczJAcwC9iBwK4EBCyNZ9AtvoZIwbd8gbpIwbY4T0IEBAdcA1AHQAdQB0EMwbBNvA+IgbrOaNgUgbvLQgG8jW+MOL4EBCyNZ9AtvoZIwbd8gbpIwbY4f0NQB0AHUAdAB1AHQAYEBAdcA1AHQ1DAVFEMwbBVvBeKLCIsIyMnQcMjJWyYnALAwU1XIyj8szxYkzxbJ+QCBAQtUONXIVSBQI4EBAc8AyFjPFskBzMhYzxbJAczJToBSQCBulTBZ9FkwlEEz9BPiHYEBAVQQcyBulTBZ9FowlEEz9BTiDAULA8QjbrOaXwMgbvLQgG8lW5QzfzlY4iwPERgPDhEXDg0RFg0MERUMCxEUCwoREwoJERIJCBERCAcREAcGERgGBREXBQQRFgQDERUDAhEUAgEREwERFds8AREVAQH5AAH5ALrjDygpKgE6yG8AAW+MbW+MAds8byIByZMhbrOWAW8iWczJ6DF8AWBXEFcVCxEUCwoREwoJERIJCBERCAcREAcQbyUPEF4QTRA8S6AQOQgQN0VAQTB/2zwrArpXEVcRDo6oChETCRESCQgREQgHERAHEG8kEG9R6xBeEE0QPFCrEIkQeAVEQ3/bPI6rChETCRESCQgREQgHERAHEG8QXhBNcCRR7BBeEE0MEHsQmhCJBgcFQ0PbPOIrKwPQyCcg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYtzxbJ+QAIgQEBKVn0DG+hkjBt3yBujyEwEEZHU4IQBCwdgAdyUCl/CMhVcNs8ySQDREREQG1t2zyOjDE3BiBu8tCABQbbPOIsUy0AsoIQcUdbfFAJyx9QByDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhXKABOBAQHPAIEBAc8AyFjPFskBzMhYzxbJAczIWM8WyQHMyMhQA88WyVjMyQHMA6CCEAQsHYBycHD4QW8kECNfA8jJIsjJ0BBFEE3IVVDbPMkQJBA5QYBEQG1t2zxANHFSgshVYNs8yciCWMAAAAAAAAAAAAAAAAEBy2fMyXD7AFJTLgB2ghDU5PDOUAjLHxbL/8hQBc8WyVAEzMhQA88WyVjMyFjPFskBzMv/yMhQA88WyVjMyFADzxbJWMzJAcwBxAUREQUEERAEED9O3FBFyz/IUAPPFslYzMhYzxbJAcwBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8Wyz/IRxNQZchQA88WyVADzMhQA88WyVjMyFjPFskBzMhDFFBbMQPsCxEaCwoRFwoJERoJCBEWCAcRGgcGERwGBREbBQQRFgQDERoDAhEWAgERGwHbPBERERIREREQEREREA8REA8Q7xDeEM0QvBCrEJoQiRB4EGcQVhBFEDQDERkD2zzIVhXPFlYYzxbJ+QArgQEBIln0DW+hkjBt3zIzNAD0UDTLP8hYzxbJAcwBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyFjPFskBzMgFEEcQNkB2UEXMyFADzxbJWMxQI1AjgQEBzwCBAQHPAAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJWMzJAczJAcwBNnAgbW0EiuQyMzOCAMvZL6oAc6kEpFIwvvL0ATUBQjJwggCoViTCAPL0+CdvECCBFgUGvhXy9FEyqQQCiuRfAzkE9CBukjBtjjXQ1AHQAdQB0AH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcA1FVAbBVvBeKLCIsI+ChwyMkzM3BwVhnIyj9WH88WVhzPFsn5AC6BAQEiWfQMb6GSMG3fJ26zkTfjDSLjDyBus5J/M94jOjs8PQT+JIEBASRZ9A1voZIwbd8gbpIwbZzQ1AHQAdP/WWwSbwLiIG7y0IBvIlRXIvkQDhEWDg0RFQ0MERQMCxETCwoREgoJEREJCBEQCBB/BhEWBgURFQUEERQEAxETAwIREgIBEREBERBWEds8IG7y0IBvIzAREpNwVxLfERHjDxESpG82NzgAjgEREgGBAQEBVhQBERIgbpUwWfRaMJRBM/QU4oEBASADERYDElYUAhETASFulVtZ9FowmMgBzwBBM/RC4hERpBERERMPERAPAAhXEFcQAEQMERQMCxETCwoREgoJEREJCBEQCBB/EG4QXRBMEDtAGlCYAfyBAQFUUQBSUEEz9AxvoZQB1wAwkltt4iBu8tCADxESDw4REQ4NERANDBESDAsREQsKERAKCRESCQgREQgHERAHBhESBgUREQUEERAEAxESAwIREQIBERAB2zwwERGkDhERDg0REA0QzxC+EK0QnBCLEHoQaRBYEEcQNkAVUENvACRsMzN/BCBu8tCAbyUzMxBWVSIAasgkINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WLc8WyfkAgQEBVhECWfQMb6GSMG3fAB5WEIEBASlZ9AxvoZIwbd8DQJEikXDijxcjkiKzkXDi4w8QThA9TBoIULcQNkU1FOMNPj9ABPwTXwM0NFcTVxNXE1cWVxZXF4IQBCwdgHJ/iFYXVSBEQG1t2zz4Qw+kED8CERQCAVYXUA/bPHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIERMegQELERFPU1BBA/w0NDQgs5Ijs5Fw4o6jECRfBFcYghA1pOkAcn9WFQJWFAJWGwJWHwIBERsBVh8BERmOxjI0VxNXE1cTVxVXFVcWVxYMs5JwPd8Mjhk8PDw8PYIA09ny8BBOED1MukkYRxZFFEAz4w0eEJ0QXBArEHoJEEcQRgNFVQTiDRCcEFtCQ0QCiDhXF1tXFVcVVxhXGFcZERZus46uPj4+VxBXEFcREREgbvLQgAcREQcGERAGEF8QThA9TLAQehBpEEgQNxA2EDXbPOMOTE0C5shVIFAjgQEBzwDIWM8WyQHMyFjPFskBzMlN8FYSASBulTBZ9FkwlEEz9BPiHYEBAVALVhEgbpUwWfRaMJRBM/QU4oIQBCwdgHJwcPhBbyQQI18DyMkiyMnQEEUEERMEyFVQ2zzJECQDERIDQeBEQG1t2zxSUwH+yFVgghDvIlptUAjLHxbMVSFQI4EBAc8AgQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyFgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbIUAPPFslYzMhQA88WyVjMyQHMyVQTBAMCERcCERQBREBtbUUD7BER+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDEMbrOOpzsNIG7y0IAHEREHBhEQBhBfEE4QPUywEDoQORBYEDcQVhA1EDTbPI8lPDw8ghAExLQAcn+IEDQQPERAbW3bPBBOED1MuhB5CEUWRBRQM+JMT1MAChCKCQcGBMbbPPhD+ChQQ1YSAwIREQIBERcBERrbPHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCI+ENw+ChBBBER2zxTRlBHAY4F0PQEMG0hggCiJQGAEPQPb6Hy4IcBggCiJSICgBD0FwKBeeoBgBD0D2+h8uCHEoF56gECgBD0F8gByPQAyQHMcAHKAFVABkgBnnBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIgQEBcMjJVhYCVhFURQNJAKhQVCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhLMyFBDUCOBAQHPAIEBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskBzMkBtshVQMhQBc8WyVAFzMhQA88WyVjMASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhKBAQHPAMzJEDhB4CBulTBZ9FowlEEz9BXigQELcMjJLwJWFgJWFFlKAejIVUDIUAXPFslQBczIUAPPFslYzMhYzxbJAcwSgQEBzwAByMzJAczJLRA3ASBulTBZ9FkwlEEz9BPiERIdgQELERDIVSBQI4EBAc8AyFjPFskBzMhYzxbJAczJROBSoCBulTBZ9FkwlEEz9BPiECqBAQFA+UsAHCBulTBZ9FowlEEz9BTiAnqCEATEtAByfyXIAYIQGIRZSljLHwEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJJFUgREBtbds8U04E4FcXghAELB2Acn+IVhJVIERAbW3bPPhDERSkAxEUA08AVhcBERHbPHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIERMegQELERFPU1BRAMzIVSCCEJDBvzhQBMsfWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsv/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsnIgljAAAAAAAAAAAAAAAABActnzMlw+wAAEAAAAABNaW50AOYE0PQEMG0BgXnqAYAQ9A9vofLghwGBeeoiAoAQ9BfIAcj0AMkBzHABygBVMAVQQyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFoEBAc8AWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFszJA/zIVSBQI4EBAc8AyFjPFskBzMhYzxbJAczJTfBWEgEgbpUwWfRZMJRBM/QT4h2BAQFQCVYRIG6VMFn0WjCUQTP0FOKCEAQsHYBycHD4QW8kECNfA8jJIsjJ0BBFBBETBMhVUNs8yRAkAxESA0HgREBtbds8EE4QPUwaCFC3EDZSU1QAwoIQX8w9FFAHyx8Vyz9QAyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYhbrOVfwHKAMyUcDLKAOIB+gIBzxYByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsAVQAEUEIAmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCASBYWQIBIFxdAhWxFjbPFUO2zxs8YHhaAhGxRLbPNs8bPGB4WwAcgQEBLwJZ9AxvoZIwbd8AAiACAnZeXwJNsgd2zwOERAOEN9VHNs8bPEgbpIwbZkgbvLQgG8lbwXiIG6SMG3egeGICS6H8g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCI2zxVDts8bPGeGACD6MnbPNs8bPGeGEAaMgBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WJc8WyfkAgQEBKQJZ9AxvoZIwbd8AAisAqshYzxYBzxbJ+QCBAQEsAln0DW+hkjBt3yBukjBtjjXQ1AHQAdQB0AH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcA1FVAbBVvBeICASBlZgIBSHR1AgEgZ2gAlbd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHME4ECrgDcAzscpnLB1XI5LZYcE4TsunLVmnZbmdB0s2yjN0UkAIBSGlqAgEgbW4CKKvo2zwOEREODREQDRDPVSvbPGzxeGsCVqjJASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPA4REA5VHds8bPF4bAA4AsjKPwHPFiHPFjHJ+QCBAQEoAln0DG+hkjBt3wBoyFgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBzxbJ+QCBAQEqAln0DG+hkjBt3wJBrn1tniqHbZ42eJA3SRg2zJA3eWhAN5G3gfEQN0kYNu9AeG8CASBwcQCEgQEBVhACWfQNb6GSMG3fIG6SMG2OK9D6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdIA+gBVIGwTbwPiAnirEyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPFUO2zxs8SBukjBtmSBu8tCAbyVvBeIgbpIwbd54cgIQqEHbPNs8bPF4cwBqgQELKwJZ9AtvoZIwbd8gbpIwbY4f0NQB0AHUAdAB1AHQAYEBAdcA1AHQ1DAVFEMwbBVvBeIAAiEAEbCvu1E0NIAAYAIBIHZ3Anmv1xBrpMCAhd15cEQQa4WFEECCf915aETBhN15cERtniqHbZ42eJA3SRg2zJA3eWhAN5G3gfEQN0kYNu9AeHkAdazdxoatLgzOZ0Xl6i2sri5Krm4vDulmhyyuSW0qbucppszubS3GSIaMRuorKQoMZu7qDQzOzuyuBxBAAfbtRNDUAfhj0gABjm/0BPQE1AHQ9ATT//QE9ATUMND0BPQE9ATUMND0BNQB0AHU1DDQ1AHQAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDEQ3xDebB96AFKBAQsnAln0C2+hkjBt3yBukjBtjhPQgQEB1wDUAdAB1AHQQzBsE28D4gF24Pgo1wsKgwm68uCJgQEB1wD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQB0EMwA9FY2zx7AvRtbW1tbW1tbW2LhzaW5ndWxhcogQEBDH9wyFUgWiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhLKAAH6AskQOkzQIG6VMFn0WjCUQTP0FeJxKchvAAFvjG1vjFAL2zxvIgHJkyFus5YBbyJZzMnoMfgo+CgQTnx9ALog10oh10mXIMIAIsIAsY5KA28igH8izzGrAqEFqwJRVbYIIMIAnCCqAhXXGFAzzxZAFN5ZbwJTQaHCAJnIAW8CUEShqgKOEjEzwgCZ1DDQINdKIddJknAg4uLoXwMALBCtEJwQOxCKEHkQaBBXEDYQNRA0ECM=');
    const __system = core_1.Cell.fromBase64('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');
    const builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initBridge_init_args({
        $$type: 'Bridge_init_args',
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
    9414: { message: `Invalid destination chain!` },
    16053: { message: `Only owner can call` },
    35976: { message: `Only the owner can call this function` },
    36476: { message: `Validator does not exist!` },
    43094: { message: `Invalid fees` },
    43570: { message: `Data already processed!` },
    49280: { message: `not owner` },
    52185: { message: `Threshold not reached!` },
    54233: { message: `Invalid bridge state` },
    54339: { message: `Invalid NFT type!` },
    54615: { message: `Insufficient balance` },
    62521: { message: `Must have signatures!` },
    62742: { message: `non-sequential NFTs` },
};
const Bridge_types = [
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
        name: 'DeployNFT721Storage',
        header: 1900501884,
        fields: [
            {
                name: 'collectionAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'isOriginal',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
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
                name: 'sourceNftContractAddressLock',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'DeployNFT721Collection',
        header: 4012005997,
        fields: [
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
            {
                name: 'destination_user_address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'source_chain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'transaction_hash',
                type: { kind: 'simple', type: 'string', optional: false },
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
        header: 1515353638,
        fields: [
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'storageAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'isOriginal',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
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
                name: 'sourceNftContractAddressLock',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'HiFromDeployNFT721Collection',
        header: 1062806393,
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
    {
        name: 'CollectionDeploy',
        header: 2783573850,
        fields: [
            {
                name: 'newOwner',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
    },
    {
        name: 'StorageDeploy',
        header: 2356437903,
        fields: [
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'isOriginal',
                type: { kind: 'simple', type: 'bool', optional: false },
            },
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
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
                name: 'sourceNftContractAddressLock',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'Validator',
        header: null,
        fields: [
            {
                name: 'address',
                type: { kind: 'simple', type: 'address', optional: false },
            },
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
        name: 'ValidatorsToRewards',
        header: null,
        fields: [
            {
                name: 'addresses',
                type: { kind: 'dict', key: 'int', value: 'address' },
            },
            {
                name: 'publicKeys',
                type: { kind: 'dict', key: 'int', value: 'int' },
            },
            {
                name: 'len',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
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
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'lastIndex',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'collectionContent',
                type: { kind: 'simple', type: 'cell', optional: false },
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
            {
                name: 'lastIndex',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'collectionContent',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
        ],
    },
    {
        name: 'ClaimData1',
        header: null,
        fields: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
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
                name: 'tokenAmount',
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
        name: 'ClaimData2',
        header: null,
        fields: [
            {
                name: 'name',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'symbol',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'nftType',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'ClaimData3',
        header: null,
        fields: [
            {
                name: 'fee',
                type: {
                    kind: 'simple',
                    type: 'uint',
                    optional: false,
                    format: 64,
                },
            },
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
            {
                name: 'royaltyReceiver',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'metadata',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
    },
    {
        name: 'ClaimData4',
        header: null,
        fields: [
            {
                name: 'newContent',
                type: { kind: 'simple', type: 'cell', optional: false },
            },
            {
                name: 'transactionHash',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'royalty',
                type: {
                    kind: 'simple',
                    type: 'RoyaltyParams',
                    optional: false,
                },
            },
        ],
    },
    {
        name: 'ClaimData',
        header: null,
        fields: [
            {
                name: 'data1',
                type: { kind: 'simple', type: 'ClaimData1', optional: false },
            },
            {
                name: 'data2',
                type: { kind: 'simple', type: 'ClaimData2', optional: false },
            },
            {
                name: 'data3',
                type: { kind: 'simple', type: 'ClaimData3', optional: false },
            },
            {
                name: 'data4',
                type: { kind: 'simple', type: 'ClaimData4', optional: false },
            },
        ],
    },
    {
        name: 'Token',
        header: null,
        fields: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'chain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'contractAddress',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
        ],
    },
    {
        name: 'AddValidator',
        header: 3868963206,
        fields: [
            {
                name: 'newValidatorPublicKey',
                type: { kind: 'simple', type: 'NewValidator', optional: false },
            },
            {
                name: 'newValidatorAddress',
                type: { kind: 'simple', type: 'address', optional: false },
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
        name: 'ClaimNFT721',
        header: 1653459629,
        fields: [
            {
                name: 'data',
                type: { kind: 'simple', type: 'ClaimData', optional: false },
            },
            {
                name: 'signatures',
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
        header: 3571773646,
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
                type: { kind: 'simple', type: 'slice', optional: false },
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
        header: 2428616504,
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
                name: 'contractAddress',
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
const Bridge_getters = [
    {
        name: 'Original721Mapping',
        arguments: [
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'Duplicate721Mapping',
        arguments: [
            {
                name: 'contractAddress',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'OriginalToDuplicate',
        arguments: [
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
        ],
        returnType: {
            kind: 'simple',
            type: 'OriginalToDuplicateContractInfo',
            optional: true,
        },
    },
    {
        name: 'DuplicateToOriginal',
        arguments: [
            {
                name: 'key',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
        returnType: {
            kind: 'simple',
            type: 'DuplicateToOriginalContractInfo',
            optional: true,
        },
    },
    {
        name: 'TokenInfo',
        arguments: [
            {
                name: 'key',
                type: { kind: 'simple', type: 'address', optional: false },
            },
        ],
        returnType: { kind: 'simple', type: 'Token', optional: true },
    },
    {
        name: 'TokenInfoSelf',
        arguments: [
            {
                name: 'tokenId',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
            {
                name: 'sourceChain',
                type: { kind: 'simple', type: 'string', optional: false },
            },
            {
                name: 'sourceNftContractAddress',
                type: { kind: 'simple', type: 'slice', optional: false },
            },
        ],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'Validator',
        arguments: [
            {
                name: 'key',
                type: {
                    kind: 'simple',
                    type: 'int',
                    optional: false,
                    format: 257,
                },
            },
        ],
        returnType: { kind: 'simple', type: 'Validator', optional: true },
    },
    {
        name: 'ValidatorsCount',
        arguments: [],
        returnType: {
            kind: 'simple',
            type: 'int',
            optional: true,
            format: 257,
        },
    },
    {
        name: 'CollectionDeployer',
        arguments: [],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'StorageDeployer',
        arguments: [],
        returnType: { kind: 'simple', type: 'address', optional: true },
    },
    {
        name: 'Collections',
        arguments: [
            {
                name: 'key',
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
];
const Bridge_receivers = [
    { receiver: 'internal', message: { kind: 'typed', type: 'Excesses' } },
    { receiver: 'internal', message: { kind: 'text', text: 'Deploy' } },
    { receiver: 'internal', message: { kind: 'typed', type: 'AddValidator' } },
    {
        receiver: 'internal',
        message: { kind: 'typed', type: 'RewardValidator' },
    },
    {
        receiver: 'internal',
        message: { kind: 'typed', type: 'HiFromDeployNFT721Storage' },
    },
    {
        receiver: 'internal',
        message: { kind: 'typed', type: 'HiFromDeployNFT721Collection' },
    },
    { receiver: 'internal', message: { kind: 'typed', type: 'Lock721' } },
    { receiver: 'internal', message: { kind: 'typed', type: 'ClaimNFT721' } },
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
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'Excesses') {
            body = (0, core_1.beginCell)().store(storeExcesses(message)).endCell();
        }
        if (message === 'Deploy') {
            body = (0, core_1.beginCell)()
                .storeUint(0, 32)
                .storeStringTail(message)
                .endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'AddValidator') {
            body = (0, core_1.beginCell)().store(storeAddValidator(message)).endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'RewardValidator') {
            body = (0, core_1.beginCell)().store(storeRewardValidator(message)).endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'HiFromDeployNFT721Storage') {
            body = (0, core_1.beginCell)()
                .store(storeHiFromDeployNFT721Storage(message))
                .endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'HiFromDeployNFT721Collection') {
            body = (0, core_1.beginCell)()
                .store(storeHiFromDeployNFT721Collection(message))
                .endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'Lock721') {
            body = (0, core_1.beginCell)().store(storeLock721(message)).endCell();
        }
        if (message &&
            typeof message === 'object' &&
            !(message instanceof core_1.Slice) &&
            message.$$type === 'ClaimNFT721') {
            body = (0, core_1.beginCell)().store(storeClaimNFT721(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getOriginal721Mapping(provider, sourceNftContractAddress, sourceChain) {
        const builder = new core_1.TupleBuilder();
        builder.writeAddress(sourceNftContractAddress);
        builder.writeString(sourceChain);
        const source = (await provider.get('Original721Mapping', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getDuplicate721Mapping(provider, contractAddress) {
        const builder = new core_1.TupleBuilder();
        builder.writeAddress(contractAddress);
        const source = (await provider.get('Duplicate721Mapping', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getOriginalToDuplicate(provider, sourceNftContractAddress, sourceChain) {
        const builder = new core_1.TupleBuilder();
        builder.writeString(sourceNftContractAddress);
        builder.writeString(sourceChain);
        const source = (await provider.get('OriginalToDuplicate', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p
            ? loadTupleOriginalToDuplicateContractInfo(result_p)
            : null;
        return result;
    }
    async getDuplicateToOriginal(provider, key) {
        const builder = new core_1.TupleBuilder();
        builder.writeAddress(key);
        const source = (await provider.get('DuplicateToOriginal', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p
            ? loadTupleDuplicateToOriginalContractInfo(result_p)
            : null;
        return result;
    }
    async getTokenInfo(provider, key) {
        const builder = new core_1.TupleBuilder();
        builder.writeAddress(key);
        const source = (await provider.get('TokenInfo', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleToken(result_p) : null;
        return result;
    }
    async getTokenInfoSelf(provider, tokenId, sourceChain, sourceNftContractAddress) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(tokenId);
        builder.writeString(sourceChain);
        builder.writeSlice(sourceNftContractAddress);
        const source = (await provider.get('TokenInfoSelf', builder.build()))
            .stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getValidator(provider, key) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(key);
        const source = (await provider.get('Validator', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleValidator(result_p) : null;
        return result;
    }
    async getValidatorsCount(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('ValidatorsCount', builder.build()))
            .stack;
        const result = source.readBigNumberOpt();
        return result;
    }
    async getCollectionDeployer(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('CollectionDeployer', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getStorageDeployer(provider) {
        const builder = new core_1.TupleBuilder();
        const source = (await provider.get('StorageDeployer', builder.build()))
            .stack;
        const result = source.readAddressOpt();
        return result;
    }
    async getCollections(provider, key) {
        const builder = new core_1.TupleBuilder();
        builder.writeNumber(key);
        const source = (await provider.get('Collections', builder.build()))
            .stack;
        const result = source.readAddressOpt();
        return result;
    }
}
exports.Bridge = Bridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9uQnJpZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyYWN0c1R5cGVzL3Rvbi90b25CcmlkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLG9DQWtCbUI7QUFRbkIsU0FBZ0IsY0FBYyxDQUFDLEdBQWM7SUFDekMsT0FBTyxDQUFDLE9BQWdCLEVBQUUsRUFBRTtRQUN4QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFDcEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQU5ELHdDQU1DO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLEtBQVk7SUFDdEMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFvQixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3RFLENBQUM7QUFMRCxzQ0FLQztBQVVELFNBQWdCLFlBQVksQ0FBQyxHQUFZO0lBQ3JDLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDeEIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM3QixHQUFHLENBQUMs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