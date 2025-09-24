'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { WalletState } from '@/types';

interface WalletContextType {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  aptos: Aptos;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    balance: 0,
    receipts: [],
    loans: [],
  });

  // Initialize Aptos client for testnet
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const connectWallet = async () => {
    try {
      // Check if wallet is available
      if (typeof window !== 'undefined' && 'aptos' in window) {
        const wallet = (window as any).aptos;
        
        // Request connection
        const response = await wallet.connect();
        
        if (response.address) {
          // Get balance
          const balance = await aptos.getAccountAPTAmount({
            accountAddress: response.address,
          });
          
          setWalletState({
            address: response.address,
            isConnected: true,
            balance: Number(balance) / 100000000, // Convert from octas to APT
            receipts: [],
            loans: [],
          });
        }
      } else {
        alert('Please install Petra wallet to continue');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      balance: 0,
      receipts: [],
      loans: [],
    });
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && 'aptos' in window) {
        try {
          const wallet = (window as any).aptos;
          const isConnected = await wallet.isConnected();
          
          if (isConnected) {
            const account = await wallet.account();
            const balance = await aptos.getAccountAPTAmount({
              accountAddress: account.address,
            });
            
            setWalletState({
              address: account.address,
              isConnected: true,
              balance: Number(balance) / 100000000,
              receipts: [],
              loans: [],
            });
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkWalletConnection();
  }, [aptos]);

  return (
    <WalletContext.Provider
      value={{ walletState, connectWallet, disconnectWallet, aptos }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}