"use client";

import { useRouter } from "next/navigation";
import { XMark } from "@/components/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/libraries/utils";
import { useRef } from "react";

export default function CreateFeedModal() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close the modal and go back to the previous page
  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open onOpenChange={() => handleClose()}>
      <DialogContent
        className="sm:max-w-[500px] p-0 overflow-hidden border-0 bg-card rounded-xl"
        ref={dialogRef}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create Feed</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-1.5 hover:bg-accent/20 transition-colors"
            >
              <XMark className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="feed-name"
                  className="block text-sm font-medium mb-1"
                >
                  Feed Name
                </label>
                <input
                  type="text"
                  id="feed-name"
                  placeholder="Enter feed name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="feed-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="feed-description"
                  rows={4}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-full text-sm font-medium"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                Create
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
