import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface InvestmentCardProps {
  investment: Investment;
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  // Cálculos de rendimento
  const amount = parseFloat(investment.amount);
  const profit = parseFloat(investment.plan.profit);
  const dailyProfit = amount * (profit / 100);
  const totalEarnings = parseFloat(investment.total_earnings);

  // Formatação de datas
  const timeLeft = formatDistanceToNow(new Date(investment.expires_at), {
    locale: ptBR,
    addSuffix: true
  });

  return (
    <Card className="bg-card/30 backdrop-blur-xl border-white/10">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{investment.plan.name}</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground">
                  Término {timeLeft}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                R$ {amount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground/60">investido</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <span className="text-xs text-muted-foreground/60">Rendimento Diário</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-[#d5eb2d]">
                  {profit}%
                </span>
                <span className="text-xs text-muted-foreground/60">
                  R$ {dailyProfit.toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground/60">Total Ganho</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-[#d5eb2d]">
                  R$ {totalEarnings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-white/5">
            <Calendar className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground">
              Duração: <strong className="text-foreground">{investment.plan.days} dias</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 