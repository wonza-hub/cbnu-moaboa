"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Bookmark, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  {
    label: "공지사항",
    href: "/notices",
    icon: FileText,
  },
  {
    label: "즐겨찾기",
    href: "/bookmarks",
    icon: Bookmark,
  },
  {
    label: "마이페이지",
    href: "/mypage",
    icon: User,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe bg-background fixed right-0 bottom-0 left-0 z-50 flex h-20 items-center justify-around border-t border-border shadow-2xl transition-colors duration-200">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200",
              isActive
                ? "text-primary"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 transition-transform",
                isActive && "scale-110",
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
