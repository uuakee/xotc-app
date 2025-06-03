import { cn } from "@/lib/utils"
import { Space_Grotesk } from "next/font/google"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })
import { useRouter } from "next/router"

export default function ManagerLoginPage() {
    const router = useRouter()

  return (
    <div className={spaceGrotesk.className}>
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.15] scale-[1.2]" />
            <div className="fixed inset-0 bg-[#d5eb2d]/5 blur-[100px] rotate-12" />
            <div className="fixed -top-40 -right-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />
            <div className="fixed -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#d5eb2d]/20 blur-[100px]" />

            <main className="absolute inset-0 flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-md border border-white/10 bg-card/30 backdrop-blur-xl shadow-xl shadow-black/10">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative h-16 w-32">
                                    <Image src="/logotype.svg" alt="logo" fill className="object-contain" priority />
                                </div>
                                <p className="text-md text-muted-foreground">
                                    Painel de Administrador
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium inline-flex items-center gap-2">
                                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Email
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Digite seu email"
                                        className="bg-background/50 border-white/10 focus:border-[#d5eb2d]/50 focus:ring-[#d5eb2d]/20 transition-all pr-10 h-12"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium inline-flex items-center gap-2">
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
                            <Button className="w-full bg-[#d5eb2d] text-background hover:bg-[#d5eb2d]/90 transition-all font-medium h-12 hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => router.push("/manager/dashboard")}
                            >
                                Entrar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  )
}
