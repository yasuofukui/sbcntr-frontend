import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  Link
} from "react-router";

import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { UserProvider } from "~/contexts/userProvider";
import { NotificationProvider } from "~/contexts/notificationProvider";
import { Toaster } from "~/components/ui/toaster";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { PawPrint, RefreshCw, Home as HomeIcon } from "lucide-react";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overscroll-none">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <div className="min-h-screen flex flex-col overscroll-none">
          <Header />
          <main className="flex-1 overscroll-none">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster />
      </UserProvider>
    </NotificationProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 container mx-auto px-6">
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50 rounded-2xl border border-orange-100">
        <div className="text-center max-w-2xl p-8">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-100 text-orange-800 border-orange-200"
          >
            <PawPrint className="w-4 h-4" />
            {message}
          </Badge>

          <h1 className="mt-4 text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            {details}
          </h1>

          {stack && (
            <pre className="mt-6 text-left w-full p-4 overflow-x-auto bg-white/60 backdrop-blur rounded-xl border border-orange-100 text-xs text-gray-700">
              <code>{stack}</code>
            </pre>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              再読み込み
            </Button>
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-300"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                ホームへ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
