import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getComplementGroups,
  getComplementGroupById,
  createComplementGroup,
  updateComplementGroup,
  deleteComplementGroup,
  createComplement,
  updateComplement,
  deleteComplement,
  uploadComplementImage,
  deleteComplementImage,
  getProductComplementGroups,
  updateProductComplementGroups,
  getProductsByComplementGroup,
} from '@/services/complements'
import type {
  ComplementGroupUpdate,
  ComplementUpdate,
} from '@/types/database'

export function useComplementGroups() {
  return useQuery({
    queryKey: ['complement-groups'],
    queryFn: getComplementGroups,
  })
}

export function useComplementGroup(id: string) {
  return useQuery({
    queryKey: ['complement-groups', id],
    queryFn: () => getComplementGroupById(id),
    enabled: !!id,
  })
}

export function useCreateComplementGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComplementGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Grupo de complementos criado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar grupo de complementos')
      console.error(error)
    },
  })
}

export function useUpdateComplementGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ComplementGroupUpdate }) =>
      updateComplementGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Grupo de complementos atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar grupo de complementos')
      console.error(error)
    },
  })
}

export function useDeleteComplementGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComplementGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Grupo de complementos excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir grupo de complementos')
      console.error(error)
    },
  })
}

export function useCreateComplement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createComplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Complemento criado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao criar complemento')
      console.error(error)
    },
  })
}

export function useUpdateComplement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ComplementUpdate }) =>
      updateComplement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Complemento atualizado com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar complemento')
      console.error(error)
    },
  })
}

export function useDeleteComplement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComplement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complement-groups'] })
      toast.success('Complemento excluído com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao excluir complemento')
      console.error(error)
    },
  })
}

export function useUploadComplementImage() {
  return useMutation({
    mutationFn: uploadComplementImage,
    onError: (error) => {
      toast.error('Erro ao fazer upload da imagem')
      console.error(error)
    },
  })
}

export function useDeleteComplementImage() {
  return useMutation({
    mutationFn: deleteComplementImage,
    onError: (error) => {
      toast.error('Erro ao deletar imagem')
      console.error(error)
    },
  })
}

export function useProductComplementGroups(productId: string) {
  return useQuery({
    queryKey: ['product-complement-groups', productId],
    queryFn: () => getProductComplementGroups(productId),
    enabled: !!productId,
  })
}

export function useUpdateProductComplementGroups() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, groupIds }: { productId: string; groupIds: string[] }) =>
      updateProductComplementGroups(productId, groupIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-complement-groups'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products-by-complement-group'] })
      toast.success('Grupos de complementos vinculados com sucesso!')
    },
    onError: (error) => {
      toast.error('Erro ao vincular grupos de complementos')
      console.error(error)
    },
  })
}

export function useProductsByComplementGroup(complementGroupId: string) {
  return useQuery({
    queryKey: ['products-by-complement-group', complementGroupId],
    queryFn: () => getProductsByComplementGroup(complementGroupId),
    enabled: !!complementGroupId,
  })
}
