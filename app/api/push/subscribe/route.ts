import { NextRequest, NextResponse } from "next/server";
import {
  upsertSubscription,
  deleteSubscription,
  getSubscription,
} from "@/shared/lib/supabase/tables/push_notifications";

// 푸시 알림 및 구독 관련

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Subscription payload:", body);
    const { subscription, groups } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      console.error("Invalid subscription data:", subscription);
      return NextResponse.json(
        { error: "Invalid subscription data (missing endpoint or keys)" },
        { status: 400 },
      );
    }

    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;

    if (!p256dh || !auth) {
      console.error("Missing keys:", subscription.keys);
      return NextResponse.json(
        { error: "Missing p256dh or auth keys" },
        { status: 400 },
      );
    }

    // 구독 정보 저장 또는 업데이트
    console.log("Upserting to Supabase via helper...");
    await upsertSubscription(subscription, groups || []);

    console.log("구독 정보 저장 성공:", {
      endpoint: subscription.endpoint,
      groups,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 },
      );
    }

    console.log("Deleting subscription from Supabase:", endpoint);
    await deleteSubscription(endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscription API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint parameter is required" },
        { status: 400 },
      );
    }

    const data = await getSubscription(endpoint);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Get Subscription API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
