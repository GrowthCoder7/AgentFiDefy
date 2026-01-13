// import { createInstance } from "fhevmjs";
// import { ethers } from "ethers";

// // Inco Rivest Testnet Config
// const INCO_CONFIG = {
//   chainId: 9090, // Rivest Chain ID
//   networkUrl: "https://validator.rivest.inco.org",
//   gatewayUrl: "https://gateway.rivest.inco.org",
//   kmsContractAddress: "0x408a28795A48F9AF28b74686411E267D78816A99",
//   aclContractAddress: "0xAc9d4F25f20667c4E6D29A26241a7dAc60682971"
// };

// async function unlockSecretStrategy(agentAddress: string, brainWallet: ethers.Wallet) {
//   // 1. Initialize FHEVM Instance
//   const fhevm = await createInstance(INCO_CONFIG);

//   // 2. Generate Ephemeral Keypair (Inside TEE)
//   const { publicKey, privateKey } = fhevm.generateKeypair();

//   // 3. Create EIP-712 Signature for Authorization
//   // This proves to the Gateway that the Brain is authorized by the contract
//   const eip712 = fhevm.createEIP712(publicKey, "YOUR_CONFIDENTIAL_REGISTRY_ADDRESS");
  
//   // The TEE signs the request with its authorized address
//   const signature = await brainWallet.signTypedData(
//     eip712.domain,
//     { Reauthenticate: eip712.types.Reauthenticate },
//     eip712.message
//   );

//   // 4. Fetch the Encrypted Handle from your Solidity Registry
//   // (Assuming you've called the contract to get the bytes32 handle)
//   const encryptedHandle = "0x..."; 
//   const handleBigInt = BigInt(encryptedHandle);
//   // 5. THE HANDSHAKE: Request Re-encryption from Inco Gateway
//   const decryptedResult = await fhevm.reencrypt(
//     handleBigInt,
//     privateKey,
//     publicKey,
//     signature,
//     "YOUR_CONFIDENTIAL_REGISTRY_ADDRESS",
//     brainWallet.address
//   );

//   return decryptedResult; // Returns the plaintext: e.g., 1 for DEGEN_MODE
// }

import { createInstance, FhevmInstance } from "fhevmjs";
import { ethers } from "ethers";

const INCO_CONFIG = {
  chainId: 9090,
  networkUrl: "https://validator.rivest.inco.org",
  gatewayUrl: "https://gateway.rivest.inco.org",
  kmsContractAddress: "0x408a28795A48F9AF28b74686411E267D78816A99",
  aclContractAddress: "0xAc9d4F25f20667c4E6D29A26241a7dAc60682971"
};

export async function unlockSecretStrategy(agentAddress: string, brainWallet: ethers.Wallet) {
  // --- MOCK BYPASS: Use this if Inco is not yet deployed ---
  if (!process.env.REGISTRY_ADDRESS || process.env.REGISTRY_ADDRESS.includes("YOUR_")) {
      console.log("[TEE BRAIN] Using MOCK strategy (DEGEN_MODE) for testing.");
      return 1; 
  }

  try {
    const fhevm = await createInstance(INCO_CONFIG);
    const { publicKey, privateKey } = fhevm.generateKeypair();

    // Create EIP-712 structured data for Inco Gateway
    const eip712 = fhevm.createEIP712(publicKey, process.env.REGISTRY_ADDRESS);
    
    // Ethers v6 signTypedData syntax
    const signature = await brainWallet.signTypedData(
      eip712.domain,
      { Reauthenticate: eip712.types.Reauthenticate },
      eip712.message
    );

    // Fetch encrypted handle (placeholder - in production this comes from contract call)
    const encryptedHandle = "0x01"; // Replace with real handle bytes from Registry
    
    const decryptedResult = await fhevm.reencrypt(
      BigInt(encryptedHandle),
      privateKey,
      publicKey,
      signature,
      process.env.REGISTRY_ADDRESS,
      brainWallet.address
    );

    return Number(decryptedResult);
  } catch (error) {
    console.error("[TEE BRAIN] FHE Handshake failed, defaulting to STABLE_MODE.");
    return 2; 
  }
}