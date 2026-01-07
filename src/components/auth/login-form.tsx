import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onToggle: () => void
}

export function LoginForm({ onToggle }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Entrar
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="font-medium text-foreground hover:underline"
        >
          Criar conta
        </button>
      </p>
    </form>
  )
}
