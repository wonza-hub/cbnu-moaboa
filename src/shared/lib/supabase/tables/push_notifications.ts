import { createAdminClient } from "@/shared/lib/supabase/admin";

interface SubscriptionKeys {
  p256dh: string;
  auth: string;
}

interface SubscriptionData {
  endpoint: string;
  keys: SubscriptionKeys;
}

export async function upsertSubscription(
  subscription: SubscriptionData,
  groups: string[] = [],
) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      groups: groups,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    console.error("Supabase upsert error:", error);
    throw error;
  }

  return true;
}

export async function deleteSubscription(endpoint: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) {
    console.error("Supabase delete error:", error);
    throw error;
  }

  return true;
}

export async function getSubscription(endpoint: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("groups")
    .eq("endpoint", endpoint)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Supabase select error:", error);
    throw error;
  }

  return data;
}
