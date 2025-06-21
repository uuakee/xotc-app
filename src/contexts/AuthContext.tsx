import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'sonner';

type UserLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5';

interface UserWallet {
  balance: string;
  balance_commission: string;
  balance_withdrawal: string;
  balance_withdrawal_commission: string;
  total_withdrawal: string;
  total_investment: string;
  total_commission: string;
  total_deposit: string;
  total_deposit_commission: string;
}

interface User {
  id: string;
  realName: string;
  cpf: string;
  phone: string;
  is_admin: boolean;
  level: UserLevel;
  points: number;
  wallet: UserWallet;
  referral_code: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const publicRoutes = ['/', '/register'];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const updateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get<{ user: User }>('https://sv2.xotc.lat/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.user) {
        throw new Error('Usuário não encontrado');
      }

      setUser(response.data.user);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      let errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário';
      if (errorMessage.startsWith('错误: ')) {
        errorMessage = errorMessage.replace('错误: ', '');
      }
      toast.error(errorMessage);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const login = async (cpf: string, password: string) => {
    try {
      const response = await axios.post<AuthResponse>('https://sv2.xotc.lat/api/v1/auth/login', {
        cpf,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      if (errorMessage.startsWith('错误: ')) {
        errorMessage = errorMessage.replace('错误: ', '');
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await updateUser();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.includes(router.pathname);
    const hasToken = !!localStorage.getItem('token');

    if (!isPublicRoute && !hasToken) {
      router.push('/');
    } else if (isPublicRoute && hasToken && user) {
      router.push('/dashboard');
    }
  }, [router.pathname, isLoading, user]);

  // Interceptor para tratar erros de autenticação
  useEffect(() => {
    // Interceptor de requisição para adicionar o token
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Interceptor de resposta para tratar erros de autenticação
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 