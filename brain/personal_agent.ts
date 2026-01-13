// import { createPublicClient, createWalletClient, http, parseEther, defineChain, parseAbi, toHex, toBytes } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
// import { createInstance } from 'fhevmjs'; // Encryption Library
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as path from 'path';

// dotenv.config();

// // ---------------- CONFIGURATION ---------------- //
// // 1. Blockchain Networks
// const SHARDEUM_RPC = "https://api-mezame.shardeum.org";
// const INCO_RPC = "https://validator.testnet.inco.org"; // Validator RPC for stability
// const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";

// // 2. Contracts
// const INCO_CONTRACT_ADDRESS = "0x..."; // <--- REPLACE WITH YOUR DEPLOYED INCO CONTRACT
// const CHAINLINK_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // ETH/USD (Sepolia)

// // 3. AI Config
// const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
// const AI_MODEL = "llama3.2";
// const HISTORY_LENGTH = 20;
// const LOG_FILE = path.join(__dirname, 'agent_training_data.jsonl');

// // ---------------- CHAIN DEFINITIONS ---------------- //
// const shardeumMezame = defineChain({
//     id: 8119,
//     name: 'Shardeum Mezame',
//     nativeCurrency: { decimals: 18, name: 'Shardeum', symbol: 'SHM' },
//     rpcUrls: { default: { http: [SHARDEUM_RPC] } },
// });

// const incoGentry = defineChain({
//     id: 9090,
//     name: 'Inco Gentry',
//     nativeCurrency: { decimals: 18, name: 'INCO', symbol: 'INCO' },
//     rpcUrls: { default: { http: [INCO_RPC] } },
// });

// // ---------------- CLIENT SETUP ---------------- //
// const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

// // 1. Data Client (Sepolia - For Reliability)
// const sepoliaClient = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_RPC) });

// // 2. Public Execution Clients (Shardeum)
// // We need BOTH Wallet (to send) and Public (to check nonce/status)
// const shardeumWallet = createWalletClient({ account, chain: shardeumMezame, transport: http(SHARDEUM_RPC) });
// const shardeumPublic = createPublicClient({ chain: shardeumMezame, transport: http(SHARDEUM_RPC) });

// // 3. Secret Execution Clients (Inco)
// const incoPublic = createPublicClient({ chain: incoGentry, transport: http(INCO_RPC) });
// const incoWallet = createWalletClient({ account, chain: incoGentry, transport: http(INCO_RPC) });

// // Minimal ABI for Chainlink
// const CHAINLINK_ABI = parseAbi([
//     'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
//     'function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
// ]);

// // ---------------- FHE SETUP ---------------- //
// let fheInstance: any = null;

// async function getFHEInstance() {
//     if (fheInstance) return fheInstance;
    
//     // 1. Fetch Inco Network Public Key (Returns a Hex String)
//     const networkPublicKeyHex = await incoPublic.readContract({
//         address: "0x000000000000000000000000000000000000005d",
//         abi: [{ name: 'fhePubKey', outputs: [{ type: 'bytes' }], type: 'function' }],
//         functionName: 'fhePubKey'
//     }) as `0x${string}`; // Tell TS it's a valid Hex string

//     // 2. Convert Hex String -> Uint8Array (Crucial Fix)
//     const networkPublicKey = toBytes(networkPublicKeyHex);

//     // 3. Create FHE instance with REQUIRED addresses
//     fheInstance = await createInstance({ 
//         chainId: 9090, 
//         publicKey: networkPublicKey,
//         kmsContractAddress: "0x9D4454B023096f34B160d6B654540c56A1Be9571",
//         aclContractAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633DAAA95"
//     });
//     return fheInstance;
// }

// // ---------------- MATH ENGINE (RETAINED) ---------------- //
// const MathEngine = {
//     calculateRSI: (prices: number[], period: number = 14): number => {
//         if (prices.length < period + 1) return 50;
//         let gains = 0, losses = 0;
//         for (let i = 1; i <= period; i++) {
//             const change = prices[i] - prices[i - 1];
//             if (change > 0) gains += change;
//             else losses += Math.abs(change);
//         }
//         const avgGain = gains / period;
//         const avgLoss = losses / period;
//         if (avgLoss === 0) return 100;
//         const rs = avgGain / avgLoss;
//         return 100 - (100 / (1 + rs));
//     },
//     calculateVolatility: (prices: number[]): number => {
//         if (prices.length === 0) return 0;
//         const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
//         const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
//         return Math.sqrt(variance);
//     },
//     calculateSharpe: (prices: number[], riskFreeRate: number = 0.02): number => {
//         const returns = prices.map((p, i) => i === 0 ? 0 : (p - prices[i-1]) / prices[i-1]).slice(1);
//         const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
//         const stdDev = MathEngine.calculateVolatility(returns);
//         if (stdDev === 0) return 0;
//         return (avgReturn - riskFreeRate) / stdDev;
//     }
// };

