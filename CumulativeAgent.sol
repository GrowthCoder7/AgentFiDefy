// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CumulativeAgent {
    address public brainTEE; // The Phala TEE address

    event TradeExecuted(string action, uint256 amount);

    constructor(address _brainTEE) {
        brainTEE = _brainTEE;
    }

    // Only the TEE can trigger this after it has decrypted the Inco result
    function executeBatch(uint8 signal, address[] calldata users) external {
    require(msg.sender == TEE_ADDRESS, "Unauthorized: Only the TEE can settle");
    
    for(uint i=0; i < users.length; i++) {
        // This pulls the funds from the TBAs
        // Note: TBAs must have called token.approve(address(this), amount) first!
        IERC20(usdc).transferFrom(users[i], address(this), 10 * 10**6);
    }
    
    emit ExecutionSuccess(signal, users.length);
}
}