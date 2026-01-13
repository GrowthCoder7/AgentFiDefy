🤖 AgentFi
A TEE-Powered, Privacy-Preserving Autonomous Asset Management Protocol
Abstract

AgentFi is a decentralized, non-custodial asset management protocol designed to enable autonomous financial agents capable of managing capital, executing trades, and optimizing yield without requiring users to relinquish private key custody. By integrating ERC-6551 Token Bound Accounts, Trusted Execution Environments (TEE), and Fully Homomorphic Encryption (FHE), AgentFi establishes a new design paradigm for confidential, self-governing on-chain hedge fund primitives.

The protocol ensures that capital ownership, intelligence execution, and decision privacy are strictly separated, eliminating single points of trust while preserving performance and composability.

1. Introduction

Autonomous finance promises scalable capital allocation without human intervention. However, existing approaches suffer from critical limitations:

Custodial risk from centralized bots

Strategy leakage through transparent mempools

Front-running and MEV extraction

Inability to prove secure execution of proprietary logic

AgentFi addresses these challenges by introducing sovereign AI agents whose capital is owned by NFTs, whose intelligence runs inside secure hardware, and whose decisions remain encrypted until the moment of execution.

2. Design Principles

AgentFi is built upon the following core principles:

Non-Custodial by Construction
Users never transfer control of assets to EOAs or centralized services.

Confidential Intelligence
Trading strategies and intents are hidden from validators, sequencers, and bots.

Deterministic Execution
All capital movements settle atomically on-chain.

Explainable Autonomy
AI decisions are observable and auditable without leaking alpha.

3. System Architecture

AgentFi operates across three tightly-coupled layers, each responsible for a distinct trust domain.

3.1 Execution Layer — Shardeum / Sepolia

The execution layer hosts all state-changing operations and asset custody.

Responsibilities:

Deployment of ERC-6551 Token Bound Accounts (TBAs)

Atomic batch execution of trades

Final settlement of capital movements

Each AI agent is represented by an Agent NFT, which owns a unique TBA.
This account acts as a sovereign vault, ensuring that only protocol-verified logic can initiate transactions.

3.2 Privacy Layer — Inco Network (FHE)

The privacy layer functions as a Confidential Dark Pool for intent aggregation.

Key properties:

Trade intents are encrypted client-side using FHE

Encrypted signals can be aggregated without decryption

No participant gains visibility into individual strategies

By leveraging Fully Homomorphic Encryption, AgentFi ensures that alpha remains private even during coordination and consensus.

3.3 Intelligence Layer — Phala Trusted Execution Environment

The intelligence layer hosts the AI logic inside a hardware-secured enclave.

Capabilities:

Decrypt aggregated signals

Execute proprietary quant strategies

Sign cross-chain transactions securely

The TEE is the only entity permitted to access decrypted trade intents, enforcing strict confidentiality guarantees.

4. Core Workflow
Step 1: Agent Initialization

User mints an Agent NFT

A dedicated ERC-6551 vault is deployed

Capital is deposited into the NFT-owned account

Step 2: Market Analysis

The AI agent retrieves:

Market data

Sentiment indicators

Historical decision context via RAG

Analysis is performed entirely inside the TEE

Step 3: Intent Shielding

Trade intent is encrypted using FHE

Ciphertext is submitted to the Inco Confidential Store

Step 4: Blind Aggregation

Multiple encrypted intents are aggregated

No plaintext is ever revealed on-chain

Step 5: Atomic Settlement

TEE decrypts the final signal

Transaction is signed inside the enclave

Execution occurs atomically on Shardeum

5. AI Architecture
5.1 TEE-Isolated AI Engine

The AI engine runs as a dockerized Python service within a Phala SGX enclave.

Characteristics:

No access to host OS or external memory

Enclave-restricted APIs

Deterministic execution guarantees

Internal Endpoints:

POST /v1/analyze/intent
GET  /v1/memory/rag

5.2 Retrieval-Augmented Memory (RAG)

AgentFi integrates a lightweight RAG system backed by IPFS.

Stored artifacts:

Historical trades

Market regimes

Decision embeddings

This enables adaptive behavior without centralized data silos.

6. Visual Explainability

AgentFi introduces a Visual Decision Forest, rendering the AI’s reasoning process as a graph.

Benefits:

Human-readable strategy interpretation

Post-trade audits

Governance and compliance tooling

Visualization does not reveal proprietary weights or alpha-generating parameters.

7. Security Model
Threat Vector	Mitigation
Private key leakage	Keys sealed inside TEE
Front-running	FHE-encrypted intents
Strategy theft	Blind aggregation
Malicious operators	Hardware-backed enclaves
Partial execution	Atomic settlement
8. Gas & Yield Optimization

Idle capital is automatically deployed into lending protocols

Trades are delayed during periods of high gas volatility

Execution timing is optimized by the TEE to preserve margins

9. Extensibility

AgentFi is designed as a modular protocol.

Planned extensions include:

Swappable AI personalities

Cross-shard arbitrage strategies

DAO-governed parameter tuning

Zero-Knowledge verification of enclave honesty

10. Future Roadmap

Personality Marketplace
Tradeable AI strategy modules

Cross-Shard Arbitrage
Atomic execution across Shardeum shards

ZKP Audits
Cryptographic verification of TEE integrity

Composable Agent DAOs
Collective governance of autonomous agents

11. Conclusion

AgentFi redefines autonomous finance by separating capital ownership, intelligence execution, and decision privacy into independently verifiable layers. This architecture enables trust-minimized, censorship-resistant, and front-run-proof financial agents capable of operating at scale.

AgentFi represents a foundational primitive for the next generation of decentralized hedge funds.

📄 License

This project is licensed under the MIT License.
Refer to the LICENSE file for details.
