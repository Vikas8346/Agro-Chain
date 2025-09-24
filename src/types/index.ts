export interface CropReceipt {
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

export interface LoanDetails {
  id: string;
  receiptId: string;
  amount: number;
  interestRate: number;
  dueDate: number;
  isActive: boolean;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: number;
  receipts: CropReceipt[];
  loans: LoanDetails[];
}