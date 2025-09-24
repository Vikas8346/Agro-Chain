'use client';

import { useWallet } from '@/components/WalletProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Wallet, Plus, DollarSign, FileText, ArrowLeft, Sprout } from 'lucide-react';
import { CropReceipt, LoanDetails } from '@/types';

export default function Dashboard() {
  const { walletState, disconnectWallet } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'receipts' | 'loans'>('receipts');

  // Sample data for demonstration
  const [receipts] = useState<CropReceipt[]>([
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
      isLocked: true,
    },
  ]);

  const [loans] = useState<LoanDetails[]>([
    {
      id: '1',
      receiptId: '2',
      amount: 50000,
      interestRate: 8.5,
      dueDate: Date.now() + 2592000000, // 30 days from now
      isActive: true,
    },
  ]);

  useEffect(() => {
    if (!walletState.isConnected) {
      router.push('/');
    }
  }, [walletState.isConnected, router]);

  if (!walletState.isConnected) {
    return null;
  }

  const handleCreateReceipt = () => {
    router.push('/create-receipt');
  };

  const handleTakeLoan = (receiptId: string) => {
    router.push(`/borrow/${receiptId}`);
  };

  const handleRepayLoan = (loanId: string) => {
    router.push(`/repay/${loanId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Sprout className="h-6 w-6 text-primary-600" />
                <span className="text-xl font-bold">Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold">{walletState.balance.toFixed(4)} APT</div>
              </div>
              <button
                onClick={disconnectWallet}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <Wallet className="h-5 w-5" />
                <span className="hidden sm:block">
                  {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-primary-600">{receipts.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {loans.filter(loan => loan.isActive).length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-secondary-600" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Borrowed</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{loans.reduce((total, loan) => total + (loan.isActive ? loan.amount : 0), 0).toLocaleString()}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('receipts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'receipts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Crop Receipts / फसल रसीदें
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'loans'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Loans / ऋण
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'receipts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Your Crop Receipts</h3>
                  <button
                    onClick={handleCreateReceipt}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Receipt</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-lg">{receipt.cropType}</span>
                            {receipt.isLocked && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                Locked
                              </span>
                            )}
                            {receipt.tokenId && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                NFT: {receipt.tokenId}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>Quantity: {receipt.quantity} tonnes</div>
                            <div>Quality: {receipt.quality}</div>
                            <div>Location: {receipt.storageLocation}</div>
                            <div>Date: {new Date(receipt.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          {!receipt.isLocked ? (
                            <button
                              onClick={() => handleTakeLoan(receipt.id)}
                              className="btn-secondary w-full sm:w-auto"
                            >
                              Take Loan / ऋण लें
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Used as collateral
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Your Loans</h3>
                
                <div className="space-y-4">
                  {loans.filter(loan => loan.isActive).map((loan) => {
                    const receipt = receipts.find(r => r.id === loan.receiptId);
                    const daysUntilDue = Math.ceil((loan.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-semibold text-lg">₹{loan.amount.toLocaleString()}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {loan.interestRate}% APR
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>Collateral: {receipt?.cropType}</div>
                              <div>Due in: {daysUntilDue} days</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 sm:mt-0">
                            <button
                              onClick={() => handleRepayLoan(loan.id)}
                              className="btn-primary w-full sm:w-auto"
                            >
                              Repay / चुकता करें
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {loans.filter(loan => loan.isActive).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No active loans</p>
                      <p className="text-sm font-hindi">कोई सक्रिय ऋण नहीं</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}