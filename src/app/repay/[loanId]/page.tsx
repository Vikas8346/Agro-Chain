'use client';

import { useWallet } from '@/components/WalletProvider';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, CheckCircle, Sprout, Unlock } from 'lucide-react';
import { LoanDetails, CropReceipt } from '@/types';

export default function RepayPage() {
  const { walletState, aptos } = useWallet();
  const router = useRouter();
  const params = useParams();
  const loanId = params.loanId as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [loan, setLoan] = useState<LoanDetails | null>(null);
  const [receipt, setReceipt] = useState<CropReceipt | null>(null);

  // Sample data - in real app, fetch from blockchain
  const sampleLoans: LoanDetails[] = [
    {
      id: '1',
      receiptId: '2',
      amount: 50000,
      interestRate: 8.5,
      dueDate: Date.now() + 2592000000, // 30 days from now
      isActive: true,
    },
  ];

  const sampleReceipts: CropReceipt[] = [
    {
      id: '2',
      farmerId: walletState.address || '',
      cropType: 'Wheat / गेहूं',
      quantity: 150,
      quality: 'Grade B',
      storageLocation: 'Warehouse Mumbai',
      timestamp: Date.now() - 86400000,
      tokenId: 'NFT002',
      isLocked: true,
    },
  ];

  useEffect(() => {
    // Find the loan and associated receipt
    const foundLoan = sampleLoans.find(l => l.id === loanId);
    if (foundLoan) {
      setLoan(foundLoan);
      const associatedReceipt = sampleReceipts.find(r => r.id === foundLoan.receiptId);
      setReceipt(associatedReceipt || null);
    }
  }, [loanId]);

  useEffect(() => {
    if (!walletState.isConnected) {
      router.push('/');
    }
  }, [walletState.isConnected, router]);

  if (!walletState.isConnected || !loan || !receipt) {
    return null;
  }

  const daysRemaining = Math.ceil((loan.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
  const dailyInterest = (loan.amount * (loan.interestRate / 100)) / 365;
  const daysElapsed = 30 - daysRemaining;
  const accruedInterest = dailyInterest * daysElapsed;
  const totalRepayment = loan.amount + accruedInterest;
  const isOverdue = daysRemaining < 0;

  const handleRepay = async () => {
    setIsLoading(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would:
      // 1. Transfer stablecoins from user to protocol
      // 2. Unlock the NFT from smart contract
      // 3. Update loan status to repaid
      // 4. Transfer NFT back to user

      console.log('Loan repaid:', {
        loanId,
        repaymentAmount: totalRepayment,
        nftUnlocked: receipt.tokenId,
      });

      alert(`Loan successfully repaid! Your NFT ${receipt.tokenId} has been unlocked.`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error processing repayment:', error);
      alert('Failed to process repayment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold">Repay Loan</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Loan Status */}
          <div className={`rounded-lg p-4 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              <div>
                <h2 className={`font-semibold ${isOverdue ? 'text-red-900' : 'text-blue-900'}`}>
                  {isOverdue ? 'Loan Overdue / ऋण देरी से' : 'Loan Active / सक्रिय ऋण'}
                </h2>
                <p className={`text-sm ${isOverdue ? 'text-red-700' : 'text-blue-700'}`}>
                  {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                </p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Loan Details / ऋण विवरण
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium">₹{loan.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{loan.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Elapsed:</span>
                    <span className="font-medium">{daysElapsed} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accrued Interest:</span>
                    <span className="font-medium">₹{accruedInterest.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Interest:</span>
                    <span className="font-medium">₹{dailyInterest.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-900 font-semibold">Total Repayment:</span>
                    <span className="font-bold text-lg text-primary-600">
                      ₹{totalRepayment.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collateral Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Unlock className="h-5 w-5 text-gray-500 mr-2" />
              Collateral to be Released / जारी की जाने वाली गारंटी
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-lg">{receipt.cropType}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  NFT: {receipt.tokenId}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>Quantity: {receipt.quantity} tonnes</div>
                <div>Quality: {receipt.quality}</div>
                <div>Location: {receipt.storageLocation}</div>
                <div>Status: Currently Locked</div>
              </div>
            </div>
          </div>

          {/* Repayment Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Repayment Breakdown / चुकौती विवरण
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-medium">₹{loan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest ({daysElapsed} days):</span>
                <span className="font-medium">₹{accruedInterest.toFixed(2)}</span>
              </div>
              {isOverdue && (
                <div className="flex justify-between">
                  <span className="text-red-600">Late Fee:</span>
                  <span className="font-medium text-red-600">₹{(Math.abs(daysRemaining) * 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="text-xl font-bold">Total Payment:</span>
                <span className="text-xl font-bold text-primary-600">
                  ₹{(totalRepayment + (isOverdue ? Math.abs(daysRemaining) * 100 : 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment Method / भुगतान विधि
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Mock USDC</h3>
                  <p className="text-sm text-blue-700">Payment will be deducted from your wallet</p>
                </div>
              </div>
              
              <div className="text-sm text-blue-700">
                <p>• Ensure you have sufficient USDC balance in your wallet</p>
                <p>• Transaction will be processed on Aptos testnet</p>
                <p className="font-hindi">• सुनिश्चित करें कि आपके वॉलेट में पर्याप्त USDC बैलेंस है</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRepay}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Repayment...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Repay Loan / ऋण चुकाएं</span>
              </>
            )}
          </button>

          {/* Success Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  After Repayment / चुकौती के बाद
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Your NFT collateral will be unlocked immediately</li>
                  <li>• You can use the NFT for new loans or withdraw crops</li>
                  <li>• Loan will be marked as completed in your dashboard</li>
                  <li className="font-hindi">• आपकी NFT गारंटी तुरंत अनलॉक हो जाएगी</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}