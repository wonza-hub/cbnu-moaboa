import { create } from "zustand";
import { persist, createJSONStorage, combine } from "zustand/middleware";
import { Bookmark } from "./types";

type BookmarkState = {
  bookmarks: Bookmark[];
};

const initialState = {
  bookmarks: [],
} as BookmarkState;

export const useBookmarkStore = create(
  persist(
    combine(initialState, (set) => ({
      addBookmark: (notice: Bookmark) =>
        set((state) => {
          if (state.bookmarks.some((b) => b.noticeId === notice.noticeId)) {
            return state;
          }
          return { bookmarks: [notice, ...state.bookmarks] };
        }),
      removeBookmark: (noticeId: string) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.noticeId !== noticeId),
        })),
    })),
    {
      name: "bookmark-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Selectors
export const useBookmarkList = () =>
  useBookmarkStore((state) => state.bookmarks);
export const useAddBookmark = () =>
  useBookmarkStore((state) => state.addBookmark);
export const useRemoveBookmark = () =>
  useBookmarkStore((state) => state.removeBookmark);
export const useIsBookmarked = (noticeId: string) =>
  useBookmarkStore((state) =>
    state.bookmarks.some((bookmarkItem) => bookmarkItem.noticeId === noticeId),
  );
