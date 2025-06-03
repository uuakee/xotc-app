import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/navigation-bar";
import Head from "next/head";
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/router';
import { useAuth } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  available: boolean;
}

// Dados mockados dos itens do marketplace
const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    name: "Bônus de R$ 10",
    description: "Troque seus pontos por um bônus de R$ 10 em sua conta",
    points: 1000,
    image: "/bonus.png",
    available: true,
  },
  {
    id: "2",
    name: "Cashback 5%",
    description: "5% de cashback em seu próximo depósito",
    points: 2000,
    image: "/cashback.png",
    available: true,
  },
  {
    id: "3",
    name: "Level 2",
    description: "Acesso Level 2 à plataforma por 7 dias, ganhe mais comissões.",
    points: 5000,
    image: "/vip.png",
    available: true,
  },
  {
    id: "4",
    name: "Bônus de R$ 50",
    description: "Troque seus pontos por um bônus de R$ 50 em sua conta",
    points: 8000,
    image: "/bonus-50.png",
    available: true,
  },
  {
    id: "5",
    name: "Chaveiro Exclusivo XOTC",
    description: "Chaveiro personalizado com o logo da XOTC",
    points: 3000,
    image: "/keychain.png",
    available: true,
  },
  {
    id: "6",
    name: "Camiseta Premium XOTC",
    description: "Camiseta exclusiva com design especial da XOTC",
    points: 6000,
    image: "/tshirt.png",
    available: true,
  }
];

export default function Marketplace() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExchange = async (item: MarketplaceItem) => {
    try {
      if (!user) {
        toast.error("Você precisa estar logado para trocar pontos");
        return;
      }

      if (user.points < item.points) {
        toast.error("Pontos insuficientes para realizar esta troca");
        return;
      }

      // Aqui você implementaria a lógica de troca com o backend
      toast.success(`Troca realizada com sucesso! Você recebeu: ${item.name}`);
    } catch (error) {
      toast.error("Erro ao realizar a troca. Tente novamente.");
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
        <title>Marketplace | XOTC</title>
        <meta 
          name="description" 
          content="Troque seus pontos por recompensas exclusivas na XOTC." 
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
            </header>

            <div className="flex items-center justify-center gap-3 mb-8">
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
            </div>

            <div className="text-center mb-12">
              <p className="text-white/50 text-sm">
                Ao adquirir planos você acumula pontos e pode trocar por itens exclusivos
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Itens Disponíveis</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MARKETPLACE_ITEMS.map((item) => (
                  <Card 
                    key={item.id}
                    className="bg-card/30 backdrop-blur-xl border-white/5 hover:border-[#d5eb2d]/20 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                              <div className="absolute inset-0 bg-[#d5eb2d]/20 blur-md rounded-full" />
                              <div className="relative flex items-center justify-center w-full h-full">
                                <ShoppingBag className="w-6 h-6 text-[#d5eb2d]" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-[#d5eb2d]" />
                            <span className="text-sm font-medium text-foreground">{item.points} pontos</span>
                          </div>
                          <Button
                            variant="outline"
                            className="bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground transition-all h-9 relative cursor-not-allowed"
                            disabled
                          >
                            <span>Comprar</span>
                            <div className="absolute -top-2 -right-2">
                              <span className="bg-[#d5eb2d] text-[10px] text-background px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                                Em breve
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <NavigationBar currentPath="/marketplace" />
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
      `}</style>
    </>
  );
}
