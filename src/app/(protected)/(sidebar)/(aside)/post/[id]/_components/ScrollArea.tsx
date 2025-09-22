export default function ScrollArea({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="size-full overflow-hidden">{children}</div>;
}
