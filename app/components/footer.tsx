import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

function ListHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="font-semibold mb-2">{children}</h3>;
}

function ExternalLinkComponent({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center hover:underline"
    >
      {children}
      <ExternalLink className="ml-1 h-3 w-3" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 sticky top-[100vh]">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <ListHeader>Titles</ListHeader>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li>
                <ExternalLinkComponent href="https://umarai-books.booth.pm/items/1866872">
                  First Story
                </ExternalLinkComponent>
              </li>
              <li>
                <ExternalLinkComponent href="https://umarai-books.booth.pm/items/3045918">
                  IaC Story
                </ExternalLinkComponent>
              </li>
              <li>
                <ExternalLinkComponent href="https://umarai-books.booth.pm/items/4130172">
                  o11y Story
                </ExternalLinkComponent>
              </li>
              <li>
                <ExternalLinkComponent href="https://umarai-books.booth.pm/items/5757590">
                  The Cloud Run
                </ExternalLinkComponent>
              </li>
            </ul>
          </div>

          <div>
            <ListHeader>Support</ListHeader>
            <ul className="space-y-2">
              <li>
                <ExternalLinkComponent href="https://umarai-books.booth.pm/">
                  BOOTH
                </ExternalLinkComponent>
              </li>
            </ul>
          </div>

          <div>
            <ListHeader>Legal</ListHeader>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 uma-arai. All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
