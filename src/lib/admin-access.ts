interface Identity { email?: string; email_verified?: boolean }
interface AccessOptions {
  adminEmail: string | undefined;
  verifyToken: (token: string) => Promise<Identity>;
}
/** Check authorization before provider work; injectable verification keeps tests offline. */
export async function authorizeAdmin(request: Request, options: AccessOptions): Promise<Response | null> {
  const match = /^Bearer (\S+)$/i.exec(request.headers.get("authorization") ?? "");
  if (!match) return new Response("Sign in as the administrator", { status: 401 });
  if (!options.adminEmail?.trim()) return new Response("Administrator access is not configured", { status: 503 });
  let identity: Identity;
  try { identity = await options.verifyToken(match[1]); }
  catch { return new Response("Invalid or expired sign-in token", { status: 401 }); }
  if (!identity.email_verified || identity.email?.toLowerCase() !== options.adminEmail.trim().toLowerCase()) {
    return new Response("Administrator access required", { status: 403 });
  }
  return null;
}
