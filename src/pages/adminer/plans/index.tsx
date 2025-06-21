import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  IconCheck,
  IconLoader2,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
  IconPower,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Plan, UserLevel } from "@/types/api"

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

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value))
}

const LEVELS: UserLevel[] = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"]

interface PlanFormData {
  name: string
  price: string
  days: string
  profit: string
  max_buy: string
  level: UserLevel
  points: string
}

const initialFormData: PlanFormData = {
  name: "",
  price: "",
  days: "",
  profit: "",
  max_buy: "",
  level: "LEVEL_5",
  points: "",
}

export default function PlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [formData, setFormData] = useState<PlanFormData>(initialFormData)

  useEffect(() => {
    fetchPlans()
  }, [router])

  async function fetchPlans() {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/dashboard")
        return
      }

      const response = await fetch("https://sv2.xotc.lat/api/v1/admin/plans", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Falha ao carregar planos")
      }

      const data = await response.json()
      setPlans(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    try {
      const token = localStorage.getItem("token")
      const url = selectedPlan
        ? `https://sv2.xotc.lat/api/v1/admin/plans/${selectedPlan.id}`
        : "https://sv2.xotc.lat/api/v1/admin/plans"

      const response = await fetch(url, {
        method: selectedPlan ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          days: Number(formData.days),
          profit: Number(formData.profit),
          max_buy: Number(formData.max_buy),
          level: formData.level,
          points: Number(formData.points)
        })
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar plano")
      }

      await fetchPlans()
      setIsDialogOpen(false)
      setSelectedPlan(null)
      setFormData(initialFormData)
    } catch (error) {
      console.error("Erro ao salvar plano:", error)
    }
  }

  async function handleDelete(plan: Plan) {
    if (!confirm("Tem certeza que deseja excluir este plano?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://sv2.xotc.lat/api/v1/admin/plans/${plan.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir plano")
      }

      await fetchPlans()
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
    }
  }

  function handleEdit(plan: Plan) {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price,
      days: String(plan.days),
      profit: plan.profit,
      max_buy: String(plan.max_buy),
      level: plan.level,
      points: String(plan.points)
    })
    setIsDialogOpen(true)
  }

  function handleCreate() {
    setSelectedPlan(null)
    setFormData(initialFormData)
    setIsDialogOpen(true)
  }

  async function handleToggleActive(plan: Plan) {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://sv2.xotc.lat/api/v1/admin/plans/${plan.id}/toggle`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          is_active: !plan.is_active
        })
      })

      if (!response.ok) {
        throw new Error("Falha ao alterar status do plano")
      }

      await fetchPlans()
    } catch (error) {
      console.error("Erro ao alterar status do plano:", error)
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
                    <CardTitle>Planos de Investimento</CardTitle>
                    <Button onClick={handleCreate}>
                      <IconPlus className="mr-2 size-4" />
                      Novo Plano
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Dias</TableHead>
                          <TableHead>Lucro</TableHead>
                          <TableHead>Nível</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {plans.map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell className="font-medium">{plan.name}</TableCell>
                            <TableCell>{formatCurrency(plan.price)}</TableCell>
                            <TableCell>{plan.days} dias</TableCell>
                            <TableCell>{Number(plan.profit)}% ao dia</TableCell>
                            <TableCell>{plan.level}</TableCell>
                            <TableCell>
                              {plan.is_active ? (
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
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant={plan.is_active ? "outline" : "secondary"}
                                  onClick={() => handleToggleActive(plan)}
                                  title={plan.is_active ? "Desativar plano" : "Ativar plano"}
                                >
                                  <IconPower className="size-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(plan)}
                                >
                                  <IconPencil className="size-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(plan)}
                                >
                                  <IconTrash className="size-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Editar Plano" : "Novo Plano"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan
                ? "Edite as informações do plano de investimento"
                : "Crie um novo plano de investimento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Plano
              </label>
              <Input
                id="name"
                placeholder="Ex: Plano Premium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Preço (R$)
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Ex: 1000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="days" className="text-sm font-medium">
                  Duração (dias)
                </label>
                <Input
                  id="days"
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="profit" className="text-sm font-medium">
                  Lucro Diário (%)
                </label>
                <Input
                  id="profit"
                  type="number"
                  placeholder="Ex: 1.5"
                  value={formData.profit}
                  onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="max_buy" className="text-sm font-medium">
                  Limite de Compras
                </label>
                <Input
                  id="max_buy"
                  type="number"
                  placeholder="Ex: 5"
                  value={formData.max_buy}
                  onChange={(e) => setFormData({ ...formData, max_buy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="level" className="text-sm font-medium">
                  Nível Requerido
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value: UserLevel) =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="points" className="text-sm font-medium">
                  Pontos Ganhos
                </label>
                <Input
                  id="points"
                  type="number"
                  placeholder="Ex: 100"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPlan ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
} 