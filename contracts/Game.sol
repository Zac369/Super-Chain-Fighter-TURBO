// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Game is ERC721 {

    uint public tokenCounter;

    string private baseURI;

    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;        
        uint hp;
        uint attackDamage;
    }

    CharacterAttributes[] allCharacters;

    // Mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint => address) public nftHolders;
    mapping(address => uint[]) public ownerItems;


    constructor() ERC721("Super Chain Fighter TURBO", "SCFT") {
        tokenCounter = 0;
    }

    function mintCharacterNFT(uint _characterIndex) external {
        _safeMint(msg.sender, tokenCounter);
        ownerItems[msg.sender].push(tokenCounter);

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", tokenCounter + 1, _characterIndex);

        tokenCounter += 1;
    }

    // CHANGE ONCE TABLE IS SETUP
    // https://testnet.tableland.network/tables/{table_id}/id/.
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://testnet.tableland.network/tables/309/id/";
    }

    function getAllCharacters() public view returns (CharacterAttributes[] memory) {
        return allCharacters;
    }

    //allows changing metadata in the future
    //should be deployed as onlyOwner for production
    function setBaseURI(string memory BaseURI) public {
        baseURI = BaseURI;
    }

    function getUsersNFTs() public view returns (uint[] memory) {
        return ownerItems[msg.sender];
    }
}