// // ---------------- CORE FUNCTIONS ---------------- //
// async function fetchMarketContext() {
//     try {
//         const latest = await sepoliaClient.readContract({
//             address: CHAINLINK_FEED, abi: CHAINLINK_ABI, functionName: 'latestRoundData'
//         });
//         const currentPrice = Number(latest[1]) / 1e8;
//         const currentRoundId = latest[0];

//         const historyPromises = [];
//         for (let i = 1; i < HISTORY_LENGTH; i++) {
//             historyPromises.push(sepoliaClient.readContract({
//                 address: CHAINLINK_FEED, abi: CHAINLINK_ABI, functionName: 'getRoundData', args: [currentRoundId - BigInt(i)]
//             }));
//         }
        
//         const historyResults = await Promise.all(historyPromises);
//         const prices = [...historyResults.map(h => Number(h[1]) / 1e8), currentPrice].reverse();
//         return { prices, currentPrice };
//     } catch (e) {
//         console.error("RPC Error:", e);
//         return { prices: [], currentPrice: 0 };
//     }
// }

// async function getAIVerdict(context: any) {
//     const prompt = `
//     You are an autonomous agent. Analyze this Ethereum market data:
//     - Current Price: $${context.price}
//     - RSI: ${context.rsi}
//     - Volatility: ${context.volatility}
    
//     Output JSON ONLY: { "action": "BUY" | "SELL" | "HOLD", "confidence": 0-100, "reason": "string" }
//     `;
//     try {
//         const response = await fetch(OLLAMA_ENDPOINT, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ model: AI_MODEL, prompt: prompt, stream: false, format: "json" })
//         });
//         const data = await response.json();
//         return JSON.parse(data.response);
//     } catch (e) {
//         console.error("AI Offline:", e);
//         return { action: "HOLD", reason: "AI Offline" };
//     }
// }

// function logTrainingData(inputs: any, output: any, publicHash: string | null, secretHash: string | null) {
//     const entry = {
//         timestamp: new Date().toISOString(),
//         inputs,
//         ai_decision: output,
//         shardeum_hash: publicHash,
//         inco_hash: secretHash
//     };
//     fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
// }

// // ---------------- MAIN LOOP ---------------- //
// async function runAgent() {
//     console.log(`\n🤖 [${new Date().toLocaleTimeString()}] AGENT WAKING UP...`);

//     // 1. Eyes: Get Data (Sepolia)
//     const { prices, currentPrice } = await fetchMarketContext();
//     if (prices.length === 0) return console.log("❌ Data fetch failed.");

//     // 2. Brain: Calculate & Decide
//     const rsi = MathEngine.calculateRSI(prices);
//     const volatility = MathEngine.calculateVolatility(prices);
//     const sharpe = MathEngine.calculateSharpe(prices);
    
//     console.log(`   📊 $${currentPrice} | RSI: ${rsi.toFixed(1)} | Vol: ${volatility.toFixed(4)}`);

//     const decision = await getAIVerdict({ price: currentPrice, rsi, volatility, sharpe });
//     console.log(`   🧠 Llama 3.2: [${decision.action}] (${decision.confidence}%) -> "${decision.reason}"`);

//     let shmHash = null;
//     let incoHash = null;

//     if (decision.action === "BUY" && decision.confidence > 70) {
//         try {
//             // 3. Mouth: Public Log (Shardeum)
//             console.log("   📢 Broadcasting to Shardeum...");
            
//             // --- A. GET NONCE ---
//             const nonce = await shardeumPublic.getTransactionCount({
//                 address: account.address,
//                 blockTag: 'pending' 
//             });

//             // --- B. GET DYNAMIC GAS PRICE ---
//             const gasPrice = await shardeumPublic.getGasPrice();
//             const safeGasPrice = (gasPrice * 110n) / 100n; // +10% Tip
//             console.log(`      ⛽ Network Price: ${Number(gasPrice)/1e9} Gwei | Paying: ${Number(safeGasPrice)/1e9} Gwei`);

