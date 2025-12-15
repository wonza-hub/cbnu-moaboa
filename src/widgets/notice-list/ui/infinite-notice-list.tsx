"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import {
  NoticeCard,
  type IApiResponse,
  type INoticeRowData,
} from "@/entities/notice";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

/**
 * WIDGET: 공지사항 목록
 */
interface IInfiniteNoticesProps {
  selectedGroup?: string;
}
export default function InfiniteNoticeList({
  selectedGroup,
}: IInfiniteNoticesProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const queryKey = ["notices", { group: selectedGroup }];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<IApiResponse, Error>({
      queryKey,
      queryFn: async ({ pageParam }) => {
        // API Routes를 위한 상대 경로 사용
        const params = new URLSearchParams();

        // 페이지 파라미터 추가
        params.set("page", String(pageParam));

        // 선택된 그룹이 있으면 그룹 파라미터 추가
        if (selectedGroup) {
          params.set("noticeGroup", selectedGroup);
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/notices?${params.toString()}`;
        const response = await fetch(apiUrl);

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
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 페이지의 공지사항 데이터 병합
  const allNotices = data?.pages.flatMap((page) => page.data || []) || [];

  if (allNotices.length === 0) {
    return (
      <div className="glass-card rounded-lg p-8 text-center">
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
          <div key={`${notice.noticeId}-${index}`}>
            <NoticeCard notice={notice} />
          </div>
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
