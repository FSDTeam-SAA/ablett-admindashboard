"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { SettingsHero } from "./SettingsHero";

const profileQueryKey = "user-profile";
const fieldClass =
  "h-[42px] w-full rounded-md border border-[#8A8A8A] bg-[#333333] px-3 text-sm font-light text-[#CFCFCF] outline-none transition placeholder:text-[#9C9C9C] focus:border-[#C88719] focus:ring-2 focus:ring-[#C88719]/25 disabled:cursor-not-allowed disabled:opacity-70";

type UserProfile = {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  gender?: string;
  status?: string;
  tag?: string;
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  postcode?: string;
  profilePicture?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  data?: T;
};

type ProfileFormData = {
  fullName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
};

const emptyFormData: ProfileFormData = {
  fullName: "",
  email: "",
  gender: "male",
  phoneNumber: "",
  address: "",
  city: "",
  country: "",
  postcode: "",
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

async function parseResponse<T>(response: Response, fallback: string) {
  const data: ApiResponse<T> | null = await response.json().catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || fallback);
  }

  if (!data?.data) {
    throw new Error(fallback);
  }

  return data;
}

async function fetchProfile(accessToken?: string) {
  const response = await fetch(`${getApiBaseUrl()}/user/profile`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await parseResponse<UserProfile>(
    response,
    "Failed to fetch profile.",
  );

  return data.data;
}

async function updateProfile({
  payload,
  profilePicture,
  accessToken,
}: {
  payload: ProfileFormData;
  profilePicture: File | null;
  accessToken?: string;
}) {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("firstName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("gender", payload.gender);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("address", payload.address);
  formData.append("city", payload.city);
  formData.append("country", payload.country);
  formData.append("postcode", payload.postcode);

  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  const response = await fetch(`${getApiBaseUrl()}/user/profile`, {
    method: "PUT",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });
  const data = await parseResponse<UserProfile>(
    response,
    "Failed to update profile.",
  );

  return {
    ...data,
    data: data.data as UserProfile,
  };
}

function createFormData(profile?: UserProfile): ProfileFormData {
  return {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    gender: profile?.gender || "male",
    phoneNumber: profile?.phoneNumber ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    country: profile?.country ?? "",
    postcode: profile?.postcode ?? "",
  };
}

function getInitials(fullName?: string, email?: string) {
  const value = fullName?.trim() || email || "Admin";
  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
}

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus, update } = useSession();
  const accessToken = session?.accessToken;
  const [formData, setFormData] = useState<ProfileFormData>(emptyFormData);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const syncedProfileImageRef = useRef<string | null>(null);
  const isSessionLoading = sessionStatus === "loading";
  const profileQuery = useQuery({
    queryKey: [profileQueryKey, accessToken],
    queryFn: () => fetchProfile(accessToken),
    enabled: !isSessionLoading,
  });
  const profile = profileQuery.data;
  const profileImage = previewImage || profile?.profilePicture || "";
  const mutation = useMutation({
    mutationFn: () =>
      updateProfile({
        payload: formData,
        profilePicture,
        accessToken,
      }),
    onSuccess: async (data) => {
      const updatedProfile = data.data;
      const savedImage = updatedProfile.profilePicture || previewImage || "";

      queryClient.setQueryData([profileQueryKey, accessToken], updatedProfile);
      setFormData(createFormData(updatedProfile));
      setProfilePicture(null);

      await update({
        user: {
          fullName: updatedProfile.fullName,
          name: updatedProfile.fullName,
          email: updatedProfile.email,
          profileImage: savedImage,
          image: savedImage,
        },
      });

      toast.success(data.message || "Profile updated successfully.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile.",
      );
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData(createFormData(profile));
    }
  }, [profile]);

  useEffect(() => {
    const profilePictureUrl = profile?.profilePicture;
    const sessionImage = session?.user?.profileImage || session?.user?.image;

    if (
      !profilePictureUrl ||
      previewImage ||
      sessionImage === profilePictureUrl ||
      syncedProfileImageRef.current === profilePictureUrl
    ) {
      return;
    }

    syncedProfileImageRef.current = profilePictureUrl;
    update({
      user: {
        profileImage: profilePictureUrl,
        image: profilePictureUrl,
      },
    });
  }, [
    previewImage,
    profile?.profilePicture,
    session?.user?.image,
    session?.user?.profileImage,
    update,
  ]);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleGenderChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((current) => ({
      ...current,
      gender: event.target.value,
    }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfilePicture(file);
    setPreviewImage((currentPreview) => {
      if (currentPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Please login to update your profile.");
      return;
    }

    if (mutation.isPending) return;

    mutation.mutate();
  }

  if (isSessionLoading || profileQuery.isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <main className="space-y-5">
        <SettingsHero />
        <section className="rounded-lg bg-[#333333] p-6 text-center text-sm text-[#d7d7d7]">
          Failed to load profile.
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-5">
  

      <section className="rounded-lg bg-[#333333] p-4 text-white sm:p-6">
        <div>
          <h2 className="text-[22px] font-semibold leading-tight sm:text-[28px]">
            Personal Information
          </h2>
          <p className="mt-1 text-sm font-light text-[#BDBDBD]">
            Manage your personal information and profile details.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#C88719] bg-[#202020]">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={formData.fullName || "Profile picture"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-semibold text-[#C88719]">
                {getInitials(formData.fullName, formData.email)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">
              {formData.fullName || "Admin"}
            </p>
            <p className="truncate text-sm text-[#BDBDBD]">
              {formData.email || "No email found"}
            </p>
            <label className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[#C88719] px-4 text-sm font-medium text-[#C88719] transition hover:bg-[#C88719] hover:text-white">
              <Camera className="h-4 w-4" />
              Edit Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
                disabled={mutation.isPending}
              />
            </label>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5"
        >
          <div className="flex flex-wrap items-center gap-5 text-sm text-white sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2">
              <span>Male</span>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender.toLowerCase() === "male"}
                onChange={handleGenderChange}
                className="h-4 w-4 accent-[#C88719]"
                disabled={mutation.isPending}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <span>Female</span>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender.toLowerCase() === "female"}
                onChange={handleGenderChange}
                className="h-4 w-4 accent-[#C88719]"
                disabled={mutation.isPending}
              />
            </label>
          </div>

          <ProfileField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={mutation.isPending}
          />
          <ProfileField
            label="Postal Code"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            disabled={mutation.isPending}
          />

          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#C88719] px-7 text-sm font-semibold text-white transition hover:bg-[#B47714] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled,
}: {
  label: string;
  name: keyof ProfileFormData;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-normal text-white">{label}</span>
      <input
        name={name}
        className={fieldClass}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}

const skeletonBox = "animate-pulse rounded-md bg-white/10";

function SkeletonField({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className={`${skeletonBox} mb-2 h-4 w-28`} />
      <div className={`${skeletonBox} h-[42px] w-full`} />
    </div>
  );
}

function ProfileSettingsSkeleton() {
  return (
    <main className="space-y-5">
      <SettingsHero />
      <section className="rounded-lg bg-[#333333] p-4 text-white sm:p-6">
        <div className={`${skeletonBox} h-8 w-60`} />
        <div className={`${skeletonBox} mt-3 h-4 w-full max-w-sm`} />

        <div className="mt-6 flex items-center gap-4">
          <div className={`${skeletonBox} h-24 w-24 rounded-full`} />
          <div className="space-y-3">
            <div className={`${skeletonBox} h-5 w-36`} />
            <div className={`${skeletonBox} h-4 w-48`} />
            <div className={`${skeletonBox} h-9 w-28 rounded-full`} />
          </div>
        </div>

        <div className="mt-6 flex gap-5">
          <div className={`${skeletonBox} h-5 w-20`} />
          <div className={`${skeletonBox} h-5 w-24`} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
          <SkeletonField />
        </div>
      </section>
    </main>
  );
}
