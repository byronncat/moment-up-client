import type { ContactDto, MessageDto, UserStatusDto } from "api";

const avatar = [
  "https://pbs.twimg.com/media/G2Qcoh3WIAAzwD6?format=jpg&name=large",
  "https://pbs.twimg.com/media/G2o8WN2XAAAr8D2?format=jpg&name=medium",
];

const video = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

export function getRandomFile(
  text: string,
  type: "image" | "video" | "audio" = "image"
) {
  const seed = text
    ? text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  if (type === "video") return video[seed % video.length];
  return avatar[seed % avatar.length];
}

export const mockUserStatuses: UserStatusDto[] = [
  {
    id: "1",
    name: "cberling0",
    avatar: getRandomFile("1"),
    isActive: true,
  },
  {
    id: "2",
    name: "mpellitt2",
    avatar: getRandomFile("2"),
    isActive: true,
  },
  {
    id: "3",
    name: "lteall5",
    avatar: getRandomFile("3"),
    isActive: true,
  },
  {
    id: "4",
    name: "shaydon6",
    avatar: getRandomFile("4"),
    isActive: false,
  },
  {
    id: "5",
    name: "cbartol1",
    avatar: getRandomFile("5"),
    isActive: false,
  },
  {
    id: "6",
    name: "cmalecky3",
    avatar: getRandomFile("6"),
    isActive: false,
  },
  {
    id: "7",
    name: "cbradnum4",
    avatar: getRandomFile("7"),
    isActive: false,
  },
];

export const mockContacts: ContactDto[] = [
  {
    id: "1",
    name: "cberling0",
    avatar: getRandomFile("1"),
    lastMessage: "Hi, Thinh! Please let us know how we can help you.",
    timestamp: "2h",
    isActive: true,
    type: "user",
    members: null,
  },
  {
    id: "2",
    name: "mpellitt2",
    avatar: getRandomFile("2"),
    lastMessage: "Phuong reacted 👍 to your message",
    timestamp: "2w",
    isActive: true,
    type: "user",
    members: null,
  },
  {
    id: "3",
    name: "lteall5",
    avatar: getRandomFile("3"),
    lastMessage: "I'm going ahead, kkkk",
    timestamp: "3w",
    isActive: true,
    type: "user",
    members: null,
  },
  {
    id: "4",
    name: "shaydon6",
    avatar: getRandomFile("4"),
    lastMessage: "I'm Meta AI. Please treat me as one...",
    timestamp: "4w",
    isActive: false,
    type: "user",
    members: null,
  },
  {
    id: "5",
    name: "cbartol1",
    avatar: getRandomFile("5"),
    lastMessage: "Messages and calls are secured with end-to-end encryption",
    timestamp: "6w",
    isActive: false,
    type: "user",
    members: null,
  },
  {
    id: "6",
    name: "cmalecky3",
    avatar: getRandomFile("6"),
    lastMessage: "Reacted 😊 to your message",
    timestamp: "7w",
    isActive: false,
    type: "user",
    members: null,
  },
  {
    id: "7",
    name: "cbradnum4",
    avatar: getRandomFile("7"),
    lastMessage: "Alex: Let's meet tomorrow to discuss the UI updates",
    timestamp: "1d",
    isActive: false,
    type: "group",
    members: [
      {
        id: "1",
        name: "alex",
        avatar: getRandomFile("alex_walker"),
      },
      {
        id: "2",
        name: "Sarah",
        avatar: getRandomFile("emily_photos"),
      },
      {
        id: "3",
        name: "John",
        avatar: getRandomFile("john_doe"),
      },
    ],
  },
  {
    id: "8",
    name: "Family Group",
    avatar: "",
    lastMessage: "Mom: Don't forget the dinner on Sunday!",
    timestamp: "3d",
    isActive: false,
    type: "group",
    members: [
      {
        id: "1",
        name: "mom",
        avatar: getRandomFile("mom"),
      },
      {
        id: "2",
        name: "Dad",
        avatar: getRandomFile("dad"),
      },
      {
        id: "3",
        name: "Sister",
        avatar: getRandomFile("sister"),
      },
    ],
  },
  {
    id: "9",
    name: "Project Alpha",
    avatar: "",
    lastMessage: "David: I've uploaded the latest designs",
    timestamp: "5d",
    isActive: false,
    type: "group",
    members: [
      {
        id: "1",
        name: "David",
        avatar: getRandomFile("david"),
      },
      {
        id: "2",
        name: "Emma",
        avatar: getRandomFile("emma"),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getRandomFile("michael"),
      },
    ],
  },
  {
    id: "10",
    name: "Gaming Squad",
    avatar: "",
    lastMessage: "Kevin: Anyone up for a game tonight?",
    timestamp: "1w",
    isActive: false,
    type: "group",
    members: [
      {
        id: "1",
        name: "Kevin",
        avatar: getRandomFile("kevin"),
      },
      {
        id: "2",
        name: "John",
        avatar: getRandomFile("john_doe"),
      },
    ],
  },
  {
    id: "11",
    name: "Gaming Squad",
    avatar: "",
    lastMessage: "Kevin: Anyone up for a game tonight?",
    timestamp: "1w",
    isActive: false,
    type: "group",
    members: [
      {
        id: "1",
        name: "Kevin",
        avatar: getRandomFile("kevin"),
      },
      {
        id: "2",
        name: "John",
        avatar: getRandomFile("john_doe"),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getRandomFile("michael"),
      },
    ],
  },
  {
    id: "12",
    name: "Mom",
    avatar: getRandomFile("mom"),
    lastMessage: "Mom: Don't forget the dinner on Sunday!",
    timestamp: "3d",
    isActive: false,
    type: "user",
    members: null,
  },
  {
    id: "13",
    name: "Dad",
    avatar: getRandomFile("dad"),
    lastMessage: "Dad: Don't forget the dinner on Sunday!",
    timestamp: "3d",
    isActive: false,
    type: "user",
    members: null,
  },
];

export const mockInitialMessages: MessageDto[] = [
  {
    id: "1",
    text: "Hi, Thinh! Please let us know how we can help you.",
    user: {
      id: "1",
      name: "cberling0",
      avatar: getRandomFile("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "2",
    text: "Can I learn more about your business?",
    user: {
      id: "2",
      name: "mpellitt2",
      avatar: getRandomFile("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "3",
    text: "Sure, I'll send you the details. Please wait a moment.",
    user: {
      id: "1",
      name: "cberling0",
      avatar: getRandomFile("la_vie"),
    },
    timestamp: "Just now",
  },
];

import { getCldImageUrl } from "next-cloudinary";

export function __parseUrl(
  data: string | null,
  assetType: "image" | "video" = "image",
  width?: number,
  height?: number
) {
  if (!data) return null;
  if (data.startsWith("http") || data.startsWith("blob:")) return data;
  return getCldImageUrl({
    src: data,
    width,
    height,
    assetType,
  });
}
