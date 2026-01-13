// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc6551/interfaces/IERC6551Account.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AgentAccount is IERC6551Account {
    address public cumulativeAgent; 

    receive() external payable {}

    function setAggregator(address _aggregator) external {
        require(msg.sender == owner(), "Only Owner");
        cumulativeAgent = _aggregator;
    }

    // FIXED: Renamed 'token' to 'paymentToken' to avoid conflict
    function submitJob(address paymentToken, uint256 amount, bytes calldata ciphertext) external {
        require(msg.sender == owner(), "Only Owner");
        require(cumulativeAgent != address(0), "Aggregator not set");
        
        // 1. Approve the Aggregator to take our tokens
        IERC20(paymentToken).approve(cumulativeAgent, amount);
        
        // 2. Call the Aggregator
        (bool success, ) = cumulativeAgent.call(
            abi.encodeWithSignature("submitIntent(uint256,bytes)", amount, ciphertext)
        );
        require(success, "Job Submission Failed");
    }

    function execute(address target, uint256 value, bytes calldata data) external payable returns (bytes memory) {
        require(msg.sender == owner(), "Unauthorized");
        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Execution failed");
        return result;
    }
    
    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = token();
        if (chainId != block.chainid) return address(0);
        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function token() public view returns (uint256, address, uint256) {
        bytes memory footer = new bytes(0x60);
        assembly { extcodecopy(address(), add(footer, 0x20), 0x2d, 0x60) }
        return abi.decode(footer, (uint256, address, uint256));
    }
    function state() external pure returns (uint256) { return 0; }
    function isValidSigner(address, bytes calldata) external pure returns (bytes4) { return 0x1626ba7e; }
}