//@ts-nocheck

import {
  Cell,
  Slice,
  Address,
  Builder,
  beginCell,
  ComputeError,
  TupleItem,
  TupleReader,
  Dictionary,
  contractAddress,
  ContractProvider,
  Sender,
  Contract,
  ContractABI,
  ABIType,
  ABIGetter,
  ABIReceiver,
  TupleBuilder,
  DictionaryValue,
} from "ton-core";

export type StateInit = {
  $$type: "StateInit";
  code: Cell;
  data: Cell;
};

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeRef(src.code);
    b_0.storeRef(src.data);
  };
}

export function loadStateInit(slice: Slice) {
  let sc_0 = slice;
  let _code = sc_0.loadRef();
  let _data = sc_0.loadRef();
  return { $$type: "StateInit" as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
  let _code = source.readCell();
  let _data = source.readCell();
  return { $$type: "StateInit" as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
  let builder = new TupleBuilder();
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse());
    },
  };
}

export type Context = {
  $$type: "Context";
  bounced: boolean;
  sender: Address;
  value: bigint;
  raw: Cell;
};

export function storeContext(src: Context) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounced);
    b_0.storeAddress(src.sender);
    b_0.storeInt(src.value, 257);
    b_0.storeRef(src.raw);
  };
}

export function loadContext(slice: Slice) {
  let sc_0 = slice;
  let _bounced = sc_0.loadBit();
  let _sender = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _raw = sc_0.loadRef();
  return {
    $$type: "Context" as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function loadTupleContext(source: TupleReader) {
  let _bounced = source.readBoolean();
  let _sender = source.readAddress();
  let _value = source.readBigNumber();
  let _raw = source.readCell();
  return {
    $$type: "Context" as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function storeTupleContext(source: Context) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounced);
  builder.writeAddress(source.sender);
  builder.writeNumber(source.value);
  builder.writeSlice(source.raw);
  return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeContext(src)).endCell());
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse());
    },
  };
}

export type SendParameters = {
  $$type: "SendParameters";
  bounce: boolean;
  to: Address;
  value: bigint;
  mode: bigint;
  body: Cell | null;
  code: Cell | null;
  data: Cell | null;
};

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounce);
    b_0.storeAddress(src.to);
    b_0.storeInt(src.value, 257);
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body);
    } else {
      b_0.storeBit(false);
    }
    if (src.code !== null && src.code !== undefined) {
      b_0.storeBit(true).storeRef(src.code);
    } else {
      b_0.storeBit(false);
    }
    if (src.data !== null && src.data !== undefined) {
      b_0.storeBit(true).storeRef(src.data);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadSendParameters(slice: Slice) {
  let sc_0 = slice;
  let _bounce = sc_0.loadBit();
  let _to = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _mode = sc_0.loadIntBig(257);
  let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: "SendParameters" as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function loadTupleSendParameters(source: TupleReader) {
  let _bounce = source.readBoolean();
  let _to = source.readAddress();
  let _value = source.readBigNumber();
  let _mode = source.readBigNumber();
  let _body = source.readCellOpt();
  let _code = source.readCellOpt();
  let _data = source.readCellOpt();
  return {
    $$type: "SendParameters" as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function storeTupleSendParameters(source: SendParameters) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounce);
  builder.writeAddress(source.to);
  builder.writeNumber(source.value);
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse());
    },
  };
}

export type Deploy = {
  $$type: "Deploy";
  queryId: bigint;
};

export function storeDeploy(src: Deploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2490013878, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2490013878) {
    throw Error("Invalid prefix");
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: "Deploy" as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: "Deploy" as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadDeploy(src.loadRef().beginParse());
    },
  };
}

export type DeployOk = {
  $$type: "DeployOk";
  queryId: bigint;
};

export function storeDeployOk(src: DeployOk) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2952335191, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeployOk(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2952335191) {
    throw Error("Invalid prefix");
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: "DeployOk" as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: "DeployOk" as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
    },
    parse: (src) => {
      return loadDeployOk(src.loadRef().beginParse());
    },
  };
}

export type FactoryDeploy = {
  $$type: "FactoryDeploy";
  queryId: bigint;
  cashback: Address;
};

export function storeFactoryDeploy(src: FactoryDeploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1829761339, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.cashback);
  };
}

