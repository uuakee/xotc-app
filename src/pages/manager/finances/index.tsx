import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Filter,
  Download,
  DollarSign,
  User,
  Calendar,
  Receipt,
  CreditCard,
  CheckCircle2,
  Copy
} from "lucide-react"
import { Sidebar } from "@/components/manager/sidebar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export default function ManagerFinancesPage() {
  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        <Sidebar />

        <main className="px-4 pt-20 pb-8 lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header com busca e ações */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-[280px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar transação..." 
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Depositado</p>
                      <p className="text-2xl font-bold">R$ 250.000,00</p>
                    </div>
                    <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Retirado</p>
                      <p className="text-2xl font-bold">R$ 125.000,00</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Saldo em Sistema</p>
                      <p className="text-2xl font-bold">R$ 125.000,00</p>
                    </div>
                    <Wallet className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Média por Transação</p>
                      <p className="text-2xl font-bold">R$ 1.500,00</p>
                    </div>
                    <DollarSign className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Transações */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[#d5eb2d]" />
                  Histórico de Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="rounded-md border border-white/5">
                  <div className="min-w-[920px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                          <TableHead className="text-muted-foreground w-[100px]">ID Transação</TableHead>
                          <TableHead className="text-muted-foreground">Nº Telefone</TableHead>
                          <TableHead className="text-muted-foreground">Tipo</TableHead>
                          <TableHead className="text-muted-foreground">Valor</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-muted-foreground">Data</TableHead>
                          <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <TableRow key={item} className="border-white/5 hover:bg-white/5">
                            <TableCell className="font-medium">#{item.toString().padStart(5, '0')}</TableCell>
                            <TableCell>João Silva</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={item % 2 === 0 ? "border-emerald-500/20 text-emerald-500" : "border-red-500/20 text-red-500"}>
                                {item % 2 === 0 ? "Depósito" : "Saque"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className={`font-medium ${item % 2 === 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {item % 2 === 0 ? "+" : "-"}R$ 1.500,00
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                                Aprovado
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Há 5 minutos</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Ver detalhes
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md border-white/10 bg-card/30 backdrop-blur-xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Receipt className="h-5 w-5 text-[#d5eb2d]" />
                                      Detalhes da Transação
                                    </DialogTitle>
                                  </DialogHeader>
                                  
                                  <div className="space-y-6">
                                    {/* Status do Pagamento */}
                                    <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-4">
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <p className="font-medium text-emerald-500">Pagamento Aprovado</p>
                                      </div>
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>

                                    {/* ID da Transação */}
                                    <div className="flex items-center justify-between">
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">ID da Transação</p>
                                        <p className="font-medium">#00001</p>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Separator className="bg-white/5" />

                                    {/* Informações do Usuário */}
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm text-muted-foreground">Nº Telefone</p>
                                          <p className="font-medium">11 9 9999-9999</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm text-muted-foreground">Data</p>
                                          <p className="font-medium">15 Mar 2024, 14:30</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm text-muted-foreground">Método</p>
                                          <p className="font-medium">PIX</p>
                                        </div>
                                      </div>
                                    </div>

                                    <Separator className="bg-white/5" />

                                    {/* Valores */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">Valor</p>
                                        <p className="font-medium">R$ 1.500,00</p>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">Taxa</p>
                                        <p className="font-medium">R$ 0,00</p>
                                      </div>
                                      <Separator className="my-2 bg-white/5" />
                                      <div className="flex items-center justify-between">
                                        <p className="font-medium">Total</p>
                                        <p className="text-lg font-bold text-emerald-500">R$ 1.500,00</p>
                                      </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-2">
                                      <Button className="w-full gap-2">
                                        <Receipt className="h-4 w-4" />
                                        Gerar Comprovante
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
