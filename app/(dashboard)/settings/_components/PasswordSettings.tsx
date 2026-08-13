"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const inputClass =
  "h-[42px] w-full rounded-md border border-[#8A8A8A] bg-[#333333] px-3 pr-10 text-sm font-light text-[#CFCFCF] outline-none transition placeholder:text-[#9C9C9C] focus:border-[#C88719] focus:ring-2 focus:ring-[#C88719]/25 disabled:cursor-not-allowed disabled:opacity-70";

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

type ApiResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
};

type PasswordFieldName = "oldPassword" | "newPassword" | "confirmPassword";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

async function changePassword({
  payload,
  accessToken,
}: {
  payload: ChangePasswordPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse | null = await response.json().catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || "Failed to change password.");
  }

  return data;
}

export function PasswordSettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibleFields, setVisibleFields] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const isConfirmInvalid =
    formData.confirmPassword.length > 0 &&
    formData.newPassword !== formData.confirmPassword;
  const mutation = useMutation({
    mutationFn: () =>
      changePassword({
        payload: {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        accessToken: session?.accessToken,
      }),
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully.");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setVisibleFields({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password.",
      );
    },
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleField(field: PasswordFieldName) {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.accessToken) {
      toast.error("Please login to change your password.");
      return;
    }

    if (!formData.oldPassword || !formData.newPassword) {
      toast.error("Please enter your current and new password.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (mutation.isPending) return;

    mutation.mutate();
  }

  return (
    <main className="space-y-5">
      <section className="rounded-lg bg-[#333333] p-4 text-white sm:p-6">
        <h2 className="text-[22px] font-semibold leading-tight sm:text-[28px]">
          Change Password
        </h2>
        <p className="mt-1 text-sm font-light text-[#BDBDBD]">
          Update your account password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5"
        >
          <PasswordField
            label="Current Password"
            name="oldPassword"
            value={formData.oldPassword}
            visible={visibleFields.oldPassword}
            onChange={handleChange}
            onToggleVisibility={() => toggleField("oldPassword")}
            disabled={mutation.isPending}
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            visible={visibleFields.newPassword}
            onChange={handleChange}
            onToggleVisibility={() => toggleField("newPassword")}
            disabled={mutation.isPending}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            visible={visibleFields.confirmPassword}
            onChange={handleChange}
            onToggleVisibility={() => toggleField("confirmPassword")}
            disabled={mutation.isPending}
            invalid={isConfirmInvalid}
            className="sm:col-span-2"
          />

          {formData.confirmPassword ? (
            <div
              className={`text-sm sm:col-span-2 ${
                isConfirmInvalid ? "text-red-500" : "text-green-500"
              }`}
            >
              {isConfirmInvalid
                ? "Passwords do not match"
                : "Passwords match"}
            </div>
          ) : null}

          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#C88719] px-8 text-sm font-semibold text-white transition hover:bg-[#B47714] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function PasswordField({
  label,
  name,
  value,
  visible,
  onChange,
  onToggleVisibility,
  disabled,
  invalid,
  className,
}: {
  label: string;
  name: PasswordFieldName;
  value: string;
  visible: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility: () => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-normal text-white">{label}</span>
      <div className="relative">
        <input
          className={`${inputClass} ${invalid ? "border-red-500" : ""}`}
          type={visible ? "text" : "password"}
          name={name}
          placeholder="********"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BDBDBD] transition hover:text-[#C88719] disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
}
