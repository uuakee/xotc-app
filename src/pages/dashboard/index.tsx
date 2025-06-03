import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, Bell, Clock, Gift, Plus, PartyPopper, Coins, X, AlertCircle, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/navigation-bar";
import Head from "next/head";
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/router';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { PlanCard } from "@/components/plan-card";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
  });

interface CurrencyData {
  code: string;
  bid: string;
  pctChange: string;
}

interface UserData {
  user: {
    id: number;
    phone: string;
    balance: number;
    referral_code: string;
    commission_total: number;
    earnings_total: number;
    invested_total: number;
    vip_level: string;
  };
  estatisticas: {
    total_referrals: number;
    total_investido: number;
    total_ganhos: number;
    total_comissoes: number;
    saldo_atual: number;
  };
}

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

export default function Dashboard() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    checkWelcomeModal();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const pairs = ['USD-BRL', 'EUR-BRL', 'GBP-BRL', 'BTC-BRL', 'ETH-BRL'];
        const responses = await Promise.all(
          pairs.map(pair => axios.get(`https://economia.awesomeapi.com.br/last/${pair}`))
        );
        
        const newCurrencies = responses.map(response => {
          const data = Object.values(response.data)[0] as any;
          return {
            code: data.code,
            bid: Number(data.bid).toFixed(2),
            pctChange: Number(data.pctChange).toFixed(2)
          };
        });
        
        setCurrencies(newCurrencies);
      } catch (error) {
        console.error('Erro ao buscar cotações:', error);
      }
    };

    fetchCurrencies();
    const interval = setInterval(fetchCurrencies, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/');
          return;
        }

        const response = await axios.get<Plan[]>(
          'https://srv.xotc.lat/api/v1/plans/list',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Ordenar planos por nível (decrescente)
        const sortedPlans = response.data.sort((a, b) => {
          const levelA = parseInt(a.level.replace('LEVEL_', ''));
          const levelB = parseInt(b.level.replace('LEVEL_', ''));
          return levelB - levelA;
        });
        
        setPlans(sortedPlans);
      } catch (error) {
        toast.error('Erro ao carregar planos disponíveis');
      }
    };

    fetchPlans();
  }, [router]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const checkGiftAvailability = () => {
    const lastGift = localStorage.getItem('lastGiftClaim');
    if (lastGift) {
      const lastClaimDate = new Date(lastGift);
      const now = new Date();
      const diffHours = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        const hoursLeft = Math.ceil(24 - diffHours);
        const minutesLeft = Math.ceil((24 - diffHours) * 60) % 60;
        setTimeLeft(`${hoursLeft}h${minutesLeft}m`);
        setShowErrorDialog(true);
        return false;
      }
    }
    return true;
  };

  const handleGiftClick = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/");
        return;
      }

      const response = await fetch("https://api.xotc.lat/v1/user/take-gift", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Mostra dialog de sucesso
        setShowGiftDialog(true);
        setShowErrorDialog(false);
        toast.success("Presente diário de R$ 5,00 resgatado com sucesso!");
      } else {
        // Se já resgatou hoje
        if (response.status === 400) {
          setTimeLeft("24h00m"); // Define um tempo padrão
          setShowErrorDialog(true);
          setShowGiftDialog(false);
          toast.error("Você já resgatou seu presente hoje!");
        } 
        // Se usuário não encontrado
        else if (response.status === 404) {
          toast.error("Usuário não encontrado");
          router.push("/");
        } 
        // Outros erros
        else {
          toast.error("Erro ao resgatar presente diário");
        }
      }
    } catch (error) {
      console.error("Erro ao resgatar presente:", error);
      toast.error("Erro ao resgatar presente diário");
    }
  };

  const checkWelcomeModal = () => {
    const lastDismissed = localStorage.getItem('welcomeModalDismissed');
    
    if (lastDismissed) {
      const dismissedDate = new Date(lastDismissed);
      const now = new Date();
      const diffHours = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours >= 48) {
        setShowWelcomeModal(true);
        localStorage.removeItem('welcomeModalDismissed');
      }
    } else {
      setShowWelcomeModal(true);
    }
  };

  const handleDontShowAgain = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('welcomeModalDismissed', new Date().toISOString());
    } else {
      localStorage.removeItem('welcomeModalDismissed');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d5eb2d]"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | XOTC</title>
        <meta 
          name="description" 
          content="Gerencie seus investimentos na XOTC. Acompanhe seu saldo, rendimentos e histórico de transações em tempo real." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors duration={4000} />
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          {/* Grid Background */}
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

          <div className="relative p-4 md:p-6 max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
              <div className="relative h-8 w-32">
                <Image
                  src="/logotype.svg"
                  alt="XOTC"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="text-sm">
                  {mounted && currentTime ? (
                    <>
                      <span className="font-medium text-muted-foreground">{formatTime(currentTime)}</span>
                    </>
                  ) : (
                    <span className="opacity-0">00:00:00</span>
                  )}
                </div>
              </div>
            </header>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 bg-[#d5eb2d]/20 blur-md rounded-full" />
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Coins className="w-4 h-4 text-[#d5eb2d]" />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user?.points || '0'} pontos
                </span>
              </div>

              <Button
                variant="outline"
                className="cursor-pointer bg-white/5 border-white/10 hover:bg-[#d5eb2d]/10 hover:text-[#d5eb2d] hover:border-[#d5eb2d]/20 transition-all text-muted-foreground text-sm px-4 py-1.5 h-auto relative overflow-hidden"
                onClick={() => router.push('/marketplace')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer-smooth" />
                <span className="relative z-10">Marketplace</span>
              </Button>
            </div>

            <Card className="bg-card/30 backdrop-blur-xl border-white/5 shadow-xl shadow-black/10">
              <CardContent className="p-4">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground/80">Saldo Total</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#d5eb2d]" />
                      <span className="text-sm font-medium text-[#d5eb2d]">Nível {user?.level.replace('LEVEL_', '')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      R$ {((Number(user?.wallet?.balance) || 0) + (Number(user?.wallet?.balance_withdrawal) || 0)).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-8 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground/60">Investido</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          R$ {user?.wallet.total_investment || '0,00'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground/60">Rendimento</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#d5eb2d]">
                          R$ {user?.wallet.balance_commission || '0,00'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground/60">Indicações</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#d5eb2d]">
                          R$ {user?.wallet.total_commission || '0,00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <Button 
                  className="flex-1 bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all h-12 gap-2 font-medium"
                  onClick={() => {
                    window.location.href = '/deposit';
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Depositar</span>
                </Button>

                <Button 
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-foreground transition-all h-12 gap-2 font-medium"
                  onClick={() => {
                    window.location.href = '/withdraw';
                  }}
                >
                  <ArrowDown className="w-5 h-5" />
                  <span>Retirar</span>
                </Button>

                <Button 
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground transition-all h-12 w-12 p-0 relative cursor-not-allowed opacity-50"
                  disabled
                  title="Em breve"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse">
                      <Gift className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-[#d5eb2d] text-[10px] text-background px-1.5 py-0.5 rounded-full font-medium">
                      Em breve
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Telão de Cotação de Moedas */}
            <div className="mt-8">
              <Card className="border-white/10 bg-card/30 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full overflow-hidden">
                    <div className="animate-ticker flex gap-8 items-center whitespace-nowrap">
                      {[...currencies, ...currencies].map((currency, index) => (
                        <div
                          key={`${currency.code}-${index}`}
                          className="flex items-center gap-3 px-4"
                        >
                          <span className="font-medium text-sm text-muted-foreground/60">
                            {currency.code}/BRL
                          </span>
                          <span className="font-bold text-foreground">
                            R$ {currency.bid}
                          </span>
                          <span className={`text-xs font-medium ${
                            Number(currency.pctChange) >= 0 
                              ? 'text-[#d5eb2d]' 
                              : 'text-red-500'
                          }`}>
                            {Number(currency.pctChange) >= 0 ? '+' : ''}{currency.pctChange}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Investimentos Disponíveis</h2>
                <Button 
                  variant="ghost" 
                  className="text-sm text-muted-foreground hover:text-[#d5eb2d]"
                
                >
                  Web3 Pool
                </Button>
              </div>

              <div className="grid gap-4">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onPurchase={() => {
                      // Atualiza os dados do usuário após a compra
                      const fetchUserData = async () => {
                        try {
                          const userId = localStorage.getItem('userId');
                          const token = localStorage.getItem('token');
                  
                          if (!userId || !token) {
                            router.push('/');
                            return;
                          }
                  
                          const response = await axios.get<UserData>(`https://api.xotc.lat/v1/user/${userId}`, {
                            headers: {
                              Authorization: `Bearer ${token}`
                            }
                          });
                  
                          await updateUser();
                        } catch (error: any) {
                          toast.error('Erro ao atualizar dados do usuário');
                        }
                      };
                      
                      fetchUserData();
                    }}
                  />
                ))}
                
                {plans.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum plano disponível no momento
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Substitua a navegação antiga pelo novo componente */}
          <NavigationBar currentPath="/dashboard" />

          <Dialog open={showGiftDialog} onOpenChange={(open: boolean) => {
            setShowGiftDialog(open);
            if (!open) {
              // Recarrega a página quando o dialog for fechado
              router.reload();
            }
          }}>
            <DialogContent className="bg-card/30 backdrop-blur-xl border-white/10 sm:max-w-[425px]">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="bg-[#d5eb2d] rounded-full p-4 shadow-xl shadow-[#d5eb2d]/20">
                  <PartyPopper className="w-8 h-8 text-background" />
                </div>
              </div>
              
              <DialogHeader className="pt-8 text-center space-y-2">
                <DialogTitle className="text-2xl font-bold">
                  Parabéns! 🎉
                </DialogTitle>
                <p className="text-muted-foreground">
                  Você recebeu um bônus especial!
                </p>
              </DialogHeader>

              <div className="flex flex-col items-center gap-6 py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#d5eb2d]/20 blur-2xl rounded-full" />
                  <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <Coins className="w-6 h-6 text-[#d5eb2d]" />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Bônus Recebido</span>
                      <span className="text-xl font-bold text-[#d5eb2d]">R$ 5,00</span>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Este valor já foi adicionado ao seu saldo!
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Continue investindo para receber mais bônus
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  className="bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all font-medium px-8"
                  onClick={() => {
                    setShowGiftDialog(false);
                    // O reload será acionado pelo onOpenChange acima
                  }}
                >
                  Continuar Investindo
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
            <DialogContent className="bg-card/30 backdrop-blur-xl border-white/10 sm:max-w-[425px]">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="bg-red-500/90 rounded-full p-4 shadow-xl shadow-red-500/20">
                  <AlertCircle className="w-8 h-8 text-background" />
                </div>
              </div>
              
              <DialogHeader className="pt-8 text-center space-y-2">
                <DialogTitle className="text-2xl font-bold">
                  Ops! Aguarde um pouco 🕒
                </DialogTitle>
                <p className="text-muted-foreground">
                  Você precisa esperar para receber outro bônus
                </p>
              </DialogHeader>

              <div className="flex flex-col items-center gap-6 py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                  <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Tempo Restante</span>
                      <span className="text-xl font-bold text-red-500">{timeLeft}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Você poderá receber um novo bônus em breve!
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Retorne após o tempo indicado
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  className="border-red-500/20 hover:bg-red-500/10 text-red-500 transition-all font-medium px-8"
                  onClick={() => setShowErrorDialog(false)}
                >
                  Entendi
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
            <DialogContent className="bg-card/30 backdrop-blur-xl border-white/10 sm:max-w-[425px]">
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="relative w-32 h-12">
                  <Image
                    src="/logotype.svg"
                    alt="XOTC"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold text-foreground">
                    Bem-vindo à XOTC
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tenha investimentos baseados em Web3 com altos rendimentos e segurança. Conheça agora nossa carteira de ativos e comece a lucrar hoje mesmo!
                  </p>
                </div>

                <Button
                  className="w-full bg-[#d5eb2d] hover:bg-[#d5eb2d]/90 text-black/80 gap-2"
                  onClick={() => window.open('https://t.me/xotcinvest', '_blank')}
                >
                  <MessageCircle className="w-5 h-5" />
                  Canal Oficial Telegram
                </Button>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="dontShow"
                    onCheckedChange={handleDontShowAgain}
                  />
                  <Label
                    htmlFor="dontShow"
                    className="text-sm text-muted-foreground"
                  >
                    Não mostrar esta mensagem novamente
                  </Label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 2s infinite linear;
          overflow: hidden;
        }

        @keyframes shimmer-smooth {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-shimmer-smooth {
          animation: shimmer-smooth 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
