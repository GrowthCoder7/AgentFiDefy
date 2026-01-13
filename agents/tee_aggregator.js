const { ethers } = require("ethers");
require("dotenv").config();

const CUMULATIVE_CONTRACT_ADDR = "0x73f1DdcCe38fD0D3ce14c313232Ba199202F8B5f";

async function startTEE() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const cumulativeContract = new ethers.Contract(
    CUMULATIVE_CONTRACT_ADDR,
    [
      "event IntentReceived(address indexed sender, uint256 amount, bytes ciphertext)",
    ],
    provider
  );

  console.log("🧠 TEE AGGREGATOR: POLLING MODE STARTING...");

  let lastCheckedBlock = await provider.getBlockNumber();
  console.log(`📡 Starting at Block: ${lastCheckedBlock}`);

  let batchQueue = [];

  // This loop runs every 5 seconds to check for new blocks
  setInterval(async () => {
    try {
      const currentBlock = await provider.getBlockNumber();

      if (currentBlock > lastCheckedBlock) {
        console.log(
          `🔍 Checking blocks ${lastCheckedBlock + 1} to ${currentBlock}...`
        );

        // We ask for logs in the new blocks found
        const logs = await cumulativeContract.queryFilter(
          "IntentReceived",
          lastCheckedBlock + 1,
          currentBlock
        );

        logs.forEach((log) => {
          console.log(`\n📥 NEW PAYLOAD FROM: ${log.args.sender}`);
          try {
            const decryptedData = JSON.parse(
              ethers.toUtf8String(log.args.ciphertext)
            );
            console.log(
              "🔓 DECRYPTED:",
              decryptedData.agent,
              "|",
              decryptedData.action
            );
            batchQueue.push(decryptedData);
          } catch (e) {
            console.log("❌ Received non-JSON or encrypted data.");
          }
        });

        if (batchQueue.length >= 3) {
          console.log("\n⚖️  BATCH READY (3/3). Processing...");
          batchQueue = [];
        }

        lastCheckedBlock = currentBlock;
      }
    } catch (error) {
      console.error(
        "☁️  RPC Polling Error (waiting for next block...):",
        error.message
      );
    }
  }, 5000); // Check every 5 seconds
}

startTEE();
