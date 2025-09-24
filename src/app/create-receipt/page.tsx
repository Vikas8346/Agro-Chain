'use client';

import { useWallet } from '@/components/WalletProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Upload, Sprout } from 'lucide-react';

export default function CreateReceipt() {
  const { walletState, aptos } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    quality: 'Grade A',
    storageLocation: '',
    warehouseOperator: '',
    moistureContent: '',
    remarks: '',
  });

  const cropTypes = [
    { value: 'rice', label: 'Rice / चावल' },
    { value: 'wheat', label: 'Wheat / गेहूं' },
    { value: 'corn', label: 'Corn / मक्का' },
    { value: 'soybean', label: 'Soybean / सोयाबीन' },
    { value: 'cotton', label: 'Cotton / कपास' },
    { value: 'sugarcane', label: 'Sugarcane / गन्ना' },
  ];

  const qualities = ['Grade A', 'Grade B', 'Grade C'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate NFT minting process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would:
      // 1. Upload metadata to IPFS
      // 2. Call smart contract to mint NFT
      // 3. Update user's receipt list

      const receiptData = {
        id: `receipt_${Date.now()}`,
        farmerId: walletState.address,
        cropType: formData.cropType,
        quantity: parseFloat(formData.quantity),
        quality: formData.quality,
        storageLocation: formData.storageLocation,
        warehouseOperator: formData.warehouseOperator,
        moistureContent: formData.moistureContent,
        remarks: formData.remarks,
        timestamp: Date.now(),
        tokenId: `NFT_${Math.random().toString(36).substr(2, 9)}`,
        isLocked: false,
      };

      console.log('Receipt created:', receiptData);
      
      // Show success message
      alert('Receipt successfully created and minted as NFT!');
      
      // Redirect back to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Failed to create receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletState.isConnected) {
    router.push('/');
    return null;
  }

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
              <Sprout className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold">Create Receipt</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Deposit Crop Receipt / फसल जमा रसीद
              </h1>
              <p className="text-gray-600">
                Create a digital receipt for your stored crops
              </p>
              <p className="text-sm text-gray-500 font-hindi">
                अपनी भंडारित फसलों के लिए एक डिजिटल रसीद बनाएं
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type / फसल का प्रकार *
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map((crop) => (
                    <option key={crop.value} value={crop.value}>
                      {crop.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity and Quality */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (tonnes) / मात्रा (टन) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 100.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Grade / गुणवत्ता ग्रेड *
                  </label>
                  <select
                    name="quality"
                    value={formData.quality}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {qualities.map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Storage Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location / भंडारण स्थान *
                </label>
                <input
                  type="text"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Warehouse Delhi, Sector 12"
                />
              </div>

              {/* Warehouse Operator */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Operator / वेयरहाउस ऑपरेटर *
                </label>
                <input
                  type="text"
                  name="warehouseOperator"
                  value={formData.warehouseOperator}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Central Warehousing Corporation"
                />
              </div>

              {/* Moisture Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moisture Content (%) / नमी की मात्रा (%)
                </label>
                <input
                  type="number"
                  name="moistureContent"
                  value={formData.moistureContent}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 12.5"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks / टिप्पणी
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional information..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating NFT Receipt...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Create NFT Receipt / NFT रसीद बनाएं</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                What happens next? / आगे क्या होता है?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your receipt will be minted as an NFT on Aptos blockchain</li>
                <li>• You can use this NFT as collateral for instant loans</li>
                <li>• The NFT represents ownership of your stored crops</li>
                <li className="font-hindi">• आपकी रसीद Aptos ब्लॉकचेन पर NFT के रूप में मिंट होगी</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}