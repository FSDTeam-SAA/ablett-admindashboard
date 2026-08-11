"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

export type ProjectField =
  | "title"
  | "description"
  | "scope"
  | "challenge"
  | "a7Solution"
  | "result"
  | "equipmentsUsed"
  | "timeline"
  | "projectExperience";

export type ProjectImageField = "coverImage" | "before" | "during" | "completed";

export type ProjectFormValues = Record<ProjectField, string> &
  Partial<Record<ProjectImageField, File>>;

type ProjectFormProps = {
  onDiscard: () => void;
  onSave: (payload: ProjectFormValues) => void;
  isSaving?: boolean;
  initialValues?: Partial<Record<ProjectField, string | null>>;
  initialImagePreviews?: Partial<Record<ProjectImageField, string | null>>;
  submitLabel?: string;
  savingLabel?: string;
  imageHelpText?: string;
};

const initialValues: Record<ProjectField, string> = {
  title: "",
  description: "",
  scope: "",
  challenge: "",
  a7Solution: "",
  result: "",
  equipmentsUsed: "",
  timeline: "",
  projectExperience: "",
};

const textFields: Array<{
  id: ProjectField;
  label: string;
  placeholder: string;
  multiline?: boolean;
}> = [
  {
    id: "title",
    label: "Project Title",
    placeholder: "Enter project title",
  },
  {
    id: "scope",
    label: "Scope",
    placeholder: "Define the project scope",
  },
  {
    id: "challenge",
    label: "Challenge",
    placeholder: "Describe the main challenge",
    multiline: true,
  },
  {
    id: "a7Solution",
    label: "A7 Solution",
    placeholder: "Explain the solution A7 delivered",
    multiline: true,
  },
  {
    id: "result",
    label: "Result",
    placeholder: "Summarize the project result",
    multiline: true,
  },
  {
    id: "equipmentsUsed",
    label: "Equipments Used",
    placeholder: "List equipment used on the project",
  },
  {
    id: "timeline",
    label: "Timeline",
    placeholder: "Example: 12 weeks",
  },
  {
    id: "projectExperience",
    label: "Project Experience",
    placeholder: "Share the client or team experience",
    multiline: true,
  },
];

const imageFields: Array<{
  id: ProjectImageField;
  label: string;
}> = [
  { id: "coverImage", label: "Cover Image" },
  { id: "before", label: "Before" },
  { id: "during", label: "During" },
  { id: "completed", label: "Completed" },
];

export function ProjectForm({
  onDiscard,
  onSave,
  isSaving = false,
  initialValues: initialFormValues,
  initialImagePreviews,
  submitLabel = "Save",
  savingLabel = "Saving...",
  imageHelpText = "Upload one image for each stage. Files are posted with the API field names.",
}: ProjectFormProps) {
  const previewUrlsRef = useRef<string[]>([]);
  const [values, setValues] = useState<Record<ProjectField, string>>(() => ({
    ...initialValues,
    ...Object.fromEntries(
      Object.entries(initialFormValues ?? {}).map(([key, value]) => [
        key,
        value ?? "",
      ]),
    ),
  }));
  const [images, setImages] = useState<Partial<Record<ProjectImageField, File>>>(
    {},
  );
  const [imagePreviews, setImagePreviews] = useState<
    Partial<Record<ProjectImageField, string>>
  >(() => ({
    ...Object.fromEntries(
      Object.entries(initialImagePreviews ?? {}).filter(([, value]) =>
        Boolean(value),
      ),
    ),
  }));

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const updateValue = (field: ProjectField, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  };

  const handleImageChange = (
    field: ProjectImageField,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setImagePreviews((currentPreviews) => {
      const currentPreview = currentPreviews[field];

      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      const nextPreview = URL.createObjectURL(selectedFile);
      previewUrlsRef.current = [
        ...previewUrlsRef.current.filter((preview) => preview !== currentPreview),
        nextPreview,
      ];

      return { ...currentPreviews, [field]: nextPreview };
    });
    setImages((currentImages) => ({ ...currentImages, [field]: selectedFile }));
    event.target.value = "";
  };

  const handleRemoveImage = (field: ProjectImageField) => {
    const preview = imagePreviews[field];

    if (preview) {
      URL.revokeObjectURL(preview);
      previewUrlsRef.current = previewUrlsRef.current.filter(
        (currentPreview) => currentPreview !== preview,
      );
    }

    setImagePreviews((currentPreviews) => {
      const nextPreviews = { ...currentPreviews };
      delete nextPreviews[field];
      return nextPreviews;
    });
    setImages((currentImages) => {
      const nextImages = { ...currentImages };
      delete nextImages[field];
      return nextImages;
    });
  };

  const handleSubmit = () => {
    onSave({ ...values, ...images });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      className="rounded-lg bg-[#181818] p-5 text-white"
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {textFields.map((field) => (
            <div
              key={field.id}
              className={field.multiline ? "space-y-2 sm:col-span-2" : "space-y-2"}
            >
              <label
                htmlFor={`project-${field.id}`}
                className="text-base font-medium text-white"
              >
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  id={`project-${field.id}`}
                  value={values[field.id]}
                  onChange={(event) => updateValue(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-[112px] w-full resize-none rounded border border-[#747474] bg-transparent px-4 py-3 text-sm leading-5 text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
                />
              ) : (
                <input
                  id={`project-${field.id}`}
                  type="text"
                  value={values[field.id]}
                  onChange={(event) => updateValue(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  className="h-10 w-full rounded border border-[#747474] bg-transparent px-4 text-sm text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
                />
              )}
            </div>
          ))}

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="project-description"
              className="text-base font-medium text-white"
            >
              Description
            </label>
            <textarea
              id="project-description"
              value={values.description}
              onChange={(event) => updateValue("description", event.target.value)}
              placeholder="Describe your project in detail"
              className="min-h-[150px] w-full resize-none rounded border border-[#747474] bg-transparent px-4 py-4 text-sm leading-5 text-white outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#c98313]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-[#222222] p-4">
            <p className="text-base font-medium text-white">Project Images</p>
            <p className="mt-1 text-xs leading-5 text-[#9a9a9a]">
              {imageHelpText}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {imageFields.map((field) => {
              const preview = imagePreviews[field.id];
              const inputId = `project-${field.id}`;

              return (
                <div key={field.id} className="space-y-2">
                  <p className="text-sm font-medium text-white">{field.label}</p>
                  <label
                    htmlFor={inputId}
                    className="relative flex min-h-[132px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded border border-dashed border-[#6c6c6c] bg-cover bg-center text-center transition-colors hover:border-[#c98313]"
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
                            handleRemoveImage(field.id);
                          }}
                          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-[#ff4d62]"
                          aria-label={`Remove ${field.label}`}
                        >
                          <X className="size-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
                          {images[field.id]?.name ?? field.label}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[#5b3800] text-[#c98313]">
                          {field.id === "coverImage" ? (
                            <ImagePlus className="size-5" />
                          ) : (
                            <Upload className="size-5" />
                          )}
                        </span>
                        <span className="px-4 text-sm text-[#b0b0b0]">
                          Click to upload {field.label.toLowerCase()}
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(field.id, event)}
                    className="hidden"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="h-10 rounded-full bg-[#5a5a5a] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#686868] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#c98313] px-8 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSaving ? savingLabel : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
