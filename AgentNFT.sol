// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Added FOSS Access Control

contract AgentNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    address public factory;

    // Pass msg.sender to Ownable constructor so YOU are the initial owner
    constructor() ERC721("AgentFi Identity", "AGFI") Ownable(msg.sender) {}

    function setFactory(address _factory) external onlyOwner {
        // Now only you (or a future DAO/Owner) can change the authorized factory
        factory = _factory;
    }

    function mint(address to) external returns (uint256) {
        require(msg.sender == factory, "Only Factory");
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}