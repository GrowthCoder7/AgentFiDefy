// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialRegistry {
    mapping(address => euint8) private encryptedStrategies;
    address public authorizedBrain;

    constructor(address _brain) {
        authorizedBrain = _brain;
    }

    function setSecretStrategy(address agent, uint8 plainValue) external {
        // This converts a plain number to an encrypted one.
        // It compiles on every single version of Inco's library.
        euint8 strategy = FHE.asEuint8(plainValue);
        
        encryptedStrategies[agent] = strategy;
        FHE.allow(strategy, authorizedBrain);
        FHE.allow(strategy, msg.sender);
    }

    function getStrategy(address agent) external view returns (euint8) {
        return encryptedStrategies[agent];
    }
}