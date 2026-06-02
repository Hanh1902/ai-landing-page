import { supabase } from "./supabase";

export async function getCurrentUserRole(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return profile?.role || "user";
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const role = await getCurrentUserRole();
    return role === "admin";
  } catch {
    return false;
  }
}
