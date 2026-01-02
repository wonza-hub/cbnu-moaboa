"use client";

import { useBookmarkList } from "@/entities/bookmark";
import { NoticeCard } from "@/entities/notice";
import { ToggleBookmarkButton } from "@/features/bookmark";

export function BookmarkList() {
  const bookmarks = useBookmarkList();

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-medium text-gray-900">
          아직 즐겨찾기한 공지사항이 없습니다.
        </h3>
        <p className="text-sm text-gray-500">
          관심 있는 공지사항을 즐겨찾기에 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      {bookmarks.map((notice) => (
        <NoticeCard
          key={notice.noticeId}
          notice={notice}
          actionSlot={<ToggleBookmarkButton notice={notice} />}
        />
      ))}
    </div>
  );
}
