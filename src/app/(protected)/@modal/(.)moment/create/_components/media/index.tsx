import { useCallback, useRef } from "react";
import { useMomentData, MAX_FILES_LIMIT } from "../../_provider/MomentData";
import { toast } from "sonner";
import UploadView from "./UploadView";
import MediaView from "./MediaControl";

export default function UploadMediaWindow() {
  const { files, addFiles } = useMomentData();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/")
        );

        const invalidFiles = selectedFiles.length - validFiles.length;
        const result = addFiles(validFiles);

        if (result.rejected > 0)
          toast.error(
            `${result.rejected} file${result.rejected > 1 ? "s" : ""} rejected - maximum limit is ${MAX_FILES_LIMIT} files`
          );

        if (invalidFiles > 0)
          toast.warning(
            `${invalidFiles} file${invalidFiles > 1 ? "s" : ""} skipped - only images and videos are supported`
          );

        e.target.value = "";
      }
    },
    [addFiles]
  );

  const handleBrowse = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileInput}
        className="hidden"
        ref={inputRef}
      />
      {files.length === 0 ? (
        <UploadView onBrowse={handleBrowse} />
      ) : (
        <MediaView onBrowse={handleBrowse} />
      )}
    </>
  );
}
