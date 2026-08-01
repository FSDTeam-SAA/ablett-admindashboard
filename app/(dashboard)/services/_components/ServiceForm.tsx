"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Plus, Upload, X } from "lucide-react";

type ServiceFormProps = {
  onDiscard: () => void;
  onSave: () => void;
};

export function ServiceForm({ onDiscard, onSave }: ServiceFormProps) {
  const previewUrlsRef = useRef<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureValue, setFeatureValue] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleAddFeature = () => {
    const trimmedFeature = featureValue.trim();

    if (!trimmedFeature) {
      return;
    }

    setFeatures((currentFeatures) => {
      if (currentFeatures.includes(trimmedFeature)) {
        return currentFeatures;
      }

      return [...currentFeatures, trimmedFeature];
    });
    setFeatureValue("");
  };

  const handleFeatureKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddFeature();
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures((currentFeatures) =>
      currentFeatures.filter((currentFeature) => currentFeature !== feature),
    );
  };

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
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="service-title"
            className="text-base font-medium text-white"
          >
            Service Title*
          </label>
          <input
            id="service-title"
            type="text"
            defaultValue="Residential Construction"
            className="h-10 w-full rounded-md border border-transparent bg-[#232323] px-4 text-sm text-[#d9d9d9] outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-base font-medium text-white">
            Core Features*
          </label>
          <div className="flex min-h-14 items-center gap-2 rounded-md bg-[#232323] px-3 py-2">
            <input
              type="text"
              value={featureValue}
              onChange={(event) => setFeatureValue(event.target.value)}
              onKeyDown={handleFeatureKeyDown}
              placeholder="Write core feature"
              className="h-8 min-w-0 flex-1 rounded-full border border-transparent bg-[#303030] px-3 text-xs text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="inline-flex h-8 items-center gap-2 rounded-full bg-[#c98313] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>

          {features.length > 0 ? (
            <div className="flex flex-wrap gap-2 rounded-md bg-[#1f1f1f] p-3">
              {features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 rounded-full bg-[#3a3a3a] px-3 py-2 text-xs text-[#cfcfcf]"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="text-[#9f9f9f] transition-colors hover:text-white"
                    aria-label={`Remove ${feature}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="service-description"
            className="text-base font-medium text-white"
          >
            Description
          </label>
          <textarea
            id="service-description"
            defaultValue="At A7 Property Solutions, we believe every home should be as unique as the family living in it. Building a home is one of life's biggest investments, and we are committed to making that journey smooth, transparent, and rewarding. From the very first consultation, we take the time to understand your vision, lifestyle, budget, and long-term goals, ensuring every detail is thoughtfully planned to create a home that reflects your personality while delivering lasting comfort, functionality, and value. Our experienced residential construction team manages every phase of the project with precision and care. From site evaluations, land preparation, architectural coordination, permitting, and foundation work to structural framing, roofing, exterior finishing, and interior details, we keep the process organized and dependable from start to finish."
            className="min-h-[76px] w-full resize-none rounded-md border border-transparent bg-[#232323] px-4 py-3 text-xs leading-4 text-[#cfcfcf] outline-none transition-colors focus:border-[#c98313]"
          />
        </div>

        <div className="space-y-2">
          <p className="text-base font-medium text-white">Image Upload</p>
          <label
            htmlFor="service-images"
            className="flex h-[190px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#6c6c6c] bg-[#181818] text-center transition-colors hover:border-[#c98313]"
          >
            <span className="mb-4 flex size-8 items-center justify-center rounded-full bg-[#4a4a4a] text-[#d6d6d6]">
              <Upload className="size-4" />
            </span>
            <span className="text-xs text-[#8f8f8f]">
              Drag and drop image here, or click add image
            </span>
          </label>
          <input
            id="service-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => {
            const preview = imagePreviews[index];

            return (
              <label
                key={index}
                htmlFor="service-images"
                className="relative flex h-[168px] cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-[#6c6c6c] bg-cover bg-center text-xs text-[#777777] transition-colors hover:border-[#c98313]"
                style={
                  preview ? { backgroundImage: `url(${preview})` } : undefined
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
                      className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-[#ff4d62]"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="size-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
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
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onDiscard}
          className="h-10 min-w-[135px] rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
        >
          Discard
        </button>
        <button
          type="submit"
          className="h-10 min-w-[135px] rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
