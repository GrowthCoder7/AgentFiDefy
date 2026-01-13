// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AccountRegistry.sol";
import "../src/AgentNFT.sol";
import "../src/AgentAccount.sol";
import "../src/AgentFactory.sol";

contract DeploySepolia is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AccountRegistry accReg = new AccountRegistry();
        AgentNFT nft = new AgentNFT();
        AgentAccount implementation = new AgentAccount();
        AgentFactory factory = new AgentFactory(
            address(accReg),
            address(nft),
            address(implementation)
        );

        nft.setFactory(address(factory));

        console.log("AgentNFT:", address(nft));
        console.log("AgentFactory:", address(factory));

        vm.stopBroadcast();
    }
}