export const NFTStorageCode: {
    __type: 'NFTStorageCode';
    protocol: string;
    code: object[];
} = {
    __type: 'NFTStorageCode',
    protocol: 'PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo',
    code: JSON.parse(
        `[{"prim":"parameter","args":[{"prim":"or","args":[{"prim":"pair","annots":["%unlock_token"],"args":[{"prim":"nat","annots":["%token_id"]},{"prim":"address","annots":["%to"]}]},{"prim":"nat","annots":["%add_deposited_token"]}]}]},{"prim":"storage","args":[{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"address","annots":["%collection"]},{"prim":"set","annots":["%locked"],"args":[{"prim":"nat"}]}]}]},{"prim":"code","args":[[{"prim":"LAMBDA","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"address"},{"prim":"set","args":[{"prim":"nat"}]}]},{"prim":"unit"},[{"prim":"CAR"},{"prim":"SENDER"},{"prim":"COMPARE"},{"prim":"NEQ"},{"prim":"IF","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"Cannot perform this function since you are not the owner."}]},{"prim":"FAILWITH"}],[]]},{"prim":"UNIT"}]]},{"prim":"SWAP"},[[{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"CDR"}]]}]],{"prim":"IF_LEFT","args":[[{"prim":"SELF_ADDRESS"},[{"prim":"DIP","args":[{"int":"2"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"3"}]}],{"prim":"DIG","args":[{"int":"4"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"DROP"},[{"prim":"DIP","args":[{"int":"2"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"3"}]}],{"prim":"GET","args":[{"int":"3"}]},{"prim":"CONTRACT","annots":["%transfer"],"args":[{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address","annots":["%from_"]},{"prim":"list","annots":["%txs"],"args":[{"prim":"pair","args":[{"prim":"address","annots":["%to_"]},{"prim":"nat","annots":["%token_id"]},{"prim":"nat","annots":["%amount"]}]}]}]}]}]},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"bad address for get_entrypoint"}]},{"prim":"FAILWITH"}],[]]},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"NIL","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"nat"},{"prim":"nat"}]}]}]}]},{"prim":"NIL","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"nat"},{"prim":"nat"}]}]},{"prim":"PUSH","args":[{"prim":"nat"},{"int":"1"}]},[{"prim":"DIP","args":[{"int":"6"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"7"}]}],{"prim":"CAR"},[{"prim":"DIP","args":[{"int":"7"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"8"}]}],{"prim":"CDR"},{"prim":"PAIR","args":[{"int":"3"}]},{"prim":"CONS"},{"prim":"DIG","args":[{"int":"4"}]},{"prim":"PAIR"},{"prim":"CONS"},{"prim":"TRANSFER_TOKENS"},[{"prim":"DIP","args":[{"int":"2"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"3"}]}],{"prim":"DIG","args":[{"int":"3"}]},{"prim":"GET","args":[{"int":"4"}]},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"CAR"},{"prim":"PUSH","args":[{"prim":"bool"},{"prim":"False"}]},{"prim":"SWAP"},{"prim":"UPDATE"},{"prim":"UPDATE","args":[{"int":"4"}]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"}],[[{"prim":"DIP","args":[[{"prim":"DUP"}]]},{"prim":"SWAP"}],{"prim":"DIG","args":[{"int":"3"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"DROP"},[{"prim":"DIP","args":[[{"prim":"DUP"}]]},{"prim":"SWAP"}],{"prim":"DIG","args":[{"int":"2"}]},{"prim":"GET","args":[{"int":"4"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"PUSH","args":[{"prim":"bool"},{"prim":"True"}]},{"prim":"SWAP"},{"prim":"UPDATE"},{"prim":"UPDATE","args":[{"int":"4"}]},{"prim":"NIL","args":[{"prim":"operation"}]}]]},{"prim":"PAIR"}]]},{"prim":"view","args":[{"string":"get_collection_address"},{"prim":"unit"},{"prim":"address"},[{"prim":"CDR"},{"prim":"GET","args":[{"int":"3"}]}]]},{"prim":"view","args":[{"string":"has_locked_token"},{"prim":"nat"},{"prim":"bool"},[[[{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"CDR"}]]}]],{"prim":"SWAP"},{"prim":"GET","args":[{"int":"4"}]},{"prim":"SWAP"},{"prim":"MEM"}]]},{"prim":"view","args":[{"string":"get_owner"},{"prim":"unit"},{"prim":"address"},[{"prim":"CDR"},{"prim":"GET","args":[{"int":"3"}]}]]}]`,
    ),
};
