import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings,
  LogOut,
  Store,
  Menu
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/orders', icon: ShoppingBag },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { signOut } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <Store className="h-6 w-6 text-accent" />
          <span className="font-semibold text-lg">DeliveryPro</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-surface text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-border space-y-1">
          <a
            href="/cardapio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <Menu className="h-5 w-5" />
            Ver Cardápio
          </a>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
