// app/routes/_index.tsx

import { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, Link } from "@remix-run/react";
import i18next from "~/i18n/i18n.server";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18next.getFixedT(request);
  return json({ title: t("title"), description: t("description") });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.description },
  ];
};

export default function Index() {
  const { t } = useTranslation();
  const { toast } = useToast();

  return (
    <section className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-1 justify-center overflow-x-hidden px-4 py-8 md:px-6">
        <div className="flex flex-col items-center space-y-4 p-4 text-center md:w-1/2">
          <h1 className="text-3xl font-bold tracking-tighter md:text-3xl">
            <span className="bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 bg-clip-text font-extrabold text-transparent">
              {t("welcome_to")}
            </span>{" "}
            {t("title")}
          </h1>

          <div className="font-sans">
            <h1 className="text-2xl font-bold tracking-tighter md:text-3xl">
              Welcome to Remix
            </h1>
            <ul className="mt-4 list-disc">
              <li>
                <Link
                  className="hover:underline"
                  target="_blank"
                  to="https://remix.run/start/quickstart"
                  rel="noreferrer">
                  5m Quick Start
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  target="_blank"
                  to="https://remix.run/start/tutorial"
                  rel="noreferrer">
                  30m Tutorial
                </Link>
              </li>
              <li>
                <Link
                  className="hover:underline"
                  target="_blank"
                  to="https://remix.run/docs"
                  rel="noreferrer">
                  Remix Docs
                </Link>
              </li>
            </ul>
          </div>

          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                  action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                  ),
                });
              }}>
              Show Error Toast
            </Button>
          </div>

          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Dummy Card Example</CardTitle>
              <CardDescription>Describe the function here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
