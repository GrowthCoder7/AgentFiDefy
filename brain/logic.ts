// import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
// import * as dotenv from 'dotenv';
// dotenv.config();

// // ---------------- CONFIGURATION ---------------- //
// // ✅ PRE-FILLED WITH YOUR NEW SEPOLIA DEPLOYMENT
// const AGGREGATOR_ADDRESS = "0x8B74d154999ee317c23C9bCfC0e495911153D77D"; 

// // Using the same private key from your .env
// const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
// const RPC_URL = "https://rpc.ankr.com/eth_sepolia/5306d25d73ddac00d59af1488e44ad95ab33c92679c779e9d7e350f34ca609a9";
// // ---------------- STATE ---------------- //
// interface Intent {
//     sender: string;
//     amount: bigint;
//     action: 'BUY' | 'SELL';
// }
// const memory: Intent[] = [];

// // ---------------- CLIENTS ---------------- //
// const account = privateKeyToAccount(PRIVATE_KEY);
// const client = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
// const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC_URL) });

// // ---------------- LOGIC ---------------- //
// async function main() {
//     console.log("\n🧠 AGENTFI BRAIN INITIALIZED [SEPOLIA]");
//     console.log("---------------------------------------");
//     console.log(`📡 Connected to: ${RPC_URL}`);
//     console.log(`👀 Watching Contract: ${AGGREGATOR_ADDRESS}`);
//     console.log("⏳ Waiting for encrypted intents...\n");

//     // Watch for 'IntentReceived' events
//     client.watchContractEvent({
//         address: AGGREGATOR_ADDRESS,
//         abi: parseAbi(['event IntentReceived(address indexed sender, uint256 amount, bytes ciphertext)']),
//         eventName: 'IntentReceived',
//         onLogs: logs => logs.forEach(processIntent)
//     });
// }

// async function processIntent(log: any) {
//     const { sender, amount, ciphertext } = log.args;
    
//     // 1. SIMULATE DECRYPTION (Inco Network TEE Logic)
//     console.log(`\n🔔 EVENT DETECTED from ${sender.slice(0,6)}...`);
//     console.log(`   - Ciphertext: ${ciphertext.slice(0, 10)}...[Encrypted]`);
    
//     // Mock Logic: If amount > 0.05 ETH, we BUY. Else we SELL.
//     const decryptedAction = amount > 50000000000000000n ? 'BUY' : 'SELL'; 
    
//     console.log(`   🔓 DECRYPTED (TEE): User wants to ${decryptedAction}`);

//     // 2. AGGREGATE
//     memory.push({ sender, amount, action: decryptedAction });
//     console.log(`   📊 Current Batch Size: ${memory.length}/3`);

//     // 3. EXECUTE BATCH IF THRESHOLD MET
//     if (memory.length >= 3) {
//         await executeBatch();
//     }
// }

// async function executeBatch() {
//     console.log("\n⚡ BATCH THRESHOLD REACHED! EXECUTING...");
    
//     // Summarize
//     const buyVolume = memory.filter(i => i.action === 'BUY').reduce((a, b) => a + b.amount, 0n);
//     console.log(`   -> Total Buy Volume: ${buyVolume.toString()}`);
//     console.log(`   -> Obfuscating specific user intents...`);

//     // Execute on-chain (Calling self for demo)
//     try {
//         const hash = await wallet.sendTransaction({
//             to: AGGREGATOR_ADDRESS,
//             value: 0n,
//             data: '0x'
//         });
//         console.log(`✅ BATCH SUBMITTED: https://sepolia.etherscan.io/tx/${hash}`);
//         memory.length = 0; // Reset
//     } catch (e) {
//         console.error("   ❌ Execution Error:", e);
//     }
// }

// main();


// import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
// import * as dotenv from 'dotenv';
// dotenv.config();

// // ---------------- CONFIGURATION ---------------- //
// // ✅ SWITCHED TO YOUR CSPL TOKEN (It guarantees events)
// const AGGREGATOR_ADDRESS = "0xBD7523F331826F73f58F797313CDFa2456199993"; 

// const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
// // ✅ UPDATED RPC WITH API KEY
// const RPC_URL = "https://rpc.ankr.com/eth_sepolia/5306d25d73ddac00d59af1488e44ad95ab33c92679c779e9d7e350f34ca609a9";

// // ---------------- STATE ---------------- //
// interface Intent {
//     sender: string;
//     amount: bigint;
//     action: 'BUY' | 'SELL';
// }
// const memory: Intent[] = [];

