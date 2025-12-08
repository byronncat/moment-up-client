"use client";

import SettingsProvider from "./_providers/Settings";
import { Navigation, SettingsContent } from "./_components";

export default function SettingsPage() {
  return (
    <div className="flex size-full">
      <SettingsProvider>
        <Navigation />
        <SettingsContent />
      </SettingsProvider>
    </div>
  );
}
