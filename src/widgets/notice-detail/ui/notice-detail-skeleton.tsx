import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * UI: 공지사항 상세 스켈레톤
 */
export default function NoticeDetailSkeleton() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header Tabs Skeleton */}
      <div className="sticky top-0 z-10 border-b border-border bg-background pb-4 pt-6 px-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="mt-2 h-7 w-3/4" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Image Placeholder */}
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>

      {/* Bottom Button */}
      <div className="sticky bottom-0 border-t border-border bg-background p-4 shadow-md">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