//             // --- C. SEND LEGACY TRANSACTION ---
//             shmHash = await shardeumWallet.sendTransaction({
//                 to: account.address, 
//                 value: parseEther("0.001"),
//                 nonce: nonce,
//                 gasPrice: safeGasPrice // Using legacy gasPrice to prevent "Underpriced" errors
//             });
            
//             console.log(`      ⏳ Waiting for Shardeum confirmation...`);
//             await shardeumPublic.waitForTransactionReceipt({ hash: shmHash });
//             console.log(`      ✅ Shardeum TX Confirmed: https://explorer-mezame.shardeum.org/tx/${shmHash}`);

//             // 4. Hands: Secret Execution (Inco)
//             if (INCO_CONTRACT_ADDRESS !== "0x...") {
//                 console.log("   🔒 Encrypting Intent for Inco...");
//                 const instance = await getFHEInstance();

//                 const input = instance.createEncryptedInput(INCO_CONTRACT_ADDRESS, account.address);
//                 input.add128(100); 
//                 input.add8(1);
//                 const encrypted = input.encrypt();

//                 incoHash = await incoWallet.writeContract({
//                     address: INCO_CONTRACT_ADDRESS,
//                     abi: [{ 
//                         name: "receiveEncryptedSignal", 
//                         type: "function", 
//                         inputs: [{ type: "bytes" }, { type: "bytes" }, { type: "bytes" }], 
//                         outputs: [] 
//                     }],
//                     functionName: 'receiveEncryptedSignal',
//                     args: [
//                         toHex(encrypted.handles[0] as Uint8Array), // Cast to fix TS error
//                         toHex(encrypted.handles[1] as Uint8Array), 
//                         toHex(encrypted.inputProof as Uint8Array)
//                     ]
//                 });
//                 console.log(`      ✅ Inco Secret TX: https://explorer.testnet.inco.org/tx/${incoHash}`);
//             } else {
//                 console.log("      ⚠️ Inco Contract not configured.");
//             }
//         } catch (e) {
//             console.error("   ❌ Execution Failed:", e);
//         }
//     }

//     // 5. Memory
//     logTrainingData({ price: currentPrice, rsi, volatility }, decision, shmHash, incoHash);
// }

// // Start
// console.log("🔥 HYBRID AGENT STARTED (Sepolia Data -> Shardeum Public -> Inco Secret)");
// runAgent();
// setInterval(runAgent, 60 * 1000);

// import { createPublicClient, createWalletClient, http, parseEther, defineChain, parseAbi, toHex, toBytes } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { sepolia } from 'viem/chains';
// import { createInstance } from 'fhevmjs'; 
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as path from 'path';

// dotenv.config();

// // ---------------- CONFIGURATION ---------------- //
// const SHARDEUM_RPC = "https://api-mezame.shardeum.org";
// const INCO_RPC = "https://validator.testnet.inco.org"; 
// const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";
// const CHAINLINK_FEED = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; 

// // AI Config
// const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
// const AI_MODEL = "llama3.2";
// const HISTORY_LENGTH = 20;
// const LOG_FILE = path.join(__dirname, 'agent_training_data.jsonl');

// // ---------------- CHAINS ---------------- //
// const shardeumMezame = defineChain({
//     id: 8119,
//     name: 'Shardeum Mezame',
//     nativeCurrency: { decimals: 18, name: 'Shardeum', symbol: 'SHM' },
//     rpcUrls: { default: { http: [SHARDEUM_RPC] } },
// });

// const incoGentry = defineChain({
//     id: 9090,
//     name: 'Inco Gentry',
//     nativeCurrency: { decimals: 18, name: 'INCO', symbol: 'INCO' },
//     rpcUrls: { default: { http: [INCO_RPC] } },
// });

// // ---------------- CLIENTS ---------------- //
// const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
// const sepoliaClient = createPublicClient({ chain: sepolia, transport: http(SEPOLIA_RPC) });
// const shardeumWallet = createWalletClient({ account, chain: shardeumMezame, transport: http(SHARDEUM_RPC) });
// const shardeumPublic = createPublicClient({ chain: shardeumMezame, transport: http(SHARDEUM_RPC) });
// // We keep Inco Public to fetch the Encryption Key (Read-only, no gas needed)
// const incoPublic = createPublicClient({ chain: incoGentry, transport: http(INCO_RPC) });

