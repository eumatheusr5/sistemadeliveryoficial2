import { Users } from 'lucide-react'
import { useCustomers } from '@/hooks/use-customers'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

export function CustomersPage() {
  const { data: customers, isLoading } = useCustomers()

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Clientes" description="Lista de clientes cadastrados" />
        <Card>
          <CardContent className="p-0">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!customers?.length) {
    return (
      <div>
        <PageHeader title="Clientes" description="Lista de clientes cadastrados" />
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Os clientes serão registrados automaticamente quando fizerem pedidos."
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Clientes" description="Lista de clientes cadastrados" />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>
                    {customer.address
                      ? `${customer.address}, ${customer.neighborhood || ''} - ${customer.city || ''}`
                      : '-'}
                  </TableCell>
                  <TableCell>{formatDate(customer.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
