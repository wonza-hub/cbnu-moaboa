import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { INoticeRowData } from "@/entities/notice";
import { createAdminClient } from "@/shared/lib/supabase/admin";

// VAPID 설정
webpush.setVapidDetails(
  `mailto:${process.env.WEBHOOK_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(request: NextRequest) {
  // 1. Secret 검증
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const notices: INoticeRowData[] = body.notices;

    if (!Array.isArray(notices) || notices.length === 0) {
      return NextResponse.json(
        { message: "No notices to process" },
        { status: 200 },
      );
    }

    console.log(`[Webhook] ${notices.length}개의 새 공지사항 수신`);

    const supabase = createAdminClient();

    // 2. 각 공지사항 그룹별 구독자 조회 및 발송
    const results = await Promise.all(
      notices.map(async (notice) => {
        const group = notice.noticeGroup;

        // 해당 그룹을 구독 중인 사용자 조회
        // groups 배열에 group이 포함된 행을 찾음
        const { data: subscriptions, error } = await supabase
          .from("push_subscriptions")
          .select("endpoint, p256dh, auth")
          .contains("groups", [group]);

        if (error) {
          console.error(`[Push] 그룹 '${group}' 구독자 조회 실패:`, error);
          return { group, error: error.message };
        }

        if (!subscriptions || subscriptions.length === 0) {
          console.log(`[Push] 그룹 '${group}'의 구독자가 없습니다.`);
          return { group, count: 0 };
        }

        console.log(
          `[Push] 그룹 '${group}'의 구독자 ${subscriptions.length}명에게 알림 발송 시도`,
        );

        const pushPromises = subscriptions.map((sub) => {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          // TODO: 푸시 알림 발송 로직 및 내용 수정
          return webpush
            .sendNotification(
              pushSubscription,
              JSON.stringify({
                title: `[새 공지] ${notice.title}`,
                body: notice.category
                  ? `${notice.category} - ${notice.noticeGroup}`
                  : notice.noticeGroup,
                icon: "/icon.png",
                // 클릭 시 해당 공지사항 상세 페이지로 이동하도록 URL 포함
                data: {
                  url: `/notices?noticeGroup=${notice.noticeGroup}&openNotice=${notice.noticeId}`,
                },
              }),
            )
            .catch(async (err) => {
              console.error("푸시 전송 실패:", err);
              // 410 Gone (구독 만료) 또는 404 Not Found인 경우 DB에서 삭제
              if (err.statusCode === 410 || err.statusCode === 404) {
                console.log(
                  `만료된 구독 정보 삭제: ${sub.endpoint.slice(0, 20)}...`,
                );
                await supabase
                  .from("push_subscriptions")
                  .delete()
                  .eq("endpoint", sub.endpoint);
              }
            });
        });

        await Promise.all(pushPromises);
        return { group, count: subscriptions.length };
      }),
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
