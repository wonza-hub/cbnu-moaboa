import {
  type INoticeRowData,
  NOTICE_GROUPS,
  CATEGORY_COLORS,
} from "@/entities/notice";
import { DATE_UTILS } from "@/shared/utils/date";
import { CLEAN_UTILS } from "@/shared/utils/clean";

/**
 * COMPONENT: 공지사항의 메타데이터를 포함한 카드
 */
export default function NoticeCard({ notice }: { notice: INoticeRowData }) {
  const groupInfo = NOTICE_GROUPS[
    notice.noticeGroup as keyof typeof NOTICE_GROUPS
  ] || {
    name: notice.noticeGroup,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const categoryColor =
    CATEGORY_COLORS[notice.category] || CATEGORY_COLORS["기타"];

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md">
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

        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {CLEAN_UTILS.cleanHtmlContent(notice.body)}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{DATE_UTILS.formatDate(notice.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
