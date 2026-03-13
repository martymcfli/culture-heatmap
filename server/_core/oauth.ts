import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { createClerkClient, verifyToken } from "@clerk/express";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // ── Clerk auth sync ──────────────────────────────────────────────────────────
  // Client sends Clerk session token; we verify it, upsert user, and set our cookie.
  app.post("/api/auth/clerk-sync", async (req: Request, res: Response) => {
    const { token } = req.body as { token?: string };
    if (!token) {
      res.status(400).json({ error: "token is required" });
      return;
    }

    if (!ENV.clerkSecretKey) {
      res.status(500).json({ error: "Clerk not configured on server" });
      return;
    }

    try {
      const payload = await verifyToken(token, { secretKey: ENV.clerkSecretKey });
      const clerkClient = createClerkClient({ secretKey: ENV.clerkSecretKey });
      const clerkUserId = payload.sub; // e.g. "user_2abc..."

      // Fetch full user record from Clerk to get email/name
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const primaryEmail = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ?? null;
      const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

      await db.upsertUser({
        openId: clerkUserId,
        name,
        email: primaryEmail,
        loginMethod: "clerk",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(clerkUserId, {
        name: name ?? "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ ok: true });
    } catch (error) {
      console.error("[Clerk] Sync failed", error);
      res.status(401).json({ error: "Clerk token verification failed" });
    }
  });


  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