export function loadFactoryDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1829761339) {
    throw Error("Invalid prefix");
  }
  let _queryId = sc_0.loadUintBig(64);
  let _cashback = sc_0.loadAddress();
  return {
    $$type: "FactoryDeploy" as const,
    queryId: _queryId,
    cashback: _cashback,
  };
}

function loadTupleFactoryDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _cashback = source.readAddress();
  return {
    $$type: "FactoryDeploy" as const,
    queryId: _queryId,
    cashback: _cashback,
  };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.cashback);
  return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadFactoryDeploy(src.loadRef().beginParse());
    },
  };
}

export type CollectionData = {
  $$type: "CollectionData";
  next_item_index: bigint;
  collection_content: Cell;
  owner_address: Address;
};

export function storeCollectionData(src: CollectionData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.next_item_index, 257);
    b_0.storeRef(src.collection_content);
    b_0.storeAddress(src.owner_address);
  };
}

export function loadCollectionData(slice: Slice) {
  let sc_0 = slice;
  let _next_item_index = sc_0.loadIntBig(257);
  let _collection_content = sc_0.loadRef();
  let _owner_address = sc_0.loadAddress();
  return {
    $$type: "CollectionData" as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address,
  };
}

function loadTupleCollectionData(source: TupleReader) {
  let _next_item_index = source.readBigNumber();
  let _collection_content = source.readCell();
  let _owner_address = source.readAddress();
  return {
    $$type: "CollectionData" as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address,
  };
}

function storeTupleCollectionData(source: CollectionData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.next_item_index);
  builder.writeCell(source.collection_content);
  builder.writeAddress(source.owner_address);
  return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeCollectionData(src)).endCell());
    },
    parse: (src) => {
      return loadCollectionData(src.loadRef().beginParse());
    },
  };
}

export type RoyaltyParams = {
  $$type: "RoyaltyParams";
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeRoyaltyParams(src: RoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(src.numerator, 16);
    b_0.storeUint(src.denominator, 16);
    b_0.storeAddress(src.destination);
  };
}

export function loadRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  let _numerator = sc_0.loadUintBig(16);
  let _denominator = sc_0.loadUintBig(16);
  let _destination = sc_0.loadAddress();
  return {
    $$type: "RoyaltyParams" as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function loadTupleRoyaltyParams(source: TupleReader) {
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: "RoyaltyParams" as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type GetRoyaltyParams = {
  $$type: "GetRoyaltyParams";
  query_id: bigint;
};

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1765620048, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1765620048) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "GetRoyaltyParams" as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "GetRoyaltyParams" as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadGetRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type ReportRoyaltyParams = {
  $$type: "ReportRoyaltyParams";
  query_id: bigint;
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2831876269, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeUint(src.numerator, 16);
    b_0.storeUint(src.denominator, 16);
    b_0.storeAddress(src.destination);
  };
}

export function loadReportRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2831876269) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _numerator = sc_0.loadUintBig(16);
  let _denominator = sc_0.loadUintBig(16);
  let _destination = sc_0.loadAddress();
  return {
    $$type: "ReportRoyaltyParams" as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: "ReportRoyaltyParams" as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeReportRoyaltyParams(src)).endCell(),
      );
    },
    parse: (src) => {
      return loadReportRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type Transfer = {
  $$type: "Transfer";
  query_id: bigint;
  new_owner: Address;
  response_destination: Address;
  custom_payload: Cell | null;
  forward_amount: bigint;
  forward_payload: Cell;
};

export function storeTransfer(src: Transfer) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1607220500, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.new_owner);
    b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null && src.custom_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.custom_payload);
    } else {
      b_0.storeBit(false);
    }
    b_0.storeCoins(src.forward_amount);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTransfer(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1607220500) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _new_owner = sc_0.loadAddress();
  let _response_destination = sc_0.loadAddress();
  let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _forward_amount = sc_0.loadCoins();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: "Transfer" as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload,
  };
}

function loadTupleTransfer(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _new_owner = source.readAddress();
  let _response_destination = source.readAddress();
  let _custom_payload = source.readCellOpt();
  let _forward_amount = source.readBigNumber();
  let _forward_payload = source.readCell();
  return {
    $$type: "Transfer" as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload,
  };
}

function storeTupleTransfer(source: Transfer) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.new_owner);
  builder.writeAddress(source.response_destination);
  builder.writeCell(source.custom_payload);
  builder.writeNumber(source.forward_amount);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeTransfer(src)).endCell());
    },
    parse: (src) => {
      return loadTransfer(src.loadRef().beginParse());
    },
  };
}