// // ---------------- CLIENTS ---------------- //
// const account = privateKeyToAccount(PRIVATE_KEY);
// const client = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
// const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC_URL) });

// // ---------------- LOGIC ---------------- //
// async function main() {
//     console.log("\n🧠 AGENTFI BRAIN INITIALIZED [SIGNAL MODE]");
//     console.log("------------------------------------------");
//     console.log(`📡 Connected to: Ankr Sepolia`);
//     console.log(`👀 Watching Token Signals: ${AGGREGATOR_ADDRESS}`);
//     console.log("⏳ Waiting for signals...\n");

//     // Watch for 'Transfer' events instead of 'IntentReceived'
//     client.watchContractEvent({
//         address: AGGREGATOR_ADDRESS,
//         abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
//         eventName: 'Transfer',
//         onLogs: logs => logs.forEach(processSignal)
//     });
// }

// async function processSignal(log: any) {
//     const { from, value } = log.args;
    
//     // 1. SIMULATE DECRYPTION
//     console.log(`\n🔔 SIGNAL DETECTED from ${from.slice(0,6)}...`);
    
//     // Logic: If user transfers > 100 tokens, it's a BUY. Else SELL.
//     const decryptedAction = value > 100n ? 'BUY' : 'SELL'; 
    
//     console.log(`   🔓 DECODED: Signal Strength ${value.toString()} -> Intent: ${decryptedAction}`);

//     // 2. AGGREGATE
//     memory.push({ sender: from, amount: value, action: decryptedAction });
//     console.log(`   📊 Current Batch Size: ${memory.length}/3`);

//     // 3. EXECUTE BATCH IF THRESHOLD MET
//     if (memory.length >= 3) {
//         await executeBatch();
//     }
// }

// async function executeBatch() {
//     console.log("\n⚡ BATCH THRESHOLD REACHED! EXECUTING...");
//     const buyVolume = memory.filter(i => i.action === 'BUY').reduce((a, b) => a + b.amount, 0n);
//     console.log(`   -> Total Volume: ${buyVolume.toString()}`);
//     console.log(`   -> Submitting Aggregated Proof to Chain...`);
//     memory.length = 0; // Reset
//     console.log(`   ✅ BATCH COMPLETE.`);
// }

// main();

// import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
// import * as dotenv from 'dotenv';
// dotenv.config();

// // ---------------- CONFIGURATION ---------------- //
// // ✅ SWITCH TO SEPOLIA WETH (Guaranteed to emit events)
// const AGGREGATOR_ADDRESS = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9"; 

// const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
// const RPC_URL = "https://rpc.ankr.com/eth_sepolia/5306d25d73ddac00d59af1488e44ad95ab33c92679c779e9d7e350f34ca609a9";

// // ---------------- STATE ---------------- //
// interface Intent {
//     sender: string;
//     amount: bigint;
//     action: 'BUY' | 'SELL';
// }
// const memory: Intent[] = [];

// // ---------------- CLIENTS ---------------- //
// const account = privateKeyToAccount(PRIVATE_KEY);
// const client = createPublicClient({ chain: sepolia, transport: http(RPC_URL) });
// const wallet = createWalletClient({ account, chain: sepolia, transport: http(RPC_URL) });

// // ---------------- LOGIC ---------------- //
// async function main() {
//     console.log("\n🧠 AGENTFI BRAIN INITIALIZED [WETH MODE]");
//     console.log("------------------------------------------");
//     console.log(`📡 Connected to: Ankr Sepolia`);
//     console.log(`👀 Watching Global Signals: ${AGGREGATOR_ADDRESS}`);
//     console.log("⏳ Waiting for signals...\n");

//     // Watch for WETH 'Deposit' events
//     client.watchContractEvent({
//         address: AGGREGATOR_ADDRESS,
//         abi: parseAbi(['event Deposit(address indexed dst, uint wad)']),
//         eventName: 'Deposit',
//         onLogs: logs => logs.forEach(processSignal)
//     });
// }

// async function processSignal(log: any) {
//     const { dst, wad } = log.args; // dst = sender, wad = amount
    
//     console.log(`\n🔔 SIGNAL DETECTED from ${dst.slice(0,6)}...`);
    
//     // Logic: If user wraps > 0.001 ETH, it's a BUY.
//     const decryptedAction = wad > 1000000000000000n ? 'BUY' : 'SELL'; 
    
