export type PhaseData = {
  title: string;
  component: React.ReactNode;
  buttons?: Array<{ id: string; icon: React.ReactNode; onClick: () => void }>;
};

export type PhaseState = "media" | "text" | "preview";

export type UploadMediaFile = File & {
  id: string;
  previewUrl: string;
  aspectRatio: "1:1" | "4:5" | "1.91:1";
};
