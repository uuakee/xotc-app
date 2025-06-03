import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users, Wallet, Crown, Star, Trophy, Medal, Sparkles } from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
  });

interface Referral {
  id: string;
  name: string;
  level: string;
  joined_at: string;
  total_invested: string;
}

interface ReferralStats {
  total_referrals: number;
  total_commission: string;
  available_commission: string;
  referrals: Referral[];
  recent_commissions: any[];
}

export default function Team() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!authUser?.id) return;

        const response = await axios.get<ReferralStats>(
          'https://srv.xotc.lat/api/v1/users/referral/stats'
        );

        setStats(response.data);
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        let message = error.response?.data?.message || "Erro ao carregar dados da equipe";
        if (message.startsWith('错误: ')) {
          message = message.replace('错误: ', '');
        }
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
    fetchData();
    }
  }, [authUser?.id, authLoading]);

  const handleCopyReferralLink = async () => {
    if (!authUser) return;
    
    const link = `https://xotc.lat/r/${authUser.referral_code}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado com sucesso!");
    } catch (err) {
      toast.error("Erro ao copiar link");
    }
  };

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

  if (!authUser) {
    router.push('/');
    return null;
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Minha Rede | XOTC</title>
        <meta 
          name="description" 
          content="Gerencie sua rede de indicados na XOTC. Acompanhe suas comissões e progresso." 
        />
      </Head>
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <div className="relative p-4 md:p-6 max-w-4xl mx-auto pb-24">
        <header className="mb-6">
            <h1 className="text-xl font-bold text-foreground">Minha Rede</h1>
              <p className="text-sm text-muted-foreground mt-1">Acompanhe seus indicados e comissões</p>
          </header>

          {/* Header com Estatísticas */}
          <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#d5eb2d]" />
                      </div>
                      <span className="text-sm text-muted-foreground">Indicados</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-foreground">{stats.total_referrals}</span>
                      <span className="text-sm text-[#d5eb2d]">ativos</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-[#d5eb2d]" />
                      </div>
                        <span className="text-sm text-muted-foreground">Comissões Disponíveis</span>
                      </div>
                      <span className="text-xl font-bold text-[#d5eb2d]">
                        R$ {parseFloat(stats.available_commission).toFixed(2)}
                      </span>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Link de Indicação */}
          <Card className="bg-card/20 backdrop-blur-xl border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-foreground">Seu Link</h2>
                      <p className="text-sm text-muted-foreground">Compartilhe e ganhe comissões</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-sm font-medium text-foreground flex-1 truncate">
                      https://xotc.lat/r/{authUser.referral_code}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-[#d5eb2d]/10 text-[#d5eb2d]"
                    onClick={handleCopyReferralLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Lista de Indicados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">Níveis de Comissão</h2>
                  <p className="text-sm text-muted-foreground">Quanto mais você indica, maior sua comissão</p>
              </div>
            </div>

              <div className="space-y-3">
                {/* Level 1 - Master */}
                <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d5eb2d]/20 to-transparent" />
                  <CardContent className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#d5eb2d] to-[#d5eb2d]/50 flex items-center justify-center text-background font-bold text-sm sm:text-base">
                          L1
                  </div>
                      <div>
                          <h3 className="font-semibold text-foreground">Level Master</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d5eb2d] text-background font-medium">
                              12% por indicação
                          </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-[52px] sm:pl-[60px]">
                        Alcance o nível máximo e ganhe as maiores comissões
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Level 2 - Expert */}
                <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d5eb2d]/15 to-transparent" />
                  <CardContent className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#d5eb2d]/80 to-[#d5eb2d]/40 flex items-center justify-center text-background font-bold text-sm sm:text-base">
                          L2
                        </div>
                      <div>
                          <h3 className="font-semibold text-foreground">Level Expert</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d5eb2d]/80 text-background font-medium">
                              9% por indicação
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-[52px] sm:pl-[60px]">
                        Aumente sua rede e maximize seus ganhos
                      </p>
                </div>
              </CardContent>
            </Card>

                {/* Level 3 - Pro */}
                <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d5eb2d]/10 to-transparent" />
                  <CardContent className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#d5eb2d]/60 to-[#d5eb2d]/30 flex items-center justify-center text-background font-bold text-sm sm:text-base">
                          L3
                  </div>
                      <div>
                          <h3 className="font-semibold text-foreground">Level Pro</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d5eb2d]/60 text-background font-medium">
                              6% por indicação
                          </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-[52px] sm:pl-[60px]">
                        Continue crescendo e alcance novos patamares
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Level 4 - Advanced */}
                <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d5eb2d]/5 to-transparent" />
                  <CardContent className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#d5eb2d]/40 to-[#d5eb2d]/20 flex items-center justify-center text-background font-bold text-sm sm:text-base">
                          L4
                        </div>
                      <div>
                          <h3 className="font-semibold text-foreground">Level Advanced</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d5eb2d]/40 text-background font-medium">
                              3% por indicação
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-[52px] sm:pl-[60px]">
                        Expanda sua rede e aumente suas comissões
                      </p>
                </div>
              </CardContent>
            </Card>

                {/* Level 5 - Starter */}
                <Card className="bg-card/30 backdrop-blur-xl border-white/10 relative overflow-hidden">
                  <CardContent className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-[#d5eb2d]/20 to-[#d5eb2d]/10 flex items-center justify-center text-background font-bold text-sm sm:text-base">
                          L5
                  </div>
                      <div>
                          <h3 className="font-semibold text-foreground">Level Starter</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d5eb2d]/20 text-[#d5eb2d] font-medium">
                            1% por indicação
                          </span>
                    </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground pl-[52px] sm:pl-[60px]">
                        Comece sua jornada e ganhe suas primeiras comissões
                      </p>
                </div>
              </CardContent>
            </Card>
              </div>

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#d5eb2d]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">Como funciona?</h4>
                  <p className="text-sm text-muted-foreground">
                      Comece no Level 5 com 1% de comissão e evolua até o Level 1 com 12%. Quanto mais pessoas você indicar, maior será seu nível e suas comissões sobre os investimentos dos seus indicados.
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NavigationBar currentPath="/team" />
      </div>
    </>
  );
}
