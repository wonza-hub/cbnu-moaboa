"use client";

import { create } from "zustand";
import { INoticeRowData } from "@/entities/notice";

interface INoticeDetailDrawerStore {
  isOpen: boolean;
  drawerContent: INoticeRowData | null;
  isLoading: boolean;
  error: string | null;

  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawerContent: (data: INoticeRowData | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}
/**
 * STORE: 공지사항 상세 뷰어 상태
 */
export const useNoticeDetailDrawerStore = create<INoticeDetailDrawerStore>(
  (set) => ({
    // INITIAL STATE
    isOpen: false,
    drawerContent: null,
    isLoading: false,
    error: null,

    // ACTIONS
    openDrawer: () =>
      set({
        isOpen: true,
        drawerContent: null,
        error: null,
      }),
    closeDrawer: () => set({ isOpen: false }),
    setDrawerContent: (data) => set({ drawerContent: data, isLoading: false }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
  }),
);
