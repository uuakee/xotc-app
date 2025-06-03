import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { InvestmentCard } from "@/components/investment-card";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

interface Plan {
  id: string;
  name: string;
  price: string;
  days: number;
  profit: string;
  max_buy: number;
  level: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  amount: string;
  total_earnings: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
  plan: Plan;
}

export default function Investments() {
  const { user, isLoading: authLoading } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get<Investment[]>(
          'https://srv.xotc.lat/api/v1/users/investments'
        );

        setInvestments(response.data);
      } catch (error: any) {
        let message = error.response?.data?.message || 'Erro ao carregar investimentos';
        if (message.startsWith('错误: ')) {
          message = message.replace('错误: ', '');
          if (message !== "Nenhum investimento encontrado") {
            toast.error(message);
          }
        } else {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchInvestments();
    }
  }, [router, authLoading]);

  // Calcula estatísticas
  const activeInvestments = investments.filter(inv => inv.is_active);
  const totalInvested = activeInvestments.reduce((total, inv) => total + parseFloat(inv.amount), 0);
  const totalDailyProfit = activeInvestments.reduce((total, inv) => {
    const amount = parseFloat(inv.amount);
    const profit = parseFloat(inv.plan.profit);
    return total + (amount * (profit / 100));
  }, 0);

  if (loading || authLoading) {
    return (
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d5eb2d]" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Investimentos | XOTC</title>
        <meta 
          name="description" 
          content="Gerencie seus investimentos na XOTC. Acompanhe seus planos ativos e rendimentos." 
        />
      </Head>
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          {/* Grid Background */}
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

          <div className="relative p-4 md:p-6 max-w-4xl mx-auto pb-24">
            <header className="mb-6">
              <h1 className="text-xl font-bold text-foreground">Meus Investimentos</h1>
              <p className="text-sm text-muted-foreground mt-1">Acompanhe seus investimentos ativos</p>
            </header>

            {/* Cards de Resumo */}
            <div className="flex flex-col gap-3 mb-8">
              <Card className="bg-card/30 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-[#d5eb2d]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground/60">Total Investido</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-2xl font-bold text-foreground">
                          R$ {totalInvested.toFixed(2)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#d5eb2d]/10 text-[#d5eb2d] font-medium">
                          {activeInvestments.length} planos
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/30 backdrop-blur-xl border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#d5eb2d]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground/60">Retorno Diário</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-2xl font-bold text-[#d5eb2d]">
                          R$ {totalDailyProfit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investimentos Ativos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-foreground">Investimentos Ativos</h2>
                <span className="text-xs text-muted-foreground">
                  {activeInvestments.length} ativos
                </span>
              </div>

              <div className="space-y-3">
                {activeInvestments.map(investment => (
                  <InvestmentCard key={investment.id} investment={investment} />
                ))}

                {activeInvestments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não tem investimentos ativos
                  </div>
                )}
              </div>
            </div>
          </div>

          <NavigationBar currentPath="/investments" />
          <Toaster richColors />
        </div>
      </div>
    </>
  );
}
