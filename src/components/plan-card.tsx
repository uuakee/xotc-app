import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

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
  points?: number;
}

interface PlanCardProps {
  plan: Plan;
  onPurchase: (planId: string) => void;
}

const levelStyles = {
  LEVEL_1: {
    background: "bg-purple-500/20",
    text: "text-purple-300"
  },
  LEVEL_2: {
    background: "bg-blue-500/20",
    text: "text-blue-300"
  },
  LEVEL_3: {
    background: "bg-green-500/20",
    text: "text-green-300"
  },
  LEVEL_4: {
    background: "bg-yellow-500/20",
    text: "text-yellow-300"
  },
  LEVEL_5: {
    background: "bg-cyan-500/20",
    text: "text-cyan-300"
  }
};

export function PlanCard({ plan, onPurchase }: PlanCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Conversão de strings para números para cálculos
  const priceNumber = parseFloat(plan.price);
  const profitNumber = parseFloat(plan.profit);
  
  // Cálculo do rendimento diário em valor
  const dailyProfitAmount = (priceNumber * (profitNumber / 100));
  
  // Cálculo do rendimento total
  const totalProfitAmount = dailyProfitAmount * plan.days;
  
  // Cálculo das porcentagens
  const dailyProfitPercentage = profitNumber.toFixed(2);
  const totalProfitPercentage = ((totalProfitAmount / priceNumber) * 100).toFixed(2);
  
  const levelStyle = levelStyles[plan.level as keyof typeof levelStyles] || levelStyles.LEVEL_5;

  // Verifica se o plano tem pontos definidos e maiores que 0
  const points = plan.points || 0;
  const hasPoints = points > 0;

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.", {
          duration: 4000
        });
        window.location.href = "/";
        return;
      }

      const response = await axios.post(
        "https://sv2.xotc.lat/api/v1/users/investments/buy",
        { plan_id: plan.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const investment = response.data.investment;
        const expiryDate = new Date(investment.expires_at).toLocaleDateString('pt-BR');
        
        toast.success(`Plano adquirido com sucesso! Expira em ${expiryDate}`, {
          duration: 4000
        });
        onPurchase(plan.id);
      } else {
        throw new Error("Falha ao processar a compra");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Sessão expirada. Por favor, faça login novamente.", {
          duration: 4000
        });
        window.location.href = "/";
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          duration: 4000
        });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error, {
          duration: 4000
        });
      } else {
        toast.error("Erro ao adquirir o plano. Tente novamente.", {
          duration: 4000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {hasPoints && (
            <div className="absolute -top-2 right-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#d5eb2d]/20 blur-md rounded-full" />
                <div className="relative bg-[#d5eb2d] text-background text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>+{points} pontos</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between pt-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{plan.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60">Nível necessário:</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelStyle.background} ${levelStyle.text}`}>
                  {plan.level.replace('LEVEL_', 'Nível ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                R$ {parseFloat(plan.price).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground/60">por cota</div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 border-y border-white/5">
            <Calendar className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground">
              Duração: <strong className="text-foreground">{plan.days} dias</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/5">
            <div>
              <span className="text-xs text-muted-foreground/60">Rendimento Diário</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-[#d5eb2d]">
                  {dailyProfitPercentage}%
                </span>
                <span className="text-xs text-muted-foreground/60">
                  R$ {dailyProfitAmount.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground/60">Rendimento Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-[#d5eb2d]">
                  {totalProfitPercentage}%
                </span>
                <span className="text-xs text-muted-foreground/60">
                  R$ {totalProfitAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground/60">Você pode comprar</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  até {plan.max_buy}
                </span>
                <span className="text-xs text-muted-foreground/60">cotas</span>
              </div>
            </div>
            <Button 
              onClick={handlePurchase}
              disabled={isLoading}
              className={`${hasPoints ? 'bg-[#d5eb2d] hover:bg-[#d5eb2d]/90' : 'bg-[#d5eb2d] hover:bg-[#d5eb2d]/90'} text-background transition-all font-medium px-6 relative group`}
            >
              {isLoading ? "Comprando..." : (
                <>
                  <span>Comprar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 