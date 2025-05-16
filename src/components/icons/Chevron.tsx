type ChevronProps = Pick<IconProps, "className"> & {
  direction: "up" | "down" | "left" | "right";
};

export default function Chevron({ className, direction }: ChevronProps) {
  const Path = () => {
    switch (direction) {
      case "up":
        return (
          <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
        );
      case "down":
        return (
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        );
      case "left":
        return <path d="M15 18l-6-6 6-6" />;
      case "right":
        return <path d="M9 18l6-6-6-6" />;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
    >
      <Path />
    </svg>
  );
}
