"use client";

import { Pencil } from "lucide-react";

type SettingsHeroProps = {
  showEdit?: boolean;
};

export function SettingsHero({ showEdit = true }: SettingsHeroProps) {
  return (
    <section className="relative h-[124px] overflow-hidden rounded-md bg-[#181818]">
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(246,226,205,0.92)_0%,rgba(218,177,128,0.72)_20%,rgba(95,71,55,0.54)_42%,rgba(14,14,14,0.68)_72%),radial-gradient(circle_at_62%_24%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(90deg,#4f392d,#1b1b1b)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1b120c] to-transparent" />
      <div className="absolute left-6 top-1/2 flex -translate-y-1/2 items-end gap-3">
        <div className="flex size-16 items-center justify-center rounded-md border-2 border-white bg-[linear-gradient(135deg,#d7a56e,#25352f)] text-xl font-semibold text-white shadow-lg">
          CM
        </div>
        <div className="pb-2">
          <p className="text-xl font-semibold leading-6 text-white">
            Cody Mathew
          </p>
          <p className="text-sm leading-5 text-white">codymathew22@info.com</p>
        </div>
      </div>

      {showEdit ? (
        <button
          type="button"
          className="absolute right-4 top-4 text-white transition-colors hover:text-[#c98313]"
          aria-label="Edit cover image"
        >
          <Pencil className="size-5" />
        </button>
      ) : null}
    </section>
  );
}
