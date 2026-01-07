import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { MenuLayout } from '@/components/menu/menu-layout'
import { AuthPage } from '@/pages/auth'
import { DashboardPage } from '@/pages/dashboard'
import { OrdersPage } from '@/pages/orders'
import { ProductsPage } from '@/pages/products'
import { CustomersPage } from '@/pages/customers'
import { MenuPage } from '@/pages/menu'
import { ProductPage } from '@/pages/menu/product'
import { CartPage } from '@/pages/menu/cart'
import { CheckoutPage } from '@/pages/menu/checkout'
import { Skeleton } from '@/components/ui/skeleton'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/menu" element={<MenuLayout />}>
        <Route index element={<MenuPage />} />
        <Route path="produto/:id" element={<ProductPage />} />
        <Route path="carrinho" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="clientes" element={<CustomersPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
