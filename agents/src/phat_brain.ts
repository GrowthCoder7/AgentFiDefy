import { ethers } from "ethers";

export default function main(input: string) {
  // Selector for "getNetSignalHandle()" is 0x76543b56
  const GET_SIGNAL_SELECTOR = "0x76543b56";
  const INCO_STORE = "0xYourIncoContractAddress";

  // 1. Request the 'Net Signal' handle from Inco
  const response = pink.httpRequest({
    url: "https://validator.testnet.inco.org",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{
        to: INCO_STORE,
        data: GET_SIGNAL_SELECTOR 
      }, "latest"]
    }),
    returnTextBody: true
  });

  if (response.statusCode !== 200) return "Error: Inco RPC down";

  // 2. Parse the result
  const respBody = JSON.parse(response.body as string);
  const signalHandle = respBody.result; // This is the encrypted handle (hex)

  // Demo Logic: Check if we have enough intents
  // In a real demo, you'd fetch 'intentCount' similarly
  const intentCount = 3; 
  
  if (intentCount >= 3) {
    const signal = 1; // Buy signal
    console.log("🔥 Threshold met! Signing Sepolia Transaction...");
    
    // Create the call for Sepolia's executeBatch(uint8)
    const iface = new ethers.Interface(["function executeBatch(uint8 signal)"]);
    const calldata = iface.encodeFunctionData("executeBatch", [signal]);

    return {
        target: "0xSepoliaCumulativeAgentAddress",
        data: calldata
    };
  }

  return "Waiting for agents...";
}