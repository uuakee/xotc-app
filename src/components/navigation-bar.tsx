import { Home, LineChart, Users, User } from "lucide-react";
import { useRouter } from "next/router";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${
      isActive ? 'text-[#d5eb2d]' : 'text-muted-foreground hover:text-[#d5eb2d]'
    }`}
  >
    <div className={`p-2 rounded-xl ${
      isActive ? 'bg-[#d5eb2d]/10' : 'hover:bg-[#d5eb2d]/10'
    }`}>
      {icon}
    </div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface NavigationBarProps {
  currentPath: string;
}

export function NavigationBar({ currentPath }: NavigationBarProps) {
  const router = useRouter();

  const navItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Início",
      path: "/dashboard"
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: "Investimentos",
      path: "/investments"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Equipe",
      path: "/team"
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Perfil",
      path: "/profile"
    }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card/30 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center justify-around py-3">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                isActive={currentPath === item.path}
                onClick={() => router.push(item.path)}
              />
            ))}
          </nav>
        </div>
      </div>
      <div className="pb-24" />
    </>
  );
} 