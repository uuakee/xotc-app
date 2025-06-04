import { IconTrendingUp, IconWallet, IconUsers, IconChartBar } from "@tabler/icons-react"
import { DashboardResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  data: DashboardResponse;
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Usuários</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.users.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Usuários registrados na plataforma
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total depósitos</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
            R$ {Number(data.finances.deposits.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWallet className="size-4" />
              {data.finances.deposits.count} depósitos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total de depósitos realizados
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total em Saques</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
            R$ {Number(data.finances.withdrawals.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              {data.finances.withdrawals.count} saques
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total de saques realizados
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Investimentos Ativos</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
            R$ {Number(data.finances.investments.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconChartBar className="size-4" />
              {data.finances.investments.active} ativos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total em investimentos ativos
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
