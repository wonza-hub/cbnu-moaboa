import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Bookmark } from "./types";

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (notice: Bookmark) => void;
  removeBookmark: (noticeId: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (notice) =>
        set((state) => {
          if (state.bookmarks.some((b) => b.noticeId === notice.noticeId)) {
            return state;
          }
          return { bookmarks: [notice, ...state.bookmarks] };
        }),
      removeBookmark: (noticeId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.noticeId !== noticeId),
        })),
    }),
    {
      name: "bookmark-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useAddBookmark = () => {
  return useBookmarkStore((state) => state.addBookmark);
};

export const useRemoveBookmark = () => {
  return useBookmarkStore((state) => state.removeBookmark);
};

export const useIsBookmarked = (noticeId: string) => {
  return useBookmarkStore((state) =>
    state.bookmarks.some((bookmarkItem) => bookmarkItem.noticeId === noticeId),
  );
};
