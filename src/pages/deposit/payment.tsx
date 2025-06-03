import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, Copy, CheckCircle2, ArrowLeft
} from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export default function DepositPayment() {
  const router = useRouter();
  const { qr_code, amount, expiration_date, deposit_id } = router.query;
  const [copied, setCopied] = useState(false);

  // Protege a rota
  useEffect(() => {
    if (!qr_code || !amount || !expiration_date || !deposit_id) {
      router.push("/deposit");
    }
  }, [qr_code, amount, expiration_date, deposit_id, router]);

  const handleCopyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(qr_code as string);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Erro ao copiar código PIX");
    }
  };

  const formatExpirationDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!qr_code || !amount || !expiration_date || !deposit_id) {
    return null;
  }

  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <div className="relative p-4 md:p-6 max-w-4xl mx-auto pb-24">
          <header className="mb-6">
            <button 
              onClick={() => router.push("/deposit")}
              className="mb-4 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-bold text-foreground">Pagamento via PIX</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Copie o código PIX abaixo
            </p>
          </header>

          <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-6">
                {/* Código PIX */}
                <div className="w-full">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 break-all font-mono text-sm text-foreground">
                    {qr_code as string}
                  </div>
                </div>

                {/* Valor */}
                <div className="text-center space-y-1">
                  <span className="text-sm text-muted-foreground">Valor a pagar</span>
                  <div className="text-2xl font-bold text-foreground">
                    R$ {Number(amount).toFixed(2)}
                  </div>
                </div>

                {/* Botão Copiar */}
                <Button
                  onClick={handleCopyQRCode}
                  className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 h-12"
                >
                  <div className="flex items-center justify-center gap-2">
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    <span>Copiar código PIX</span>
                  </div>
                </Button>

                {/* Timer */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Expira em: {formatExpirationDate(expiration_date as string)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="bg-card/30 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Como pagar?
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#d5eb2d]">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Abra o aplicativo do seu banco
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#d5eb2d]">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Busque a opção de pagamento via PIX
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#d5eb2d]">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cole o código PIX copiado
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#d5eb2d]/10 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#d5eb2d]">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confirme as informações e finalize o pagamento
                  </p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-[#d5eb2d]/10">
                  <p className="text-sm text-foreground">
                    Após o pagamento, o valor será creditado automaticamente em sua conta em até 1 minuto.
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