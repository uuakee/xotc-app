import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { consultarCPF } from "@/services/cpfApi";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
  });   

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    phone: string;
    balance: number;
    referral_code: string;
    vip_level: string;
    is_admin: boolean;
  };
  token: string;
}

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cpfVerificado, setCpfVerificado] = useState(false);
  const [verificandoCpf, setVerificandoCpf] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const router = useRouter();

  // Pega o código de referral da URL
  useEffect(() => {
    const { r, referal_code } = router.query;
    if (r) {
      setInviteCode(r as string);
    } else if (referal_code) {
      setInviteCode(referal_code as string);
    }
  }, [router.query]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      const masked = value
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2");
      setPhone(masked);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      const masked = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setCpf(masked);
      setCpfVerificado(false);
    }
  };

  const verificarCPF = async () => {
    try {
      setVerificandoCpf(true);
      const cpfLimpo = cpf.replace(/\D/g, "");
      const response = await consultarCPF(cpfLimpo);

      if (response.code === 200 && response.data) {
        setNomeCompleto(response.data.nome);
        setCpfVerificado(true);
        toast.success("CPF verificado com sucesso!");
      } else {
        toast.error(response.message || "CPF não encontrado");
        setCpfVerificado(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao verificar CPF");
      setCpfVerificado(false);
    } finally {
      setVerificandoCpf(false);
    }
  };

  const handleRegister = async () => {
    try {
      if (!cpfVerificado) {
        toast.error("Por favor, verifique seu CPF antes de continuar");
        return;
      }

      if (!phone || !password || !confirmPassword) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (password.length < 8) {
        toast.error("A senha deve ter no mínimo 8 caracteres");
        return;
      }

      if (!acceptedTerms) {
        toast.error("Você precisa aceitar os termos e condições");
        return;
      }

      setLoading(true);

      const cleanPhone = phone.replace(/\D/g, "");
      const cleanCpf = cpf.replace(/\D/g, "");
      
      const payload = {
        realName: nomeCompleto,
        cpf: cleanCpf,
        phone: cleanPhone,
        password,
        referral_code: inviteCode || undefined
      };

      const response = await fetch("https://srv.xotc.lat/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      // Salva os dados do usuário
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(data.user.id));

      toast.success("Conta criada com sucesso!");

      // Redireciona para o dashboard
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast.error(error.message || "Erro ao criar conta. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden">
        {/* Grid Background com container ajustado */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="absolute inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
      
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border border-white/10 bg-card/30 backdrop-blur-xl shadow-xl shadow-black/10">
          <CardHeader className="space-y-6 pb-8">
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
                  Comece sua jornada
                </h1>
                <p className="text-sm text-muted-foreground/80 max-w-sm">
                  Crie sua conta agora e faça parte de uma nova geração de investidores
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
              <div className="flex gap-2">
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  disabled={cpfVerificado}
                  className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all h-12"
                />
                <Button
                  onClick={verificarCPF}
                  disabled={verificandoCpf || cpfVerificado || cpf.length < 14}
                  className="bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all font-medium h-12 px-4"
                >
                  {verificandoCpf ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            </div>

            {cpfVerificado && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={nomeCompleto}
                  disabled
                  className="bg-background/50 border-white/10 transition-all h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Número de telefone
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 9 0000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all pl-18 h-12"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  🇧🇷 +55
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirme sua senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteCode" className="text-sm font-medium inline-flex items-center gap-2">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Código de convite
              </Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Digite o código de convite (opcional)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all h-12"
                disabled={!!inviteCode}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked: boolean) => setAcceptedTerms(checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 data-[state=checked]:bg-[#d5eb2d] data-[state=checked]:border-[#d5eb2d] transition-colors"
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground/80">
                  Li e aceito os Termos e Condições de uso e a Política de Privacidade, e concordo em receber comunicações.
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button 
              className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all font-medium h-12 hover:scale-[1.02] active:scale-[0.98]"
              disabled={!acceptedTerms || loading}
              onClick={handleRegister}
            >
              {loading ? "Criando conta..." : "Criar minha conta"}
            </Button>
            <p className="text-xs text-muted-foreground/60 text-center">
              Já tem uma conta?{" "}
              <Link href="/" className="text-[#d5eb2d] hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
    </div>
  );
}
