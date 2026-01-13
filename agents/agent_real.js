const { ethers } = require("ethers");
// We use the Inco/Fhenix encryption library (standard for FHE-EVMs)
const { createInstance } = require("fhenixjs");

async function sendConfidentialIntent() {
  const provider = new ethers.JsonRpcProvider(
    "https://validator.testnet.inco.org"
  ); // Inco Testnet
  const signer = new ethers.Wallet(process.env.USER1_KEY, provider);

  // 1. Initialize the FHE Instance
  const instance = await createInstance({ provider });

  // 2. Encrypt the "Intent" (e.g., Buy Signal = 1, Sell = 2)
  // In FHE, we encrypt the input before it leaves the terminal
  const encryptedSignal = await instance.encrypt8(1); // '1' for BUY

  console.log("🔐 Signal encrypted via FHE...");

  const agentTBA = new ethers.Contract(AGENT_TBA_ADDRESS, ABI, signer);

  // 3. Submit to the Cumulative Agent via the TBA
  // The 'ciphertext' hides whether this is a Buy or Sell
  const tx = await agentTBA.submitJob(
    CSPL_TOKEN_ADDRESS,
    ethers.parseEther("10"),
    encryptedSignal // This is the Inco-wrapped data
  );

  console.log(`✅ Confidential Intent Sent: ${tx.hash}`);
}
