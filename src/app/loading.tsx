export default function Loading() {
  return (
    <div className="max-w-container mx-auto px-6 py-20 min-h-[60vh]">
      <div className="animate-pulse space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-primary/10 rounded"></div>
            <div className="h-10 w-64 bg-primary/10 rounded"></div>
          </div>
          <div className="h-6 w-20 bg-primary/10 rounded mt-4 md:mt-0"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] w-full bg-primary/5 rounded-sm"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-primary/10 rounded mx-auto"></div>
                <div className="h-4 w-1/2 bg-primary/10 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
