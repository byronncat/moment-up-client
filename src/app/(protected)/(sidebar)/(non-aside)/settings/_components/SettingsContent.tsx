import { useSettings } from "../_providers/Settings";

export default function SettingsContent() {
  const { currentTitle } = useSettings();

  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-bold">{currentTitle}</h1>
      <div className="text-sm text-muted-foreground mt-3">Coming soon...</div>
    </main>
  );
}
