type PhaseData = {
  title: string;
  component: React.ReactNode;
  buttons?: { id: string; icon: React.ReactNode; onClick: () => void }[];
};

type PhaseState = "media" | "text" | "preview";

type UploadMediaFile = File & {
  id: string;
  previewUrl: string;
  aspectRatio: "1:1" | "9:16" | "4:5";
};

export type { PhaseData, PhaseState, UploadMediaFile };
