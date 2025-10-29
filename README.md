# Increase Blue Base v2 – React & Reown + Wagmi AppKit

Rebuilt version of the original Increase Blue DApp (Base Mainnet), previously written in vanilla JavaScript, now in React.

## Technologies
- **React** (v18.3.1)
- **Reown AppKit** (v1.8.10)
- **Reown AppKit Wagmi Adapter** (v1.8.10)
- **Web3.js** (v4.16.0)
- **Vite** (v6.4.1)

## Overview
This project is a new, improved version of Increase Blue Base:
- Fully rewritten in React (instead of vanilla JS)
- Integrated with Reown AppKit – multi-wallet support (WalletConnect, MetaMask, Coinbase, Trust Wallet, etc.)
- Wagmi Adapter for modern hooks and wallet management
- Full compatibility with Base Mainnet
- Clean, responsive interface

## Functionality

Increase Blue Base v2 is a simple DApp based on the following contract:

**Increase Blue Base**
*Working DApp: Simple, Immutable, Ever-Increasing Counter Smart Contract*

- Solidity 0.8.0+ • License: MIT
- Deployed and Verified on Base: `0x78776b0d6185D97Ca9a9A822bf1E192e3B44307f`

### Key Contract Features
- ✅ Only increases – the `increment()` function adds +1
- ❌ No decrease – you cannot subtract from the counter
- ❌ No reset – the counter never returns to zero
- ❌ No owner – no admin privileges
- ❌ No parameters – always +1
- 🔒 Immutable – behavior cannot be changed after deployment
- 🔍 Transparent – everything visible on BaseScan

### Contract Interface
- `function increment() public` – only function that modifies state
- `function getCount() public view returns (uint256)` – current counter value
- `function getIncreaseHistoryCount() public view returns (uint256)` – total number of increases
- `function getIncreaseRecord(uint256 index) public view returns (IncreaseRecord memory)` – details of a specific increase


