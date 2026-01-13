// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AccountRegistry.sol";
import "../src/AgentNFT.sol";
import "../src/AgentAccount.sol";
import "../src/AgentFactory.sol";
import { FHE } from "@fhevm/solidity/lib/FHE.sol";
import { euint8 } from "encrypted-types/EncryptedTypes.sol"; // REMOVED inEuint8

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the Core Components
        AccountRegistry accReg = new AccountRegistry();
        // ProtocolRegistry removed because file was deleted
        AgentNFT nft = new AgentNFT();
        AgentAccount implementation = new AgentAccount();

        // 2. Deploy the Factory (Wiring everything together)
        AgentFactory factory = new AgentFactory(
            address(accReg),
            address(nft),
            address(implementation)
        );

        // 3. Authorize the Factory to mint NFTs
        nft.setFactory(address(factory));

        // 4. Log the addresses for our Frontend/TEE
        console.log("------------------------------------------------");
        console.log("Deployment Successful!");
        console.log("------------------------------------------------");
        console.log("AccountRegistry: ", address(accReg));
        console.log("ProtocolRegistry: (Deleted)");
        console.log("AgentNFT:         ", address(nft));
        console.log("AgentImplementation:", address(implementation));
        console.log("AgentFactory:     ", address(factory));
        console.log("------------------------------------------------");

        vm.stopBroadcast();
    }
}