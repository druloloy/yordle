import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/app/_providers/ThemeProvider';
import { Toaster } from './_components/atoms/toaster';
import { AppProvider } from './_providers/AppProvider';
import connectToDatabase from '@/database';
import { Header } from './_components/Header';

const geistSans = localFont({
  src: './_fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './_fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Yordle',
  description: 'Solve the yordle puzzle',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectToDatabase();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AppProvider>
            <Header />
            <main>{children}</main>
          </AppProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
