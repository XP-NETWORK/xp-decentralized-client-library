"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructClaimDataType = void 0;
const out_1 = require("@multiversx/sdk-core/out");
exports.StructClaimDataType = new out_1.StructType("ClaimData", [
    new out_1.FieldDefinition("token_id", "name of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("source_chain", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("destination_chain", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("destination_user_address", "attributes of the nft", new out_1.AddressType()),
    new out_1.FieldDefinition("source_nft_contract_address", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("name", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("symbol", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("royalty", "attributes of the nft", new out_1.BigUIntType()),
    new out_1.FieldDefinition("royalty_receiver", "attributes of the nft", new out_1.AddressType()),
    new out_1.FieldDefinition("attrs", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("transaction_hash", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("token_amount", "attributes of the nft", new out_1.BigUIntType()),
    new out_1.FieldDefinition("nft_type", "attributes of the nft", new out_1.BytesType()),
    new out_1.FieldDefinition("fee", "attributes of the nft", new out_1.BigUIntType()),
    new out_1.FieldDefinition("lock_tx_chain", "Chain identifier on which nft was locked", new out_1.BytesType()),
    new out_1.FieldDefinition("img_uri", "uri of the image", new out_1.BytesType()),
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGFuZGxlcnMvbXVsdGl2ZXJzeC90eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFPa0M7QUF3RnJCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxnQkFBVSxDQUFDLFdBQVcsRUFBRTtJQUM3RCxJQUFJLHFCQUFlLENBQUMsVUFBVSxFQUFFLGlCQUFpQixFQUFFLElBQUksZUFBUyxFQUFFLENBQUM7SUFDbkUsSUFBSSxxQkFBZSxDQUFDLGNBQWMsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLGVBQVMsRUFBRSxDQUFDO0lBQzdFLElBQUkscUJBQWUsQ0FDakIsbUJBQW1CLEVBQ25CLHVCQUF1QixFQUN2QixJQUFJLGVBQVMsRUFBRSxDQUNoQjtJQUNELElBQUkscUJBQWUsQ0FDakIsMEJBQTBCLEVBQzFCLHVCQUF1QixFQUN2QixJQUFJLGlCQUFXLEVBQUUsQ0FDbEI7SUFDRCxJQUFJLHFCQUFlLENBQ2pCLDZCQUE2QixFQUM3Qix1QkFBdUIsRUFDdkIsSUFBSSxlQUFTLEVBQUUsQ0FDaEI7SUFDRCxJQUFJLHFCQUFlLENBQUMsTUFBTSxFQUFFLHVCQUF1QixFQUFFLElBQUksZUFBUyxFQUFFLENBQUM7SUFDckUsSUFBSSxxQkFBZSxDQUFDLFFBQVEsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLGVBQVMsRUFBRSxDQUFDO0lBQ3ZFLElBQUkscUJBQWUsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxpQkFBVyxFQUFFLENBQUM7SUFDMUUsSUFBSSxxQkFBZSxDQUNqQixrQkFBa0IsRUFDbEIsdUJBQXVCLEVBQ3ZCLElBQUksaUJBQVcsRUFBRSxDQUNsQjtJQUNELElBQUkscUJBQWUsQ0FBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxlQUFTLEVBQUUsQ0FBQztJQUN0RSxJQUFJLHFCQUFlLENBQ2pCLGtCQUFrQixFQUNsQix1QkFBdUIsRUFDdkIsSUFBSSxlQUFTLEVBQUUsQ0FDaEI7SUFDRCxJQUFJLHFCQUFlLENBQ2pCLGNBQWMsRUFDZCx1QkFBdUIsRUFDdkIsSUFBSSxpQkFBVyxFQUFFLENBQ2xCO0lBQ0QsSUFBSSxxQkFBZSxDQUFDLFVBQVUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLGVBQVMsRUFBRSxDQUFDO0lBQ3pFLElBQUkscUJBQWUsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxpQkFBVyxFQUFFLENBQUM7SUFDdEUsSUFBSSxxQkFBZSxDQUNqQixlQUFlLEVBQ2YsMENBQTBDLEVBQzFDLElBQUksZUFBUyxFQUFFLENBQ2hCO0lBQ0QsSUFBSSxxQkFBZSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLGVBQVMsRUFBRSxDQUFDO0NBQ3BFLENBQUMsQ0FBQyJ9