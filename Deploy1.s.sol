// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AccountRegistry.sol";
import "../src/AgentAccount.sol";
import "../src/AgentFactory.sol";
import "../src/AgentNFT.sol";
import "../src/CSPLToken.sol";
import "../src/CumulativeAgent.sol";

contract DeployAgentFi is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Core Infrastructure
        CSPLToken token = new CSPLToken(); // Minted 1M to deployer
        AccountRegistry registry = new AccountRegistry();
        AgentAccount implementation = new AgentAccount(); // The logic contract
        AgentNFT nft = new AgentNFT(); // Deployer owns it initially to set factory
        
        // 2. Deploy Factory & Cumulative Agent
        AgentFactory factory = new AgentFactory(
            address(registry), 
            address(nft), 
            address(implementation)
        );
        
        CumulativeAgent cumulative = new CumulativeAgent(address(token));

        // 3. Wiring: Connect NFT to Factory
        nft.setFactory(address(factory));

        // 4. Create 3 Personal Agents
        // We track them to fund them later
        address[] memory personalAgents = new address[](3);
        
        for(uint i = 0; i < 3; i++) {
            // Factory creates NFT + Account
            (address wallet, ) = factory.createAgent();
            personalAgents[i] = wallet;
            console.log("Personal Agent", i, "deployed at:", wallet);
        }

        // 5. Setup & Funding Loop
        for(uint i = 0; i < 3; i++) {
            address agentWallet = personalAgents[i];

            // A. Fund Agent with CSPL (so they can pay the Cumulative Agent)
            token.transfer(agentWallet, 1000 * 10**18);

            // B. Configure the Agent
            // Since 'deployer' owns the NFT, 'deployer' is the 'owner' of the AgentAccount.
            // We can call administrative functions on the AgentAccount directly.
            AgentAccount(payable(agentWallet)).setAggregator(address(cumulative));
            
            console.log("Agent", i, "Funded and Linked to Cumulative Agent");
        }

        // 6. Set the Brain (TEE) on the Cumulative Agent
        // For now, we set it to the deployer for testing, or a known TEE address
        cumulative.setBrain(deployer); 

        vm.stopBroadcast();

        console.log("--- Deployment Complete ---");
        console.log("Token:", address(token));
        console.log("Factory:", address(factory));
        console.log("Cumulative Agent:", address(cumulative));
    }
}