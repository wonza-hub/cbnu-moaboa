import {
  type INoticeRowData,
  NOTICE_GROUPS,
  CATEGORY_COLORS,
} from "@/entities/notice";
import { DATE_UTILS } from "@/shared/utils/date";
import { CLEAN_UTILS } from "@/shared/utils/clean";
import { useNoticeDetailDrawerStore } from "@/shared/stores/use-notice-detail-drawer-store";
import { memo } from "react";

/**
 * COMPONENT: 공지사항의 메타데이터를 포함한 카드
 */
export default memo(function NoticeCard({
  notice,
}: {
  notice: INoticeRowData;
}) {
  const { openDrawer, setIsLoading, setError, setDrawerContent } =
    useNoticeDetailDrawerStore();

  const groupInfo = NOTICE_GROUPS[
    notice.noticeGroup as keyof typeof NOTICE_GROUPS
  ] || {
    name: notice.noticeGroup,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const categoryColor =
    CATEGORY_COLORS[notice.category] || CATEGORY_COLORS["기타"];

  const handleClick = async () => {
    if (!notice.noticeId) return;

    try {
      openDrawer();
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:3000"}/api/notices/${notice.noticeId}`,
      );

      if (!response.ok) {
        throw new Error(
          `공지사항을 불러오는데 실패했습니다: ${response.status}`,
        );
      }

      const data: INoticeRowData = await response.json();
      setDrawerContent(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다",
      );
      console.error("공지사항 상세 정보 로딩 중 오류:", err);
    }
  };

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${groupInfo.color}`}
          >
            {groupInfo.name}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${categoryColor}`}
          >
            {notice.category}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
          {notice.title}
        </h3>

        {/* <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {CLEAN_UTILS.cleanHtmlContent(notice.body)}
        </p> */}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{DATE_UTILS.formatDate(notice.createdAt)}</span>
        </div>
      </div>
    </div>
  );
});
