"use client";

import { mockFooterLinks } from "@/__mocks__";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="space-y-4 w-full">
      <nav className="flex flex-wrap gap-x-1 gap-y-2">
        {mockFooterLinks.map((link, index) => (
          <span key={link.text} className="flex items-center">
            <Link
              href={link.href}
              className="text-xs text-muted-foreground hover:underline"
            >
              {link.text}
            </Link>
            {index < mockFooterLinks.length - 1 && (
              <span className="text-xs text-muted-foreground mx-1">•</span>
            )}
          </span>
        ))}
      </nav>
      <p className="text-xs text-muted-foreground">© 2025 Byron</p>
    </footer>
  );
}
