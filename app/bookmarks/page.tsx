"use client";

import { BookmarkList } from "@/widgets/bookmark-list";
import { BookmarkHeader } from "@/entities/bookmark";
import { useState, useEffect } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { NoticeCardSkeleton as BookmarkCardSkeleton } from "@/entities/notice";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col gap-4 px-4 pt-20">
      {mounted ? (
        <>
          <BookmarkHeader />
          <BookmarkList />
        </>
      ) : (
        <>
          <Skeleton className="h-7 w-36" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BookmarkCardSkeleton key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
