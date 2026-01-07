import { cn } from '@/lib/utils'
import type { Category } from '@/types/database'

interface CategoryNavProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="sticky top-16 z-40 bg-background border-b border-border py-3">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === null
                ? 'bg-foreground text-white'
                : 'bg-surface text-muted-foreground hover:text-foreground'
            )}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === category.id
                  ? 'bg-foreground text-white'
                  : 'bg-surface text-muted-foreground hover:text-foreground'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
