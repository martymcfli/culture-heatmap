export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // When Clerk is configured, we never redirect to the Manus OAuth portal.
  // Sign-in is handled by Clerk's modal triggered from within the app.
  if (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) return "#";

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Guard against missing env vars (e.g. demo/portfolio deployments without OAuth configured)
  if (!oauthPortalUrl || !appId) return "#";

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
