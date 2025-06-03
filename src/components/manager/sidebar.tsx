import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Users, DollarSign, Settings, BarChart2, Menu as MenuIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/manager/dashboard",
      icon: BarChart2
    },
    {
      name: "Usuários",
      href: "/manager/users",
      icon: Users
    },
    {
      name: "Finanças",
      href: "/manager/finances",
      icon: DollarSign
    },
    {
      name: "Configurações",
      href: "/manager/settings",
      icon: Settings
    }
  ]

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="mb-8 px-6">
        <div className="relative h-8 w-20">
          <Image src="/logotype.svg" alt="logo" fill className="object-contain" priority />
        </div>
      </div>
      <div className="flex flex-col px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "mb-1 w-full justify-start rounded-lg px-3 py-2 text-muted-foreground hover:bg-[#d5eb2d]/5 hover:text-[#d5eb2d]",
                  isActive && "bg-[#d5eb2d]/10 text-[#d5eb2d]"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-white/5 bg-card/30 backdrop-blur-xl lg:flex",
        className
      )}>
        <div className="flex w-full flex-col py-5">
          <NavContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-white/5 bg-card/30 backdrop-blur-xl p-0">
          <div className="py-5">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 