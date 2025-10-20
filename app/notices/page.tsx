import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoticeFilter, InfiniteNoticeList } from "@/widgets/notice-list";

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
  searchParams: Promise<{ noticeGroup?: string }>;
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

  // API URL 생성 (초기 데이터용)
  const apiUrl = new URL(
    `/api/notices`,
    process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:3000",
  );

  // 쿼리 파라미터 추가
  apiUrl.searchParams.set("page", "1");
  apiUrl.searchParams.set("limit", "12"); // 한 페이지에 12개 표시

  if (selectedGroups.length > 0) {
    apiUrl.searchParams.set("noticeGroup", selectedGroups.join(","));
  }

  try {
    // 서버에서 초기 데이터 가져오기
    const response = await fetch(apiUrl.toString(), {
      cache: "force-cache",
      next: { revalidate: 3600 }, // 1시간마다 재검증
    });

    if (!response.ok) {
      throw new Error(`공지사항을 불러오는데 실패했습니다: ${response.status}`);
    }

    const initialData = await response.json();

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <main className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            충북대학교 통합 공지사항
          </h1>

          {/* 그룹 필터 */}
          <NoticeFilter selectedGroups={selectedGroups} />

          {/* 무한스크롤 공지사항 */}
          <InfiniteNoticeList
            initialData={initialData}
            selectedGroups={selectedGroups}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("공지사항 로딩 중 오류:", error);
    return notFound();
  }
}
