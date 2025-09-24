import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import LanguageWrapper from '@/components/LanguageWrapper'

export const metadata = {
  title: 'Agri-Chain - किसान कोश',
  description: 'NFT-backed e-NWR collateral platform for farmers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <LanguageWrapper>
              <WalletProvider>
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
                  {children}
                </div>
              </WalletProvider>
            </LanguageWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}