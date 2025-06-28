"use client";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void
}>;

export default function Error({ error, reset }: ErrorProps) {
  console.log(error);
  return (
    <div>
      <h1>Error {error.message}</h1>
      <button onClick={reset}>Reset</button>
    </div>
  );
}