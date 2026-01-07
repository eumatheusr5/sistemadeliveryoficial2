import { Outlet } from 'react-router-dom'
import { MenuHeader } from './menu-header'
import { MenuFooter } from './menu-footer'

export function MenuLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MenuHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MenuFooter />
    </div>
  )
}
