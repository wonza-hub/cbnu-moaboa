import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen flex-col px-4 pt-20">
      <h1 className="mb-6 text-2xl font-bold">설정</h1>
      <div className="flex flex-col gap-2">
        <Link
          href="/settings/push-alarm"
          className="glass-card flex items-center justify-between rounded-lg p-4"
        >
          <span className="font-medium">푸시 알림 관리</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
