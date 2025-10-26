/**
 * UI: 공지사항 상세 스켈레톤
 */
export default function NoticeDetailSkeleton() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header Tabs Skeleton */}
      <div className="flex gap-2 border-b p-4">
        <div className="h-9 w-16 animate-pulse rounded-md bg-gray-200" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Category and Date */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Title */}
        <div className="mb-6 space-y-2">
          <div className="h-7 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-7 w-4/5 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Subtitle Text */}
        <div className="mb-6 h-5 w-3/4 animate-pulse rounded bg-gray-200" />

        {/* Image Placeholder */}
        <div className="aspect-[4/5] w-full animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Bottom Button */}
      <div className="border-t p-4">
        <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
