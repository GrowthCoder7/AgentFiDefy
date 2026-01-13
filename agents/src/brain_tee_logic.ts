// Phala Phat Contract Logic (TypeScript)
import { ethers } from "ethers";

// Configuration for the two chains
const INCO_RPC = "https://validator.testnet.inco.org";
const SEPOLIA_RPC = process.env.SEPOLIA_RPC;

export default async function main() {
  // 1. Setup Providers
  const incoProvider = new ethers.JsonRpcProvider(INCO_RPC);
  const sepoliaProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

  // 2. The Cumulative Agent's TBA on Sepolia
  const cumulativeTBA = "0x73f1DdcCe38fD0D3ce14c313232Ba199202F8B5f";

  // 3. Logic: Fetch Encrypted Intents from Inco
  // The TEE checks the 'ConfidentialStore' contract on Inco
  const encryptedIntents = await fetchEncryptedIntents(incoProvider);

  if (encryptedIntents.length >= 3) {
    console.log("🔒 TEE: Threshold met. Requesting FHE Decryption from Inco...");

    // 4. Request Decryption
    // The TEE uses its identity to request the 'Net Result' of the FHE sum
    const netTradeSignal = await requestFHEDecryption(encryptedIntents);

    // 5. Execute on Sepolia
    // If netTradeSignal > 0 (Buy), < 0 (Sell)
    console.log(`🚀 TEE: Signing Sepolia Batch Transaction for ${netTradeSignal}`);
    
    await signAndSendSepoliaTx(netTradeSignal, cumulativeTBA, sepoliaProvider);
  }
}

// Helper: Signs the actual transaction using the TEE's hardware-bound key
async function signAndSendSepoliaTx(signal, tbaAddress, provider) {
  const wallet = new ethers.Wallet(process.env.TEE_PRIVATE_KEY, provider);
  const abi = ["function executeBatch(int256 netSignal) external"];
  const contract = new ethers.Contract(tbaAddress, abi, wallet);
  
  return await contract.executeBatch(signal);
}