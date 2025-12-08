import { useCreateData } from "../../../_providers";
import UploadZone from "./UploadZone";
import AudioSettings from "./AudioSettings";

type SoundSelectorProps = Readonly<{
  className?: string;
}>;

export default function SoundSelector({ className }: SoundSelectorProps) {
  const { uploadedAudio } = useCreateData();
  if (!uploadedAudio) return <UploadZone className={className} />;
  return <AudioSettings className={className} />;
}
