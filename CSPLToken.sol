// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CSPLToken is ERC20 {
    constructor() ERC20("Cumulative Service PL", "CSPL") {
        // Mint 1 Million tokens to you (the deployer) so you can distribute them
        _mint(msg.sender, 1000000 * 10**18); 
    }
    
    // Public mint for Hackathon testing speed (anyone can get tokens)
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}