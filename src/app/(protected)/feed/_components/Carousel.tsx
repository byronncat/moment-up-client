"use client";

import type { FeedInfo } from "api";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/libraries/utils";
import { ASPECT_RATIO } from "@/constants/clientConfig";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { TriangleAlert, Loader2, Volume2, VolumeX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Container from "./FeedContainer";
import useEmblaCarousel from "embla-carousel-react";

const CAROUSEL_OPTIONS = {
  TRANSITION: 0,
  AUTOPLAY_DELAY: 10000,
};

type ContentProps = ComponentProps<{
  data: FeedInfo | null;
  loading: boolean;
  onClose: () => void;
}>;

type EmblaCarouselOptions = {
  loop?: boolean;
  duration?: number;
  autoplayDelay?: number;
  [key: string]: unknown;
};

export default function Content({
  data,
  loading,
  onClose,
}: ContentProps): React.ReactElement {
  const params = useParams();
  const feedId = params.id as string;
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const currentAudioUrlRef = useRef<string | null>(null);

  // Find the index of the current feed ID in the data
  const initialIndex =
    data?.feeds?.findIndex((feed) => feed.id === feedId) ?? 0;

  const {
    emblaRef,
    emblaApi,
    currentIndex: currentFeedIndex,
    progress: progressValue,
    isActive: showProgress,
    scrollPrev,
    scrollNext,
    toggleAutoplay,
    scrollTo,
  } = useEmblaCarouselWithProgress(
    {
      loop: true,
      duration: CAROUSEL_OPTIONS.TRANSITION,
      autoplayDelay: CAROUSEL_OPTIONS.AUTOPLAY_DELAY,
      startIndex: initialIndex >= 0 ? initialIndex : 0,
    },
    [
      Autoplay({
        delay: CAROUSEL_OPTIONS.AUTOPLAY_DELAY,
        stopOnInteraction: false,
        playOnInit: true,
      }),
    ]
  );

  // Initialize carousel to the correct feed when data loads
  useEffect(() => {
    if (emblaApi && data?.feeds && !loading && feedId) {
      const targetIndex = data.feeds.findIndex((feed) => feed.id === feedId);
      if (targetIndex >= 0 && targetIndex !== emblaApi.selectedScrollSnap()) {
        scrollTo(targetIndex);
      }
    }
  }, [emblaApi, data, feedId, loading, scrollTo]);

  // Update URL when feed changes - client-side only, no router navigation
  useEffect(() => {
    if (data?.feeds && data.feeds.length > 0 && currentFeedIndex >= 0) {
      const currentFeed = data.feeds[currentFeedIndex];
      const newUrl = `/feed/${currentFeed.id}`;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    }
  }, [currentFeedIndex, data, feedId]);

  // Handle audio playback when feed changes
  useEffect(() => {
    if (!data?.feeds || currentFeedIndex < 0) return;

    // Reset all videos when navigating
    Object.values(videoRefs.current).forEach((videoEl) => {
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.pause();
      }
    });

    // Only play current video
    const currentVideo = videoRefs.current[currentFeedIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo
        .play()
        .catch((err) => console.error("Error playing video:", err));
    }

    // Audio playback handling
    if (!isSoundOn) return;

    const currentFeed = data.feeds[currentFeedIndex];
    const audioUrl = currentFeed.sound?.url || null;

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Play new audio if available
    if (audioUrl && isSoundOn) {
      currentAudioUrlRef.current = audioUrl;
      try {
        const audio = new Audio(audioUrl);

        // Only set the audio ref after it's loaded to prevent interrupted errors
        audio.addEventListener("canplaythrough", () => {
          audioRef.current = audio;
          // Use catch inside the promise returned by play()
          audio.play().catch((err) => {
            console.error("Error playing audio:", err);
            // Reset audio ref if play fails
            audioRef.current = null;
          });
        });

        // Handle load errors
        audio.addEventListener("error", () => {
          console.error("Error loading audio");
          audioRef.current = null;
        });

        // Preload audio
        audio.load();
      } catch (err) {
        console.error("Error creating audio:", err);
      }
    }

    // Cleanup function to stop audio when navigating away
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentFeedIndex, data, isSoundOn]);

  // Listen for autoplay timer completion to stop audio
  useEffect(() => {
    // When progress is 100, the autoplay timer is complete
    if (progressValue >= 99 && audioRef.current) {
      // Add a small delay to ensure smooth transition
      const stopTimer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }, 50);

      return () => clearTimeout(stopTimer);
    }
  }, [progressValue]);

  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => {
      const newState = !prev;

      if (newState && data?.feeds && currentFeedIndex >= 0) {
        // Turn sound on
        const currentFeed = data.feeds[currentFeedIndex];
        const audioUrl = currentFeed.sound?.url || null;

        if (audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }

          try {
            const audio = new Audio(audioUrl);

            // Only set the audio ref after it's loaded
            audio.addEventListener("canplaythrough", () => {
              audioRef.current = audio;
              // Use catch inside the promise returned by play()
              audio.play().catch((err) => {
                console.error("Error playing audio:", err);
                audioRef.current = null;
              });
            });

            // Handle load errors
            audio.addEventListener("error", () => {
              console.error("Error loading audio");
              audioRef.current = null;
            });

            // Preload audio
            audio.load();
          } catch (err) {
            console.error("Error creating audio:", err);
          }
        }
      } else {
        // Turn sound off
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }

      return newState;
    });
  }, [currentFeedIndex, data]);

  if (loading)
    return (
      <Container>
        <Skeleton className="size-full flex items-center justify-center">
          <Loader2 className="size-10 animate-spin text-muted-foreground" />
        </Skeleton>
      </Container>
    );
  if (!data)
    return (
      <Container>
        <div
          className={cn(
            "flex size-full items-center justify-center",
            "flex-col"
          )}
        >
          <TriangleAlert className="size-10 mb-3" />
          <p className="text-lg font-semibold">Something went wrong!</p>
          <p className="text-sm text-muted-foreground">
            Please try again later.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="mt-5"
          >
            Go back
          </Button>
        </div>
      </Container>
    );

  return (
    <Container>
      <div
        className={cn(
          "absolute top-0 left-0 z-10",
          "w-full px-2 pt-2",
          "flex gap-1"
        )}
      >
        {data.feeds.map((feed, index) => (
          <div key={index} className="flex-1">
            {index === currentFeedIndex ? (
              <Progress
                value={progressValue}
                className="h-1 rounded-full bg-primary/20"
              />
            ) : (
              <div
                className={cn(
                  "h-1 rounded-full",
                  index < currentFeedIndex ? "bg-primary" : "bg-primary/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full h-full" ref={emblaRef}>
        <div className="w-full h-full flex">
          {data.feeds.map((feed, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 flex-grow-0"
              style={{ flex: "0 0 100%" }}
            >
              <AspectRatio ratio={ASPECT_RATIO.VERTICAL}>
                {typeof feed.content === "string" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-800">
                    {feed.content}
                  </div>
                ) : feed.content.type === "image" ? (
                  <Image
                    src={feed.content.url}
                    alt={`Feed ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    quality={100}
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPDY2ODYyTEhMR0BGRlNCRkJHYGFjYWM4OTtBV0ZGUJJgdmBwoKD/2wBDARUXFx4aHh0eHCAdHyChOKE4oaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                ) : (
                  <video
                    className="size-full object-cover"
                    autoPlay
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    muted={!isSoundOn}
                  >
                    <source src={feed.content.url} type="video/mp4" />
                  </video>
                )}
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {data.feeds.length > 1 && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 size-10 rounded-full bg-background/80 flex items-center justify-center text-foreground"
            onClick={scrollPrev}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 size-10 rounded-full bg-background/80 flex items-center justify-center text-foreground"
            onClick={scrollNext}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Sound control button */}
      <button
        className="absolute bottom-12 left-4 z-10 size-10 rounded-full bg-background/80 flex items-center justify-center text-foreground"
        onClick={toggleSound}
      >
        {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Autoplay control */}
      <button
        className="absolute bottom-12 right-4 z-10 size-10 rounded-full bg-background/80 flex items-center justify-center text-foreground"
        onClick={toggleAutoplay}
      >
        {showProgress ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="6"
              y="4"
              width="4"
              height="16"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="14"
              y="4"
              width="4"
              height="16"
              rx="1"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
          </svg>
        )}
      </button>
    </Container>
  );
}

// Custom hook for the progress functionality
function useProgressTimer(delay: number) {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<{
    interval: number | null;
    timeout: number | null;
  }>({
    interval: null,
    timeout: null,
  });

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current.interval) {
      clearInterval(timerRef.current.interval);
      timerRef.current.interval = null;
    }
    if (timerRef.current.timeout) {
      clearTimeout(timerRef.current.timeout);
      timerRef.current.timeout = null;
    }
  }, []);

  // Start the progress timer
  const start = useCallback(() => {
    // Clear any existing timers
    clearTimers();

    // Reset progress
    setProgress(0);
    setIsActive(true);

    // Calculate the update interval (aim for smooth animation)
    const updateInterval = 30; // ms
    const steps = delay / updateInterval;
    const increment = 100 / steps;
    let currentProgress = 0;

    // Create an interval to update the progress
    timerRef.current.interval = window.setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        setProgress(100);
        clearTimers();
      } else {
        setProgress(currentProgress);
      }
    }, updateInterval);
  }, [delay, clearTimers]);

  // Stop the timer
  const stop = useCallback(() => {
    clearTimers();
    setIsActive(false);
    setProgress(0);
  }, [clearTimers]);

  // Reset the timer (stop and start)
  const reset = useCallback(() => {
    stop();

    // Small delay before starting again
    timerRef.current.timeout = window.setTimeout(() => {
      start();
    }, 10);
  }, [start, stop]);

  // Clean up on unmount
  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return { progress, isActive, start, stop, reset };
}

// Custom hook for managing Embla Carousel with autoplay integration
function useEmblaCarouselWithProgress(
  options: EmblaCarouselOptions = {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any[] = []
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
  const { progress, isActive, start, stop, reset } = useProgressTimer(
    options.autoplayDelay || CAROUSEL_OPTIONS.AUTOPLAY_DELAY
  );
  const isFirstLoad = useRef(true);

  // Handle slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
      reset();
    };

    emblaApi.on("select", onSelect);

    // Set initial index
    setCurrentIndex(emblaApi.selectedScrollSnap());

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, reset]);

  // Initialize on first load
  useEffect(() => {
    if (emblaApi && isFirstLoad.current) {
      isFirstLoad.current = false;

      const initTimeout = setTimeout(() => {
        const autoplay = emblaApi.plugins()?.autoplay;
        if (autoplay && autoplay.isPlaying()) {
          start();
        }
      }, 200);

      return () => clearTimeout(initTimeout);
    }
  }, [emblaApi, start]);

  // Handle autoplay events
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;

    const handlePlay = () => start();
    const handleStop = () => stop();
    const handleTimerSet = () => (isActive ? reset() : start());

    emblaApi
      .on("autoplay:play", handlePlay)
      .on("autoplay:stop", handleStop)
      .on("autoplay:timerset", handleTimerSet);

    return () => {
      emblaApi
        .off("autoplay:play", handlePlay)
        .off("autoplay:stop", handleStop)
        .off("autoplay:timerset", handleTimerSet);
    };
  }, [emblaApi, start, stop, reset, isActive]);

  // Navigation helpers
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      stop();
      emblaApi.scrollPrev();
      const autoplay = emblaApi.plugins()?.autoplay;
      if (autoplay && autoplay.isPlaying()) {
        autoplay.reset();
      }
    }
  }, [emblaApi, stop]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      stop();
      emblaApi.scrollNext();
      const autoplay = emblaApi.plugins()?.autoplay;
      if (autoplay && autoplay.isPlaying()) {
        autoplay.reset();
      }
    }
  }, [emblaApi, stop]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        stop();
        emblaApi.scrollTo(index);
        const autoplay = emblaApi.plugins()?.autoplay;
        if (autoplay && autoplay.isPlaying()) {
          autoplay.reset();
        }
      }
    },
    [emblaApi, stop]
  );

  const toggleAutoplay = useCallback(() => {
    if (emblaApi) {
      const autoplay = emblaApi.plugins()?.autoplay;
      if (autoplay) {
        if (autoplay.isPlaying()) {
          autoplay.stop();
        } else {
          autoplay.play();
        }
      }
    }
  }, [emblaApi]);

  return {
    emblaRef,
    emblaApi,
    currentIndex,
    progress,
    isActive,
    scrollPrev,
    scrollNext,
    toggleAutoplay,
    scrollTo,
  };
}
