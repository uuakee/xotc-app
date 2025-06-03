import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, Shield, Star, LogOut, 
  ChevronRight, Wallet, Lock, Headset, ArrowDown
} from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

// Função para formatar o nível
const formatLevel = (level: string) => {
  return level.replace('LEVEL_', 'Nível ');
};

// Função para formatar o nome
const formatName = (fullName: string) => {
  const names = fullName.split(' ');
  if (names.length === 1) return names[0];
  return `${names[0]} ${names[names.length - 1]}`;
};

export default function Profile() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  if (isLoading) {
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
        <title>Perfil | XOTC</title>
        <meta 
          name="description" 
          content="Gerencie seu perfil na XOTC. Configure suas preferências e acesse informações importantes." 
        />
      </Head>
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          {/* Grid Background */}
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

          <div className="relative p-4 md:p-6 max-w-4xl mx-auto">
            {/* Perfil Header */}
            <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-white/5 border-2 border-[#d5eb2d] p-1">
                      <div className="h-full w-full rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-12 h-12 text-[#d5eb2d]" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#d5eb2d] flex items-center justify-center">
                      <Star className="w-4 h-4 text-background" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <h1 className="text-xl font-bold text-foreground">
                        {formatName(user.realName)}
                      </h1>
                      <span className="text-sm px-2 py-1 rounded-full bg-[#d5eb2d]/10 text-[#d5eb2d] font-medium">
                        {formatLevel(user.level)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              {/* Engajamento */}
              <Card className="bg-card/30 backdrop-blur-xl border-white/10 mt-8">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-[#d5eb2d]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Plataforma Verificada</h3>
                          <p className="text-sm text-muted-foreground">Seus investimentos protegidos</p>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {[1,2,3].map((i) => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-[#d5eb2d]/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-[#d5eb2d]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Rendimento Max.</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-[#d5eb2d]">7.2%</span>
                          <span className="text-xs text-emerald-400">+0.2%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Tempo Médio</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-foreground">120</span>
                          <span className="text-xs text-muted-foreground">dias</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-5 w-5 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                          <span className="text-xs text-[#d5eb2d]">✓</span>
                        </div>
                        <span>Saques instantâneos 24/7</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-5 w-5 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                          <span className="text-xs text-[#d5eb2d]">✓</span>
                        </div>
                        <span>Suporte dedicado via chat</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-5 w-5 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                          <span className="text-xs text-[#d5eb2d]">✓</span>
                        </div>
                        <span>Sistema anti-fraude avançado</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all h-12"
                      onClick={() => router.push('/dashboard')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <span className="font-medium">Começar a Investir</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Menu de Opções */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground px-1">Configurações</h2>

              <Card className="bg-card/30 backdrop-blur-xl border-white/10">
                <CardContent className="p-2">
                  <div className="divide-y divide-white/5">
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                      onClick={() => router.push('/last-withdrawals')}
                    >
                      <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                        <ArrowDown className="w-5 h-5 text-[#d5eb2d]" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-foreground">Histórico de Retiradas</h3>
                        <p className="text-sm text-muted-foreground">Veja todas as retiradas realizadas</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                        <Headset className="w-5 h-5 text-[#d5eb2d]" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-foreground">Suporte do Telegram</h3>
                        <p className="text-sm text-muted-foreground">Especialistas disponíveis 24/7</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <button 
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#d5eb2d]" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-foreground">Segurança</h3>
                        <p className="text-sm text-muted-foreground">Altere sua senha</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <button 
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                      onClick={logout}
                    >
                      <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-red-500">Sair</h3>
                        <p className="text-sm text-muted-foreground">Encerrar sessão</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <NavigationBar currentPath="/profile" />
        </div>

        <ChangePasswordDialog 
          open={showPasswordDialog} 
          onOpenChange={setShowPasswordDialog} 
        />
        <Toaster richColors />
      </div>
    </>
  );
}
