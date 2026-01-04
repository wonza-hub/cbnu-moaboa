"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/shared/components/ui/drawer";
import {
  CATEGORY_COLORS,
  NOTICE_GROUPS,
} from "@/entities/notice/lib/constants";
import { DATE_UTILS } from "@/shared/utils/date";
import Image from "next/image";
import { PARSE_UTILS } from "@/shared/utils/parse";
import { useNoticeDetailDrawerStore } from "@/shared/stores/use-notice-detail-drawer-store";
import { NoticeDetailSkeleton } from "@/widgets/notice-detail";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

// 카테고리 색상 가져오기
const getCategoryColor = (category: string) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS["기타"];
};

// 그룹 정보 가져오기
const getGroupInfo = (noticeGroup: string) => {
  return (
    NOTICE_GROUPS[noticeGroup as keyof typeof NOTICE_GROUPS] || {
      name: noticeGroup,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    }
  );
};

/**
 * WIDGET: 공지사항 상세 뷰어
 * 전역 상태를 활용하여 drawer 열림/닫힘 및 데이터 로딩 상태 관리
 */
export default function NoticeDetailDrawer() {
  const { isOpen, drawerContent, isLoading, error, closeDrawer } =
    useNoticeDetailDrawerStore();

  // 닫기 핸들러
  const handleClose = () => {
    closeDrawer();
  };

  // drawer가 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="flex max-h-[90vh] min-h-[90vh] flex-col">
        {/* 에러 발생 시 */}
        {error && (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <p className="mb-4 text-red-500">{error}</p>
              <button
                onClick={handleClose}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                닫기
              </button>
            </div>
          </div>
        )}
        <DrawerTitle className="hidden">공지사항 상세 드로어</DrawerTitle>
        {/* 공지사항 내용 */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl">
            {!drawerContent || isLoading ? (
              <NoticeDetailSkeleton />
            ) : (
              <>
                <DrawerHeader className="bg-background sticky top-0 z-10 border-b pb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      {/* 그룹 배지 */}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          getGroupInfo(drawerContent?.noticeGroup).color
                        }`}
                      >
                        {getGroupInfo(drawerContent?.noticeGroup).name}
                      </span>

                      {/* 카테고리 배지 */}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(
                          drawerContent?.category,
                        )}`}
                      >
                        {drawerContent?.category}
                      </span>
                    </div>

                    {/* 날짜 */}
                    <span className="text-muted-foreground text-sm">
                      {DATE_UTILS.formatDate(drawerContent?.createdAt)}
                    </span>
                  </div>

                  {/* 제목 */}
                  <div className="text-foreground mt-2 text-lg font-semibold">
                    {drawerContent?.title}
                  </div>
                </DrawerHeader>

                {/* 본문 내용 */}
                <article className="p-6">
                  <div className="prose dark:prose-invert mb-8 max-w-none">
                    <div
                      dangerouslySetInnerHTML={PARSE_UTILS.renderSafeHTML(
                        drawerContent?.body,
                      )}
                      className="text-foreground leading-relaxed"
                    />
                  </div>

                  {/* 이미지 처리 */}
                  {drawerContent?.imageUrls &&
                    drawerContent.imageUrls.length > 0 && (
                      <div className="mb-8">
                        <h3 className="mb-4 hidden text-lg font-semibold">
                          첨부 이미지
                        </h3>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {drawerContent.imageUrls.map((url, idx) => (
                              <CarouselItem key={idx}>
                                <div className="bg-muted relative w-full overflow-hidden rounded-lg">
                                  <Image
                                    className="h-auto w-full object-contain"
                                    src={url}
                                    alt={`첨부 이미지 ${idx + 1}`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          {drawerContent.imageUrls.length > 1 && (
                            <>
                              <CarouselPrevious className="bg-background/80 hover:bg-background left-2" />
                              <CarouselNext className="bg-background/80 hover:bg-background right-2" />
                            </>
                          )}
                        </Carousel>
                      </div>
                    )}

                  {/* 테이블 */}
                  {drawerContent?.tables && (
                    <div className="mb-8">
                      <h3 className="mb-4 hidden text-lg font-semibold">
                        첨부 표
                      </h3>
                      <div className="space-y-6">
                        <div
                          className="overflow-x-auto border"
                          dangerouslySetInnerHTML={PARSE_UTILS.renderSafeHTML(
                            drawerContent?.tables,
                          )}
                        />
                      </div>
                    </div>
                  )}
                </article>
              </>
            )}
          </div>
        </div>

        <DrawerFooter className="border-border bg-background sticky bottom-0 border-t shadow-md">
          <DrawerClose asChild>
            <button
              onClick={handleClose}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              닫기
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
