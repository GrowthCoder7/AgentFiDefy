🤖 AgentFi
A TEE-Powered, Privacy-Preserving Autonomous Asset Management Protocol
Abstract

AgentFi is a decentralized, non-custodial asset management protocol that enables autonomous financial agents to manage capital, execute trades, and optimize yield without requiring users to relinquish private key custody.

By combining ERC-6551 Token Bound Accounts, Trusted Execution Environments (TEE), and Fully Homomorphic Encryption (FHE), AgentFi introduces a new architectural paradigm for confidential, self-governing, and composable on-chain hedge fund primitives.

The protocol enforces a strict separation between capital ownership, intelligence execution, and decision privacy while maintaining deterministic on-chain settlement.

1. Introduction

Autonomous finance systems today face fundamental trust and security limitations:

Custodial risk from centralized trading bots

Strategy leakage due to transparent mempools

Front-running and MEV extraction

Inability to verify secure execution of proprietary logic

AgentFi addresses these challenges by introducing sovereign AI agents whose assets are owned by NFTs, whose intelligence executes inside secure hardware, and whose trade intents remain encrypted until execution.

2. Design Principles

AgentFi is built on the following principles:

Non-Custodial by Design
Assets are never controlled by EOAs or centralized operators.

Confidential Intelligence
Trading strategies and intents are hidden from validators and third parties.

Deterministic Settlement
All capital movements settle atomically on-chain.

Explainable Autonomy
AI decisions are auditable without revealing proprietary strategy alpha.

3. System Architecture

AgentFi consists of three tightly coupled layers, each responsible for a separate trust domain.

3.1 Execution Layer (Shardeum / Sepolia)

The execution layer manages asset custody and final settlement.

Responsibilities:

Deployment of ERC-6551 Token Bound Accounts (TBAs)

Atomic batch execution of trades

Final settlement of capital movements

Each AI agent is represented by an NFT that owns a unique TBA, forming a sovereign on-chain vault.

3.2 Privacy Layer (Inco Network – FHE)

The privacy layer acts as a confidential coordination and aggregation layer.

Properties:

Trade intents are encrypted client-side

Encrypted signals are aggregated without decryption

No participant gains access to individual strategy data

Fully Homomorphic Encryption ensures that intent data remains private throughout aggregation and coordination.

3.3 Intelligence Layer (Phala Trusted Execution Environment)

The intelligence layer hosts AI logic inside a hardware-secured enclave.

Capabilities:

Decryption of aggregated signals

Execution of proprietary quant strategies

Secure transaction signing

Only the TEE can access decrypted trade intents, enforcing strict confidentiality guarantees.

4. Core Workflow
Step 1: Agent Initialization

User mints an Agent NFT

A dedicated ERC-6551 vault is deployed

Capital is deposited into the NFT-owned account

Step 2: Market Analysis

The AI agent retrieves market data, sentiment indicators, and historical context

Analysis occurs entirely within the TEE

Step 3: Intent Shielding

Trade intent is encrypted using FHE

Ciphertext is submitted to the Inco Confidential Store

Step 4: Blind Aggregation

Multiple encrypted intents are aggregated

No plaintext is revealed on-chain

Step 5: Atomic Settlement

The TEE decrypts the final signal

The transaction is signed inside the enclave

Execution occurs atomically on the execution layer

5. AI Architecture
5.1 TEE-Isolated AI Engine

The AI engine runs as a dockerized Python service inside a Phala SGX enclave.

Characteristics:

No access to host OS

Enclave-restricted APIs

Deterministic execution guarantees

Internal endpoints:

POST /v1/analyze/intent
GET  /v1/memory/rag

5.2 Retrieval-Augmented Memory (RAG)

AgentFi uses a lightweight RAG system backed by IPFS.

Stored artifacts:

Historical trades

Market regimes

Decision embeddings

This enables adaptive decision-making without centralized data storage.

6. Explainability and Visualization

AgentFi provides a visual decision graph that represents the AI’s reasoning process.

Benefits:

Human-readable interpretation of decisions

Post-trade auditing

Governance and compliance tooling

Visualization does not expose proprietary weights or alpha-generating parameters.

7. Security Model
Threat	Mitigation
Private key leakage	Keys remain sealed inside TEE
Front-running	FHE-encrypted trade intents
Strategy theft	Blind encrypted aggregation
Malicious operators	Hardware-backed enclave isolation
Partial execution	Atomic transaction settlement
8. Gas and Yield Optimization

Idle capital is automatically deployed into yield-generating protocols

Trades are delayed during high gas volatility

Execution timing is optimized inside the TEE

9. Extensibility

AgentFi is designed as a modular and extensible protocol.

Planned extensions include:

Swappable AI personalities

Cross-shard arbitrage strategies

DAO-governed agent parameters

Zero-knowledge verification of enclave integrity

10. Roadmap

Personality marketplace for AI strategy modules

Cross-shard atomic arbitrage

Zero-knowledge TEE audits

DAO-controlled autonomous agents

11. Conclusion

AgentFi introduces a new model for autonomous on-chain asset management by separating capital ownership, intelligence execution, and decision privacy into independently verifiable layers.

This architecture enables trust-minimized, censorship-resistant, and front-run-proof financial agents capable of operating at scale.

License

This project is licensed under the MIT License.
See the LICENSE file for details.
