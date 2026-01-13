const { ethers } = require("ethers");
require("dotenv").config();

// CONFIGURATION FOR USER 3
const CONFIG = {
  name: "User Agent 3",
  walletAddr: "0x651b22283da8077fCc39b6A3616734489D209138", // From your deployment
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
    action: "SELL",
    amount: "0.15 ETH",
    reason: "Overbought RSI Signal", // Implementation detail hidden by INCO
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
