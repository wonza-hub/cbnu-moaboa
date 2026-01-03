import Link from "next/link";
import { NOTICE_GROUPS } from "@/entities/notice";

/**
 * COMPONENT: 공지사항 그룹 필터
 */
export default function NoticeFilter({
  selectedGroup,
}: {
  selectedGroup?: string;
}) {
  return (
    <div className="mb-6 rounded-lg bg-card p-4 shadow">
      <h2 className="mb-3 hidden text-lg font-medium text-foreground">
        공지사항 그룹 필터
      </h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/notices"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            !selectedGroup
              ? "border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              : "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          }`}
        >
          전체
        </Link>

        {Object.entries(NOTICE_GROUPS).map(([id, { name, color }]) => (
          <Link
            key={id}
            href={
              selectedGroup === id ? "/notices" : `/notices?noticeGroup=${id}`
            }
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedGroup === id
                ? color
                : "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
