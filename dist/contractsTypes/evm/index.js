"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTStorageERC721__factory = exports.NFTStorageERC1155__factory = exports.NFTStorageDeployer__factory = exports.NFTCollectionDeployer__factory = exports.INFTStorageERC1155__factory = exports.INFTCollectionDeployer__factory = exports.IERC1155Royalty__factory = exports.ERC721Royalty__factory = exports.ERC20Token__factory = exports.ERC20Staking__factory = exports.ERC1155Royalty__factory = exports.BridgeStorage__factory = exports.Bridge__factory = exports.Strings__factory = exports.Math__factory = exports.IERC165__factory = exports.ERC165__factory = exports.ECDSA__factory = exports.ERC721Holder__factory = exports.IERC721Receiver__factory = exports.IERC721__factory = exports.IERC721Metadata__factory = exports.ERC721URIStorage__factory = exports.ERC721__factory = exports.IERC20__factory = exports.IERC20Metadata__factory = exports.ERC20__factory = exports.ERC1155Holder__factory = exports.IERC1155Receiver__factory = exports.IERC1155__factory = exports.IERC1155MetadataURI__factory = exports.ERC1155__factory = exports.ERC2981__factory = exports.IERC4906__factory = exports.IERC2981__factory = exports.IERC721Errors__factory = exports.IERC20Errors__factory = exports.IERC1155Errors__factory = exports.Ownable__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var Ownable__factory_1 = require("./factories/@openzeppelin/contracts/access/Ownable__factory");
Object.defineProperty(exports, "Ownable__factory", { enumerable: true, get: function () { return Ownable__factory_1.Ownable__factory; } });
var IERC1155Errors__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/draft-IERC6093.sol/IERC1155Errors__factory");
Object.defineProperty(exports, "IERC1155Errors__factory", { enumerable: true, get: function () { return IERC1155Errors__factory_1.IERC1155Errors__factory; } });
var IERC20Errors__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/draft-IERC6093.sol/IERC20Errors__factory");
Object.defineProperty(exports, "IERC20Errors__factory", { enumerable: true, get: function () { return IERC20Errors__factory_1.IERC20Errors__factory; } });
var IERC721Errors__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/draft-IERC6093.sol/IERC721Errors__factory");
Object.defineProperty(exports, "IERC721Errors__factory", { enumerable: true, get: function () { return IERC721Errors__factory_1.IERC721Errors__factory; } });
var IERC2981__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/IERC2981__factory");
Object.defineProperty(exports, "IERC2981__factory", { enumerable: true, get: function () { return IERC2981__factory_1.IERC2981__factory; } });
var IERC4906__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/IERC4906__factory");
Object.defineProperty(exports, "IERC4906__factory", { enumerable: true, get: function () { return IERC4906__factory_1.IERC4906__factory; } });
var ERC2981__factory_1 = require("./factories/@openzeppelin/contracts/token/common/ERC2981__factory");
Object.defineProperty(exports, "ERC2981__factory", { enumerable: true, get: function () { return ERC2981__factory_1.ERC2981__factory; } });
var ERC1155__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/ERC1155__factory");
Object.defineProperty(exports, "ERC1155__factory", { enumerable: true, get: function () { return ERC1155__factory_1.ERC1155__factory; } });
var IERC1155MetadataURI__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI__factory");
Object.defineProperty(exports, "IERC1155MetadataURI__factory", { enumerable: true, get: function () { return IERC1155MetadataURI__factory_1.IERC1155MetadataURI__factory; } });
var IERC1155__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/IERC1155__factory");
Object.defineProperty(exports, "IERC1155__factory", { enumerable: true, get: function () { return IERC1155__factory_1.IERC1155__factory; } });
var IERC1155Receiver__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver__factory");
Object.defineProperty(exports, "IERC1155Receiver__factory", { enumerable: true, get: function () { return IERC1155Receiver__factory_1.IERC1155Receiver__factory; } });
var ERC1155Holder__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder__factory");
Object.defineProperty(exports, "ERC1155Holder__factory", { enumerable: true, get: function () { return ERC1155Holder__factory_1.ERC1155Holder__factory; } });
var ERC20__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/ERC20__factory");
Object.defineProperty(exports, "ERC20__factory", { enumerable: true, get: function () { return ERC20__factory_1.ERC20__factory; } });
var IERC20Metadata__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata__factory");
Object.defineProperty(exports, "IERC20Metadata__factory", { enumerable: true, get: function () { return IERC20Metadata__factory_1.IERC20Metadata__factory; } });
var IERC20__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/IERC20__factory");
Object.defineProperty(exports, "IERC20__factory", { enumerable: true, get: function () { return IERC20__factory_1.IERC20__factory; } });
var ERC721__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/ERC721__factory");
Object.defineProperty(exports, "ERC721__factory", { enumerable: true, get: function () { return ERC721__factory_1.ERC721__factory; } });
var ERC721URIStorage__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage__factory");
Object.defineProperty(exports, "ERC721URIStorage__factory", { enumerable: true, get: function () { return ERC721URIStorage__factory_1.ERC721URIStorage__factory; } });
var IERC721Metadata__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata__factory");
Object.defineProperty(exports, "IERC721Metadata__factory", { enumerable: true, get: function () { return IERC721Metadata__factory_1.IERC721Metadata__factory; } });
var IERC721__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/IERC721__factory");
Object.defineProperty(exports, "IERC721__factory", { enumerable: true, get: function () { return IERC721__factory_1.IERC721__factory; } });
var IERC721Receiver__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/IERC721Receiver__factory");
Object.defineProperty(exports, "IERC721Receiver__factory", { enumerable: true, get: function () { return IERC721Receiver__factory_1.IERC721Receiver__factory; } });
var ERC721Holder__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder__factory");
Object.defineProperty(exports, "ERC721Holder__factory", { enumerable: true, get: function () { return ERC721Holder__factory_1.ERC721Holder__factory; } });
var ECDSA__factory_1 = require("./factories/@openzeppelin/contracts/utils/cryptography/ECDSA__factory");
Object.defineProperty(exports, "ECDSA__factory", { enumerable: true, get: function () { return ECDSA__factory_1.ECDSA__factory; } });
var ERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/ERC165__factory");
Object.defineProperty(exports, "ERC165__factory", { enumerable: true, get: function () { return ERC165__factory_1.ERC165__factory; } });
var IERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/IERC165__factory");
Object.defineProperty(exports, "IERC165__factory", { enumerable: true, get: function () { return IERC165__factory_1.IERC165__factory; } });
var Math__factory_1 = require("./factories/@openzeppelin/contracts/utils/math/Math__factory");
Object.defineProperty(exports, "Math__factory", { enumerable: true, get: function () { return Math__factory_1.Math__factory; } });
var Strings__factory_1 = require("./factories/@openzeppelin/contracts/utils/Strings__factory");
Object.defineProperty(exports, "Strings__factory", { enumerable: true, get: function () { return Strings__factory_1.Strings__factory; } });
var Bridge__factory_1 = require("./factories/contracts/Bridge__factory");
Object.defineProperty(exports, "Bridge__factory", { enumerable: true, get: function () { return Bridge__factory_1.Bridge__factory; } });
var BridgeStorage__factory_1 = require("./factories/contracts/BridgeStorage__factory");
Object.defineProperty(exports, "BridgeStorage__factory", { enumerable: true, get: function () { return BridgeStorage__factory_1.BridgeStorage__factory; } });
var ERC1155Royalty__factory_1 = require("./factories/contracts/ERC1155Royalty__factory");
Object.defineProperty(exports, "ERC1155Royalty__factory", { enumerable: true, get: function () { return ERC1155Royalty__factory_1.ERC1155Royalty__factory; } });
var ERC20Staking__factory_1 = require("./factories/contracts/ERC20Staking__factory");
Object.defineProperty(exports, "ERC20Staking__factory", { enumerable: true, get: function () { return ERC20Staking__factory_1.ERC20Staking__factory; } });
var ERC20Token__factory_1 = require("./factories/contracts/ERC20Token__factory");
Object.defineProperty(exports, "ERC20Token__factory", { enumerable: true, get: function () { return ERC20Token__factory_1.ERC20Token__factory; } });
var ERC721Royalty__factory_1 = require("./factories/contracts/ERC721Royalty__factory");
Object.defineProperty(exports, "ERC721Royalty__factory", { enumerable: true, get: function () { return ERC721Royalty__factory_1.ERC721Royalty__factory; } });
var IERC1155Royalty__factory_1 = require("./factories/contracts/interfaces/IERC1155Royalty__factory");
Object.defineProperty(exports, "IERC1155Royalty__factory", { enumerable: true, get: function () { return IERC1155Royalty__factory_1.IERC1155Royalty__factory; } });
var INFTCollectionDeployer__factory_1 = require("./factories/contracts/interfaces/INFTCollectionDeployer__factory");
Object.defineProperty(exports, "INFTCollectionDeployer__factory", { enumerable: true, get: function () { return INFTCollectionDeployer__factory_1.INFTCollectionDeployer__factory; } });
var INFTStorageERC1155__factory_1 = require("./factories/contracts/interfaces/INFTStorageERC1155__factory");
Object.defineProperty(exports, "INFTStorageERC1155__factory", { enumerable: true, get: function () { return INFTStorageERC1155__factory_1.INFTStorageERC1155__factory; } });
var NFTCollectionDeployer__factory_1 = require("./factories/contracts/NFTCollectionDeployer__factory");
Object.defineProperty(exports, "NFTCollectionDeployer__factory", { enumerable: true, get: function () { return NFTCollectionDeployer__factory_1.NFTCollectionDeployer__factory; } });
var NFTStorageDeployer__factory_1 = require("./factories/contracts/NFTStorageDeployer__factory");
Object.defineProperty(exports, "NFTStorageDeployer__factory", { enumerable: true, get: function () { return NFTStorageDeployer__factory_1.NFTStorageDeployer__factory; } });
var NFTStorageERC1155__factory_1 = require("./factories/contracts/NFTStorageERC1155__factory");
Object.defineProperty(exports, "NFTStorageERC1155__factory", { enumerable: true, get: function () { return NFTStorageERC1155__factory_1.NFTStorageERC1155__factory; } });
var NFTStorageERC721__factory_1 = require("./factories/contracts/NFTStorageERC721__factory");
Object.defineProperty(exports, "NFTStorageERC721__factory", { enumerable: true, get: function () { return NFTStorageERC721__factory_1.NFTStorageERC721__factory; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJhY3RzVHlwZXMvZXZtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EseURBQXlDO0FBRXpDLGdHQUErRjtBQUF0RixvSEFBQSxnQkFBZ0IsT0FBQTtBQUV6QixxSUFBb0k7QUFBM0gsa0lBQUEsdUJBQXVCLE9BQUE7QUFFaEMsaUlBQWdJO0FBQXZILDhIQUFBLHFCQUFxQixPQUFBO0FBRTlCLG1JQUFrSTtBQUF6SCxnSUFBQSxzQkFBc0IsT0FBQTtBQUUvQixzR0FBcUc7QUFBNUYsc0hBQUEsaUJBQWlCLE9BQUE7QUFFMUIsc0dBQXFHO0FBQTVGLHNIQUFBLGlCQUFpQixPQUFBO0FBRTFCLHNHQUFxRztBQUE1RixvSEFBQSxnQkFBZ0IsT0FBQTtBQUV6Qix1R0FBc0c7QUFBN0Ysb0hBQUEsZ0JBQWdCLE9BQUE7QUFFekIsMElBQXlJO0FBQWhJLDRJQUFBLDRCQUE0QixPQUFBO0FBRXJDLHlHQUF3RztBQUEvRixzSEFBQSxpQkFBaUIsT0FBQTtBQUUxQix5SEFBd0g7QUFBL0csc0lBQUEseUJBQXlCLE9BQUE7QUFFbEMseUhBQXdIO0FBQS9HLGdJQUFBLHNCQUFzQixPQUFBO0FBRS9CLGlHQUFnRztBQUF2RixnSEFBQSxjQUFjLE9BQUE7QUFFdkIsOEhBQTZIO0FBQXBILGtJQUFBLHVCQUF1QixPQUFBO0FBRWhDLG1HQUFrRztBQUF6RixrSEFBQSxlQUFlLE9BQUE7QUFFeEIsb0dBQW1HO0FBQTFGLGtIQUFBLGVBQWUsT0FBQTtBQUV4QixtSUFBa0k7QUFBekgsc0lBQUEseUJBQXlCLE9BQUE7QUFFbEMsaUlBQWdJO0FBQXZILG9JQUFBLHdCQUF3QixPQUFBO0FBRWpDLHNHQUFxRztBQUE1RixvSEFBQSxnQkFBZ0IsT0FBQTtBQUV6QixzSEFBcUg7QUFBNUcsb0lBQUEsd0JBQXdCLE9BQUE7QUFFakMsc0hBQXFIO0FBQTVHLDhIQUFBLHFCQUFxQixPQUFBO0FBRTlCLHdHQUF1RztBQUE5RixnSEFBQSxjQUFjLE9BQUE7QUFFdkIsMkdBQTBHO0FBQWpHLGtIQUFBLGVBQWUsT0FBQTtBQUV4Qiw2R0FBNEc7QUFBbkcsb0hBQUEsZ0JBQWdCLE9BQUE7QUFFekIsOEZBQTZGO0FBQXBGLDhHQUFBLGFBQWEsT0FBQTtBQUV0QiwrRkFBOEY7QUFBckYsb0hBQUEsZ0JBQWdCLE9BQUE7QUFFekIseUVBQXdFO0FBQS9ELGtIQUFBLGVBQWUsT0FBQTtBQUV4Qix1RkFBc0Y7QUFBN0UsZ0lBQUEsc0JBQXNCLE9BQUE7QUFFL0IseUZBQXdGO0FBQS9FLGtJQUFBLHVCQUF1QixPQUFBO0FBRWhDLHFGQUFvRjtBQUEzRSw4SEFBQSxxQkFBcUIsT0FBQTtBQUU5QixpRkFBZ0Y7QUFBdkUsMEhBQUEsbUJBQW1CLE9BQUE7QUFFNUIsdUZBQXNGO0FBQTdFLGdJQUFBLHNCQUFzQixPQUFBO0FBRS9CLHNHQUFxRztBQUE1RixvSUFBQSx3QkFBd0IsT0FBQTtBQUVqQyxvSEFBbUg7QUFBMUcsa0pBQUEsK0JBQStCLE9BQUE7QUFFeEMsNEdBQTJHO0FBQWxHLDBJQUFBLDJCQUEyQixPQUFBO0FBRXBDLHVHQUFzRztBQUE3RixnSkFBQSw4QkFBOEIsT0FBQTtBQUV2QyxpR0FBZ0c7QUFBdkYsMElBQUEsMkJBQTJCLE9BQUE7QUFFcEMsK0ZBQThGO0FBQXJGLHdJQUFBLDBCQUEwQixPQUFBO0FBRW5DLDZGQUE0RjtBQUFuRixzSUFBQSx5QkFBeUIsT0FBQSJ9