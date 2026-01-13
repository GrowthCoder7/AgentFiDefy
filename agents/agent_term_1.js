const { ethers } = require("ethers");
require("dotenv").config();

// CONFIGURATION FOR USER 1
const CONFIG = {
  name: "User Agent 1",
  walletAddr: "0xFbde5De77Ea71c905010EB6562b6479075948B9e", // From your deploy log
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

  // This is the "Implementation Detail" hidden by INCO/FHE
  const tradeLogic = {
    agent: CONFIG.name,
    action: "BUY",
    amount: "0.1 ETH",
    reason: "Social Hype Detected", // Implementation detail
    timestamp: Date.now(),
  };

  console.log(`🚀 ${CONFIG.name} initiating trade...`);
  const ciphertext = ethers.hexlify(
    ethers.toUtf8Bytes(JSON.stringify(tradeLogic))
  );

  try {
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
