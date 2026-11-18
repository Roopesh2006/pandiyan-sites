export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden bg-bone-200">
      <div className="h-60 skeleton" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 skeleton rounded-chip" />
          <div className="h-5 w-20 skeleton rounded-chip" />
        </div>
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-6 w-24 skeleton rounded" />
        <div className="h-[2px] w-full bg-border" />
        <div className="flex gap-4">
          <div className="h-4 w-16 skeleton rounded" />
          <div className="h-4 w-12 skeleton rounded" />
          <div className="h-4 w-20 skeleton rounded" />
        </div>
        <div className="h-10 w-full skeleton rounded-button" />
      </div>
    </div>
  )
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[100svh] bg-surface-dark">
      <div className="absolute inset-0 skeleton opacity-30" />
      <div className="absolute top-1/3 left-1/4 space-y-4">
        <div className="h-4 w-48 skeleton rounded" />
        <div className="h-16 w-96 skeleton rounded" />
        <div className="h-4 w-64 skeleton rounded" />
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="h-96 skeleton rounded-image" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-24 skeleton rounded-image" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-32 skeleton rounded" />
          <div className="h-8 w-3/4 skeleton rounded" />
          <div className="h-10 w-32 skeleton rounded" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-card" />
            ))}
          </div>
          <div className="h-32 skeleton rounded-card" />
        </div>
      </div>
    </div>
  )
}
