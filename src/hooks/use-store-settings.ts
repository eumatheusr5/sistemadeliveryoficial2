import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getStoreSettings,
  updateStoreSettings,
  createStoreSettings,
  uploadStoreLogo,
  deleteStoreLogo,
} from '@/services/store-settings'
import type { StoreSettings } from '@/services/store-settings'

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: getStoreSettings,
  })
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<StoreSettings, 'name' | 'description' | 'logo_url'>>
    }) => updateStoreSettings(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] })
      toast.success('Configurações salvas com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao salvar configurações')
      console.error(error)
    },
  })
}

export function useCreateStoreSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStoreSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] })
      toast.success('Configurações criadas com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar configurações')
      console.error(error)
    },
  })
}

export function useUploadStoreLogo() {
  return useMutation({
    mutationFn: uploadStoreLogo,
    onError: (error) => {
      toast.error('Erro ao fazer upload da logo')
      console.error(error)
    },
  })
}

export function useDeleteStoreLogo() {
  return useMutation({
    mutationFn: deleteStoreLogo,
    onError: (error) => {
      toast.error('Erro ao remover logo')
      console.error(error)
    },
  })
}
