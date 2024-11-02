import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import ResponsiveNavBar from "./components/ResponsiveNavBar";
import { Toaster } from "./components/ui/toaster";
import { themeSessionResolver } from "./theme.sessions.server";

import "./tailwind.css";

import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

import ConfirmProvider from "./components/layout/confirm-provider";
import i18next, { localeCookie } from "./i18n/i18n.server";

// dark mode
// https://gist.github.com/keepforever/43c5cfa72cad8b1dad2f3982fe81b576?permalink_comment_id=5117253#gistcomment-5117253

// i18n
// https://sergiodxa.com/tutorials/add-i18n-to-a-remix-vite-app

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "translation",
};

// Return the theme and the session from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  // Get theme from session
  const themeSession = await themeSessionResolver(request);
  const theme = themeSession.getTheme();
  console.log("Theme: " + theme);

  // Get locale from i18next
  const locale = await i18next.getLocale(request);
  console.log("Locale: " + locale);

  return json(
    {
      theme,
      locale,
    },
    { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
  );
}

// It defines the overall page structure (header, footer, etc.) and renders children
export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");

  return (
    <ThemeProvider
      specifiedTheme={loaderData?.theme ?? null}
      themeAction="/action/set-theme">
      <ConfirmProvider>
        <InnerLayout
          ssrTheme={Boolean(loaderData?.theme)}
          locale={loaderData?.locale}>
          {children}
        </InnerLayout>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

// In order to avoid the Error: useTheme must be used within a ThemeProvider
function InnerLayout({
  ssrTheme,
  locale,
  children,
}: {
  ssrTheme: boolean;
  locale?: string;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();
  const { i18n } = useTranslation();

  return (
    <html lang={locale ?? "en"} dir={i18n.dir()} className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Links />
      </head>
      <body>
        <ResponsiveNavBar />
        {/* children will be the root Component, ErrorBoundary, or HydrateFallback */}
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale); // Change i18next language if locale changes

  // Remix’s Outlet renders the matched route’s component, which will be wrapped by Layout.
  return <Outlet />;
}
