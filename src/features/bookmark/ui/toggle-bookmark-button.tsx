"use client";

import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  useAddBookmark,
  useIsBookmarked,
  useRemoveBookmark,
  type Bookmark,
} from "@/entities/bookmark";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

interface ToggleBookmarkButtonProps {
  notice: Bookmark;
  className?: string;
}

export function ToggleBookmarkButton({
  notice,
  className,
}: ToggleBookmarkButtonProps) {
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  const isBookmarked = useIsBookmarked(notice.noticeId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isBookmarked) {
      removeBookmark(notice.noticeId);
      toast.success("즐겨찾기에서 게시물이 제거되었습니다.");
    } else {
      addBookmark(notice);
      toast.success("즐겨찾기에 게시물이 추가되었습니다.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 transition-colors hover:bg-red-50 hover:text-red-500",
        isBookmarked ? "text-red-500" : "text-gray-400",
        className,
      )}
      onClick={handleToggle}
    >
      <Heart
        className={cn("h-5 w-5 transition-all", isBookmarked && "fill-current")}
      />
      <span className="sr-only">
        `즐겨찾기 ${isBookmarked ? "해제" : "추가"}`
      </span>
    </Button>
  );
}
