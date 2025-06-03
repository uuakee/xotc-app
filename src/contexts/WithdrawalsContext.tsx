import { createContext, useContext, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

interface Withdrawal {
  id: string;
  user_id: string;
  by_user_id: string | null;
  amount: string;
  plan_id: string | null;
  pix_key: string | null;
  pix_type: string | null;
  user_document: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: 'WITHDRAWAL';
  created_at: string;
  completed_at: string | null;
}

interface WithdrawalsContextData {
  withdrawals: Withdrawal[];
  isLoading: boolean;
  stats: {
    totalAmount: number;
    pendingCount: number;
    completedCount: number;
    failedCount: number;
    totalCount: number;
  };
  fetchWithdrawals: () => Promise<void>;
}

const WithdrawalsContext = createContext<WithdrawalsContextData | undefined>(undefined);

export function WithdrawalsProvider({ children }: { children: ReactNode }) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const calculateStats = (withdrawals: Withdrawal[]) => {
    return {
      totalAmount: withdrawals.reduce((total, w) => total + parseFloat(w.amount), 0),
      pendingCount: withdrawals.filter(w => w.status === 'PENDING').length,
      completedCount: withdrawals.filter(w => w.status === 'COMPLETED').length,
      failedCount: withdrawals.filter(w => w.status === 'FAILED').length,
      totalCount: withdrawals.length
    };
  };

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        router.push('/');
        return;
      }

      setIsLoading(true);
      const response = await axios.get<Withdrawal[]>('https://srv.xotc.lat/api/v1/users/withdrawals', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWithdrawals(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar saques:', error);
      
      // Se o erro for 401, redireciona para o login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
        return;
      }

      let message = error.response?.data?.message || 'Erro ao carregar saques';
      if (message.startsWith('错误: ')) {
        message = message.replace('错误: ', '');
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWithdrawals();
    }
  }, [user]);

  return (
    <WithdrawalsContext.Provider 
      value={{ 
        withdrawals, 
        isLoading,
        stats: calculateStats(withdrawals),
        fetchWithdrawals
      }}
    >
      {children}
    </WithdrawalsContext.Provider>
  );
}

export function useWithdrawals() {
  const context = useContext(WithdrawalsContext);
  if (context === undefined) {
    throw new Error('useWithdrawals must be used within a WithdrawalsProvider');
  }
  return context;
} 