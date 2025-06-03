import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, ArrowUpRight, Clock, Settings, LogOut } from "lucide-react"
import { Sidebar } from "@/components/manager/sidebar"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export default function ManagerDashboardPage() {
  return (
    <div className={spaceGrotesk.className}>
      <div className="relative min-h-screen overflow-hidden bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
        <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
        <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
        <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="px-4 pt-20 pb-8 lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-[#d5eb2d]/10 p-3">
                    <Users className="h-6 w-6 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                    <h3 className="text-2xl font-bold">2,543</h3>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-[#d5eb2d]" />
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-[#d5eb2d]/10 p-3">
                    <DollarSign className="h-6 w-6 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume Total</p>
                    <h3 className="text-2xl font-bold">$1.2M</h3>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-[#d5eb2d]" />
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-[#d5eb2d]/10 p-3">
                    <Clock className="h-6 w-6 text-[#d5eb2d]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Online</p>
                    <h3 className="text-2xl font-bold">99.9%</h3>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-[#d5eb2d]" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#d5eb2d]/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#d5eb2d]" />
                        </div>
                        <div>
                          <p className="font-medium">Novo usuário registrado</p>
                          <p className="text-sm text-muted-foreground">há 5 minutos</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-white/10">
                        Ver detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
