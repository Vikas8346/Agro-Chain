# Agri-Chain API Documentation

## Table of Contents
1. [Smart Contract API](#smart-contract-api)
2. [Frontend Components API](#frontend-components-api)
3. [Utility Functions](#utility-functions)
4. [Type Definitions](#type-definitions)

## Smart Contract API

### Contract Address
- **Testnet**: `0xb0b` (placeholder - replace with actual deployed address)
- **Module**: `agri_chain::crop_nft`

### Entry Functions

#### `mint_crop_receipt`
Creates a new NFT representing a crop storage receipt.

**Parameters:**
- `farmer: &signer` - The farmer's account
- `crop_type: String` - Type of crop (e.g., "Rice", "Wheat")
- `quantity: u64` - Quantity in tonnes
- `quality: String` - Quality grade (e.g., "Grade A")
- `storage_location: String` - Physical storage location
- `warehouse_operator: String` - Name of warehouse operator
- `moisture_content: u64` - Moisture content in basis points (1250 = 12.5%)
- `token_name: String` - Name for the NFT
- `token_description: String` - Description for the NFT
- `token_uri: String` - URI for NFT metadata

**Returns:** Transaction hash

**Events Emitted:**
```move
ReceiptMinted {
    token_id: address,
    farmer: address,
    crop_type: String,
    quantity: u64,
    timestamp: u64,
}
```

#### `create_loan`
Creates a loan against an NFT collateral.

**Parameters:**
- `borrower: &signer` - The borrower's account
- `token_id: address` - Address of the NFT to use as collateral
- `principal_amount: u64` - Loan amount in smallest currency unit
- `interest_rate: u64` - Interest rate in basis points (850 = 8.5%)
- `loan_duration_days: u64` - Loan duration in days

**Preconditions:**
- Borrower must own the NFT
- NFT must not be locked
- Token must exist

**Events Emitted:**
```move
LoanCreated {
    loan_id: address,
    borrower: address,
    token_id: address,
    amount: u64,
    interest_rate: u64,
    due_timestamp: u64,
}
```

#### `repay_loan`
Repays a loan and unlocks the NFT collateral.

**Parameters:**
- `borrower: &signer` - The borrower's account
- `loan_id: address` - Address of the loan record
- `repayment_amount: u64` - Amount being repaid

**Preconditions:**
- Loan must be active
- Repayment amount must be sufficient to cover principal + interest

**Events Emitted:**
```move
LoanRepaid {
    loan_id: address,
    borrower: address,
    token_id: address,
    amount_repaid: u64,
    timestamp: u64,
}
```

### View Functions

#### `get_crop_receipt`
Retrieves crop receipt details.

**Parameters:**
- `token_id: address` - NFT token address

**Returns:**
```move
(
    crop_type: String,
    quantity: u64,
    quality: String,
    storage_location: String,
    warehouse_operator: String,
    moisture_content: u64,
    timestamp: u64,
    is_locked: bool
)
```

#### `get_loan_details`
Retrieves loan information.

**Parameters:**
- `loan_id: address` - Loan record address

**Returns:**
```move
(
    receipt_token_id: address,
    principal_amount: u64,
    interest_rate: u64,
    start_timestamp: u64,
    due_timestamp: u64,
    is_active: bool
)
```

#### `calculate_repayment_amount`
Calculates the current repayment amount including accrued interest.

**Parameters:**
- `loan_id: address` - Loan record address

**Returns:**
- `u64` - Total repayment amount required

#### `is_token_locked`
Checks if an NFT is currently locked as collateral.

**Parameters:**
- `token_id: address` - NFT token address

**Returns:**
- `bool` - True if locked, false otherwise

## Frontend Components API

### WalletProvider

React context provider for wallet management.

#### Props
```typescript
interface WalletProviderProps {
  children: React.ReactNode;
}
```

#### Context Value
```typescript
interface WalletContextType {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  aptos: Aptos;
}
```

#### Usage
```typescript
const { walletState, connectWallet, disconnectWallet, aptos } = useWallet();
```

### ContractService

Service class for interacting with smart contracts.

#### Constructor
```typescript
constructor(aptos: Aptos)
```

#### Methods

##### `mintCropReceipt`
```typescript
async mintCropReceipt(
  account: Account,
  args: MintReceiptArgs
): Promise<string>
```

##### `createLoan`
```typescript
async createLoan(
  account: Account,
  args: CreateLoanArgs
): Promise<string>
```

##### `repayLoan`
```typescript
async repayLoan(
  account: Account,
  args: RepayLoanArgs
): Promise<string>
```

##### `getCropReceipt`
```typescript
async getCropReceipt(tokenId: string): Promise<CropReceiptData>
```

##### `getLoanDetails`
```typescript
async getLoanDetails(loanId: string): Promise<LoanData>
```

##### `calculateRepaymentAmount`
```typescript
async calculateRepaymentAmount(loanId: string): Promise<number>
```

##### `isTokenLocked`
```typescript
async isTokenLocked(tokenId: string): Promise<boolean>
```

## Utility Functions

### Number Formatting
```typescript
// Convert APT from octas
const aptAmount = octasAmount / 100000000;

// Format currency
const formattedAmount = amount.toLocaleString('en-IN', {
  style: 'currency',
  currency: 'INR'
});
```

### Date Calculations
```typescript
// Days until due
const daysRemaining = Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24));

// Interest calculation
const dailyInterest = (principal * interestRate / 100) / 365;
const accruedInterest = dailyInterest * daysElapsed;
```

### Validation Helpers
```typescript
// Validate loan amount
const isValidLoanAmount = (amount: number, maxAmount: number) => {
  return amount > 0 && amount <= maxAmount;
};

// Check wallet connection
const requireWalletConnection = (isConnected: boolean) => {
  if (!isConnected) {
    throw new Error('Wallet not connected');
  }
};
```

## Type Definitions

### Core Types

#### `CropReceipt`
```typescript
interface CropReceipt {
  id: string;
  farmerId: string;
  cropType: string;
  quantity: number;
  quality: string;
  storageLocation: string;
  timestamp: number;
  tokenId?: string;
  isLocked?: boolean;
}
```

#### `LoanDetails`
```typescript
interface LoanDetails {
  id: string;
  receiptId: string;
  amount: number;
  interestRate: number;
  dueDate: number;
  isActive: boolean;
}
```

#### `WalletState`
```typescript
interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: number;
  receipts: CropReceipt[];
  loans: LoanDetails[];
}
```

### Contract Interaction Types

#### `MintReceiptArgs`
```typescript
interface MintReceiptArgs {
  cropType: string;
  quantity: number;
  quality: string;
  storageLocation: string;
  warehouseOperator: string;
  moistureContent: number;
  tokenName: string;
  tokenDescription: string;
  tokenUri: string;
}
```

#### `CreateLoanArgs`
```typescript
interface CreateLoanArgs {
  tokenId: string;
  principalAmount: number;
  interestRate: number;
  loanDurationDays: number;
}
```

#### `RepayLoanArgs`
```typescript
interface RepayLoanArgs {
  loanId: string;
  repaymentAmount: number;
}
```

## Error Handling

### Contract Errors
```move
const ETOKEN_NOT_FOUND: u64 = 1;
const EINSUFFICIENT_BALANCE: u64 = 2;
const EUNAUTHORIZED: u64 = 3;
const ETOKEN_ALREADY_LOCKED: u64 = 4;
const ETOKEN_NOT_LOCKED: u64 = 5;
const ELOAN_ALREADY_EXISTS: u64 = 6;
const ELOAN_NOT_FOUND: u64 = 7;
const EREPAYMENT_AMOUNT_INSUFFICIENT: u64 = 8;
```

### Frontend Error Handling
```typescript
try {
  await contractService.createLoan(account, loanArgs);
} catch (error) {
  if (error.message.includes('ETOKEN_ALREADY_LOCKED')) {
    alert('This NFT is already being used as collateral');
  } else if (error.message.includes('EUNAUTHORIZED')) {
    alert('You do not own this NFT');
  } else {
    alert('Transaction failed. Please try again.');
  }
}
```

## Rate Limits and Constraints

### Smart Contract Limits
- Maximum quantity: 1,000,000 tonnes per receipt
- Maximum loan duration: 365 days
- Minimum loan amount: Equivalent to $10 USD
- Interest rate range: 1% - 50% APR

### Frontend Constraints
- File upload size: 10MB for receipt images
- Transaction timeout: 30 seconds
- Pagination: 20 items per page for receipts/loans
- Refresh interval: 30 seconds for real-time data

## Testing

### Mock Data Generation
```typescript
const generateMockReceipt = (): CropReceipt => ({
  id: `receipt_${Math.random().toString(36).substr(2, 9)}`,
  farmerId: '0x123...',
  cropType: 'Rice',
  quantity: 100,
  quality: 'Grade A',
  storageLocation: 'Warehouse Delhi',
  timestamp: Date.now(),
  tokenId: `NFT_${Math.random().toString(36).substr(2, 9)}`,
  isLocked: false,
});
```

### Integration Testing
```typescript
describe('Contract Integration', () => {
  it('should mint receipt and create loan', async () => {
    const receipt = await contractService.mintCropReceipt(account, receiptArgs);
    const loan = await contractService.createLoan(account, loanArgs);
    expect(loan).toBeDefined();
  });
});
```

---

For more information, see the main [README.md](./README.md) file.