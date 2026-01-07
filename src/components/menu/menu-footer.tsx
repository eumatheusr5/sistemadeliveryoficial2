import { Store, MapPin, Phone, Clock } from 'lucide-react'

export function MenuFooter() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-accent" />
              <span className="font-semibold">DeliveryPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              O melhor sistema de delivery para o seu negócio.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Rua Exemplo, 123 - Centro
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Horário</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Seg - Sex: 10h - 22h
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sáb - Dom: 11h - 23h
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 DeliveryPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
