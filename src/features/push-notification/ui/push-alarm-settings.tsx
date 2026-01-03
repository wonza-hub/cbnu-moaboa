"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/shared/components/ui/drawer";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { urlBase64ToUint8Array } from "@/shared/lib/utils";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

// TODO: 공지사항 그룹 정보를 서버에서 가져오도록 수정해야 함.
const NOTICE_GROUPS = [
  { id: "sw-major", label: "소프트웨어학과" },
  { id: "cieat", label: "씨앗(CIEAT)" },
];

export function PushAlarmSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
        // Fetch groups from server
        fetchGroups(sub.endpoint);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  }

  async function fetchGroups(endpoint: string) {
    try {
      const res = await fetch(
        `/api/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`,
      );
      if (res.ok) {
        const { data } = await res.json();
        if (data && data.groups) {
          setSelectedGroups(data.groups);
        }
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }

  async function handleSwitchChange(checked: boolean) {
    if (checked) {
      await subscribeToPush();
    } else {
      await unsubscribeFromPush();
    }
  }

  async function subscribeToPush() {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("푸시 알림 권한이 거부되었습니다.");
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      });

      const success = await saveSubscriptionToDb(sub, []);
      if (!success) {
        // DB 저장 실패 시 구독 취소 처리
        await sub.unsubscribe();
        throw new Error("서버에 구독 정보를 저장하는데 실패했습니다.");
      }

      setSubscription(sub);
      setIsSubscribed(true);

      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast.error(
        error instanceof Error ? error.message : "알림 구독에 실패했습니다.",
      );
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    if (!subscription) return;
    setLoading(true);
    try {
      await subscription.unsubscribe();
      await fetch(
        `/api/push/subscribe?endpoint=${encodeURIComponent(
          subscription.endpoint,
        )}`,
        { method: "DELETE" },
      );
      setSubscription(null);
      setIsSubscribed(false);
      setSelectedGroups([]);
      toast.success("구독이 취소되었습니다.");
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      toast.error("구독 취소 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSubscriptionToDb(sub: PushSubscription, groups: string[]) {
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub,
          groups: groups,
        }),
      });
      if (!response.ok) throw new Error("Failed to save to DB");
      return true;
    } catch (error) {
      console.error("DB 저장 실패:", error);
      return false;
    }
  }

  async function handleConfirmGroups() {
    if (!subscription) return;
    if (selectedGroups.length === 0) {
      toast.error("최소 1개 이상의 그룹을 선택해주세요.");
      return;
    }

    const success = await saveSubscriptionToDb(subscription, selectedGroups);
    if (success) {
      setIsDrawerOpen(false);
      toast.success("구독 그룹이 저장되었습니다.");
    } else {
      toast.error("저장에 실패했습니다.");
    }
  }

  function toggleGroup(groupId: string) {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  }

  if (!isSupported) {
    return (
      <div className="p-4 text-sm text-gray-500">
        이 브라우저는 푸시 알림을 지원하지 않습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-medium">새 게시물 알림</span>
        <Switch
          checked={isSubscribed}
          onCheckedChange={handleSwitchChange}
          disabled={loading}
        />
      </div>

      {isSubscribed && (
        <div
          className="flex cursor-pointer items-center text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setIsDrawerOpen(true)}
        >
          <span>구독 그룹 관리</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      )}

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>구독할 공지사항 그룹 선택</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                {NOTICE_GROUPS.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={group.id}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                    />
                    <Label
                      htmlFor={group.id}
                      className="text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {group.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleConfirmGroups}>확인</Button>
              <DrawerClose asChild>
                <Button variant="outline">취소</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