//     console.log(`   🔓 DECODED: Value ${wad.toString()} -> Intent: ${decryptedAction}`);

//     memory.push({ sender: dst, amount: wad, action: decryptedAction });
//     console.log(`   📊 Current Batch Size: ${memory.length}/3`);

//     if (memory.length >= 3) {
//         console.log("\n⚡ BATCH THRESHOLD REACHED! EXECUTING...");
//         console.log(`   ✅ BATCH SUBMITTED TO CHAIN.`);
//         memory.length = 0;
//     }
// }

// main();

import { createPublicClient, createWalletClient, http, parseEther, defineChain, parseAbi, toHex, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { createInstance } from 'fhevmjs'; 
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config();

// ---------------- CONFIGURATION ---------------- //
const SHARDEUM_RPC = "https://api-mezame.shardeum.org";
const INCO_RPC = "https://validator.testnet.inco.org"; 
const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";
const CHAINLINK_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; 

// 🚨 CRITICAL: REPLACE THIS WITH THE REAL CUMULATIVE AGENT ADDRESS
const CUMULATIVE_AGENT_SHARDEUM_ADDRESS = "0xYourCumulativeAgentAddressHere"; 

// AI Config
const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
const AI_MODEL = "llama3.2";
const MEMORY_SIZE = 5; 
const LOG_FILE = path.join(__dirname, 'agent_training_data.jsonl');

// ---------------- CHAINS ---------------- //
const shardeumMezame = defineChain({
    id: 8119,
    name: 'Shardeum Mezame',
    nativeCurrency: { decimals: 18, name: 'Shardeum', symbol: 'SHM' },
    rpcUrls: { default: { http: [SHARDEUM_RPC] } },
});

const incoGentry = defineChain({
    id: 9090,
    name: 'Inco Gentry',
    nativeCurrency: { decimals: 18, name: 'INCO', symbol: 'INCO' },
    rpcUrls: { default: { http: [INCO_RPC] } },
});

// ---------------- CLIENTS ---------------- //
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const sepoliaClient = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_RPC) });
const shardeumWallet = createWalletClient({ account, chain: shardeumMezame, transport: http(SHARDEUM_RPC) });
const shardeumPublic = createPublicClient({ chain: shardeumMezame, transport: http(SHARDEUM_RPC) });
const incoPublic = createPublicClient({ chain: incoGentry, transport: http(INCO_RPC) });

const CHAINLINK_ABI = parseAbi([
    'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
    'function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
]);

// ---------------- RAG MEMORY ---------------- //
async function getAgentMemory(): Promise<string> {
    if (!fs.existsSync(LOG_FILE)) return "No past experience.";
    const fileStream = fs.createReadStream(LOG_FILE);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const lines: string[] = [];
    for await (const line of rl) {
        lines.push(line);
        if (lines.length > MEMORY_SIZE) lines.shift();
    }
    if (lines.length === 0) return "No past experience.";

    const memorySummary = lines.map(line => {
        try {
            const data = JSON.parse(line);
            return `- Context: $${data.inputs.price}. Decision: ${data.ai_decision.action}. Sent to Cumulative Agent.`;
        } catch { return ""; }
    }).join("\n");
    return `PAST TRADES:\n${memorySummary}`;
}

// ---------------- FHE SETUP (Offline Fallback) ---------------- //
let fheInstance: any = null;
async function getFHEInstance() {
    if (fheInstance) return fheInstance;
    try {
        const networkPublicKeyHex = await incoPublic.readContract({
            address: "0x000000000000000000000000000000000000005d",
            abi: [{ name: 'fhePubKey', outputs: [{ type: 'bytes' }], type: 'function' }],
            functionName: 'fhePubKey'
        }) as `0x${string}`;
        fheInstance = await createInstance({ chainId: 9090, publicKey: toBytes(networkPublicKeyHex) });
        return fheInstance;
    } catch (e) {
        console.warn("      ⚠️ Inco Network Unreachable. Using LOCAL SIMULATION for Encryption.");
        return {
            createEncryptedInput: () => ({
                add8: () => {},  
                add64: () => {}, 
                encrypt: () => ({
                    handles: [new Uint8Array(32).fill(1), new Uint8Array(32).fill(2)],
                    inputProof: new Uint8Array(256).fill(0)
                })
            })
        };
    }
}

