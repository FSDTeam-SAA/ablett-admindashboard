"use client";

import { useState } from "react";

import { PasswordSettings } from "./PasswordSettings";
import { ProfileSettings } from "./ProfileSettings";
import { SettingsOptions } from "./SettingsOptions";

type SettingsView = "options" | "profile" | "password";

export function SettingsPage() {
  const [view, setView] = useState<SettingsView>("options");

  if (view === "profile") {
    return <ProfileSettings />;
  }

  if (view === "password") {
    return <PasswordSettings />;
  }

  return <SettingsOptions onSelect={setView} />;
}
