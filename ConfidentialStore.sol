// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

contract ConfidentialStore {
    address public teeManager; // The Phala TEE address
    euint8 private netSignal;   // The encrypted total
    uint256 public intentCount;

    constructor(address _teeManager) {
        teeManager = _teeManager;
        netSignal = TFHE.asEuint8(0);
        TFHE.allow(netSignal, address(this));
        TFHE.allow(netSignal, _teeManager);
    }

    // Agents call this to submit their encrypted choice (1 = Buy, 2 = Sell)
    function submitIntent(bytes calldata encryptedChoice, bytes calldata inputProof) public {
        euint8 choice = TFHE.asEuint8(encryptedChoice, inputProof);
        
        // FHE Addition: We add the choice to the net signal without decrypting it
        netSignal = TFHE.add(netSignal, choice);
        
        // We must 'allow' the TEE to read the new total
        TFHE.allow(netSignal, teeManager);
        
        intentCount++;
    }

    // The TEE calls this (off-chain) to get the handle for re-encryption
    function getNetSignalHandle() public view returns (euint8) {
        return netSignal;
    }

    function resetStore() public {
        require(msg.sender == teeManager, "Only TEE can reset");
        netSignal = TFHE.asEuint8(0);
        intentCount = 0;
    }
}