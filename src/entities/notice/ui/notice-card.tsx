import {
  type INoticeRowData,
  NOTICE_GROUPS,
  CATEGORY_COLORS,
} from "@/entities/notice";
import { DATE_UTILS } from "@/shared/utils/date";
import { useNoticeDetailDrawerStore } from "@/shared/stores/use-notice-detail-drawer-store";
import { memo } from "react";

/**
 * COMPONENT: 공지사항의 메타데이터를 포함한 카드
 */
export default memo(function NoticeCard({
  notice,
  actionSlot,
}: {
  notice: INoticeRowData;
  actionSlot?: React.ReactNode;
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/notices/${notice.noticeId}`,
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
      className="glass-card flex h-42 cursor-pointer flex-col overflow-hidden rounded-lg"
      onClick={handleClick}
    >
      <div className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex gap-2">
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
          {actionSlot && <div className="z-10">{actionSlot}</div>}
        </div>

        <h3 className="text-md text-foreground mb-auto line-clamp-2 font-semibold">
          {notice.title}
        </h3>

        <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
          <span>{DATE_UTILS.formatDate(notice.createdAt)}</span>
        </div>
      </div>
    </div>
  );
});
