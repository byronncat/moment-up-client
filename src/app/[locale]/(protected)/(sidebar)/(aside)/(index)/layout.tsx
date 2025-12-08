export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="size-full">{children}</main>;
}
