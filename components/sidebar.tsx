import Link from "next/link"
import { 
  Home, 
  Settings, 
  CreditCard, 
  Users, 
  Bell, 
  HelpCircle,
  LogOut,
  User
} from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Settings, label: "Configurações", href: "/settings" },
  { icon: CreditCard, label: "Billing", href: "/billing" },
  { icon: Users, label: "Equipe", href: "/team" },
  { icon: Bell, label: "Notificações", href: "/notifications" },
  { icon: HelpCircle, label: "Ajuda", href: "/help" },
]

export function Sidebar() {
  return (
    <div className="flex flex-col h-screen border-r bg-white w-[240px] px-3 py-4">
      {/* Logo */}
      <div className="px-3 py-2 mb-6">
        <h1 className="text-xl font-bold text-primary">FlowBack</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Usuário</span>
                <span className="text-xs text-gray-500">usuario@exemplo.com</span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <Link href="/profile" className="flex items-center gap-2">
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center gap-2">
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/billing" className="flex items-center gap-2">
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Link href="/logout" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 