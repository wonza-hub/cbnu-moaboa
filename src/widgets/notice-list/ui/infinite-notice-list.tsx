"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import {
  NoticeCard,
  NoticeCardSkeleton,
  type IApiResponse,
  type INoticeRowData,
} from "@/entities/notice";

/**
 * WIDGET: 무한스크롤 공지사항
 */
interface IInfiniteNoticesProps {
  initialData: IApiResponse;
  selectedGroups: string[];
}
export default function InfiniteNoticeList({
  initialData,
  selectedGroups,
}: IInfiniteNoticesProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const queryKey = ["notices", { groups: selectedGroups }];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<IApiResponse, Error>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;

      const apiUrl = new URL(
        `/api/notices`,
        process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:3000",
      );

      // 쿼리 파라미터 추가
      apiUrl.searchParams.set("page", page.toString());
      apiUrl.searchParams.set("limit", "12"); // 한 페이지에 12개 표시

      if (selectedGroups.length > 0) {
        apiUrl.searchParams.set("noticeGroup", selectedGroups.join(","));
      }

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        throw new Error(
          `공지사항을 불러오는데 실패했습니다: ${response.status}`,
        );
      }

      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
  });

  // 무한스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 페이지의 공지사항 데이터 병합
  const allNotices = data?.pages.flatMap((page) => page.data || []) || [];

  if (isLoading && allNotices.length === 0) {
    return <NoticesLoading />;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="mb-2 text-lg text-red-500">
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (allNotices.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-lg text-gray-500">
          공지사항이 없습니다. 다른 필터를 선택해보세요.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 공지사항 목록 */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allNotices.map((notice: INoticeRowData, index) => (
          <NoticeCard key={`${notice.noticeId}-${index}`} notice={notice} />
        ))}
      </div>

      {/* 무한스크롤 로딩 표시기 */}
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={ref} className="mt-4 flex items-center justify-center py-8">
          {isFetchingNextPage ? (
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">더 불러오는 중...</p>
            </div>
          ) : (
            <p className="text-gray-500">스크롤하여 더 보기</p>
          )}
        </div>
      )}

      {/* 더 이상 불러올 데이터가 없는 경우 */}
      {!hasNextPage && allNotices.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">모든 공지사항을 불러왔습니다.</p>
        </div>
      )}
    </>
  );
}

// 로딩 컴포넌트
function NoticesLoading() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <NoticeCardSkeleton key={index} />
      ))}
    </div>
  );
}
