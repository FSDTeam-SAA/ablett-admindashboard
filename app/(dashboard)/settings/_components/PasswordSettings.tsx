"use client";

import { Check, Eye, X } from "lucide-react";

import { SettingsHero } from "./SettingsHero";

const passwordRules = [
  { label: "Minimum 8-12 characters (recommend 12+ for stronger security).", met: true },
  { label: "At least one uppercase letter must.", met: true },
  { label: "At least one lowercase letter must.", met: true },
  { label: "At least one number must (0-9).", met: true },
  { label: "At least special character (! @ # $ % ^ & * etc.).", met: false },
  { label: "No spaces allowed.", met: false },
];

export function PasswordSettings() {
  return (
    <main className="space-y-4">
      <SettingsHero />

      <section className="rounded-md bg-[#181818] p-4 text-white">
        <div className="grid gap-4 md:grid-cols-2">
          <PasswordField label="Current Password" id="current-password" />
          <PasswordField label="New Password" id="new-password" />
          <PasswordField
            label="Confirm New Password"
            id="confirm-password"
            className="md:col-span-2"
            invalid
          />
        </div>

        <div className="mt-4 space-y-2">
          {passwordRules.map((rule) => (
            <div
              key={rule.label}
              className="flex items-center gap-2 text-xs text-[#d2d2d2]"
            >
              {rule.met ? (
                <Check className="size-4 text-[#c98313]" />
              ) : (
                <X className="size-4 text-[#7f7f7f]" />
              )}
              <span className={rule.met ? "text-[#d2d2d2]" : "text-[#8a8a8a]"}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            className="h-10 min-w-[135px] rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
          >
            Discard
          </button>
          <button
            type="button"
            className="h-10 min-w-[135px] rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
          >
            Save Changes
          </button>
        </div>
      </section>
    </main>
  );
}

function PasswordField({
  label,
  id,
  className,
  invalid,
}: {
  label: string;
  id: string;
  className?: string;
  invalid?: boolean;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm text-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="password"
          defaultValue="********"
          className={`h-10 w-full rounded border bg-transparent px-3 pr-10 text-sm text-white outline-none transition-colors focus:border-[#c98313] ${
            invalid ? "border-[#b42318]" : "border-[#747474]"
          }`}
        />
        <Eye className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white" />
      </div>
    </div>
  );
}
