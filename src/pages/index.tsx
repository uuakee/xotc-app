import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

interface LoginResponse {
  user: {
    id: string;
    realName: string;
    cpf: string;
    phone: string;
    is_admin: boolean;
    level: string;
    points: number;
    wallet: {
      id: string;
      user_id: string;
      balance: string;
      balance_commission: string;
      balance_withdrawal: string;
      balance_withdrawal_commission: string;
      total_withdrawal: string;
      total_investment: string;
      total_commission: string;
      total_deposit: string;
      total_deposit_commission: string;
      created_at: string;
      updated_at: string;
    };
  };
  token: string;
}

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      const masked = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCpf(masked);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const cleanCpf = cpf.replace(/\D/g, "");

      if (!cleanCpf || !password) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      await login(cleanCpf, password);
    } catch (error) {
      // Erros já são tratados no contexto
      console.error("Erro no login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | XOTC</title>
        <meta 
          name="description" 
          content="Acesse sua conta e descubra um mundo de oportunidades para fazer seu dinheiro trabalhar por você." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="absolute inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          
          <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md border border-white/10 bg-card/30 backdrop-blur-xl shadow-xl shadow-black/10">
              <CardHeader className="space-y-6 pb-4s">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative h-16 w-48 md:w-56">
                    <Image
                      src="/logotype.svg"
                      alt="logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      Comece a investir agora
                    </h1>
                    <p className="text-sm text-muted-foreground/80 max-w-sm">
                      Acesse sua conta e descubra um mundo de oportunidades para fazer seu dinheiro trabalhar por você
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm font-medium inline-flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                    className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium inline-flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Senha
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all pr-10 h-12"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all font-medium h-12 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Entrando..." : "Acessar minha conta"}
                </Button>
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-xs text-muted-foreground/60">
                    Ainda não tem uma conta?{" "}
                    <a href="/register" className="text-[#d5eb2d] hover:underline">
                      Comece a investir
                    </a>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
