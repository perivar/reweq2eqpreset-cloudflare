import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { createThemeSessionResolver } from "remix-themes";

const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme:mode",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    maxAge: 365 * 24 * 60 * 60, // 365 days
    secure: isProduction,
    // // Set domain and secure only if in production
    // ...(isProduction
    //   ? { domain: "your-production-domain.com", secure: true }
    //   : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
