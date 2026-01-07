import { useState } from 'react'
import { ShoppingBag, Eye, Clock, CheckCircle, XCircle, Truck, ChefHat, ThumbsUp } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '@/hooks/use-orders'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { OrderWithItems, OrderStatus } from '@/types/database'

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'accent'; icon: typeof Clock }> = {
  pending: { label: 'Pendente', variant: 'warning', icon: Clock },
  confirmed: { label: 'Confirmado', variant: 'accent', icon: ThumbsUp },
  preparing: { label: 'Preparando', variant: 'secondary', icon: ChefHat },
  delivering: { label: 'Em Entrega', variant: 'default', icon: Truck },
  delivered: { label: 'Entregue', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelado', variant: 'destructive', icon: XCircle },
}

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered']

export function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const updateStatus = useUpdateOrderStatus()
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)

  function handleStatusChange(orderId: string, currentStatus: OrderStatus) {
    const currentIndex = statusFlow.indexOf(currentStatus)
    if (currentIndex < statusFlow.length - 1) {
      updateStatus.mutate({ id: orderId, status: statusFlow[currentIndex + 1] })
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Pedidos" description="Gerencie os pedidos da sua loja" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div>
        <PageHeader title="Pedidos" description="Gerencie os pedidos da sua loja" />
        <EmptyState
          icon={ShoppingBag}
          title="Nenhum pedido encontrado"
          description="Os pedidos aparecerão aqui quando os clientes fizerem pedidos pelo cardápio."
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Pedidos" description="Gerencie os pedidos da sua loja" />

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status]
          const StatusIcon = status.icon

          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-2 rounded-lg', `bg-${status.variant}/10`)}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer?.name || 'Cliente não identificado'} • {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order as OrderWithItems)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, order.status)}
                          isLoading={updateStatus.isPending}
                        >
                          Avançar Status
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent onClose={() => setSelectedOrder(null)}>
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{selectedOrder.customer?.name || 'Não identificado'}</p>
                {selectedOrder.customer?.phone && (
                  <p className="text-sm">{selectedOrder.customer.phone}</p>
                )}
              </div>

              {selectedOrder.delivery_address && (
                <div>
                  <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                  <p className="font-medium">{selectedOrder.delivery_address}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Itens</p>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product_name}</span>
                      <span>{formatCurrency(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de Entrega</span>
                  <span>{formatCurrency(selectedOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
