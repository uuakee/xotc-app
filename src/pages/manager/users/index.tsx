import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Search, 
  Edit, 
  Ban, 
  Trash2, 
  Plus,
  Star,
  Coins,
  ArrowUpDown,
  Phone,
  UserPlus,
  Wallet,
  ArrowUpRight
} from "lucide-react"
import { Sidebar } from "@/components/manager/sidebar"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export default function ManagerUsersPage() {
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
                  placeholder="Buscar usuário..." 
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Novo Usuário
                </Button>
                <Button variant="outline" className="gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total de Usuários</p>
                      <p className="text-2xl font-bold">1234</p>
                    </div>
                    <Users className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                      <p className="text-2xl font-bold">987</p>
                    </div>
                    <UserPlus className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Saldo Total</p>
                      <p className="text-2xl font-bold">R$ 123.456,00</p>
                    </div>
                    <Wallet className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Média de Investimento</p>
                      <p className="text-2xl font-bold">R$ 5.000,00</p>
                      <p className="text-xs text-muted-foreground">por usuário ativo</p>
                    </div>
                    <Coins className="h-5 w-5 text-[#d5eb2d]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Usuários */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#d5eb2d]" />
                  Lista de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="rounded-md border border-white/5">
                  <div className="min-w-[920px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                          <TableHead className="text-muted-foreground w-[100px]">ID</TableHead>
                          <TableHead className="text-muted-foreground w-[180px]">Nº Telefone</TableHead>
                          <TableHead className="text-muted-foreground">
                            <Button variant="ghost" className="p-0 hover:bg-transparent">
                              <span>Saldo</span>
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead className="text-muted-foreground">Nível VIP</TableHead>
                          <TableHead className="text-muted-foreground">Cotas</TableHead>
                          <TableHead className="text-right text-muted-foreground w-[180px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((item) => (
                          <TableRow key={item} className="border-white/5 hover:bg-white/5">
                            <TableCell className="font-medium">#{item.toString().padStart(5, '0')}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>+55 11 99999-9999</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-[#d5eb2d]" />
                                <span>$2,543.00</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                                <span>VIP 3</span>
                              </div>
                            </TableCell>
                            <TableCell>25</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500">
                                  <Plus className="h-4 w-4 text-emerald-500" />
                                </Button>
                                <Link href={`/manager/users/edit-user/${item}`}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#d5eb2d]/10 hover:text-[#d5eb2d]">
                                    <Edit className="h-4 w-4 text-[#d5eb2d]" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500">
                                  <Ban className="h-4 w-4 text-amber-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
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