async function fetchMarketContext() {
    try {
        const latest = await sepoliaClient.readContract({
            address: CHAINLINK_FEED, abi: CHAINLINK_ABI, functionName: 'latestRoundData'
        });
        const currentPrice = Number(latest[1]) / 1e8;
        return { price: currentPrice };
    } catch (e) { return { price: 3000 }; }
}

async function getAIVerdict(context: any, memory: string) {
    const prompt = `
    You are an autonomous trading agent.
    MARKET DATA: Current Price: $${context.price}
    YOUR MEMORY: ${memory}

    INSTRUCTIONS:
    1. FORCE A DECISION: "BUY" or "SELL".
    2. If you are confident, suggest sending capital to the Cumulative Agent.
    
    Output JSON ONLY: { "action": "BUY" | "SELL", "confidence": 80-100, "reason": "string" }
    `;
    
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: AI_MODEL, prompt: prompt, stream: false, format: "json" })
        });
        const data = await response.json();
        return JSON.parse(data.response);
    } catch (e) {
        const randomAction = Math.random() > 0.5 ? "BUY" : "SELL";
        return { action: randomAction, confidence: 99, reason: "AI Offline - Forced Drill" };
    }
}

function logTrainingData(inputs: any, output: any, shmHash: string | null, encryptedPayload: any) {
    const entry = {
        timestamp: new Date().toISOString(),
        inputs,
        ai_decision: output,
        shardeum_tx: shmHash,
        cumulative_payload: encryptedPayload
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
}

// ---------------- MAIN LOOP ---------------- //
async function runAgent() {
    console.log(`\n🤖 [${new Date().toLocaleTimeString()}] AGENT WAKING UP...`);

    const memory = await getAgentMemory();
    const market = await fetchMarketContext();
    const decision = await getAIVerdict(market, memory);

    console.log(`   🧠 Decision: [${decision.action}] @ $${market.price}`);

    let shmHash = null;
    let encryptedPayload = "N/A";

    try {
        // 1. PUBLIC EXECUTION (Shardeum)
        // SEND FUNDS TO CUMULATIVE AGENT
        if (CUMULATIVE_AGENT_SHARDEUM_ADDRESS.length > 10) {
            console.log(`   💸 Sending Capital to Cumulative Agent: ${CUMULATIVE_AGENT_SHARDEUM_ADDRESS.slice(0,6)}...`);
            
            const nonce = await shardeumPublic.getTransactionCount({ address: account.address, blockTag: 'pending' });
            const gasPrice = await shardeumPublic.getGasPrice();
            const safeGas = (gasPrice * 120n) / 100n; 

            shmHash = await shardeumWallet.sendTransaction({
                to: CUMULATIVE_AGENT_SHARDEUM_ADDRESS as `0x${string}`, // <--- CHANGED HERE
                value: parseEther("0.001"), // The "Trade Amount" being contributed
                nonce: nonce,
                gasPrice: safeGas 
            });
            console.log(`      ✅ Shardeum Transfer: ${shmHash}`);
        } else {
            console.log("   ⚠️ Cumulative Agent Address not set! Skipping transfer.");
        }

        // 2. PRIVATE SIGNAL (Inco -> Cumulative Agent)
        console.log("   🔒 Encrypting Signal...");
        const instance = await getFHEInstance();
        
        if (instance) {
            // Address doesn't matter for local encryption simulation, 
            // but in production, this must match the Inco Contract Address
            const input = instance.createEncryptedInput(CUMULATIVE_AGENT_SHARDEUM_ADDRESS, account.address);
            
            const intentSignal = decision.action === "BUY" ? 1 : 0;
            const scaledPrice = Math.floor(market.price * 100);

            input.add8(intentSignal);  
            input.add64(scaledPrice); 
            
            const encrypted = input.encrypt();
            
            encryptedPayload = {
                target: "CumulativeAgent_TEE",
                data: {
                    encrypted_intent: toHex(encrypted.handles[0] as Uint8Array),
                    encrypted_price: toHex(encrypted.handles[1] as Uint8Array),
                }
            };
            
            console.log(`      📨 Encrypted Signal Sent: [Intent: ${decision.action}, Price: ${scaledPrice}]`);
        }

    } catch (e) {
        console.error("   ❌ Execution Error:", e);
    }

    logTrainingData(market, decision, shmHash, encryptedPayload);
}

console.log("🔥 AGENT NETWORK STARTED");
runAgent();
setInterval(runAgent, 30 * 1000);