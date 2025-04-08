export default function Clone({ className, type = "regular" }: IconProps) {
  if (type === "solid")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className={className}
      >
        <path d="M464 0c26.5 0 48 21.5 48 48v288c0 26.5-21.5 48-48 48H176c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48h288M176 416c-44.1 0-80-35.9-80-80V128H48c-26.5 0-48 21.5-48 48v288c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-48H176z" />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
    >
      <path d="M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM362 464H54a6 6 0 0 1 -6-6V150a6 6 0 0 1 6-6h42v224c0 26.5 21.5 48 48 48h224v42a6 6 0 0 1 -6 6zm96-96H150a6 6 0 0 1 -6-6V54a6 6 0 0 1 6-6h308a6 6 0 0 1 6 6v308a6 6 0 0 1 -6 6z" />
    </svg>
  );
}
