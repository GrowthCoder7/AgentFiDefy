import { ethers } from "ethers";
import { createInstance, initFhevm } from "fhevmjs"; 
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// 1. Load the synced deployment data
const config = JSON.parse(fs.readFileSync("./agents/deployment_summary.json", "utf8"));

const INCO_STORE_ABI = [
    "function submitIntent(bytes calldata encryptedChoice, bytes calldata inputProof) public"
];

async function submitToInco(signal: number) {
    console.log(`🤖 Agent starting submission with signal: ${signal}`);
    
    // 2. Initialize the FHEVM WASM runtime
    await initFhevm();

    const provider = new ethers.JsonRpcProvider("https://validator.testnet.inco.org");
    const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY!, provider);
    
    // 3. Fetch FHE Public Key
    const publicKey = await provider.call({ to: "0x000000000000000000000000000000000000005d" });

    // 4. Setup FHE Instance
    const instance = await createInstance({ 
        chainId: 9090, 
        publicKey: publicKey
    });

    console.log("🔐 Encrypting intent locally (Alpha leak prevention)...");

    // 5. Create Encrypted Input
    // Note: Use config.incoStore dynamically!
    const input = instance.createEncryptedInput(config.incoStore, wallet.address);
    input.add8(signal); 
    
    const { handles, inputProof } = await input.encrypt();

    // 6. Submit to the Inco Store
    const store = new ethers.Contract(config.incoStore, INCO_STORE_ABI, wallet);
    
    console.log("🛰️ Sending ciphertext to Inco Network...");
    const tx = await store.submitIntent(handles[0], inputProof);
    
    console.log(`⏳ Waiting for block confirmation...`);
    await tx.wait();
    
    console.log(`✅ SUCCESS! Intent hidden in TX: ${tx.hash}`);
}

// Demo helper: Accept signal from command line
const signalArg = parseInt(process.argv[2]) || 1;
submitToInco(signalArg).catch((err) => {
    console.error("❌ Submission failed. Check if Agent TBA has gas on Inco.");
});