// const CHAINLINK_ABI = parseAbi([
//     'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
//     'function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
// ]);

// // ---------------- FHE SETUP ---------------- //
// let fheInstance: any = null;

// async function getFHEInstance() {
//     if (fheInstance) return fheInstance;

//     try {
//         console.log("      🔌 Connecting to Inco Network...");
//         // 1. Try to fetch the real key
//         const networkPublicKeyHex = await incoPublic.readContract({
//             address: "0x000000000000000000000000000000000000005d",
//             abi: [{ name: 'fhePubKey', outputs: [{ type: 'bytes' }], type: 'function' }],
//             functionName: 'fhePubKey'
//         }) as `0x${string}`;

//         const networkPublicKey = toBytes(networkPublicKeyHex);
//         fheInstance = await createInstance({ 
//             chainId: 9090, 
//             publicKey: networkPublicKey,
//             kmsContractAddress: "0x9D4454B023096f34B160d6B654540c56A1Be9571",
//             aclContractAddress: "0x2Fb4341027eb1d2aD8B5D9708187df8633DAAA95"
//         });
//         return fheInstance;

//     } catch (e) {
//         console.warn("      ⚠️ Inco Network Unreachable. Switching to OFFLINE SIMULATION.");
        
//         // 2. Return a Mock Instance if network fails
//         // This allows the agent to "pretend" to encrypt so the flow completes
//         return {
//             createEncryptedInput: (contractAddress: string, userAddress: string) => ({
//                 add128: (value: any) => {},
//                 add8: (value: any) => {},
//                 encrypt: () => ({
//                     handles: [
//                         new Uint8Array(32).fill(1), // Dummy Handle 1
//                         new Uint8Array(32).fill(2)  // Dummy Handle 2
//                     ],
//                     inputProof: new Uint8Array(256).fill(0) // Dummy Proof
//                 })
//             })
//         };
//     }
// }

// // ---------------- MATH & AI ---------------- //
// const MathEngine = {
//     calculateRSI: (prices: number[], period: number = 14): number => {
//         if (prices.length < period + 1) return 50;
//         let gains = 0, losses = 0;
//         for (let i = 1; i <= period; i++) {
//             const change = prices[i] - prices[i - 1];
//             if (change > 0) gains += change;
//             else losses += Math.abs(change);
//         }
//         const avgGain = gains / period;
//         const avgLoss = losses / period;
//         if (avgLoss === 0) return 100;
//         const rs = avgGain / avgLoss;
//         return 100 - (100 / (1 + rs));
//     },
//     calculateVolatility: (prices: number[]): number => {
//         if (prices.length === 0) return 0;
//         const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
//         const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
//         return Math.sqrt(variance);
//     },
//     calculateSharpe: (prices: number[], riskFreeRate: number = 0.02): number => {
//         const returns = prices.map((p, i) => i === 0 ? 0 : (p - prices[i-1]) / prices[i-1]).slice(1);
//         const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
//         const stdDev = MathEngine.calculateVolatility(returns);
//         if (stdDev === 0) return 0;
//         return (avgReturn - riskFreeRate) / stdDev;
//     }
// };

// async function fetchMarketContext() {
//     try {
//         const latest = await sepoliaClient.readContract({
//             address: CHAINLINK_FEED, abi: CHAINLINK_ABI, functionName: 'latestRoundData'
//         });
//         const currentPrice = Number(latest[1]) / 1e8;
//         const currentRoundId = latest[0];

//         const historyPromises = [];
//         for (let i = 1; i < HISTORY_LENGTH; i++) {
//             historyPromises.push(sepoliaClient.readContract({
//                 address: CHAINLINK_FEED, abi: CHAINLINK_ABI, functionName: 'getRoundData', args: [currentRoundId - BigInt(i)]
//             }));
//         }
//         const historyResults = await Promise.all(historyPromises);
//         const prices = [...historyResults.map(h => Number(h[1]) / 1e8), currentPrice].reverse();
//         return { prices, currentPrice };
//     } catch (e) {
//         console.error("RPC Error:", e);
//         return { prices: [], currentPrice: 0 };
//     }
// }

// async function getAIVerdict(context: any) {
//     const prompt = `
//     You are an autonomous agent. Analyze this Ethereum market data:
//     - Current Price: $${context.price}
//     - RSI: ${context.rsi}
//     - Volatility: ${context.volatility}
    
