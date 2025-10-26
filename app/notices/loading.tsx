import { NoticeCardSkeleton } from "@/entities/notice";

// 로딩 컴포넌트
export default function NoticesLoading() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <NoticeCardSkeleton key={index} />
      ))}
    </div>
  );
}
