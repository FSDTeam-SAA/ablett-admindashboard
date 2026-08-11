"use client";

import {
  ProjectForm,
  type ProjectField,
  type ProjectFormValues,
  type ProjectImageField,
} from "./ProjectForm";

export type EditableProject = {
  _id: string;
  title: string | null;
  description: string | null;
  coverImage: string | null;
  scope: string | null;
  challenge: string | null;
  a7Solution: string | null;
  result: string | null;
  equipmentsUsed: string | null;
  timeline: string | null;
  before: string | null;
  during: string | null;
  completed: string | null;
  projectExperience: string | null;
};

type EditProjectFormProps = {
  project: EditableProject;
  onDiscard: () => void;
  onSave: (payload: ProjectFormValues) => void;
  isSaving?: boolean;
};

const textFieldKeys: ProjectField[] = [
  "title",
  "description",
  "scope",
  "challenge",
  "a7Solution",
  "result",
  "equipmentsUsed",
  "timeline",
  "projectExperience",
];

const imageFieldKeys: ProjectImageField[] = [
  "coverImage",
  "before",
  "during",
  "completed",
];

export function EditProjectForm({
  project,
  onDiscard,
  onSave,
  isSaving = false,
}: EditProjectFormProps) {
  const initialValues = Object.fromEntries(
    textFieldKeys.map((key) => [key, project[key] ?? ""]),
  ) as Partial<Record<ProjectField, string>>;
  const initialImagePreviews = Object.fromEntries(
    imageFieldKeys.map((key) => [key, project[key]]),
  ) as Partial<Record<ProjectImageField, string | null>>;

  return (
    <ProjectForm
      initialValues={initialValues}
      initialImagePreviews={initialImagePreviews}
      onDiscard={onDiscard}
      onSave={onSave}
      isSaving={isSaving}
      submitLabel="Update"
      savingLabel="Updating..."
      imageHelpText="Current images are shown below. Upload a new image only when you want to replace one."
    />
  );
}
