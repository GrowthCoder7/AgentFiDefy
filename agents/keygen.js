const { ethers } = require("ethers");

const wallet = ethers.Wallet.createRandom();
console.log("--- TEE KEYPAIR FOR SIMULATION ---");
console.log("TEE_PRIVATE_KEY (Put in Terminal 4 .env):", wallet.privateKey);
console.log("TEE_PUBLIC_KEY (Put in Terminals 1-3 script):", wallet.address);
