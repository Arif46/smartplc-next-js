export function getSocialLoginUrl(provider: "google" | "facebook"): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/auth/${provider}/redirect`;
}

export async function loginWithEmail(email: string, password: string) {
  const api = (await import("@/lib/api")).default;
  await api.get("/sanctum/csrf-cookie");
  const res = await api.post("api/login", { email, password });
  return res.data as { token: string; user: { role: string; first_name?: string; name?: string; email?: string } };
}

export async function registerCustomer(data: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const api = (await import("@/lib/api")).default;
  const res = await api.post("/api/register", data);
  return res.data;
}
