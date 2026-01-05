"use client";

import { useState, useEffect } from "react";
import {
  X,
  Download,
  Share,
  MoreVertical,
  Menu,
  PlusSquare,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";

export default function PwaInstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(true); // 초기값 true로 설정하여 깜빡임 방지
  const [isVisible, setIsVisible] = useState(false);
  const [defaultTab, setDefaultTab] = useState("chrome");
  const [isIOS, setIsIOS] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // PWA 모드 감지
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");

    setIsStandalone(isStandaloneMode);

    // PWA가 아니고 아직 닫지 않았으면 표시
    if (!isStandaloneMode) {
      // 1초 뒤에 표시하여 자연스럽게 등장하도록 함
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // OS 및 브라우저 감지
    const ua = navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS에서는 Safari가 기본, Chrome 등은 공유 버튼 위치가 다를 수 있음
      if (ua.includes("crios")) {
        // Chrome on iOS
        setDefaultTab("chrome-ios");
      } else {
        setDefaultTab("safari");
      }
    } else if (ua.includes("samsungbrowser")) {
      setDefaultTab("samsung");
    } else {
      setDefaultTab("chrome");
    }
  }, []);

  if (isStandalone || !isVisible) return null;

  return (
    <>
      {/* 하단 고정 배너 */}
      <div
        className={cn(
          "border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-4 bottom-20 left-4 z-50 flex items-center justify-between rounded-lg border p-4 shadow-lg backdrop-blur md:bottom-8 md:left-auto md:max-w-md",
          "animate-in slide-in-from-bottom-5 fade-in duration-500",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">앱으로 더 편리하게!</span>
            <span className="text-muted-foreground text-xs">
              푸시 알림을 위해 홈 화면에 추가하세요
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 text-xs"
            onClick={() => setIsDrawerOpen(true)}
          >
            설치 방법
          </Button>
        </div>
      </div>

      {/* 설치 안내 드로어 (모달) */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>홈 화면에 앱 추가하기</DrawerTitle>
              <DrawerDescription>
                브라우저별로 홈 화면에 추가하는 방법이 다릅니다.
                <br />
                사용 중인 브라우저를 선택해 주세요.
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="safari">Safari</TabsTrigger>
                  <TabsTrigger value="chrome">Chrome</TabsTrigger>
                  <TabsTrigger value="samsung">Samsung</TabsTrigger>
                </TabsList>

                {/* Safari (iOS) */}
                <TabsContent value="safari" className="space-y-4 pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        1
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          하단 '...' 버튼 클릭
                        </p>
                        <p className="text-muted-foreground text-xs">
                          브라우저 하단에 있는 더보기 아이콘을 눌러주세요.
                        </p>
                        <div className="bg-background mt-1 flex justify-center rounded border py-1">
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        2
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          '홈 화면에 추가' 선택
                        </p>
                        <p className="text-muted-foreground text-xs">
                          메뉴를 위로 스크롤하여 찾을 수 있습니다.
                        </p>
                        <div className="bg-background mt-1 flex w-full items-center justify-center gap-2 rounded border py-2 text-xs font-medium">
                          <PlusSquare className="h-4 w-4" />홈 화면에 추가
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        3
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          우측 상단 '추가' 클릭
                        </p>
                        <p className="text-muted-foreground text-xs">
                          설정을 완료하면 홈 화면에 앱 아이콘이 생성됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Chrome (Android/iOS) */}
                <TabsContent value="chrome" className="space-y-4 pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        1
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          브라우저 메뉴 열기
                        </p>
                        <p className="text-muted-foreground text-xs">
                          우측 상단 (또는 하단)의 내보내기 아이콘을 눌러주세요.
                        </p>
                        <div className="bg-background mt-1 flex justify-center rounded border py-1">
                          <Share className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        2
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">'더보기' 선택</p>
                        <p className="text-muted-foreground text-xs">
                          메뉴 목록에서 해당 항목을 선택해주세요.
                        </p>
                        <div className="bg-background mt-1 flex items-center justify-center gap-2 rounded border py-2 text-xs font-medium">
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        3
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          '홈 화면에 추가' 선택
                        </p>
                        <p className="text-muted-foreground text-xs">
                          메뉴 목록에서 해당 항목을 선택해주세요.
                        </p>
                        <div className="bg-background mt-1 flex items-center justify-center gap-2 rounded border py-2 text-xs font-medium">
                          <PlusSquare className="h-4 w-4" />홈 화면에 추가
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        4
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          우측 상단에 '추가' 클릭
                        </p>
                        <p className="text-muted-foreground text-xs">
                          설정을 완료하면 홈 화면에 앱 아이콘이 생성됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Chrome (iOS) - 탭이 많아지면 복잡해지므로 Chrome 탭 내에서 분기하거나 별도 처리. 여기서는 편의상 Chrome 탭 내용을 범용적으로 작성함. */}
                {/* 만약 iOS Chrome을 따로 처리하고 싶다면 별도 탭을 만들 수도 있음. 여기서는 3개로 단순화. */}

                {/* Samsung Internet */}
                <TabsContent value="samsung" className="space-y-4 pt-4">
                  <div className="flex flex-col gap-4">
                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        1
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">하단 메뉴 열기</p>
                        <p className="text-muted-foreground text-xs">
                          우측 하단의 3선(햄버거) 메뉴 아이콘을 눌러주세요.
                        </p>
                        <div className="bg-background mt-1 flex justify-center rounded border py-1">
                          <Menu className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        2
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          '현재 페이지 추가' 선택
                        </p>
                        <p className="text-muted-foreground text-xs">
                          메뉴에서 + 아이콘이 있는 항목을 찾아주세요.
                        </p>
                        <div className="bg-background mt-1 flex items-center justify-center gap-2 rounded border py-2 text-xs font-medium">
                          <PlusSquare className="h-4 w-4" />
                          현재 페이지 추가
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 flex items-start gap-3 rounded-md p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        3
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          '홈 화면' 선택 후 '추가'
                        </p>
                        <p className="text-muted-foreground text-xs">
                          홈 화면에 바로가기가 생성됩니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">닫기</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
