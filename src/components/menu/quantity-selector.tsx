import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={cn(
          'rounded-lg border border-border flex items-center justify-center transition-colors hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
        )}
      >
        <Minus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
      <span className={cn('font-medium min-w-[2rem] text-center', size === 'sm' ? 'text-sm' : 'text-base')}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={cn(
          'rounded-lg border border-border flex items-center justify-center transition-colors hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
        )}
      >
        <Plus className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
    </div>
  )
}
