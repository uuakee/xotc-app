import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  IconCheck,
  IconLoader2,
  IconSearch,
  IconUserCircle,
  IconWallet,
  IconX,
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/api"

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <IconLoader2 className="size-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value))
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false)
  const [newBalance, setNewBalance] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/dashboard")
          return
        }

        const response = await fetch("https://sv2.xotc.lat/api/v1/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar usuários")
        }

        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  const filteredUsers = users.filter(user => 
    user.realName.toLowerCase().includes(search.toLowerCase()) ||
    user.cpf.includes(search) ||
    user.phone.includes(search)
  )

  async function handleUpdateWallet() {
    if (!selectedUser || !newBalance) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://sv2.xotc.lat/api/v1/admin/users/${selectedUser.id}/wallet`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          balance: newBalance
        })
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar saldo")
      }

      // Atualiza a lista de usuários
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            wallet: [
              {
                ...user.wallet[0],
                balance: newBalance
              }
            ]
          }
        }
        return user
      })

      setUsers(updatedUsers)
      setIsWalletDialogOpen(false)
      setNewBalance("")
    } catch (error) {
      console.error("Erro ao atualizar saldo:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Usuários</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <IconSearch className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por nome, CPF ou telefone..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Saldo</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <IconUserCircle className="size-5 text-muted-foreground" />
                                {user.realName}
                              </div>
                            </TableCell>
                            <TableCell>{formatCPF(user.cpf)}</TableCell>
                            <TableCell>{formatPhone(user.phone)}</TableCell>
                            <TableCell>
                              {user.is_active ? (
                                <Badge className="bg-success text-success-foreground">
                                  <IconCheck className="mr-1 size-3" />
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <IconX className="mr-1 size-3" />
                                  Inativo
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(user.wallet[0]?.balance || "0")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsWalletDialogOpen(true)
                                  }}
                                >
                                  <IconWallet className="mr-2 size-4" />
                                  Carteira
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Saldo</DialogTitle>
            <DialogDescription>
              Atualize o saldo da carteira do usuário {selectedUser?.realName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                type="number"
                placeholder="Novo saldo"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWalletDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateWallet}>
              Atualizar Saldo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
} 