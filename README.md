# Agri-Chain (किसान कोश — Farmer's Treasury)

**One-line:** NFT-backed e-NWR collateral on Aptos — farmers mint crop receipts as NFTs and instantly borrow stablecoins against them (mobile-first web demo).

## Overview

Agri-Chain is a decentralized finance (DeFi) platform that enables farmers to digitize their crop storage receipts as NFTs and use them as collateral for instant loans. Built on the Aptos blockchain, it provides a mobile-first solution for agricultural financing in emerging markets.

## 🌾 Key Features

- **Digital Crop Receipts**: Convert physical storage receipts into NFTs on Aptos blockchain
- **Instant Loans**: Borrow stablecoins against NFT collateral with competitive rates
- **Mobile-First Design**: Optimized for smartphones with intuitive Hindi+English interface
- **Transparent & Secure**: Blockchain-powered transparency and security for all transactions
- **Real-time Dashboard**: Track your receipts, loans, and repayment schedules

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Aptos blockchain (testnet)
- **Smart Contracts**: Move programming language
- **Wallet Integration**: Aptos Wallet Adapter (Petra/Martian)
- **Stablecoin**: Mock USDC on Aptos testnet

## 📱 User Flows

### 1. Landing Page
- **Purpose**: Introduction to Agri-Chain platform
- **Features**: 
  - Bilingual content (Hindi + English)
  - Mobile-responsive design
  - Clear call-to-action buttons
  - Feature explanation cards

### 2. Wallet Connection
- **Integration**: Aptos Wallet Adapter
- **Supported Wallets**: Petra, Martian
- **Display**: Wallet address, APT balance
- **Network**: Aptos testnet

### 3. Dashboard
- **Overview**: Stats cards showing total receipts, active loans, borrowed amount
- **Tabs**: Separate sections for crop receipts and loans
- **Actions**: Create new receipts, take loans, repay loans

### 4. Create Receipt (NFT Minting)
- **Form Fields**:
  - Crop type selection (Rice, Wheat, Corn, etc.)
  - Quantity in tonnes
  - Quality grade (A, B, C)
  - Storage location
  - Warehouse operator
  - Moisture content
  - Additional remarks
- **Process**: Mints NFT on Aptos blockchain representing the crop receipt

### 5. Take Loan (Borrow)
- **Collateral**: Use NFT receipt as collateral
- **Configuration**:
  - Loan amount (up to 70% of crop value)
  - Fixed interest rate (8.5% APR)
  - 30-day loan term
- **Process**: Locks NFT and transfers mock stablecoins to farmer

### 6. Repay Loan
- **Calculation**: Principal + accrued interest
- **Payment**: Mock USDC from farmer's wallet
- **Process**: Unlocks NFT collateral upon successful repayment

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Aptos CLI (for smart contract deployment)
- Petra or Martian wallet browser extension

### Frontend Setup
```bash
# Clone the repository
git clone <repository-url>
cd agri-chain

# Install dependencies
npm install

# Start development server
npm run dev
```

### Smart Contract Deployment
```bash
# Initialize Aptos account
aptos init --network testnet

# Publish Move contracts
aptos move publish --package-dir . --named-addresses agri_chain=<your-address>
```

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
NEXT_PUBLIC_APTOS_NETWORK=testnet
```

## 📄 Smart Contract Architecture

### Main Module: `crop_nft.move`

#### Core Structs
- **`CropReceipt`**: Stores crop details, quality, storage info
- **`LoanRecord`**: Tracks loan principal, interest, due dates
- **`CollectionData`**: NFT collection metadata

#### Key Functions
- **`mint_crop_receipt()`**: Creates new NFT for crop storage receipt
- **`create_loan()`**: Locks NFT and issues loan
- **`repay_loan()`**: Processes repayment and unlocks NFT
- **View functions**: Query receipt details, loan status, repayment amounts

#### Events
- `ReceiptMinted`: Emitted when new crop receipt NFT is created
- `LoanCreated`: Emitted when loan is issued against NFT
- `LoanRepaid`: Emitted when loan is successfully repaid

## 🔐 Security Features

- **Ownership Verification**: Only NFT owner can use it as collateral
- **Lock Mechanism**: Prevents double-spending of collateral
- **Interest Calculation**: Time-based interest accrual
- **Repayment Validation**: Ensures sufficient payment before unlock

## 🌐 API Reference

### Contract Service (`src/utils/contract.ts`)

#### Mint Crop Receipt
```typescript
await contractService.mintCropReceipt(account, {
  cropType: "Rice",
  quantity: 100,
  quality: "Grade A",
  storageLocation: "Warehouse Delhi",
  warehouseOperator: "CWC",
  moistureContent: 1250, // 12.5%
  tokenName: "Rice Receipt #001",
  tokenDescription: "100 tonnes Grade A Rice",
  tokenUri: "https://ipfs.io/..."
});
```

#### Create Loan
```typescript
await contractService.createLoan(account, {
  tokenId: "0x123...",
  principalAmount: 50000,
  interestRate: 850, // 8.5%
  loanDurationDays: 30
});
```

#### Repay Loan
```typescript
await contractService.repayLoan(account, {
  loanId: "0x456...",
  repaymentAmount: 52000
});
```

## 🧪 Testing

### Manual Testing Flows
1. **Wallet Connection**: Test with Petra/Martian wallets
2. **Receipt Creation**: Create various crop types and quantities
3. **Loan Process**: Test loan creation with different amounts
4. **Repayment**: Test successful and failed repayment scenarios

### Test Data
- Sample crop receipts with various types and qualities
- Mock loan calculations with different interest rates
- Simulated blockchain transactions with delays

## 📊 Demo Video Script (2-3 minutes)

1. **Introduction** (30s): Platform overview and problem statement
2. **Wallet Connection** (20s): Connect Petra wallet to testnet
3. **Create Receipt** (45s): Fill form and mint NFT crop receipt
4. **Take Loan** (45s): Use NFT as collateral for instant loan
5. **Repay Loan** (30s): Repay loan and unlock NFT
6. **Conclusion** (20s): Benefits and future roadmap

## 🌍 Internationalization

- **Primary Language**: English
- **Secondary Language**: Hindi (हिंदी)
- **Font Support**: Noto Sans Devanagari for Hindi text
- **Context**: Rural farmers in India and similar markets

## 🔮 Future Enhancements

- **Oracle Integration**: Real-time crop price feeds
- **Insurance**: Crop insurance integrated with loans
- **Marketplace**: P2P trading of crop receipts
- **Credit Scoring**: On-chain credit history for farmers
- **Mobile App**: Native iOS/Android applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For questions and support:
- GitHub Issues: [repository-issues-url]
- Email: support@agri-chain.com
- Documentation: [documentation-url]

---

**Built with ❤️ for farmers worldwide**