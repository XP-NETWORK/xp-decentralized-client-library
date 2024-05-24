/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from 'ethers';
import {
    DeployContractOptions,
    FactoryOptions,
    HardhatEthersHelpers as HardhatEthersHelpersBase,
} from '@nomicfoundation/hardhat-ethers/types';

import * as Contracts from '.';

declare module 'hardhat/types/runtime' {
    interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
        getContractFactory(
            name: 'Ownable',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.Ownable__factory>;
        getContractFactory(
            name: 'IERC1155Errors',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC1155Errors__factory>;
        getContractFactory(
            name: 'IERC20Errors',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC20Errors__factory>;
        getContractFactory(
            name: 'IERC721Errors',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC721Errors__factory>;
        getContractFactory(
            name: 'IERC2981',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC2981__factory>;
        getContractFactory(
            name: 'IERC4906',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC4906__factory>;
        getContractFactory(
            name: 'ERC2981',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC2981__factory>;
        getContractFactory(
            name: 'ERC1155',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC1155__factory>;
        getContractFactory(
            name: 'IERC1155MetadataURI',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC1155MetadataURI__factory>;
        getContractFactory(
            name: 'IERC1155',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC1155__factory>;
        getContractFactory(
            name: 'IERC1155Receiver',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC1155Receiver__factory>;
        getContractFactory(
            name: 'ERC1155Holder',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC1155Holder__factory>;
        getContractFactory(
            name: 'ERC20',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC20__factory>;
        getContractFactory(
            name: 'IERC20Metadata',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC20Metadata__factory>;
        getContractFactory(
            name: 'IERC20',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC20__factory>;
        getContractFactory(
            name: 'ERC721',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC721__factory>;
        getContractFactory(
            name: 'ERC721URIStorage',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC721URIStorage__factory>;
        getContractFactory(
            name: 'IERC721Metadata',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC721Metadata__factory>;
        getContractFactory(
            name: 'IERC721',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC721__factory>;
        getContractFactory(
            name: 'IERC721Receiver',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC721Receiver__factory>;
        getContractFactory(
            name: 'ERC721Holder',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC721Holder__factory>;
        getContractFactory(
            name: 'ECDSA',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ECDSA__factory>;
        getContractFactory(
            name: 'ERC165',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC165__factory>;
        getContractFactory(
            name: 'IERC165',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC165__factory>;
        getContractFactory(
            name: 'Math',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.Math__factory>;
        getContractFactory(
            name: 'Strings',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.Strings__factory>;
        getContractFactory(
            name: 'Bridge',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.Bridge__factory>;
        getContractFactory(
            name: 'BridgeStorage',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.BridgeStorage__factory>;
        getContractFactory(
            name: 'ERC1155Royalty',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC1155Royalty__factory>;
        getContractFactory(
            name: 'ERC20Staking',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC20Staking__factory>;
        getContractFactory(
            name: 'ERC20Token',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC20Token__factory>;
        getContractFactory(
            name: 'ERC721Royalty',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.ERC721Royalty__factory>;
        getContractFactory(
            name: 'IERC1155Royalty',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC1155Royalty__factory>;
        getContractFactory(
            name: 'IERC721Royalty',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.IERC721Royalty__factory>;
        getContractFactory(
            name: 'INFTCollectionDeployer',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.INFTCollectionDeployer__factory>;
        getContractFactory(
            name: 'INFTStorageDeployer',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.INFTStorageDeployer__factory>;
        getContractFactory(
            name: 'INFTStorageERC1155',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.INFTStorageERC1155__factory>;
        getContractFactory(
            name: 'INFTStorageERC721',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.INFTStorageERC721__factory>;
        getContractFactory(
            name: 'NFTCollectionDeployer',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.NFTCollectionDeployer__factory>;
        getContractFactory(
            name: 'NFTStorageDeployer',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.NFTStorageDeployer__factory>;
        getContractFactory(
            name: 'NFTStorageERC1155',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.NFTStorageERC1155__factory>;
        getContractFactory(
            name: 'NFTStorageERC721',
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<Contracts.NFTStorageERC721__factory>;

        getContractAt(
            name: 'Ownable',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.Ownable>;
        getContractAt(
            name: 'IERC1155Errors',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC1155Errors>;
        getContractAt(
            name: 'IERC20Errors',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC20Errors>;
        getContractAt(
            name: 'IERC721Errors',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC721Errors>;
        getContractAt(
            name: 'IERC2981',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC2981>;
        getContractAt(
            name: 'IERC4906',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC4906>;
        getContractAt(
            name: 'ERC2981',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC2981>;
        getContractAt(
            name: 'ERC1155',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC1155>;
        getContractAt(
            name: 'IERC1155MetadataURI',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC1155MetadataURI>;
        getContractAt(
            name: 'IERC1155',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC1155>;
        getContractAt(
            name: 'IERC1155Receiver',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC1155Receiver>;
        getContractAt(
            name: 'ERC1155Holder',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC1155Holder>;
        getContractAt(
            name: 'ERC20',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC20>;
        getContractAt(
            name: 'IERC20Metadata',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC20Metadata>;
        getContractAt(
            name: 'IERC20',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC20>;
        getContractAt(
            name: 'ERC721',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC721>;
        getContractAt(
            name: 'ERC721URIStorage',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC721URIStorage>;
        getContractAt(
            name: 'IERC721Metadata',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC721Metadata>;
        getContractAt(
            name: 'IERC721',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC721>;
        getContractAt(
            name: 'IERC721Receiver',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC721Receiver>;
        getContractAt(
            name: 'ERC721Holder',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC721Holder>;
        getContractAt(
            name: 'ECDSA',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ECDSA>;
        getContractAt(
            name: 'ERC165',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC165>;
        getContractAt(
            name: 'IERC165',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC165>;
        getContractAt(
            name: 'Math',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.Math>;
        getContractAt(
            name: 'Strings',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.Strings>;
        getContractAt(
            name: 'Bridge',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.Bridge>;
        getContractAt(
            name: 'BridgeStorage',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.BridgeStorage>;
        getContractAt(
            name: 'ERC1155Royalty',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC1155Royalty>;
        getContractAt(
            name: 'ERC20Staking',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC20Staking>;
        getContractAt(
            name: 'ERC20Token',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC20Token>;
        getContractAt(
            name: 'ERC721Royalty',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.ERC721Royalty>;
        getContractAt(
            name: 'IERC1155Royalty',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC1155Royalty>;
        getContractAt(
            name: 'IERC721Royalty',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.IERC721Royalty>;
        getContractAt(
            name: 'INFTCollectionDeployer',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.INFTCollectionDeployer>;
        getContractAt(
            name: 'INFTStorageDeployer',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.INFTStorageDeployer>;
        getContractAt(
            name: 'INFTStorageERC1155',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.INFTStorageERC1155>;
        getContractAt(
            name: 'INFTStorageERC721',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.INFTStorageERC721>;
        getContractAt(
            name: 'NFTCollectionDeployer',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.NFTCollectionDeployer>;
        getContractAt(
            name: 'NFTStorageDeployer',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.NFTStorageDeployer>;
        getContractAt(
            name: 'NFTStorageERC1155',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.NFTStorageERC1155>;
        getContractAt(
            name: 'NFTStorageERC721',
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<Contracts.NFTStorageERC721>;

        deployContract(
            name: 'Ownable',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Ownable>;
        deployContract(
            name: 'IERC1155Errors',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Errors>;
        deployContract(
            name: 'IERC20Errors',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20Errors>;
        deployContract(
            name: 'IERC721Errors',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Errors>;
        deployContract(
            name: 'IERC2981',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC2981>;
        deployContract(
            name: 'IERC4906',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC4906>;
        deployContract(
            name: 'ERC2981',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC2981>;
        deployContract(
            name: 'ERC1155',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155>;
        deployContract(
            name: 'IERC1155MetadataURI',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155MetadataURI>;
        deployContract(
            name: 'IERC1155',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155>;
        deployContract(
            name: 'IERC1155Receiver',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Receiver>;
        deployContract(
            name: 'ERC1155Holder',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155Holder>;
        deployContract(
            name: 'ERC20',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20>;
        deployContract(
            name: 'IERC20Metadata',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20Metadata>;
        deployContract(
            name: 'IERC20',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20>;
        deployContract(
            name: 'ERC721',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721>;
        deployContract(
            name: 'ERC721URIStorage',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721URIStorage>;
        deployContract(
            name: 'IERC721Metadata',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Metadata>;
        deployContract(
            name: 'IERC721',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721>;
        deployContract(
            name: 'IERC721Receiver',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Receiver>;
        deployContract(
            name: 'ERC721Holder',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721Holder>;
        deployContract(
            name: 'ECDSA',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ECDSA>;
        deployContract(
            name: 'ERC165',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC165>;
        deployContract(
            name: 'IERC165',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC165>;
        deployContract(
            name: 'Math',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Math>;
        deployContract(
            name: 'Strings',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Strings>;
        deployContract(
            name: 'Bridge',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Bridge>;
        deployContract(
            name: 'BridgeStorage',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.BridgeStorage>;
        deployContract(
            name: 'ERC1155Royalty',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155Royalty>;
        deployContract(
            name: 'ERC20Staking',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20Staking>;
        deployContract(
            name: 'ERC20Token',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20Token>;
        deployContract(
            name: 'ERC721Royalty',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721Royalty>;
        deployContract(
            name: 'IERC1155Royalty',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Royalty>;
        deployContract(
            name: 'IERC721Royalty',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Royalty>;
        deployContract(
            name: 'INFTCollectionDeployer',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTCollectionDeployer>;
        deployContract(
            name: 'INFTStorageDeployer',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageDeployer>;
        deployContract(
            name: 'INFTStorageERC1155',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageERC1155>;
        deployContract(
            name: 'INFTStorageERC721',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageERC721>;
        deployContract(
            name: 'NFTCollectionDeployer',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTCollectionDeployer>;
        deployContract(
            name: 'NFTStorageDeployer',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageDeployer>;
        deployContract(
            name: 'NFTStorageERC1155',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageERC1155>;
        deployContract(
            name: 'NFTStorageERC721',
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageERC721>;

        deployContract(
            name: 'Ownable',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Ownable>;
        deployContract(
            name: 'IERC1155Errors',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Errors>;
        deployContract(
            name: 'IERC20Errors',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20Errors>;
        deployContract(
            name: 'IERC721Errors',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Errors>;
        deployContract(
            name: 'IERC2981',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC2981>;
        deployContract(
            name: 'IERC4906',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC4906>;
        deployContract(
            name: 'ERC2981',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC2981>;
        deployContract(
            name: 'ERC1155',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155>;
        deployContract(
            name: 'IERC1155MetadataURI',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155MetadataURI>;
        deployContract(
            name: 'IERC1155',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155>;
        deployContract(
            name: 'IERC1155Receiver',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Receiver>;
        deployContract(
            name: 'ERC1155Holder',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155Holder>;
        deployContract(
            name: 'ERC20',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20>;
        deployContract(
            name: 'IERC20Metadata',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20Metadata>;
        deployContract(
            name: 'IERC20',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC20>;
        deployContract(
            name: 'ERC721',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721>;
        deployContract(
            name: 'ERC721URIStorage',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721URIStorage>;
        deployContract(
            name: 'IERC721Metadata',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Metadata>;
        deployContract(
            name: 'IERC721',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721>;
        deployContract(
            name: 'IERC721Receiver',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Receiver>;
        deployContract(
            name: 'ERC721Holder',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721Holder>;
        deployContract(
            name: 'ECDSA',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ECDSA>;
        deployContract(
            name: 'ERC165',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC165>;
        deployContract(
            name: 'IERC165',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC165>;
        deployContract(
            name: 'Math',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Math>;
        deployContract(
            name: 'Strings',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Strings>;
        deployContract(
            name: 'Bridge',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.Bridge>;
        deployContract(
            name: 'BridgeStorage',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.BridgeStorage>;
        deployContract(
            name: 'ERC1155Royalty',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC1155Royalty>;
        deployContract(
            name: 'ERC20Staking',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20Staking>;
        deployContract(
            name: 'ERC20Token',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC20Token>;
        deployContract(
            name: 'ERC721Royalty',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.ERC721Royalty>;
        deployContract(
            name: 'IERC1155Royalty',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC1155Royalty>;
        deployContract(
            name: 'IERC721Royalty',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.IERC721Royalty>;
        deployContract(
            name: 'INFTCollectionDeployer',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTCollectionDeployer>;
        deployContract(
            name: 'INFTStorageDeployer',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageDeployer>;
        deployContract(
            name: 'INFTStorageERC1155',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageERC1155>;
        deployContract(
            name: 'INFTStorageERC721',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.INFTStorageERC721>;
        deployContract(
            name: 'NFTCollectionDeployer',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTCollectionDeployer>;
        deployContract(
            name: 'NFTStorageDeployer',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageDeployer>;
        deployContract(
            name: 'NFTStorageERC1155',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageERC1155>;
        deployContract(
            name: 'NFTStorageERC721',
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<Contracts.NFTStorageERC721>;

        // default types
        getContractFactory(
            name: string,
            signerOrOptions?: ethers.Signer | FactoryOptions,
        ): Promise<ethers.ContractFactory>;
        getContractFactory(
            abi: any[],
            bytecode: ethers.BytesLike,
            signer?: ethers.Signer,
        ): Promise<ethers.ContractFactory>;
        getContractAt(
            nameOrAbi: string | any[],
            address: string | ethers.Addressable,
            signer?: ethers.Signer,
        ): Promise<ethers.Contract>;
        deployContract(
            name: string,
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<ethers.Contract>;
        deployContract(
            name: string,
            args: any[],
            signerOrOptions?: ethers.Signer | DeployContractOptions,
        ): Promise<ethers.Contract>;
    }
}