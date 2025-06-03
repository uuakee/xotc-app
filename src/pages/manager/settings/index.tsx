import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/manager/sidebar"
import { 
  Settings,
  DollarSign,
  Star,
  MessageCircle,
  Key,
  Save
} from "lucide-react"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export default function ManagerSettingsPage() {
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
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Limites de Transações */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#d5eb2d]" />
                  Limites de Transações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Depósito Mínimo</Label>
                    <Input type="number" placeholder="50.00" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Saque Mínimo</Label>
                    <Input type="number" placeholder="100.00" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Saque Máximo</Label>
                    <Input type="number" placeholder="10000.00" className="bg-background/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações VIP */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#d5eb2d]" />
                  Configurações VIP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      VIP 1
                      <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                    </Label>
                    <Input type="number" placeholder="5" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      VIP 2
                      <div className="flex">
                        <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                        <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                      </div>
                    </Label>
                    <Input type="number" placeholder="10" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      VIP 3
                      <div className="flex">
                        <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                        <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                        <Star className="h-4 w-4 fill-[#d5eb2d] text-[#d5eb2d]" />
                      </div>
                    </Label>
                    <Input type="number" placeholder="15" className="bg-background/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Telegram */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#d5eb2d]" />
                  Configurações Telegram
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Chat ID</Label>
                    <Input placeholder="-100123456789" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Channel ID</Label>
                    <Input placeholder="@channel" className="bg-background/50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-[#d5eb2d]" />
                  Chaves de API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>ClyptPay</Label>
                    <div className="space-y-2">
                      <Input type="password" placeholder="API Key" className="bg-background/50" />
                      <Input type="password" placeholder="API Secret" className="bg-background/50" />
                    </div>
                  </div>
                  
                  <Separator className="bg-white/5" />
                  
                  <div className="space-y-4">
                    <Label>SyncPay</Label>
                    <div className="space-y-2">
                      <Input type="password" placeholder="API Key" className="bg-background/50" />
                      <Input type="password" placeholder="API Secret" className="bg-background/50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <Button size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
