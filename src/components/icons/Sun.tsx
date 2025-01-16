export default function Sun({ className, type = "regular" }: IconProps) {
  if (type === "solid")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
      >
        <path
          fill="currentColor"
          d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1zM12 18a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM5.64 4.22a1 1 0 0 0-1.42 1.42l1.41 1.41a1 1 0 0 0 1.42-1.42L5.64 4.22zM18.36 16.95a1 1 0 0 0-1.42 1.42l1.41 1.41a1 1 0 0 0 1.42-1.42l-1.41-1.41zM3 11a1 1 0 0 0-1 1 1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H3zM19 11a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2h-2zM7.05 16.95a1 1 0 0 0-1.42 0l-1.41 1.41a1 1 0 0 0 1.42 1.42l1.41-1.41a1 1 0 0 0 0-1.42zM19.78 4.22a1 1 0 0 0-1.42 0l-1.41 1.41a1 1 0 0 0 1.42 1.42l1.41-1.41a1 1 0 0 0 0-1.42z"
        />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
