import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '@/contexts/AuthContext';
import { WithdrawalsProvider } from '@/contexts/WithdrawalsContext';
import { toast, Toaster } from 'sonner';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WithdrawalsProvider>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </WithdrawalsProvider>
    </AuthProvider>
  );
}
