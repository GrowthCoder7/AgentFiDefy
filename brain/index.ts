import { ethers } from "ethers";
import { executeStrategy } from "./logic";
import { unlockSecretStrategy } from "./main";
import * as dotenv from "dotenv";

dotenv.config();

async function runBrain() {
    console.log("--- 🧠 AgentFi TEE Brain Initializing ---");

    // 1. Setup Sepolia Connection
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const brainWallet = new ethers.Wallet(process.env.BRAIN_PRIVATE_KEY!, provider);
    
    // 2. Unlock Secret (Inco)
    // We pass a dummy agent address for testing
    const agentAddress = "0x1234567890123456789012345678901234567890";
    const strategyId = await unlockSecretStrategy(agentAddress, brainWallet);
    
    const strategyMap: Record<number, string> = { 
        1: "DEGEN_MODE", 
        2: "STABLE_MODE" 
    };
    const activeStrategy = strategyMap[strategyId] || "IDLE";

    // 3. Execute DeFi Logic (logic.ts)
    console.log(`[TEE BRAIN] Executing for Agent: ${agentAddress}`);
    const result = await executeStrategy(agentAddress as `0x${string}`, activeStrategy);

    // 4. Output Result for Phala TEE Worker
    console.log("--- 📊 AI DECISION LOG ---");
    console.log(result.log);
    
    if (result.action !== "HOLD") {
        console.log(`[TEE BRAIN] ATTENTION: Sending transaction to Sepolia!`);
        console.log(`Target: ${result.targetContract}`);
        console.log(`Calldata: ${result.calldata.slice(0, 50)}...`);
    }
}

runBrain().catch((err) => {
    console.error("Fatal Brain Error:", err);
});