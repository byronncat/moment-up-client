import Link from "next/link";

// TODO: Add pages
const FooterLinks = [
  { text: "About", href: "#" },
  { text: "Help", href: "#" },
  { text: "Privacy", href: "#" },
  { text: "Terms", href: "#" },
  { text: "Locations", href: "#" },
];

export default function Footer() {
  return (
    <footer className="space-y-4 w-full">
      <nav className="flex flex-wrap gap-x-1 gap-y-2">
        {FooterLinks.map((link, index) => (
          <span key={link.text} className="flex items-center">
            <Link
              href={link.href}
              className="text-xs text-muted-foreground hover:underline"
            >
              {link.text}
            </Link>
            {index < FooterLinks.length - 1 && (
              <span className="text-xs text-muted-foreground mx-1">•</span>
            )}
          </span>
        ))}
      </nav>
      <p className="text-xs text-muted-foreground">© 2025 Byron</p>
    </footer>
  );
}
