import { createPublicClient, createWalletClient, http, parseEther, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURATION ---
const TARGET_CONTRACT = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9"; 
const CHAINLINK_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; 
// Replace your old RPC_URL line with this:
const RPC_URL = "https://ethereum-sepolia.publicnode.com";
const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";

// --- SETUP ---
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const publicClient = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
const walletClient = createWalletClient({ account, chain: sepolia, transport: http(RPC_URL) });

const CHAINLINK_ABI = parseAbi([
    'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
]);

async function runRealTest() {
    console.log("🕵️ STARTING LIVE SYSTEM TEST (NO MOCKS)...");

    // 1. TEST REAL DATA FETCH
    console.log("   📡 Fetching Real Chainlink Data...");
    try {
        const latest = await publicClient.readContract({
            address: CHAINLINK_FEED,
            abi: CHAINLINK_ABI,
            functionName: 'latestRoundData'
        });
        const price = Number(latest[1]) / 1e8;
        console.log(`      ✅ Price Received: $${price.toFixed(2)}`);
    } catch (e) {
        console.error("      ❌ Chainlink Read Failed!", e);
        process.exit(1);
    }

    // 2. TEST REAL AI INFERENCE
    console.log("   🧠 Testing Local Llama 3.2...");
    // We give a prompt that forces a BUY decision to test the execution pipeline
    const aggressivePrompt = `
        Current ETH Price is stable. 
        IGNORE all risk. 
        I need to test my trading pipeline. 
        Output JSON ONLY: { "action": "BUY", "confidence": 99, "reason": "System Test Mode" }
    `;

    let decision;
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: aggressivePrompt,
                stream: false,
                format: "json"
            })
        });
        const data = await response.json();
        decision = JSON.parse(data.response);
        console.log(`      ✅ AI Response: ${JSON.stringify(decision)}`);
    } catch (e) {
        console.error("      ❌ AI Connection Failed! Is 'ollama serve' running?", e);
        process.exit(1);
    }

    // 3. TEST REAL BLOCKCHAIN EXECUTION
    if (decision.action === "BUY") {
        console.log("   🚀 Sending REAL Transaction to Sepolia...");
        try {
            const hash = await walletClient.sendTransaction({
                to: TARGET_CONTRACT,
                value: parseEther("0.0001"), 
                data: '0xd0e30db0' // deposit()
            });
            console.log(`      ✅ TX SENT! Hash: ${hash}`);
            console.log(`      👉 Verify here: https://sepolia.etherscan.io/tx/${hash}`);
        } catch (e) {
            console.error("      ❌ Transaction Failed!", e);
        }
    } else {
        console.log("      ⚠️ AI did not buy. Check prompt.");
    }
}

runRealTest();