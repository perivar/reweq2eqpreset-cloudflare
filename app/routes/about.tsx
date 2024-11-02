// app/routes/about.tsx

import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, MetaFunction, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

export const meta: MetaFunction = () => [
  // your meta here
  { title: "About Us" },
  { name: "description", content: "Welcome to our About Us Page!" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const agent = request.headers.get("User-Agent");
  return json({ agent });
};

export default function RouteComponent() {
  const data = useLoaderData<typeof loader>();
  const { toast } = useToast();

  return (
    <div className="min-h-full">
      <div className="py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="">
            <h1 className="text-4xl font-bold">About Us</h1>
            <h2 className="text-3xl font-semibold">Your user agent</h2>
            <p className="text-lg">{data.agent}</p>
          </div>
        </header>
        <main>
          <div className="mx-auto mt-4 max-w-7xl sm:px-6 lg:px-8">
            <Button
              onClick={() => {
                toast({
                  title: "About us",
                  description: "This is a test",
                });
              }}>
              Show Toast
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
