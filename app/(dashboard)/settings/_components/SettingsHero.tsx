"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type SettingsHeroProps = {
  showEdit?: boolean;
  name?: string;
  email?: string;
  profileImage?: string | null;
};

export function SettingsHero({
  showEdit = true,
  name,
  email: profileEmail,
  profileImage,
}: SettingsHeroProps) {
  const { data: session } = useSession();
  const displayName =
    name || session?.user?.fullName || session?.user?.name || "Cody Mathew";
  const email =
    profileEmail || session?.user?.email || "codymathew22@info.com";
  const imageSrc = profileImage || session?.user?.profileImage || session?.user?.image;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <section className="relative h-[146px] overflow-hidden rounded-[4px] bg-[#181818]">
      <Image
        src="/auth.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) calc(100vw - 348px), 100vw"
        className="object-cover object-[50%_44%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.28),rgba(12,12,12,0.1)_52%,rgba(12,12,12,0.42)),linear-gradient(0deg,rgba(0,0,0,0.56),rgba(0,0,0,0.04)_60%)]" />

      <div className="absolute bottom-5 left-4 flex items-end gap-3 sm:left-6">
        <div className="relative flex size-[74px] items-center justify-center overflow-hidden rounded-[6px] border-2 border-white bg-[#3e3e3e] text-xl font-semibold text-white shadow-lg">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials || "CM"
          )}
        </div>
        <div className="pb-1">
          <p className="text-[22px] font-semibold leading-7 text-white">
            {displayName}
          </p>
          <p className="text-[14px] leading-5 text-white">{email}</p>
        </div>
      </div>

      {showEdit ? (
        <button
          type="button"
          className="absolute right-5 top-5 text-white transition-colors hover:text-[#c98313]"
          aria-label="Edit cover image"
        >
          <Pencil className="size-5" strokeWidth={1.8} />
        </button>
      ) : null}
    </section>
  );
}
