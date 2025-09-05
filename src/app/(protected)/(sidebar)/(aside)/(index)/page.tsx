import HomeProvider from "./_providers/Home";
import { Moments, Stories } from "./_components";

export default function HomePage() {
  return (
    <HomeProvider>
      <div className="relative">
        <Stories />
      </div>
      <div className="size-full">
        <div className="max-w-[600px] size-full mx-auto">
          <Moments />
        </div>
      </div>
    </HomeProvider>
  );
}