//     Output JSON ONLY: { "action": "BUY" | "SELL" | "HOLD", "confidence": 0-100, "reason": "string" }
//     `;
//     try {
//         const response = await fetch(OLLAMA_ENDPOINT, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ model: AI_MODEL, prompt: prompt, stream: false, format: "json" })
//         });
//         const data = await response.json();
//         return JSON.parse(data.response);
//     } catch (e) {
//         console.error("AI Offline:", e);
//         return { action: "HOLD", reason: "AI Offline" };
//     }
// }

// function logTrainingData(inputs: any, output: any, publicHash: string | null, secretData: any) {
//     const entry = {
//         timestamp: new Date().toISOString(),
//         inputs,
//         ai_decision: output,
//         shardeum_hash: publicHash,
//         secret_encrypted_data: secretData // Storing the encrypted blob locally
//     };
//     fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
// }

// // ---------------- MAIN LOOP ---------------- //
// async function runAgent() {
//     console.log(`\n🤖 [${new Date().toLocaleTimeString()}] AGENT WAKING UP...`);

//     // 1. Eyes: Get Data
//     const { prices, currentPrice } = await fetchMarketContext();
//     if (prices.length === 0) return console.log("❌ Data fetch failed.");

//     // 2. Brain: Decide
//     const rsi = MathEngine.calculateRSI(prices);
//     const volatility = MathEngine.calculateVolatility(prices);
//     const sharpe = MathEngine.calculateSharpe(prices);
    
//     console.log(`   📊 $${currentPrice} | RSI: ${rsi.toFixed(1)} | Vol: ${volatility.toFixed(4)}`);

//     const decision = await getAIVerdict({ price: currentPrice, rsi, volatility, sharpe });
//     console.log(`   🧠 Llama 3.2: [${decision.action}] (${decision.confidence}%) -> "${decision.reason}"`);

//     let shmHash = null;
//     let encryptedData = "N/A";

//     if (decision.action === "BUY" && decision.confidence > 70) {
//         try {
//             // 3. Mouth: Public Execution (Shardeum)
//             console.log("   📢 Broadcasting to Shardeum...");
            
//             const nonce = await shardeumPublic.getTransactionCount({
//                 address: account.address,
//                 blockTag: 'pending' 
//             });

//             const gasPrice = await shardeumPublic.getGasPrice();
//             const safeGasPrice = (gasPrice * 110n) / 100n; 
//             console.log(`      ⛽ Gas: ${Number(safeGasPrice)/1e9} Gwei`);

//             shmHash = await shardeumWallet.sendTransaction({
//                 to: account.address, 
//                 value: parseEther("0.001"),
//                 nonce: nonce,
//                 gasPrice: safeGasPrice 
//             });
            
//             console.log(`      ⏳ Waiting for Shardeum...`);
//             await shardeumPublic.waitForTransactionReceipt({ hash: shmHash });
//             console.log(`      ✅ Shardeum TX: https://explorer-mezame.shardeum.org/tx/${shmHash}`);

//             // 4. Hands: Local Secret Encryption (Simulated Inco)
//             console.log("   🔒 Encrypting Data (Local Mode)...");
//             const instance = await getFHEInstance();
            
//             if (instance) {
//                 // We mock a contract address because createEncryptedInput requires one
//                 // Use a dummy address or the zero address for local testing
//                 const dummyAddress = "0x0000000000000000000000000000000000000000";
                
//                 const input = instance.createEncryptedInput(dummyAddress, account.address);
//                 input.add128(decision.confidence); // Encrypt Confidence Score
//                 input.add8(1); // Encrypt "Buy" Signal (1)
                
//                 const encrypted = input.encrypt();
                
//                 // Instead of sending to chain, we store the encrypted result
//                 encryptedData = {
//                     handle1: toHex(encrypted.handles[0] as Uint8Array),
//                     handle2: toHex(encrypted.handles[1] as Uint8Array),
//                     proof: toHex(encrypted.inputProof as Uint8Array)
//                 };
                
//                 console.log(`      ✅ Data Encrypted! (Saved to local logs)`);
//                 console.log(`      🔑 Handle: ${encryptedData.handle1.slice(0, 10)}...`);
//             } else {
//                 console.log("      ⚠️ Skipping encryption (Network Unreachable)");
//             }

//         } catch (e) {
//             console.error("   ❌ Execution Failed:", e);
//         }
//     }

//     // 5. Memory
//     logTrainingData({ price: currentPrice, rsi, volatility }, decision, shmHash, encryptedData);
// }

