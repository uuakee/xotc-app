import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, Clock, AlertCircle, Calculator, 
  CreditCard, ArrowDownCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavigationBar } from "@/components/navigation-bar";
import { useState } from "react";
import router from "next/router"; 
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
  
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
  });

const presetValues = [100, 250, 500, 1000, 2500, 5000];

type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "PHONE";

interface WithdrawalResponse {
  success: boolean;
  transaction_id: string;
  amount: number;
  status: string;
}

export default function Withdraw() {
  
  const [amount, setAmount] = useState<string>('');
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>("CPF");
  const [pixKey, setPixKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlePresetClick = (value: number) => {
    setAmount(value.toString());
  };

  const calculateNetAmount = (gross: number) => {
    const fee = gross * 0.05;
    return gross - fee;
  };

  const getPixKeyPlaceholder = () => {
    switch(pixKeyType) {
      case "CPF": return "000.000.000-00";
      case "CNPJ": return "00.000.000/0000-00";
      case "EMAIL": return "seu@email.com";
      case "PHONE": return "+55 (00) 00000-0000";
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/");
        return;
      }

      if (!amount || Number(amount) <= 0) {
        toast.error("Por favor, informe um valor válido para o saque.");
        return;
      }

      if (!pixKey) {
        toast.error("Por favor, informe a chave PIX para recebimento.");
        return;
      }

      const response = await fetch("https://sv2.xotc.lat/api/v1/payments/withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          pix_type: pixKeyType,
          pix_key: pixKey
        }),
      });

      const data: WithdrawalResponse = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao processar saque");
      }

      if (data.success) {
        toast.success("Solicitação de saque enviada com sucesso!");
        // Limpar campos após sucesso
        setAmount("");
        setPixKey("");
      } else {
        throw new Error("Erro ao processar saque");
      }
      
    } catch (error) {
      console.error("Erro ao processar saque:", error);
      toast.error("Erro ao processar saque. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Saque - XOTC</title>
        <meta 
          name="description" 
          content="Realize saques de forma rápida e segura com a XOTC. Saiba como funciona a taxa de saque e como receber seus rendimentos." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
          {/* Grid Background */}
          <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
          <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
          <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
          <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

          <div className="relative p-4 md:p-6 max-w-4xl mx-auto">
            <header className="mb-6 flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-foreground">Realizar Saque</h1>
                    <p className="text-sm text-muted-foreground mt-1">Escolha o valor e informe seus dados</p>
                </div>
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-[#d5eb2d] transition-all h-12 w-12 p-0"
                onClick={() => {
                    window.location.href = '/last-withdrawals';
                }}
                >
                    <Clock className="w-5 h-5" />
                </Button>
            </header>

            {/* Valor do Saque */}
            <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Valor do Saque</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-12 h-14 bg-white/5 border-white/10 text-lg font-medium"
                        placeholder="0.00"
                        min="100"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                        R$
                      </div>
                    </div>
                    {amount && (
                      <div className="flex items-center justify-between px-1 mt-2">
                        <span className="text-sm text-muted-foreground">Taxa (5%)</span>
                        <span className="text-sm text-muted-foreground">
                          R$ {(Number(amount) * 0.05).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {amount && (
                      <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-medium text-foreground">Você receberá</span>
                        <span className="text-sm font-medium text-[#d5eb2d]">
                          R$ {calculateNetAmount(Number(amount)).toFixed(2)}
                        </span>
                      </div>
                    )}
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Tipo de Chave PIX</label>
                      <Select
                        value={pixKeyType}
                        onValueChange={(value) => setPixKeyType(value as PixKeyType)}
                      >
                        <SelectTrigger className="h-14 bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                          <SelectItem value="EMAIL">E-mail</SelectItem>
                          <SelectItem value="PHONE">Telefone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Chave PIX</label>
                      <Input
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="h-14 bg-white/5 border-white/10"
                        placeholder={getPixKeyPlaceholder()}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 h-14 text-lg font-medium"
                    disabled={!amount || !pixKey || Number(amount) < 100 || loading}
                    onClick={handleWithdraw}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowDownCircle className="w-5 h-5" />
                      <span>{loading ? "Processando..." : "Solicitar Saque"}</span>
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
                      <h3 className="font-medium text-foreground">Tempo de Processamento</h3>
                      <p className="text-sm text-muted-foreground">Os saques podem levar até 2 horas para serem processados</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-[#d5eb2d]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Taxa de Saque</h3>
                      <p className="text-sm text-muted-foreground">É cobrada uma taxa de 15% sobre o valor do saque</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#d5eb2d]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Valor Mínimo</h3>
                      <p className="text-sm text-muted-foreground">O valor mínimo para saque é de R$ 100,00</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 rounded-lg bg-[#d5eb2d]/10">
                    <AlertCircle className="w-5 h-5 text-[#d5eb2d] flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      Confira todos os dados antes de solicitar o saque. A chave PIX informada deve estar em seu nome.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <NavigationBar currentPath="/withdraw" />
        </div>
      </div>
    </>
  );
}
