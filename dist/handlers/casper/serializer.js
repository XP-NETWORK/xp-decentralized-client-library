"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const casper_js_sdk_1 = require("casper-js-sdk");
function Serializer() {
    const u512Serializer = new casper_js_sdk_1.CLU512BytesParser();
    const stringSerializer = new casper_js_sdk_1.CLStringBytesParser();
    const accountHashSerializer = new casper_js_sdk_1.CLAccountHashBytesParser();
    return {
        claimNft(args) {
            const tokenIdentifier = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.token_id_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize token_id_arg to bytes.");
            const source_chain = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.source_chain_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize source_chain_arg to bytes.");
            const destination_chain = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.destination_chain_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize destination_chain_arg to bytes.");
            const destination_user_address = accountHashSerializer
                .toBytes(new casper_js_sdk_1.CLAccountHash(Buffer.from(args.destination_user_address_arg, "hex")))
                .expect("Serialize(ClaimArgs): Failed to serialize destination_user_address_arg to bytes.");
            const source_nft_contract_address = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.source_nft_contract_address_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize source_nft_contract_address_arg to bytes.");
            const name = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.name_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize name_arg to bytes.");
            const symbol = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.symbol_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize symbol_arg to bytes.");
            const royalty = u512Serializer
                .toBytes(new casper_js_sdk_1.CLU512(args.royalty_arg))
                .expect("Serialize(WithdrawFeeData): Failed to serialize royalty_arg to bytes.");
            const royalty_receiver = accountHashSerializer
                .toBytes(new casper_js_sdk_1.CLAccountHash(Buffer.from(args.royalty_receiver_arg, "hex")))
                .expect("Serialize(ClaimArgs): Failed to serialize royalty_receiver_arg to bytes.");
            const metadata = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.metadata_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize metadata_arg to bytes.");
            const transaction_hash = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.transaction_hash_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize transaction_hash_arg to bytes.");
            const token_amount = u512Serializer
                .toBytes(new casper_js_sdk_1.CLU512(args.token_amount_arg))
                .expect("Serialize(WithdrawFeeData): Failed to serialize token_amount_arg to bytes.");
            const nft_type = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.nft_type_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize nft_type_arg to bytes.");
            const fee = u512Serializer
                .toBytes(new casper_js_sdk_1.CLU512(args.fee_arg))
                .expect("Serialize(WithdrawFeeData): Failed to serialize fee_arg to bytes.");
            const lock_tx_chain = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.lock_tx_chain_arg))
                .expect("Serialize(ClaimArgs): Failed to serialize lock_tx_chain_arg to bytes.");
            return Buffer.concat([
                tokenIdentifier,
                source_chain,
                destination_chain,
                destination_user_address,
                source_nft_contract_address,
                name,
                symbol,
                royalty,
                royalty_receiver,
                metadata,
                transaction_hash,
                token_amount,
                nft_type,
                fee,
                lock_tx_chain,
            ]);
        },
        storageKey(args) {
            const source_nft_contract_address = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString(args.source_nft_contract_address))
                .expect("Serialize(StorageKeyArgs): Failed to serialize source_nft_contract_address to bytes.");
            const self_chain = stringSerializer
                .toBytes(new casper_js_sdk_1.CLString("CASPER"))
                .expect("Serialize(StorageKeyArgs): Failed to serialize self_chain to bytes.");
            return Buffer.concat([source_nft_contract_address, self_chain]);
        },
    };
}
exports.Serializer = Serializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oYW5kbGVycy9jYXNwZXIvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFPdUI7QUFFdkIsU0FBZ0IsVUFBVTtJQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFJLGlDQUFpQixFQUFFLENBQUM7SUFDL0MsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFtQixFQUFFLENBQUM7SUFDbkQsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLHdDQUF3QixFQUFFLENBQUM7SUFDN0QsT0FBTztRQUNMLFFBQVEsQ0FBQyxJQUFzQjtZQUM3QixNQUFNLGVBQWUsR0FBRyxnQkFBZ0I7aUJBQ3JDLE9BQU8sQ0FBQyxJQUFJLHdCQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUN4QyxNQUFNLENBQ0wsa0VBQWtFLENBQ25FLENBQUM7WUFFSixNQUFNLFlBQVksR0FBRyxnQkFBZ0I7aUJBQ2xDLE9BQU8sQ0FBQyxJQUFJLHdCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzVDLE1BQU0sQ0FDTCxzRUFBc0UsQ0FDdkUsQ0FBQztZQUVKLE1BQU0saUJBQWlCLEdBQUcsZ0JBQWdCO2lCQUN2QyxPQUFPLENBQUMsSUFBSSx3QkFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUNqRCxNQUFNLENBQ0wsMkVBQTJFLENBQzVFLENBQUM7WUFFSixNQUFNLHdCQUF3QixHQUFHLHFCQUFxQjtpQkFDbkQsT0FBTyxDQUNOLElBQUksNkJBQWEsQ0FDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FDdEQsQ0FDRjtpQkFDQSxNQUFNLENBQ0wsa0ZBQWtGLENBQ25GLENBQUM7WUFFSixNQUFNLDJCQUEyQixHQUFHLGdCQUFnQjtpQkFDakQsT0FBTyxDQUFD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