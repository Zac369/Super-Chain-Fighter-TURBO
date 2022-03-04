// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contract/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Game is ERC721 {

    uint public tokenCounter;

    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;        
        uint hp;
        uint attackDamage;
    }

    CharacterAttributes[] allCharacters;

    // Mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    constructor() ERC721("Super Chain Fighter TURBO", "SCFT") {

    }

    function mintCharacterNFT(uint _characterIndex) external {
        _safeMint(msg.sender, tokenCounter + 1);

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].hp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", tokenCounter + 1, _characterIndex);

        tokenCounter += 1;
    }

}