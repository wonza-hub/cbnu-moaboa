import Link from "next/link";
import { ChevronRight, Settings } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

export default function Page() {
  return (
    <>
      {/* 프로필 */}
      <div className="glass-card mb-8 flex items-center gap-4 rounded-xl p-4">
        <Avatar className="h-16 w-16">
          {/* TODO: 사용자 기본 프로필 이미지 추가 */}
          <AvatarImage src="/images/default-avatar.png" alt="Profile" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold">사용자님</h2>
          <p className="text-sm text-gray-500">환영합니다!</p>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-3">
        <Link
          href="/settings"
          className="glass-card flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-black/5"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="font-medium">설정</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>
    </>
  );
}
