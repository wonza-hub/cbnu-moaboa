import { Metadata } from "next";
import { NoticeFilter, InfiniteNoticeList } from "@/widgets/notice-list";
import { Suspense } from "react";
import { NoticeCardSkeleton } from "@/entities/notice";

export const metadata: Metadata = {
  title: "충북대학교 통합 공지사항",
  description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
  openGraph: {
    title: "충북대학교 통합 공지사항",
    description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
    images: ["/thumbnail.png"],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ noticeGroup?: string; openNotice?: string }>;
}) {
  const resolvedParams = await searchParams;
  const noticeGroupParam = resolvedParams.noticeGroup;

  // 단일 공지사항 그룹 선택 (문자열 또는 undefined)
  const selectedGroup =
    typeof noticeGroupParam === "string" ? noticeGroupParam : undefined;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-2 sm:p-6 lg:p-8">
        <main className="mx-auto max-w-7xl">
          <h1 className="mb-6 hidden text-3xl font-bold text-gray-900">
            충북대학교 통합 공지사항
          </h1>

          {/* 그룹 필터 */}
          <div className="sticky top-0 z-10 mb-6">
            <NoticeFilter selectedGroup={selectedGroup} />
          </div>

          {/* 무한스크롤 공지사항 */}
          <Suspense
            fallback={
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <NoticeCardSkeleton key={index} />
                ))}
              </div>
            }
          >
            <InfiniteNoticeList selectedGroup={selectedGroup} />
          </Suspense>
        </main>
      </div>
    </>
  );
}
