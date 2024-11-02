// app/routes/action/set-locale.tsx

import { json } from "@remix-run/cloudflare";
import { localeCookie } from "~/i18n/i18n.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const newLocale = formData.get("locale");

  // Set the new locale in the cookie
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await localeCookie.serialize(newLocale),
      },
    }
  );
}
