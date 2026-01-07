import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/stores/cart-store'
import { useCreateOrder } from '@/hooks/use-orders'
import { useCreateCustomer } from '@/hooks/use-customers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'pix']),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const createOrder = useCreateOrder()
  const createCustomer = useCreateCustomer()
  const [orderComplete, setOrderComplete] = useState(false)

  const deliveryFee = 5
  const subtotal = getTotal()
  const total = subtotal + deliveryFee

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  async function onSubmit(data: CheckoutFormData) {
    try {
      const customer = await createCustomer.mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
      })

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.totalPrice,
        notes: item.notes || null,
      }))

      await createOrder.mutateAsync({
        order: {
          customer_id: customer.id,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          payment_method: data.payment_method,
          delivery_address: `${data.address}, ${data.neighborhood} - ${data.city}`,
          notes: data.notes || null,
        },
        items: orderItems,
      })

      clearCart()
      setOrderComplete(true)
    } catch (error) {
      toast.error('Erro ao finalizar pedido. Tente novamente.')
    }
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pedido Realizado!</h1>
        <p className="text-muted-foreground mb-8">
          Seu pedido foi recebido e está sendo preparado. Você receberá atualizações pelo WhatsApp.
        </p>
        <Button onClick={() => navigate('/cardapio')}>
          Voltar ao Cardápio
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cardapio/carrinho')
    return null
  }

  return (
    <div className="pb-8">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/cardapio/carrinho')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </button>

        <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input {...register('name')} error={errors.name?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone (WhatsApp)</Label>
                      <Input {...register('phone')} placeholder="(11) 99999-9999" error={errors.phone?.message} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input {...register('address')} placeholder="Rua, número, complemento" error={errors.address?.message} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input {...register('neighborhood')} error={errors.neighborhood?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input {...register('city')} error={errors.city?.message} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select {...register('payment_method')} error={errors.payment_method?.message}>
                    <option value="">Selecione...</option>
                    <option value="pix">PIX</option>
                    <option value="cash">Dinheiro</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...register('notes')}
                    placeholder="Alguma informação adicional sobre a entrega..."
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                isLoading={createOrder.isPending || createCustomer.isPending}
              >
                Confirmar Pedido
              </Button>
            </form>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Entrega</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
