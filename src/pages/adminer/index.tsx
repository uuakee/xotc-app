import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { IconLoader2 } from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardResponse } from "@/types/api"

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

export default function Page() {
  const router = useRouter()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/dashboard")
          return
        }

        const response = await fetch("https://sv2.xotc.lat/api/v1/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar dados")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (loading || !data) {
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
              <SectionCards data={data} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={data} />
              </div>
              <div className="px-4 lg:px-6">
                <DataTable data={data.recentTransactions} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
