import { Metadata } from "next";
import { NoticeFilter, InfiniteNoticeList } from "@/widgets/notice-list";
import { NoticeDetailDrawer } from "@/widgets/notice-detail";
import { Suspense } from "react";
import { NoticeCardSkeleton } from "@/entities/notice";

// METADATA
export const metadata: Metadata = {
  title: "충북대학교 통합 공지사항",
  description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
  openGraph: {
    title: "충북대학교 통합 공지사항",
    description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
    images: ["/thumbnail.png"],
  },
};

// PAGE: 공지사항 목록
export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ noticeGroup?: string; openNotice?: string }>;
}) {
  const resolvedParams = await searchParams;

  // 쿼리 파라미터 추출
  const noticeGroupParam = resolvedParams.noticeGroup;

  // 선택된 공지사항 그룹 배열로 변환
  const selectedGroups =
    typeof noticeGroupParam === "string"
      ? noticeGroupParam.split(",")
      : Array.isArray(noticeGroupParam)
        ? noticeGroupParam
        : [];

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-2 sm:p-6 lg:p-8">
        <main className="mx-auto max-w-7xl">
          <h1 className="mb-6 hidden text-3xl font-bold text-gray-900">
            충북대학교 통합 공지사항
          </h1>

          {/* 그룹 필터 */}
          <div className="sticky top-0 z-10 mb-6 bg-white">
            <NoticeFilter selectedGroups={selectedGroups} />
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
            <InfiniteNoticeList selectedGroups={selectedGroups} />
          </Suspense>
        </main>
      </div>

      {/* 공지사항 상세 Drawer */}
      <NoticeDetailDrawer />
    </>
  );
}
