'use client';

import { useWallet } from '@/components/WalletProvider';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Sprout, Lock, AlertTriangle } from 'lucide-react';
import { CropReceipt } from '@/types';

export default function BorrowPage() {
  const { walletState, aptos } = useWallet();
  const router = useRouter();
  const params = useParams();
  const receiptId = params.receiptId as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [receipt, setReceipt] = useState<CropReceipt | null>(null);

  // Sample receipt data - in real app, fetch from blockchain
  const sampleReceipts: CropReceipt[] = [
    {
      id: '1',
      farmerId: walletState.address || '',
      cropType: 'Rice / चावल',
      quantity: 100,
      quality: 'Grade A',
      storageLocation: 'Warehouse Delhi',
      timestamp: Date.now(),
      tokenId: 'NFT001',
      isLocked: false,
    },
    {
      id: '2',
      farmerId: walletState.address || '',
      cropType: 'Wheat / गेहूं',
      quantity: 150,
      quality: 'Grade B',
      storageLocation: 'Warehouse Mumbai',
      timestamp: Date.now() - 86400000,
      tokenId: 'NFT002',
      isLocked: false,
    },
  ];

  const interestRate = 8.5; // 8.5% APR
  const loanToValueRatio = 0.7; // 70% LTV
  const marketPricePerTonne = 25000; // ₹25,000 per tonne (sample price)

  useEffect(() => {
    // Find the receipt
    const foundReceipt = sampleReceipts.find(r => r.id === receiptId);
    if (foundReceipt) {
      setReceipt(foundReceipt);
    }
  }, [receiptId]);

  useEffect(() => {
    if (!walletState.isConnected) {
      router.push('/');
    }
  }, [walletState.isConnected, router]);

  if (!walletState.isConnected || !receipt) {
    return null;
  }

  const maxLoanAmount = Math.floor(receipt.quantity * marketPricePerTonne * loanToValueRatio);
  const monthlyInterest = (parseFloat(loanAmount) || 0) * (interestRate / 100) / 12;
  const totalRepayment = (parseFloat(loanAmount) || 0) + monthlyInterest;

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) <= maxLoanAmount || value === '') {
      setLoanAmount(value);
    }
  };

  const handleBorrow = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would:
      // 1. Lock the NFT in smart contract
      // 2. Transfer mock USDC to farmer's wallet
      // 3. Create loan record

      console.log('Loan approved:', {
        receiptId,
        loanAmount: parseFloat(loanAmount),
        interestRate,
        collateral: receipt.tokenId,
      });

      alert(`Loan approved! ₹${loanAmount} has been transferred to your wallet.`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error processing loan:', error);
      alert('Failed to process loan. Please try again.');
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
              <span className="text-xl font-bold">Take Loan</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Collateral Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 text-gray-500 mr-2" />
              Collateral Details / गारंटी विवरण
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crop Type:</span>
                    <span className="font-medium">{receipt.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{receipt.quantity} tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <span className="font-medium">{receipt.quality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">NFT ID:</span>
                    <span className="font-medium">{receipt.tokenId}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Price:</span>
                    <span className="font-medium">₹{marketPricePerTonne.toLocaleString()}/tonne</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">₹{(receipt.quantity * marketPricePerTonne).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LTV Ratio:</span>
                    <span className="font-medium">{(loanToValueRatio * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Loan:</span>
                    <span className="font-medium text-primary-600">₹{maxLoanAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Configuration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Loan Configuration / ऋण कॉन्फ़िगरेशन
            </h2>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount / ऋण राशि (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={handleLoanAmountChange}
                  max={maxLoanAmount}
                  min="1"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`Max: ₹${maxLoanAmount.toLocaleString()}`}
                />
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Minimum: ₹10,000</span>
                  <span>Maximum: ₹{maxLoanAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate / ब्याज दर
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <span className="font-medium text-primary-600">{interestRate}% APR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term / ऋण अवधि
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    <span className="font-medium">30 days</span>
                  </div>
                </div>
              </div>

              {/* Repayment Details */}
              {loanAmount && parseFloat(loanAmount) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Repayment Details / चुकौती विवरण
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Principal Amount:</span>
                      <span className="font-medium">₹{parseFloat(loanAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Interest (30 days):</span>
                      <span className="font-medium">₹{monthlyInterest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-300 pt-2">
                      <span className="text-blue-900 font-semibold">Total Repayment:</span>
                      <span className="font-bold">₹{totalRepayment.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Important Terms / महत्वपूर्ण शर्तें
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Your NFT will be locked as collateral until loan repayment</li>
                  <li>• Failure to repay on time may result in collateral liquidation</li>
                  <li>• Interest is calculated daily and compounds monthly</li>
                  <li className="font-hindi">• ऋण चुकौती तक आपका NFT गारंटी के रूप में लॉक रहेगा</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleBorrow}
            disabled={isLoading || !loanAmount || parseFloat(loanAmount) <= 0}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Loan...</span>
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5" />
                <span>Confirm Loan / ऋण की पुष्टि करें</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}