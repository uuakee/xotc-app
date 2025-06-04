"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { DashboardResponse, Transaction } from "@/types/api"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface ChartAreaInteractiveProps {
  data: DashboardResponse;
}

const chartConfig = {
  deposits: {
    label: "Depósitos",
    color: "var(--primary)",
  },
  withdrawals: {
    label: "Saques",
    color: "var(--destructive)",
  },
  investments: {
    label: "Investimentos",
    color: "var(--success)",
  },
} satisfies ChartConfig

function processTransactions(transactions: Transaction[], days: number) {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - days)

  const filteredTransactions = transactions.filter(tx => 
    new Date(tx.created_at) >= startDate
  )

  const dailyData = new Map()
  
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dailyData.set(dateStr, {
      date: dateStr,
      deposits: 0,
      withdrawals: 0,
      investments: 0
    })
  }

  filteredTransactions.forEach(tx => {
    const date = tx.created_at.split('T')[0]
    const amount = Number(tx.amount)
    
    if (!dailyData.has(date)) return
    
    const data = dailyData.get(date)
    
    switch (tx.type) {
      case 'DEPOSIT':
        data.deposits += amount
        break
      case 'WITHDRAWAL':
        data.withdrawals += amount
        break
      case 'INVESTMENT':
        data.investments += amount
        break
    }
  })

  return Array.from(dailyData.values())
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
  const chartData = React.useMemo(() => 
    processTransactions(data.recentTransactions, days),
    [data.recentTransactions, days]
  )

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Movimentações</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Histórico de movimentações financeiras
          </span>
          <span className="@[540px]/card:hidden">Movimentações</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDeposits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-deposits)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-deposits)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillWithdrawals" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-withdrawals)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-withdrawals)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-investments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-investments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    })
                    const amount = Number(value)
                    return `${date} - R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="deposits"
              type="monotone"
              fill="url(#fillDeposits)"
              stroke="var(--color-deposits)"
              stackId="a"
            />
            <Area
              dataKey="withdrawals"
              type="monotone"
              fill="url(#fillWithdrawals)"
              stroke="var(--color-withdrawals)"
              stackId="a"
            />
            <Area
              dataKey="investments"
              type="monotone"
              fill="url(#fillInvestments)"
              stroke="var(--color-investments)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

