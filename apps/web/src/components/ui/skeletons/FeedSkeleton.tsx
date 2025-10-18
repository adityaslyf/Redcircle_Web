import { Skeleton } from "@/components/ui/skeleton";

export default function FeedSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <div className="grow space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mb-4 h-48 w-full rounded-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}


