import Link from "next/link";
import { cn } from "@/libraries/utils";

const FooterLinks = [
  { text: "About", href: "https://github.com/byronncat/moment-up-client" },
  { text: "Help", href: "https://github.com/byronncat/moment-up-client" },
  { text: "Privacy", href: "https://github.com/byronncat/moment-up-client" },
  { text: "Terms", href: "https://github.com/byronncat/moment-up-client" },
  { text: "Locations", href: "https://github.com/byronncat/moment-up-client" },
];

export default function Footer() {
  return (
    <div className="w-full px-2">
      <nav className={cn("flex flex-wrap gap-x-1 gap-y-2", "mb-1")}>
        {FooterLinks.map((link, index) => (
          <div key={link.text} className="flex items-center">
            <Link
              href={link.href}
              className={cn(
                "text-xs text-muted-foreground hover:underline",
                "focus-indicator rounded-sm"
              )}
            >
              {link.text}
            </Link>
            {index < FooterLinks.length - 1 && (
              <span className="text-xs text-muted-foreground mx-1">•</span>
            )}
          </div>
        ))}
      </nav>
      <span className="text-xs text-muted-foreground">© 2025 Byron</span>
    </div>
  );
}
