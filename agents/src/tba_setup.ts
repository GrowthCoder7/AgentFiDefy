import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function setupAgents() {
    const config = JSON.parse(fs.readFileSync("./agents/deployment_summary.json", "utf8"));
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    const mainWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    // This is the Mock USDC or Test Token you are using on Sepolia
    const TOKEN_ADDRESS = "0xYourTestTokenAddress"; 
    const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];

    // The 3 Agent TBA addresses (generated from your ERC-6551 registry)
    const agentTBAs = [
        "0xAgentTBA_1",
        "0xAgentTBA_2",
        "0xAgentTBA_3"
    ];

    console.log("🛠️ Preparing Agent TBAs for Demo...");

    for (const tba of agentTBAs) {
        // In a real demo, the Agent (as the owner of the TBA) calls this.
        // For simulation, we assume the TBA has been authorized.
        const tokenContract = new ethers.Contract(TOKEN_ADDRESS, abi, mainWallet);
        
        console.log(` Granting Allowance: ${tba} -> CumulativeAgent`);
        // We simulate the TBA approving the CumulativeAgent contract to pull 10 tokens
        // In reality, you'd use the TBA's 'execute' function here.
        const tx = await tokenContract.approve(config.sepoliaAgent, ethers.parseUnits("10", 6));
        await tx.wait();
    }

    console.log("✅ All Agents Pre-Approved. Ready for Confidential Submission.");
}

setupAgents().catch(console.error);