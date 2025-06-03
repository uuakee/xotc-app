import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '@/contexts/AuthContext';
import { WithdrawalsProvider } from '@/contexts/WithdrawalsContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WithdrawalsProvider>
        <Component {...pageProps} />
      </WithdrawalsProvider>
    </AuthProvider>
  );
}
