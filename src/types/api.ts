export interface DashboardResponse {
  users: {
    total: number;
  };
  finances: {
    deposits: {
      total: string;
      count: number;
    };
    withdrawals: {
      total: string;
      count: number;
    };
    investments: {
      total: string;
      count: number;
      active: number;
    };
  };
  recentTransactions: Transaction[];
  plans: Plan[];
}

export interface Transaction {
  id: string;
  user_id: string;
  by_user_id: string | null;
  amount: string;
  plan_id: string | null;
  pix_key: string | null;
  pix_type: string | null;
  user_document: string | null;
  external_id: string | null;
  payment_method: string | null;
  gateway_response: any | null;
  status: "PENDING" | "COMPLETED";
  type: "DEPOSIT" | "WITHDRAWAL" | "INVESTMENT";
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  paid_at: string | null;
  user: {
    realName: string;
    cpf: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  days: number;
  profit: string;
  max_buy: number;
  level: UserLevel;
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4" | "LEVEL_5"

export interface Wallet {
  id: string
  user_id: string
  balance: string
  balance_commission: string
  balance_withdrawal: string
  balance_withdrawal_commission: string
  total_withdrawal: string
  total_investment: string
  total_commission: string
  total_deposit: string
  total_deposit_commission: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  realName: string
  phone: string
  cpf: string
  is_admin: boolean
  level: UserLevel
  points: number
  referral_code: string | null
  invited_by_id: string | null
  referral_count: number
  is_active: boolean
  last_login: string | null
  created_at: string
  wallet: Wallet[]
  transactions: Transaction[]
} 