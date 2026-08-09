"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChevronDown, Upload, X } from "lucide-react";

type ProjectFormProps = {
  onDiscard: () => void;
  onSave: () => void;
};

export function ProjectForm({ onDiscard, onSave }: ProjectFormProps) {
  const previewUrlsRef = useRef<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setImagePreviews((currentPreviews) => {
      const remainingSlots = Math.max(0, 5 - currentPreviews.length);
      const newPreviews = selectedFiles
        .slice(0, remainingSlots)
        .map((file) => URL.createObjectURL(file));

      previewUrlsRef.current = [...previewUrlsRef.current, ...newPreviews];

      return [...currentPreviews, ...newPreviews];
    });

    event.target.value = "";
  };

  const handleRemoveImage = (preview: string) => {
    URL.revokeObjectURL(preview);
    previewUrlsRef.current = previewUrlsRef.current.filter(
      (currentPreview) => currentPreview !== preview,
    );
    setImagePreviews((currentPreviews) =>
      currentPreviews.filter((currentPreview) => currentPreview !== preview),
    );
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      className="rounded-lg bg-[#181818] p-5 text-white"
    >
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="project-name"
              className="text-base font-medium text-white"
            >
              Projects Name
            </label>
            <input
              id="project-name"
              type="text"
              placeholder="Enter Project  name"
              className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-location"
              className="text-base font-medium text-white"
            >
              Location
            </label>
            <input
              id="project-location"
              type="text"
              placeholder="Enter the project location"
              className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-type"
              className="text-base font-medium text-white"
            >
              Project Type
            </label>
            <input
              id="project-type"
              type="text"
              placeholder="Enter the project type"
              className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-completion"
              className="text-base font-medium text-white"
            >
              Completion
            </label>
            <input
              id="project-completion"
              type="text"
              placeholder="Enter the completion date"
              className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-duration"
              className="text-base font-medium text-white"
            >
              Duration
            </label>
            <input
              id="project-duration"
              type="text"
              placeholder="Enter the duration."
              className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="project-description"
              className="text-base font-medium text-white"
            >
              Description
            </label>
            <textarea
              id="project-description"
              placeholder="Describe your product in detail..."
              className="min-h-[190px] w-full resize-none rounded border border-[#747474] bg-transparent px-4 py-4 text-sm leading-5 text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label
              htmlFor="project-category"
              className="text-base font-medium text-white"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="project-category"
                defaultValue=""
                className="h-10 w-full appearance-none rounded border border-[#747474] bg-transparent px-4 pr-10 text-sm text-[#8a8a8a] outline-none transition-colors focus:border-[#c98313]"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="commercial">Commercial Construction</option>
                <option value="residential">Residential Construction</option>
                <option value="site">Site Preparation & Foundations</option>
                <option value="welding">Welding & Fabrication</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8a8a8a]" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium text-white">Photo</p>
            <label
              htmlFor="project-images"
              className="flex h-[105px] cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#6c6c6c] text-center transition-colors hover:border-[#c98313]"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#5b3800] text-[#c98313]">
                <Upload className="size-5" />
              </span>
              <span className="text-sm text-[#b0b0b0]">
                Drag and drop image here, or click add image
              </span>
            </label>
            <input
              id="project-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, index) => {
              const preview = imagePreviews[index];

              return (
                <label
                  key={index}
                  htmlFor="project-images"
                  className="relative flex h-20 cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed border-[#6c6c6c] bg-cover bg-center text-[10px] text-[#777777] transition-colors hover:border-[#c98313]"
                  style={
                    preview
                      ? { backgroundImage: `url(${preview})` }
                      : undefined
                  }
                >
                  {preview ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          handleRemoveImage(preview);
                        }}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-[#ff4d62]"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="size-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                        Image {index + 1}
                      </span>
                    </>
                  ) : (
                    `Image ${index + 1}`
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-auto grid gap-2 pt-28 sm:grid-cols-2">
            <button
              type="button"
              onClick={onDiscard}
              className="h-10 rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
            >
              Discard
            </button>
            <button
              type="submit"
              className="h-10 rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
