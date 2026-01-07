import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Store } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Store className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle>{isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Entre com suas credenciais para acessar o painel'
              : 'Preencha os dados para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggle={() => setIsLogin(true)} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
