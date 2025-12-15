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
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-3 hidden text-lg font-medium text-gray-900">
        공지사항 그룹 필터
      </h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/notices"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            !selectedGroup
              ? "border-indigo-200 bg-indigo-100 text-indigo-800"
              : "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
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
                : "border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
