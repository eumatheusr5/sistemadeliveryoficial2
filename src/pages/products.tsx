import { useState } from 'react'
import { Package, Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProductWithCategory, Category } from '@/types/database'

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  price: z.string().min(1, 'Preço é obrigatório'),
  category_id: z.string().optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>
type CategoryFormData = z.infer<typeof categorySchema>

export function ProductsPage() {
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [productDialog, setProductDialog] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { is_active: true },
  })

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  function openProductDialog(product?: ProductWithCategory) {
    if (product) {
      setEditingProduct(product)
      productForm.reset({
        name: product.name,
        description: product.description || '',
        price: String(product.price),
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        is_active: product.is_active,
      })
    } else {
      setEditingProduct(null)
      productForm.reset({ is_active: true })
    }
    setProductDialog(true)
  }

  function openCategoryDialog(category?: Category) {
    if (category) {
      setEditingCategory(category)
      categoryForm.reset({ name: category.name, description: category.description || '' })
    } else {
      setEditingCategory(null)
      categoryForm.reset()
    }
    setCategoryDialog(true)
  }

  async function onProductSubmit(data: ProductFormData) {
    const payload = {
      name: data.name,
      description: data.description || null,
      price: parseFloat(data.price),
      category_id: data.category_id || null,
      image_url: data.image_url || null,
      is_active: data.is_active,
    }

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...payload })
    } else {
      await createProduct.mutateAsync(payload)
    }
    setProductDialog(false)
  }

  async function onCategorySubmit(data: CategoryFormData) {
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, ...data })
    } else {
      await createCategory.mutateAsync(data)
    }
    setCategoryDialog(false)
  }

  const isLoading = productsLoading || categoriesLoading

  return (
    <div>
      <PageHeader title="Produtos" description="Gerencie seus produtos e categorias" />

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openProductDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !products?.length ? (
            <EmptyState
              icon={Package}
              title="Nenhum produto cadastrado"
              description="Comece adicionando produtos ao seu catálogo."
            >
              <Button onClick={() => openProductDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category?.name}</p>
                        <p className="font-semibold text-accent mt-1">{formatCurrency(product.price)}</p>
                      </div>
                      <Badge variant={product.is_active ? 'success' : 'secondary'}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openProductDialog(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct.mutate(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openCategoryDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-48" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !categories?.length ? (
            <EmptyState
              icon={Package}
              title="Nenhuma categoria cadastrada"
              description="Categorias ajudam a organizar seus produtos."
            >
              <Button onClick={() => openCategoryDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Categoria
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openCategoryDialog(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCategory.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent onClose={() => setProductDialog(false)}>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...productForm.register('name')} error={productForm.formState.errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea {...productForm.register('description')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input type="number" step="0.01" {...productForm.register('price')} error={productForm.formState.errors.price?.message} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select {...productForm.register('category_id')}>
                  <option value="">Sem categoria</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input {...productForm.register('image_url')} placeholder="https://..." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProductDialog(false)}>Cancelar</Button>
              <Button type="submit" isLoading={createProduct.isPending || updateProduct.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent onClose={() => setCategoryDialog(false)}>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...categoryForm.register('name')} error={categoryForm.formState.errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea {...categoryForm.register('description')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialog(false)}>Cancelar</Button>
              <Button type="submit" isLoading={createCategory.isPending || updateCategory.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
