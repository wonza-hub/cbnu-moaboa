import { PushAlarmSettings } from "@/features/push-notification/ui/push-alarm-settings";

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen flex-col px-4 pt-20">
      <h1 className="mb-6 text-2xl font-bold">푸시 알림 관리</h1>
      <PushAlarmSettings />
    </div>
  );
}
