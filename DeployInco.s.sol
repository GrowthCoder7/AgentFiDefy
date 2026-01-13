// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AccountRegistry.sol";
import "../src/AgentAccount.sol";
import "../src/AgentFactory.sol";
import "../src/AgentNFT.sol";
import "../src/CSPLToken.sol";
import "../src/CumulativeAgent.sol";

contract DeployNetwork is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // --- 1. DEPLOY INFRASTRUCTURE ---
        CSPLToken cspl = new CSPLToken();
        console.log("CSPL Token:", address(cspl));

        AccountRegistry registry = new AccountRegistry();
        console.log("Registry:", address(registry));

        AgentNFT nft = new AgentNFT();
        console.log("Agent NFT:", address(nft));

        AgentAccount implementation = new AgentAccount();
        console.log("TBA Implementation:", address(implementation));

        AgentFactory factory = new AgentFactory(
            address(registry), 
            address(nft), 
            address(implementation)
        );
        console.log("Agent Factory:", address(factory));

        CumulativeAgent cumulative = new CumulativeAgent(address(cspl));
        console.log("Cumulative Agent (Aggregator):", address(cumulative));

        // --- 2. SETUP PERMISSIONS ---
        // Give Factory the right to mint NFTs
        nft.transferOwnership(address(factory));
        console.log(">> Ownership of NFT transferred to Factory");

        // --- 3. SWARM GENERATION (Create 5 Agents) ---
        for (uint i = 1; i <= 5; i++) {
            // A. Create the Agent (Mint NFT + Deploy Wallet)
            (address wallet, uint256 tokenId) = factory.createAgent();
            
            // B. Configure the new Wallet (TBA)
            // We must cast the wallet address to the AgentAccount interface
            AgentAccount tba = AgentAccount(payable(wallet));
            
            // Point the TBA to the Cumulative Agent so it knows where to send jobs
            tba.setAggregator(address(cumulative));

            // C. Fund the TBA (Optional: Send some Gas or CSPL for testing)
            // (Simulating funding by minting CSPL to the TBA)
            cspl.mint(wallet, 100 * 10**18);

            console.log("-------------------------------------------");
            console.log("Agent ID:", tokenId);
            console.log("   Address:", wallet);
            console.log("   Setup: Linked to Aggregator & Funded");
        }

        vm.stopBroadcast();
    }
}