export type OwnershipAssigned = {
  $$type: "OwnershipAssigned";
  query_id: bigint;
  prev_owner: Address;
  forward_payload: Cell;
};

export function storeOwnershipAssigned(src: OwnershipAssigned) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(85167505, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.prev_owner);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadOwnershipAssigned(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 85167505) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _prev_owner = sc_0.loadAddress();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: "OwnershipAssigned" as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload,
  };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _prev_owner = source.readAddress();
  let _forward_payload = source.readCell();
  return {
    $$type: "OwnershipAssigned" as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload,
  };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.prev_owner);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeOwnershipAssigned(src)).endCell(),
      );
    },
    parse: (src) => {
      return loadOwnershipAssigned(src.loadRef().beginParse());
    },
  };
}

export type Excesses = {
  $$type: "Excesses";
  query_id: bigint;
};

export function storeExcesses(src: Excesses) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3576854235, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadExcesses(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3576854235) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "Excesses" as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "Excesses" as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeExcesses(src)).endCell());
    },
    parse: (src) => {
      return loadExcesses(src.loadRef().beginParse());
    },
  };
}

export type GetStaticData = {
  $$type: "GetStaticData";
  query_id: bigint;
};

export function storeGetStaticData(src: GetStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(801842850, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 801842850) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "GetStaticData" as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "GetStaticData" as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadGetStaticData(src.loadRef().beginParse());
    },
  };
}

export type ReportStaticData = {
  $$type: "ReportStaticData";
  query_id: bigint;
  index: bigint;
  collection: Address;
};

export function storeReportStaticData(src: ReportStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2339837749, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeUint(src.index, 256);
    b_0.storeAddress(src.collection);
  };
}

export function loadReportStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2339837749) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _index = sc_0.loadUintBig(256);
  let _collection = sc_0.loadAddress();
  return {
    $$type: "ReportStaticData" as const,
    query_id: _query_id,
    index: _index,
    collection: _collection,
  };
}

function loadTupleReportStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _index = source.readBigNumber();
  let _collection = source.readAddress();
  return {
    $$type: "ReportStaticData" as const,
    query_id: _query_id,
    index: _index,
    collection: _collection,
  };
}

function storeTupleReportStaticData(source: ReportStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.index);
  builder.writeAddress(source.collection);
  return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadReportStaticData(src.loadRef().beginParse());
    },
  };
}

export type NftData = {
  $$type: "NftData";
  is_initialized: boolean;
  index: bigint;
  collection_address: Address;
  owner_address: Address;
  individual_content: Cell;
};

export function storeNftData(src: NftData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.is_initialized);
    b_0.storeInt(src.index, 257);
    b_0.storeAddress(src.collection_address);
    b_0.storeAddress(src.owner_address);
    b_0.storeRef(src.individual_content);
  };
}

export function loadNftData(slice: Slice) {
  let sc_0 = slice;
  let _is_initialized = sc_0.loadBit();
  let _index = sc_0.loadIntBig(257);
  let _collection_address = sc_0.loadAddress();
  let _owner_address = sc_0.loadAddress();
  let _individual_content = sc_0.loadRef();
  return {
    $$type: "NftData" as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content,
  };
}

function loadTupleNftData(source: TupleReader) {
  let _is_initialized = source.readBoolean();
  let _index = source.readBigNumber();
  let _collection_address = source.readAddress();
  let _owner_address = source.readAddress();
  let _individual_content = source.readCell();
  return {
    $$type: "NftData" as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content,
  };
}

function storeTupleNftData(source: NftData) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.is_initialized);
  builder.writeNumber(source.index);
  builder.writeAddress(source.collection_address);
  builder.writeAddress(source.owner_address);
  builder.writeCell(source.individual_content);
  return builder.build();
}

function dictValueParserNftData(): DictionaryValue<NftData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeNftData(src)).endCell());
    },
    parse: (src) => {
      return loadNftData(src.loadRef().beginParse());
    },
  };
}

type ExampleNFTCollection_init_args = {
  $$type: "ExampleNFTCollection_init_args";
  owner_address: Address;
  collection_content: Cell;
  royalty_params: RoyaltyParams;
};

function initExampleNFTCollection_init_args(
  src: ExampleNFTCollection_init_args,
) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner_address);
    b_0.storeRef(src.collection_content);
    b_0.store(storeRoyaltyParams(src.royalty_params));
  };
}

