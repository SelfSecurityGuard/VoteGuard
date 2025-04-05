# 🗳️ VoteGuard

> A zero-knowledge voting platform that verifies identity via QR Code, ensuring privacy and enabling truly anonymous and secure on-chain voting.

## 🔥 Demo

[🔗 vote-guard.vercel.app/](https://vote-guard.vercel.app/)

## ✨ Features

- ✅ Identity verification using Self.ID + ZK Proof
- ✅ One-time voting per user (one-time proof)
- ✅ Frontend built with Next.js + TailwindCSS, deployed on Vercel
- ✅ Proof is temporarily stored using Upstash Redis
- ✅ Fully on-chain voting contract written in Solidity

## 🧱 Tech Stack

- **Frontend**: Next.js + TailwindCSS
- **Wallet Integration**: Wagmi + Ethers.js
- **Identity Verification**: @selfxyz/qrcode + ZK Proof
- **Backend Storage**: Upstash Redis
- **Smart Contracts**: Solidity for voting logic

## 🚀 Getting Started

```bash
git clone https://github.com/SelfSecurityGuard/VoteGuard.git
cd frontend
npm install
```

### Environment Variables

Create a `.env.local` file and add:

```env
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### Run Development Server

```bash
npm run dev
```

## 📡 API

### `POST /api/proof`
- Submits the user's zero-knowledge proof
- Request Body: `{ proof, publicSignals }`

### `GET /api/proof?address=0x...`
- Retrieves the stored proof for the address (single-use only)

## Contract Address: 
### Celo Mainnet: 0xEB7429486D14629E46EC38bc0489d365b8192f65
### Celo Alfajores: 0x359105Cc4Cb4F14Ba2e329d8FcA43F516988f24B
