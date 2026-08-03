"use client";

import { KeyRound, UserRound } from "lucide-react";

type SettingsOptionsProps = {
  onSelect: (view: "profile" | "password") => void;
};

export function SettingsOptions({ onSelect }: SettingsOptionsProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onSelect("profile")}
        className="flex h-12 w-full items-center gap-3 rounded-md bg-[#181818] px-4 text-left text-sm font-semibold text-white transition-colors hover:bg-[#232323]"
      >
        <UserRound className="size-4" />
        Profile
      </button>
      <button
        type="button"
        onClick={() => onSelect("password")}
        className="flex h-12 w-full items-center gap-3 rounded-md bg-[#181818] px-4 text-left text-sm font-semibold text-white transition-colors hover:bg-[#232323]"
      >
        <KeyRound className="size-4" />
        Password
      </button>
    </div>
  );
}
