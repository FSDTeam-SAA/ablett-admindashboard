"use client";

import type { ComponentProps } from "react";
import { CalendarDays, ChevronDown, Pencil } from "lucide-react";

import { SettingsHero } from "./SettingsHero";

export function ProfileSettings() {
  return (
    <main className="space-y-4">
      <SettingsHero />

      <section className="rounded-md bg-[#181818] p-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-6">
            Personal Information
          </h2>
          <button
            type="button"
            className="text-white transition-colors hover:text-[#c98313]"
            aria-label="Edit personal information"
          >
            <Pencil className="size-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First Name" id="first-name" defaultValue="Cody" />
          <Field label="Last Name" id="last-name" defaultValue="Fisher" />
          <Field
            label="Shop Name"
            id="shop-name"
            defaultValue="Opus X Perfection X"
            className="md:col-span-2"
          />
          <div className="space-y-2">
            <label htmlFor="date-of-birth" className="text-sm text-white">
              Date of Birth
            </label>
            <div className="relative">
              <input
                id="date-of-birth"
                type="text"
                placeholder="DD/MM/YYYY"
                className="h-10 w-full rounded border border-[#747474] bg-transparent px-3 pr-10 text-sm text-white outline-none transition-colors placeholder:text-[#d2d2d2] focus:border-[#c98313]"
              />
              <CalendarDays className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#d2d2d2]" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white">Gender</p>
            <div className="flex h-10 items-center gap-5 text-sm text-white">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="gender" className="accent-[#c98313]" />
                Male
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="gender" className="accent-[#c98313]" />
                Female
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md bg-[#181818] p-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-6">
            Contact Information
          </h2>
          <button
            type="button"
            className="text-white transition-colors hover:text-[#c98313]"
            aria-label="Edit contact information"
          >
            <Pencil className="size-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email"
            id="email"
            placeholder="Enter your email address"
          />
          <Field
            label="Phone Number"
            id="phone-number"
            placeholder="Enter your phone number"
          />
          <SelectField label="Country" id="country" />
          <SelectField label="State/Region" id="state-region" />
          <SelectField label="Nationality" id="nationality" />
          <Field label="Postcode" id="postcode" placeholder="e.g. 5585" />
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm text-white">
              Address
            </label>
            <textarea
              id="address"
              placeholder="Enter your full address"
              className="min-h-[76px] w-full resize-none rounded border border-[#747474] bg-transparent px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-[#d2d2d2] focus:border-[#c98313]"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  id,
  className,
  ...props
}: {
  label: string;
  id: string;
  className?: string;
} & ComponentProps<"input">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm text-white">
        {label}
      </label>
      <input
        id={id}
        className="h-10 w-full rounded border border-[#747474] bg-transparent px-3 text-sm text-white outline-none transition-colors placeholder:text-[#d2d2d2] focus:border-[#c98313]"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, id }: { label: string; id: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-white">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          defaultValue=""
          className="h-10 w-full appearance-none rounded border border-[#747474] bg-transparent px-3 pr-10 text-sm text-[#d2d2d2] outline-none transition-colors focus:border-[#c98313]"
        >
          <option value="" disabled>
            Choose any one
          </option>
          <option value="usa">United States</option>
          <option value="canada">Canada</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#d2d2d2]" />
      </div>
    </div>
  );
}