// console.log("🔥 HYBRID AGENT STARTED (Sepolia Data -> Shardeum Public -> Local Secret Encryption)");
// runAgent();
// setInterval(runAgent, 60 * 1000);

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

// AI Config
const OLLAMA_ENDPOINT = "http://127.0.0.1:11434/api/generate";
const AI_MODEL = "llama3.2";
const MEMORY_SIZE = 5; // RAG: Remember last 5 trades
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

// ---------------- RAG MEMORY (The "Brain") ---------------- //
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
            return `- Context: $${data.inputs.price}. Decision: ${data.ai_decision.action}. Outcome: Executed on Shardeum.`;
        } catch { return ""; }
    }).join("\n");

    return `PAST TRADES (Consult this before deciding):\n${memorySummary}`;
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
                add8: () => {},   // Intent
                add64: () => {},  // Price
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
    You are an autonomous trading agent participating in a CUMULATIVE AGENT DRILL.
    
    MARKET DATA:
    - Current Price: $${context.price}
    
    YOUR MEMORY (RAG):
    ${memory}

    INSTRUCTIONS:
    1. Analyze the price relative to your memory.
    2. FORCE A DECISION: You MUST output "BUY" or "SELL". "HOLD" is forbidden in this drill.
    3. If you bought last time and price is higher, SELL now to take profit.
    
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
    console.log(`\n🤖 [${new Date().toLocaleTimeString()}] AGENT WAKING UP (Cumulative Drill Mode)...`);

    const memory = await getAgentMemory();
    const market = await fetchMarketContext();
    const decision = await getAIVerdict(market, memory);

    console.log(`   🧠 RAG Memory: Analyzed ${memory.split('\n').length - 1} past trades.`);
    console.log(`   🧠 Decision: [${decision.action}] @ $${market.price} -> "${decision.reason}"`);

    let shmHash = null;
    let encryptedPayload = "N/A";

    try {
        // 1. PUBLIC EXECUTION (Shardeum)
        // We broadcast a small tx to prove liveness to the network
        const nonce = await shardeumPublic.getTransactionCount({ address: account.address, blockTag: 'pending' });
        const gasPrice = await shardeumPublic.getGasPrice();
        const safeGas = (gasPrice * 120n) / 100n; 

        shmHash = await shardeumWallet.sendTransaction({
            to: account.address, 
            value: parseEther("0.0001"),
            nonce: nonce,
            gasPrice: safeGas 
        });
        console.log(`      ✅ Shardeum Public TX: ${shmHash}`);

        // 2. PRIVATE SIGNAL (Inco -> Cumulative Agent)
        console.log("   🔒 Encrypting [Intent + Price] for Cumulative Agent...");
        const instance = await getFHEInstance();
        
        if (instance) {
            // Placeholder address for the Cumulative Agent's Contract
            const CUMULATIVE_AGENT_ADDRESS = "0x0000000000000000000000000000000000000000"; 
            
            const input = instance.createEncryptedInput(CUMULATIVE_AGENT_ADDRESS, account.address);
            
            // --- DATA PACKING ---
            // 1. Intent: 1 = BUY, 0 = SELL (euint8)
            const intentSignal = decision.action === "BUY" ? 1 : 0;
            
            // 2. Price: Scaled Integer (euint64)
            // e.g. 3050.25 -> 305025
            const scaledPrice = Math.floor(market.price * 100);

            input.add8(intentSignal);  
            input.add64(scaledPrice); 
            
            const encrypted = input.encrypt();
            
            // This payload mimics what would be sent to the Cumulative Agent contract
            encryptedPayload = {
                target: "CumulativeAgent_TEE",
                data: {
                    encrypted_intent_handle: toHex(encrypted.handles[0] as Uint8Array),
                    encrypted_price_handle: toHex(encrypted.handles[1] as Uint8Array),
                    proof: toHex(encrypted.inputProof as Uint8Array)
                }
            };
            
            console.log(`      📨 Payload Created: { Intent: ${decision.action}, Price: ${scaledPrice} }`);
            console.log(`      🚀 Sent to Cumulative Agent (Simulated)`);
        }

    } catch (e) {
        console.error("   ❌ Execution Error:", e);
    }

    logTrainingData(market, decision, shmHash, encryptedPayload);
}

// Start fast loop
console.log("🔥 CUMULATIVE AGENT PROTOCOL STARTED");
runAgent();
setInterval(runAgent, 30 * 1000);