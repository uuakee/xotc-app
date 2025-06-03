import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/manager/sidebar"
import { 
  Users, 
  Wallet,
  Lock,
  Ban,
  ArrowUpRight,
  Clock,
  Package,
  UserPlus,
  Plus,
  LogOut
} from "lucide-react"
import { useRouter } from "next/router"
import Image from "next/image"
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export default function EditUserPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <Sidebar />

                {/* Header - apenas para mobile */}
        <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-background/50 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Sidebar />
              <div className="relative h-8 w-20">
                <Image src="/logotype.svg" alt="logo" fill className="object-contain" priority />
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="px-4 pt-20 pb-8 lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Cabeçalho do Usuário */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#d5eb2d]" />
                    11 9 9999-9999
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">0x42069</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                  Ativo
                </Badge>
              </CardHeader>
              
              {/* Métricas do Usuário */}
              <CardContent className="space-y-8">
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="border-white/10 bg-card/30">
                    <CardContent className="">
                      <div className="text-sm text-muted-foreground">Saldo Atual</div>
                      <div className="mt-2 font-bold text-2xl">R$ 5.000,00</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-white/10 bg-card/30">
                    <CardContent className="">
                      <div className="text-sm text-muted-foreground">Total Depositado</div>
                      <div className="mt-2 font-bold text-2xl">R$ 10.000,00</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-white/10 bg-card/30">
                    <CardContent className="">
                      <div className="text-sm text-muted-foreground">Total Retirado</div>
                      <div className="mt-2 font-bold text-2xl">R$ 5.000,00</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-white/10 bg-card/30">
                    <CardContent className="">
                      <div className="text-sm text-muted-foreground">Data de Cadastro</div>
                      <div className="mt-2 font-bold text-2xl">14/01/2024</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <Wallet className="h-4 w-4" />
                    Alterar Saldo
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Lock className="h-4 w-4" />
                    Alterar Senha
                  </Button>
                  <Button variant="destructive" className="gap-2">
                    <Ban className="h-4 w-4" />
                    Bloquear
                  </Button>
                </div>

                {/* Resumo de Comissões */}
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="border-white/10 bg-card/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Resumo de Comissões</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Total em Comissões</div>
                        <div className="mt-1 font-bold text-xl">R$ 2.500,00</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total de Depósitos da Rede</div>
                        <div className="mt-1 font-bold text-xl">R$ 500,00</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Histórico de Saques */}
                  <Card className="border-white/10 bg-card/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Histórico de Saques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { valor: 1000, nivel: 1, de: "Pedro Santos", status: "Aprovado", data: "14/03/2024" },
                        { valor: 500, nivel: 2, de: "Maria Silva", status: "Aprovado", data: "09/03/2024" },
                        { valor: 500, nivel: 1, de: "Carlos Oliveira", status: "Pendente", data: "19/03/2024" }
                      ].map((saque, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                          <div className="space-y-1">
                            <div className="font-medium">R$ {saque.valor.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              Nível {saque.nivel} • De: {saque.de}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant="secondary"
                              className={saque.status === "Aprovado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}
                            >
                              {saque.status}
                            </Badge>
                            <div className="mt-1 text-xs text-muted-foreground">{saque.data}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Rede de Indicados e Pacotes */}
                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="border-white/10 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Rede de Indicados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[1, 2, 3].map((nivel) => (
                        <div key={nivel}>
                          <div className="mb-2 font-medium">Nível {nivel}</div>
                          <div className="text-sm text-muted-foreground">
                            Nenhum indicado neste nível
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-card/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Cotas Ativos</CardTitle>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
                          <div className="space-y-1">
                            <div className="font-medium">Pacote Premium</div>
                            <div className="text-sm text-muted-foreground">
                              R$ 1.000,00 • Estoque: 10
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 