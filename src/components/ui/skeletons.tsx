export function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Skeleton */}
        <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

