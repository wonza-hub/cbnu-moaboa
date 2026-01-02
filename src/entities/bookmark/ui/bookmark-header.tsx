"use client";

import { useBookmarkList } from "@/entities/bookmark";

export function BookmarkHeader() {
  const bookmarks = useBookmarkList();

  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">
          {bookmarks.length} 개의 즐겨찾기
        </h1>
      </div>
    </div>
  );
}
