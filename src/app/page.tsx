'use client';

import { useWallet } from '@/components/WalletProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { Wallet, Sprout, DollarSign, Shield } from 'lucide-react';

export default function HomePage() {
  const { walletState, connectWallet } = useWallet();
  const { t } = useLanguage();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (walletState.isConnected) {
      router.push('/dashboard');
    } else {
      await connectWallet();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              {t('app.title')}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSelector />
            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 btn-primary"
              disabled={walletState.isConnected}
            >
              <Wallet className="h-5 w-5" />
              <span>
                {walletState.isConnected
                  ? `${walletState.address?.slice(0, 6)}...${walletState.address?.slice(-4)}`
                  : t('header.connectWallet')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-primary-600 dark:text-primary-400">{t('hero.title.hindi')}</span>
            <br />
            <span className="text-3xl md:text-4xl">{t('hero.title.main')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4"
            >
              {t('hero.getStarted')}
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              {t('hero.learnMore')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {t('features.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card text-center">
            <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('features.deposit.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('features.deposit.description')}
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-secondary-100 dark:bg-secondary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('features.loan.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('features.loan.description')}
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {t('features.secure.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('features.secure.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 dark:bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white dark:bg-gray-100 text-primary-600 dark:text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
          >
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sprout className="h-6 w-6 text-primary-400" />
            <span className="text-xl font-bold">{t('app.title')}</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            {t('footer.tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}