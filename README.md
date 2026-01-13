🤖
<div align="center">

# AgentFi

### A TEE-Powered, Privacy-Preserving Autonomous Asset Management Protocol

**Autonomous AI agents · Non-custodial vaults · Encrypted decision-making**

</div>

---

## ✦ Abstract

> **AgentFi** is a decentralized, non-custodial asset management protocol enabling autonomous financial agents to manage capital, execute trades, and optimize yield **without ever requiring users to share private keys**.

By combining **ERC-6551 Token Bound Accounts**, **Trusted Execution Environments (TEE)**, and **Fully Homomorphic Encryption (FHE)**, AgentFi introduces a new architectural primitive for **confidential, self-governing on-chain hedge funds**.

---

## ✦ Motivation

Autonomous finance today faces critical limitations:

* Centralized bots introduce custodial risk
* Transparent mempools leak strategy alpha
* MEV and front-running erode returns
* Proprietary logic cannot be securely verified

> AgentFi resolves these issues by separating **capital ownership**, **intelligence execution**, and **decision privacy** into independent trust domains.

---

## ✦ Design Principles

* **Non-Custodial by Construction**
  Assets are never controlled by EOAs or centralized operators.

* **Confidential Intelligence**
  Trading intents remain encrypted until execution.

* **Deterministic Settlement**
  All capital movements execute atomically on-chain.

* **Explainable Autonomy**
  AI decisions are auditable without revealing strategy alpha.

---

## ✦ System Architecture

AgentFi is composed of **three tightly-coupled layers**, each responsible for a distinct trust boundary.

---

### ▸ Execution Layer

**(Shardeum / Sepolia)**

Handles custody and final settlement.

**Responsibilities**

* ERC-6551 Token Bound Account deployment
* Atomic batch execution
* Deterministic settlement

Each agent is represented by an **NFT-owned vault**, ensuring sovereign asset ownership.

---

### ▸ Privacy Layer

**(Inco Network · Fully Homomorphic Encryption)**

Acts as a confidential intent coordination layer.

**Properties**

* Client-side encrypted trade intents
* Blind aggregation without decryption
* Zero strategy leakage

> Validators only process ciphertext — never plaintext.

---

### ▸ Intelligence Layer

**(Phala Trusted Execution Environment)**

Hosts AI logic inside a hardware-secured enclave.

**Capabilities**

* Decrypt aggregated signals
* Execute proprietary strategies
* Sign transactions securely

Only the TEE can access decrypted intents.

---

## ✦ Protocol Workflow

```text
Mint Agent NFT
      ↓
Fund ERC-6551 Vault
      ↓
TEE Market Analysis
      ↓
FHE-Encrypted Intent
      ↓
Blind Aggregation
      ↓
Atomic On-Chain Execution
```

---

### 1. Agent Initialization

* User mints an Agent NFT
* A dedicated ERC-6551 vault is deployed
* Capital is deposited into the NFT-owned account

### 2. Market Analysis

* AI retrieves market data, sentiment, and historical context
* All computation occurs inside the TEE

### 3. Intent Shielding

* Trade intent is encrypted using FHE
* Ciphertext is submitted to the Inco Confidential Store

### 4. Blind Aggregation

* Multiple encrypted signals are aggregated
* No plaintext is ever revealed

### 5. Atomic Settlement

* TEE decrypts final signal
* Transaction is signed inside the enclave
* Execution settles atomically on-chain

---

## ✦ AI Architecture

### TEE-Isolated AI Engine

The AI engine runs as a **dockerized Python service** inside a Phala SGX enclave.

**Guarantees**

* No host OS access
* Enclave-restricted APIs
* Deterministic execution

**Internal API**

```http
POST /v1/analyze/intent
GET  /v1/memory/rag
```

---

### Retrieval-Augmented Memory (RAG)

A lightweight memory layer backed by IPFS.

**Stored Artifacts**

* Historical trades
* Market regimes
* Decision embeddings

Enables adaptive behavior without centralized data silos.

---

## ✦ Explainability Layer

AgentFi provides a **visual decision graph** representing the AI’s reasoning process.

**Benefits**

* Human-readable decision paths
* Post-trade auditing
* Governance and compliance tooling

> Visualization reveals *reasoning structure*, not strategy parameters.

---

## ✦ Security Model

| Threat              | Mitigation               |
| ------------------- | ------------------------ |
| Private key leakage | Keys sealed inside TEE   |
| Front-running       | FHE-encrypted intents    |
| Strategy theft      | Blind aggregation        |
| Malicious operators | Hardware-backed enclaves |
| Partial execution   | Atomic settlement        |

---

## ✦ Gas & Yield Optimization

* Idle capital auto-deployed into yield protocols
* Trades delayed during high gas volatility
* Execution timing optimized inside the TEE

---

## ✦ Extensibility

AgentFi is designed as a **modular protocol primitive**.

Planned extensions include:

* Swappable AI personalities
* Cross-shard arbitrage
* DAO-governed agent parameters
* Zero-knowledge TEE verification

---

## ✦ Roadmap

* Personality marketplace for AI strategies
* Cross-shard atomic arbitrage
* ZK-based enclave audits
* DAO-controlled autonomous agents

---

## ✦ Conclusion

AgentFi establishes a new standard for autonomous on-chain asset management by **decoupling trust domains** and enforcing confidentiality at every layer.

This architecture enables **sovereign, censorship-resistant, and front-run-proof financial agents** capable of operating at scale.

---

## License

MIT License
See the `LICENSE` file for details.


