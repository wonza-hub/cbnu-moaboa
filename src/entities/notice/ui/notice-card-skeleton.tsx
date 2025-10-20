/**
 * COMPONENT: 공지사항 카드 스켈레톤
 */
export default function NoticeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200"></div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
        </div>
        <div className="mb-2 h-6 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mt-4 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
