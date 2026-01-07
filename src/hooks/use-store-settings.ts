import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getStoreSettings, updateStoreSettings } from '@/services/store-settings'
import { toast } from 'sonner'

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: getStoreSettings,
  })
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStoreSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] })
      toast.success('Configurações salvas com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao salvar configurações')
    },
  })
}
