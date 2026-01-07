import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.email('Email inválido'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || '',
      email: user?.email || '',
    },
  })

  async function onSubmit(data: ProfileFormData) {
    toast.success('Perfil atualizado com sucesso!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Gerencie suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input {...register('name')} error={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register('email')} type="email" error={errors.email?.message} disabled />
          </div>
          <Button type="submit" isLoading={isSubmitting}>
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
