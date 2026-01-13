const { ethers } = require("ethers");
require("dotenv").config();

// CONFIGURATION FOR USER 2
const CONFIG = {
  name: "User Agent 2",
  walletAddr: "0x96be1184715f63b4a42c23E0772c8783993e9A1a", // From your deployment
  key: process.env.PRIVATE_KEY,
  token: "0x07F746d1bB3B99f43eEc8c865116901eDbDD1Ff2",
};

async function sendIntent() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(CONFIG.key, provider);

  const agentAccount = new ethers.Contract(
    CONFIG.walletAddr,
    [
      "function submitJob(address token, uint256 amount, bytes calldata ciphertext) external",
    ],
    signer
  );

  // Encrypted Strategy Logic
  const tradeLogic = {
    agent: CONFIG.name,
    action: "BUY",
    amount: "0.25 ETH",
    reason: "Moving Average Crossover", // Implementation detail hidden by INCO
    timestamp: Date.now(),
  };

  console.log(`🚀 ${CONFIG.name} initiating trade...`);
  const ciphertext = ethers.hexlify(
    ethers.toUtf8Bytes(JSON.stringify(tradeLogic))
  );

  try {
    // Sending 5 tokens as service fee
    const tx = await agentAccount.submitJob(
      CONFIG.token,
      ethers.parseEther("5"),
      ciphertext
    );
    console.log(`✅ Intent Sent by ${CONFIG.name}. TX: ${tx.hash}`);
  } catch (err) {
    console.error(`❌ ${CONFIG.name} Error:`, err.message);
  }
}

sendIntent();