async function ExampleNFTCollection_init(
  owner_address: Address,
  collection_content: Cell,
  royalty_params: RoyaltyParams,
) {
  const __code = Cell.fromBase64(
    "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",
  );
  const __system = Cell.fromBase64(
    "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",
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initExampleNFTCollection_init_args({
    $$type: "ExampleNFTCollection_init_args",
    owner_address,
    collection_content,
    royalty_params,
  })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const ExampleNFTCollection_errors: { [key: number]: { message: string } } = {
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
  4020: {
    message: `NFTItemStandard: Only the collection can initialize the NFT item`,
  },
  32575: {
    message: `NFTItemStandard: Only the owner or collection can transfer the NFT item`,
  },
};

const ExampleNFTCollection_types: ABIType[] = [
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
        type: {
          kind: "simple",
          type: "slice",
          optional: false,
          format: "remainder",
        },
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
        type: {
          kind: "simple",
          type: "slice",
          optional: false,
          format: "remainder",
        },
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
        name: "index",
        type: { kind: "simple", type: "uint", optional: false, format: 256 },
      },
      {
        name: "collection",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "NftData",
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
];

const ExampleNFTCollection_getters: ABIGetter[] = [
  {
    name: "get_collection_data",
    arguments: [],
    returnType: { kind: "simple", type: "CollectionData", optional: false },
  },
  {
    name: "get_nft_address_by_index",
    arguments: [
      {
        name: "index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
    returnType: { kind: "simple", type: "address", optional: false },
  },
  {
    name: "get_nft_content",
    arguments: [
      {
        name: "index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "individual_content",
        type: { kind: "simple", type: "cell", optional: false },
      },
    ],
    returnType: { kind: "simple", type: "cell", optional: false },
  },
  {
    name: "royalty_params",
    arguments: [],
    returnType: { kind: "simple", type: "RoyaltyParams", optional: false },
  },
];

const ExampleNFTCollection_receivers: ABIReceiver[] = [
  { receiver: "internal", message: { kind: "text", text: "Mint" } },
  {
    receiver: "internal",
    message: { kind: "typed", type: "GetRoyaltyParams" },
  },
  { receiver: "internal", message: { kind: "typed", type: "Deploy" } },
];

export class ExampleNFTCollection implements Contract {
  static async init(
    owner_address: Address,
    collection_content: Cell,
    royalty_params: RoyaltyParams,
  ) {
    return await ExampleNFTCollection_init(
      owner_address,
      collection_content,
      royalty_params,
    );
  }

  static async fromInit(
    owner_address: Address,
    collection_content: Cell,
    royalty_params: RoyaltyParams,
  ) {
    const init = await ExampleNFTCollection_init(
      owner_address,
      collection_content,
      royalty_params,
    );
    const address = contractAddress(0, init);
    return new ExampleNFTCollection(address, init);
  }

  static fromAddress(address: Address) {
    return new ExampleNFTCollection(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: ExampleNFTCollection_types,
    getters: ExampleNFTCollection_getters,
    receivers: ExampleNFTCollection_receivers,
    errors: ExampleNFTCollection_errors,
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: "Mint" | GetRoyaltyParams | Deploy,
  ) {
    let body: Cell | null = null;
    if (message === "Mint") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "GetRoyaltyParams"
    ) {
      body = beginCell().store(storeGetRoyaltyParams(message)).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "Deploy"
    ) {
      body = beginCell().store(storeDeploy(message)).endCell();
    }
    if (body === null) {
      throw new Error("Invalid message type");
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getGetCollectionData(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_collection_data", builder.build()))
      .stack;
    const result = loadTupleCollectionData(source);
    return result;
  }

  async getGetNftAddressByIndex(provider: ContractProvider, index: bigint) {
    let builder = new TupleBuilder();
    builder.writeNumber(index);
    let source = (
      await provider.get("get_nft_address_by_index", builder.build())
    ).stack;
    let result = source.readAddress();
    return result;
  }

  async getGetNftContent(
    provider: ContractProvider,
    index: bigint,
    individual_content: Cell,
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(index);
    builder.writeCell(individual_content);
    let source = (await provider.get("get_nft_content", builder.build())).stack;
    let result = source.readCell();
    return result;
  }

  async getRoyaltyParams(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("royalty_params", builder.build())).stack;
    const result = loadTupleRoyaltyParams(source);
    return result;
  }
}