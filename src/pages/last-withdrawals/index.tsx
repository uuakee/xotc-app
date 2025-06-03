import { Space_Grotesk } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouter } from "next/router";
import { useWithdrawals } from "@/contexts/WithdrawalsContext";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const getStatusConfig = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        icon: CheckCircle2,
        text: "Concluído",
        color: "text-[#d5eb2d]",
        bgColor: "bg-[#d5eb2d]/10",
        borderColor: "border-[#d5eb2d]/20"
      };
    case "PENDING":
      return {
        icon: Clock,
        text: "Em análise",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
        borderColor: "border-yellow-400/20"
      };
    case "FAILED":
      return {
        icon: XCircle,
        text: "Rejeitado",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/20"
      };
    default:
      return {
        icon: AlertCircle,
        text: "Desconhecido",
        color: "text-gray-400",
        bgColor: "bg-gray-400/10",
        borderColor: "border-gray-400/20"
      };
  }
};

export default function LastWithdrawals() {
  const router = useRouter();
  const { withdrawals, isLoading, stats } = useWithdrawals();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  return (
    <div className={spaceGrotesk.className}>
      <Head>
        <title>Histórico de Saques | XOTC</title>
        <meta 
          name="description" 
          content="Acompanhe o histórico de todos os seus saques na XOTC" 
        />
      </Head>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <div className="relative p-4 md:p-6 max-w-4xl mx-auto pb-24">
          <header className="mb-6">
            <button 
              onClick={() => router.push("/withdraw")}
              className="mb-4 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-bold text-foreground">Histórico de Saques</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe todos os seus saques realizados
            </p>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d5eb2d]" />
                <span className="text-sm text-muted-foreground">Carregando saques...</span>
              </div>
            </div>
          ) : withdrawals.length > 0 ? (
            <>
              <Card className="bg-card/30 backdrop-blur-xl border-white/10 mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Solicitado</p>
                      <p className="text-lg font-semibold">
                        R$ {stats.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Em Análise</p>
                      <p className="text-lg font-semibold text-yellow-400">
                        {stats.pendingCount}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Concluídos</p>
                      <p className="text-lg font-semibold text-[#d5eb2d]">
                        {stats.completedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {withdrawals.map((withdrawal) => {
                  const status = getStatusConfig(withdrawal.status);
                  
                  return (
                    <Card 
                      key={withdrawal.id}
                      className="bg-card/30 backdrop-blur-xl border-white/10 hover:border-white/20 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          {/* Cabeçalho com Status e Data */}
                          <div className="flex items-center justify-between">
                            <div className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 ${status.bgColor} ${status.color} border ${status.borderColor}`}>
                              <status.icon className="w-3.5 h-3.5" />
                              <span>{status.text}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(withdrawal.created_at)}
                            </span>
                          </div>

                          {/* Valor e Informações do PIX */}
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-baseline justify-between">
                              <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Valor do Saque</span>
                                <p className="text-xl font-bold text-foreground">
                                  R$ {parseFloat(withdrawal.amount).toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right space-y-1">
                                <span className="text-sm text-muted-foreground">ID</span>
                                <p className="text-sm font-medium text-foreground">
                                  {withdrawal.id}
                                </p>
                              </div>
                            </div>

                            {withdrawal.pix_key && (
                              <div className="pt-2 border-t border-white/10">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Chave PIX</span>
                                    <p className="text-sm font-medium text-foreground truncate" title={withdrawal.pix_key}>
                                      {withdrawal.pix_key}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Tipo</span>
                                    <p className="text-sm font-medium text-foreground">
                                      {withdrawal.pix_type}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card className="bg-card/30 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-foreground">Nenhum saque encontrado</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você ainda não realizou nenhum saque
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <NavigationBar currentPath="/last-withdrawals" />
      </div>
    </div>
  );
}
