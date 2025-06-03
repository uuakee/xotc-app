import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, Clock, Shield, HeadphonesIcon, AlertCircle
} from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

interface DepositResponse {
  message: string;
  deposit: {
    id: number;
    user_id: number;
    amount: number;
    api_ref: string;
    status: string;
    createdAt: string;
  };
  payment: {
    qr_code: string;
    expiration_date: string;
    amount: number;
  };
}

const presetValues = [50, 100, 250, 500, 1000, 2500];

export default function Deposit() {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/");
        return;
      }

      const response = await fetch("https://api.xotc.lat/v1/gateway/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          user_id: Number(userId)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao gerar depósito");
        return;
      }
      
      // Redireciona para a página de pagamento com os dados necessários
      router.push({
        pathname: "/deposit/payment",
        query: { 
          qr_code: data.payment.qr_code,
          amount: data.payment.amount,
          expiration_date: data.payment.expiration_date,
          deposit_id: data.deposit.id
        }
      });

    } catch (error: any) {
      console.error("Erro ao processar depósito:", error);
      toast.error("Erro ao gerar depósito. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <NavigationBar currentPath="/deposit" />
        </div>
      </div>
    );
  }

  return (
    <div className={spaceGrotesk.className}>
      <Toaster />
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Grid Background */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <div className="relative p-4 md:p-6 max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-xl font-bold text-foreground">Realizar Depósito</h1>
            <p className="text-sm text-muted-foreground mt-1">Escolha o valor para investir</p>
          </header>

          {/* Valor do Depósito */}
          <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Valor do Depósito</label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-12 h-14 bg-white/5 border-white/10 text-lg font-medium"
                      placeholder="0.00"
                      min="50"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                      R$
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {presetValues.map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      onClick={() => handlePresetClick(value)}
                      className={`h-12 border-white/10 ${
                        amount === value.toString() 
                          ? 'bg-[#d5eb2d] text-background border-transparent' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      R$ {value}
                    </Button>
                  ))}
                </div>

                <Button 
                  className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 h-14 text-lg font-medium"
                  disabled={!amount || Number(amount) < 50 || loading}
                  onClick={handleDeposit}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    <span>{loading ? "Gerando PIX..." : "Depositar Agora"}</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Regras e Informações */}
          <Card className="bg-card/30 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Informações Importantes</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Processamento Instantâneo</h3>
                    <p className="text-sm text-muted-foreground">Todos os depósitos são processados imediatamente após a confirmação</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Valor Mínimo</h3>
                    <p className="text-sm text-muted-foreground">O valor mínimo para depósito é de R$ 50,00</p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <HeadphonesIcon className="w-5 h-5 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Suporte 24/7</h3>
                    <p className="text-sm text-muted-foreground">Nossa equipe está disponível para ajudar em qualquer situação</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-[#d5eb2d]/10">
                  <AlertCircle className="w-5 h-5 text-[#d5eb2d] flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Verifique todos os dados antes de confirmar o depósito. Em caso de dúvidas, entre em contato com nosso suporte.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <NavigationBar currentPath="/deposit" />
      </div>
    </div>
  );
}
