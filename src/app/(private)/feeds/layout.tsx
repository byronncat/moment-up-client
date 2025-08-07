export default function FeedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1 overflow-auto">{children}</main>;
}
