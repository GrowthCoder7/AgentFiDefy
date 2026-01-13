// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CSPLToken.sol";
import "../src/CumulativeAgent.sol";
import "../src/AccountRegistry.sol";
import "../src/AgentNFT.sol";
import "../src/AgentAccount.sol";
import "../src/AgentFactory.sol";

contract DeployAgentFi is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the Fuel (CSPL Token)
        CSPLToken cspl = new CSPLToken();
        console.log("CSPL Token:", address(cspl));

        // 2. Deploy the Aggregator (Cumulative Agent)
        CumulativeAgent aggregator = new CumulativeAgent(address(cspl));
        console.log("Cumulative Agent:", address(aggregator));

        // 3. Deploy Infrastructure (Registry, NFT, Implementation)
        AccountRegistry registry = new AccountRegistry();
        AgentNFT nft = new AgentNFT();
        AgentAccount implementation = new AgentAccount();
        
        console.log("Registry:", address(registry));
        console.log("Agent NFT:", address(nft));
        console.log("Account Impl:", address(implementation));

        // 4. Deploy Factory
        AgentFactory factory = new AgentFactory(
            address(registry),
            address(nft),
            address(implementation)
        );
        console.log("Agent Factory:", address(factory));

        // 5. CRITICAL: Authorize Factory to Mint NFTs
        nft.setFactory(address(factory));
        console.log(">> Factory Authorized on NFT");

        vm.stopBroadcast();
    }
}