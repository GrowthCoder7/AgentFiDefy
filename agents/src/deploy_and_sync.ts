import { ethers, ContractFactory } from "ethers";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    // --- 1. SETUP PROVIDERS & SIGNERS ---
    const incoProvider = new ethers.JsonRpcProvider("https://validator.testnet.inco.org");
    const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    
    // Ensure you have a PRIVATE_KEY in your .env
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);

    const incoSigner = wallet.connect(incoProvider);
    const sepoliaSigner = wallet.connect(sepoliaProvider);

    console.log("🚀 Starting AgentFi Master Deployment...");

    // --- 2. LOAD COMPILED ARTIFACTS ---
    // Make sure these paths point to your actual compiled JSON files (usually in /artifacts or /out)
    const storeArtifact = JSON.parse(fs.readFileSync("./artifacts/ConfidentialStore.json", "utf8"));
    const agentArtifact = JSON.parse(fs.readFileSync("./artifacts/CumulativeAgent.json", "utf8"));

    // --- 3. DEPLOY TO SEPOLIA (Execution Layer) ---
    const TEE_ADDRESS = process.env.TEE_PUBLIC_ADDRESS || wallet.address; 
    console.log(`📡 Deploying to Sepolia with TEE Address: ${TEE_ADDRESS}`);
    
    // V6 Fix: Use 'new ContractFactory'
    const AgentFactory = new ContractFactory(agentArtifact.abi, agentArtifact.bytecode, sepoliaSigner);
    const sepAgent = await AgentFactory.deploy(TEE_ADDRESS);
    await sepAgent.waitForDeployment();
    const sepAgentAddress = await sepAgent.getAddress();
    console.log(`✅ Sepolia Agent Deployed: ${sepAgentAddress}`);

    // --- 4. DEPLOY TO INCO (Privacy Layer) ---
    console.log(`📡 Deploying to Inco...`);
    const StoreFactory = new ContractFactory(storeArtifact.abi, storeArtifact.bytecode, incoSigner);
    const incoStore = await StoreFactory.deploy(TEE_ADDRESS);
    await incoStore.waitForDeployment();
    const incoStoreAddress = await incoStore.getAddress();
    console.log(`✅ Inco Store Deployed: ${incoStoreAddress}`);

    // --- 5. EXPORT CONFIG ---
    const config = {
        sepoliaAgent: sepAgentAddress,
        incoStore: incoStoreAddress,
        teeAddress: TEE_ADDRESS,
        network: "Testnets"
    };

    fs.writeFileSync("./agents/deployment_summary.json", JSON.stringify(config, null, 2));
    console.log("📂 deployment_summary.json created! Agents and TEE are now synced.");
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});