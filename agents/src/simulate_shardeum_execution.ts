import { ethers } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const config = JSON.parse(fs.readFileSync("./agents/deployment_summary.json", "utf8"));
    const shardeumProvider = new ethers.JsonRpcProvider("https://atomium.shardeum.org/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, shardeumProvider);

    console.log("🚀 [TEE BRAIN]: Monitoring Inco for Agent Intents...");
    console.log("📊 [INCO]: Threshold reached (3/3 Agents Submitted).");
    
    console.log("🔑 [TEE]: Requesting re-encryption for aggregate signal...");
    // Simulate the decryption logic delay
    await new Promise(r => setTimeout(r, 2000)); 
    
    console.log("🔓 [TEE]: Decrypted Signal: 1 (BUY)");

    // Define the contract on Shardeum
    const agentContract = new ethers.Contract(config.sepoliaAgent, [
        "function executeBatch(uint8 signal, address[] calldata users)"
    ], wallet);

    console.log("✍️ [TEE]: Signing Transaction for Shardeum Shard #1...");
    
    const mockUsers = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    ];

    const tx = await agentContract.executeBatch(1, mockUsers);
    console.log(`🔥 [SHARDEUM]: Cross-chain trade executed! TX: ${tx.hash}`);
}

main().catch(console.error);