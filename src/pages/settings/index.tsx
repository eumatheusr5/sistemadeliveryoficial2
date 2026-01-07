import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { User, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsNav = [
  { name: 'Perfil', href: '/settings/profile', icon: User },
  { name: 'Loja', href: '/settings/store', icon: Store },
]

export function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>

      <div className="flex gap-8">
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            {settingsNav.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function SettingsIndex() {
  return <Navigate to="/settings/profile" replace />
}
