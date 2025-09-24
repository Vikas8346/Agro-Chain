import { Aptos, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xb0b';

export interface MintReceiptArgs {
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

export interface CreateLoanArgs {
  tokenId: string;
  principalAmount: number;
  interestRate: number;
  loanDurationDays: number;
}

export interface RepayLoanArgs {
  loanId: string;
  repaymentAmount: number;
}

export class ContractService {
  private aptos: Aptos;

  constructor(aptos: Aptos) {
    this.aptos = aptos;
  }

  async mintCropReceipt(
    account: Account,
    args: MintReceiptArgs
  ): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::crop_nft::mint_crop_receipt`,
          typeArguments: [],
          functionArguments: [
            args.cropType,
            args.quantity.toString(),
            args.quality,
            args.storageLocation,
            args.warehouseOperator,
            args.moistureContent.toString(),
            args.tokenName,
            args.tokenDescription,
            args.tokenUri,
          ],
        },
      });

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error minting crop receipt:', error);
      throw error;
    }
  }

  async createLoan(
    account: Account,
    args: CreateLoanArgs
  ): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::crop_nft::create_loan`,
          typeArguments: [],
          functionArguments: [
            args.tokenId,
            args.principalAmount.toString(),
            args.interestRate.toString(),
            args.loanDurationDays.toString(),
          ],
        },
      });

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  }

  async repayLoan(
    account: Account,
    args: RepayLoanArgs
  ): Promise<string> {
    try {
      const transaction = await this.aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::crop_nft::repay_loan`,
          typeArguments: [],
          functionArguments: [
            args.loanId,
            args.repaymentAmount.toString(),
          ],
        },
      });

      const response = await this.aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      await this.aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      return response.hash;
    } catch (error) {
      console.error('Error repaying loan:', error);
      throw error;
    }
  }

  async getCropReceipt(tokenId: string): Promise<any> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::crop_nft::get_crop_receipt`,
          typeArguments: [],
          functionArguments: [tokenId],
        },
      });

      return {
        cropType: response[0],
        quantity: parseInt(response[1] as string),
        quality: response[2],
        storageLocation: response[3],
        warehouseOperator: response[4],
        moistureContent: parseInt(response[5] as string),
        timestamp: parseInt(response[6] as string),
        isLocked: response[7] as boolean,
      };
    } catch (error) {
      console.error('Error getting crop receipt:', error);
      throw error;
    }
  }

  async getLoanDetails(loanId: string): Promise<any> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::crop_nft::get_loan_details`,
          typeArguments: [],
          functionArguments: [loanId],
        },
      });

      return {
        receiptTokenId: response[0],
        principalAmount: parseInt(response[1] as string),
        interestRate: parseInt(response[2] as string),
        startTimestamp: parseInt(response[3] as string),
        dueTimestamp: parseInt(response[4] as string),
        isActive: response[5] as boolean,
      };
    } catch (error) {
      console.error('Error getting loan details:', error);
      throw error;
    }
  }

  async calculateRepaymentAmount(loanId: string): Promise<number> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::crop_nft::calculate_repayment_amount`,
          typeArguments: [],
          functionArguments: [loanId],
        },
      });

      return parseInt(response[0] as string);
    } catch (error) {
      console.error('Error calculating repayment amount:', error);
      throw error;
    }
  }

  async isTokenLocked(tokenId: string): Promise<boolean> {
    try {
      const response = await this.aptos.view({
        payload: {
          function: `${CONTRACT_ADDRESS}::crop_nft::is_token_locked`,
          typeArguments: [],
          functionArguments: [tokenId],
        },
      });

      return response[0] as boolean;
    } catch (error) {
      console.error('Error checking token lock status:', error);
      throw error;
    }
  }
}