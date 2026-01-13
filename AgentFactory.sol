// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccountRegistry.sol";
import "./AgentNFT.sol";

contract AgentFactory {
    AccountRegistry public accountRegistry;
    AgentNFT public agentNFT;
    address public implementation;

    event AgentCreated(address indexed owner, address indexed wallet, uint256 tokenId);

    // REMOVED: ProtocolRegistry from constructor arguments
    constructor(
        address _accountRegistry, 
        address _agentNFT, 
        address _implementation
    ) {
        accountRegistry = AccountRegistry(_accountRegistry);
        agentNFT = AgentNFT(_agentNFT);
        implementation = _implementation;
    }

    function createAgent() external returns (address wallet, uint256 tokenId) {
        // 1. Mint the NFT Identity
        tokenId = agentNFT.mint(msg.sender);

        // 2. Deploy the Smart Account (Wallet)
        // salt = tokenId ensures 1-to-1 mapping
        wallet = accountRegistry.createAccount(
            implementation,
            block.chainid,
            address(agentNFT),
            tokenId,
            tokenId, 
            ""
        );

        emit AgentCreated(msg.sender, wallet, tokenId);
    }
}