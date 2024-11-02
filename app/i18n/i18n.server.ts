// This version uses bundles resources:
// https://sergiodxa.com/tutorials/add-i18n-to-a-remix-vite-app
// For a version using i18next-fs-backend
// https://remix.run/resources/remix-i18next
// For a version using i18next-fetch-backend
// https://github.com/sergiodxa/remix-vite-i18next/tree/main

import { createCookie } from "@remix-run/cloudflare";
import { RemixI18Next } from "remix-i18next/server";

import i18n from "./i18n";

const isProduction = process.env.NODE_ENV === "production";

export const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: isProduction,
  httpOnly: true,
  maxAge: 365 * 24 * 60 * 60, // 365 days
});

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    cookie: localeCookie,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,

    // You can add extra keys here
  },
  // The i18next plugins you want RemixI18next to use for `i18n.getFixedT` inside loaders and actions.
  // E.g. The Backend plugin for loading translations from the file system
  // Tip: You could pass `resources` to the `i18next` configuration and avoid a backend here
  // plugins: [Backend], // setup i18next-fs-backend
});

export default i18next;
