import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * COMPONENT: 공지사항 카드 스켈레톤
 */
export default function NoticeCardSkeleton() {
  return (
    <div className="glass-card flex h-52 flex-col overflow-hidden rounded-lg">
      <div className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="mb-auto">
          <Skeleton className="mb-2 h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
