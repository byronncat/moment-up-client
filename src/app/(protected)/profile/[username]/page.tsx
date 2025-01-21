import { mockMoments } from "@/__mocks__";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/components/icons";
import { MomentCell } from "@/components/moment";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  return (
    <div className={cn("relative", "max-w-2xl mx-auto", "bg-card", "py-8")}>
      <div className="flex flex-col justify-center items-center mb-5">
        <Avatar className="size-28">
          <AvatarImage
            src="https://res.cloudinary.com/dq02xgn2g/image/upload/v1711784076/defaul t-avatar.jpg"
            alt={`${username}'s profile`}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary">
            <User className="size-12 fill-card" type="solid" />
          </AvatarFallback>
        </Avatar>
        <span className={cn("my-3", "font-semibold")}>{username}</span>

        <div className={cn("grid grid-cols-2 gap-10", "text-sm")}>
          <div className="flex flex-col items-center">
            <span className="font-bold">10</span>
            <span>Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">1.20 K</span>
            <span>Followers</span>
          </div>
        </div>

        <button
          className={cn(
            "my-5 px-5 py-2",
            "font-semibold text-sm",
            "border border-card-foreground/[.7]"
          )}
        >
          Edit profile
        </button>

        <p className="mb-3">Description about me goes here</p>
      </div>

      <div className="grid grid-cols-4">
        <button className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="border-b-2 border-gray-600 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
        <button className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </button>
        <button className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
        <button className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className={cn("grid grid-cols-3 gap-1", "mt-5")}>
        {mockMoments.map((moment) => (
          <MomentCell key={moment.id} data={moment} />
        ))}
      </div>
    </div>
  );
}
