import type { NotificationInfo, ProfileSearchItem } from "api";

const avatar = [
  "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
  "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
  "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
  "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
  "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
  "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
  "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
  "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
  "https://pbs.twimg.com/media/Fi2-RJ9acAA7gYr?format=jpg&name=large",
  "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
  "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
  "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
  "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",

  "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
  "https://pbs.twimg.com/media/GoFJ8_PbYAAGVxY?format=jpg&name=large",
  "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
  "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
];

const backgroundImg = [
  "https://pbs.twimg.com/media/GjlpiyBaIAENj43?format=jpg&name=large",
  "https://pbs.twimg.com/media/GRn1_2AaUAAT7JU?format=jpg&name=4096x4096",
];

const video = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
];

function getRandomFile(
  text: string,
  type: "image" | "video" | "audio" = "image"
) {
  const seed = text
    ? text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  if (type === "video") return video[seed % video.length];
  return avatar[seed % avatar.length];
}

// Chat mocks
export type Message = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
};

export type Contact = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  isActive?: boolean;
  type: "user" | "group";
  members?: {
    id: string;
    name: string;
    avatar: string;
  }[];
};

export type UserStatus = {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
};

export const mockUserStatuses: UserStatus[] = [
  {
    id: "1",
    name: "La Vie",
    avatar: getRandomFile("la_vie"),
    isActive: true,
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getRandomFile("king_of_games"),
    isActive: true,
  },
  {
    id: "3",
    name: "John Doe",
    avatar: getRandomFile("john_doe"),
    isActive: true,
  },
  {
    id: "4",
    name: "Jane Doe",
    avatar: getRandomFile("jane_doe"),
    isActive: false,
  },
  {
    id: "5",
    name: "John Doe",
    avatar: getRandomFile("john_doe"),
    isActive: false,
  },
  {
    id: "6",
    name: "John Doe",
    avatar: getRandomFile("john_doe"),
    isActive: false,
  },
  {
    id: "7",
    name: "John Doe",
    avatar: getRandomFile("john_doe"),
    isActive: false,
  },
];

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "La Vie",
    avatar: getRandomFile("la_vie"),
    lastMessage: "Hi, Thinh! Please let us know how we can help you.",
    time: "2h",
    isActive: true,
    type: "user",
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getRandomFile("king_of_games"),
    lastMessage: "Phương reacted 👍 to your message",
    time: "2w",
    type: "user",
  },
  {
    id: "3",
    name: "Minh Thông",
    avatar: getRandomFile("minh_thong"),
    lastMessage: "t đi trước rồi á, kkkk",
    time: "3w",
    type: "user",
  },
  {
    id: "4",
    name: "Meta AI",
    avatar: getRandomFile("meta_ai"),
    lastMessage: "Tôi là Meta AI. Hãy coi tôi như một...",
    time: "4w",
    type: "user",
  },
  {
    id: "5",
    name: "Hà Minh",
    avatar: getRandomFile("ha_minh"),
    lastMessage: "Messages and calls are secured with end-to-end encryption",
    time: "6w",
    type: "user",
  },
  {
    id: "6",
    name: "Phương Khanh",
    avatar: getRandomFile("phuong_khanh"),
    lastMessage: "Reacted 😊 to your message",
    time: "7w",
    type: "user",
  },
  {
    id: "7",
    name: "Frontend Team",
    avatar: getRandomFile("frontend_team"),
    lastMessage: "Alex: Let's meet tomorrow to discuss the UI updates",
    time: "1d",
    type: "group",
    members: [
      {
        id: "1",
        name: "Alex",
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
    time: "3d",
    type: "group",
    members: [
      {
        id: "1",
        name: "Mom",
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
    time: "5d",
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
    time: "1w",
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
    time: "1w",
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
    time: "3d",
    type: "user",
  },
  {
    id: "13",
    name: "Dad",
    avatar: getRandomFile("dad"),
    lastMessage: "Dad: Don't forget the dinner on Sunday!",
    time: "3d",
    type: "user",
  },
];

export const mockInitialMessages: Message[] = [
  {
    id: "1",
    text: "Hi, Thinh! Please let us know how we can help you.",
    user: {
      id: "1",
      name: "La Vie",
      avatar: getRandomFile("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "2",
    text: "Hi, Thinh! Please let us know how we can help you.",
    user: {
      id: "1",
      name: "La Vie",
      avatar: getRandomFile("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "3",
    text: "Can I learn more about your business?",
    user: {
      id: "2",
      name: "Byron",
      avatar: getRandomFile("king_of_games"),
    },
    timestamp: "Just now",
  },
];

export const mockQuickReplies: string[] = [
  "Can I learn more about your business?",
  "Can you tell me more about your ad?",
  "Is anyone available to chat?",
];

export const mockNotifications: NotificationInfo[] = [
  {
    id: "f3f60344-1d0f-42f8-96db-57d100854d7d",
    type: "security",
    userId: "f3f60344-1d0f-42f8-96db-57d100854d7d",
    createdAt: "2025-07-11T09:20:12.345Z",
  },
  {
    id: "d75906a9-9655-44d6-aa06-fa675ba13e3e",
    type: "social",
    createdAt: "2025-07-11T09:20:12.345Z",
    user: {
      email: "",
      id: "d75906a9-9655-44d6-aa06-fa675ba13e3e",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("d75906a9-9655-44d6-aa06-fa675ba13e3e"),
      followers: 1000,
      following: 1000,
      hasFeed: true,
    },
    information: {
      type: "post",
      content: "Hello, how are you?",
    },
  },
  {
    id: "feff69a1-41df-48e8-b799-4be4e6f0e3c0",
    type: "social",
    user: {
      email: "",
      id: "feff69a1-41df-48e8-b799-4be4e6f0e3c0",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("feff69a1-41df-48e8-b799-4be4e6f0e3c0"),
      followers: 1000,
      following: 1000,
      hasFeed: true,
    },
    createdAt: "2025-07-11T09:20:12.345Z",
    information: {
      type: "mention",
      content: "That's me. Then, how about **Byron Atwood**?",
    },
  },
  {
    id: "a4cdafc1-9da2-47ac-9bf7-e9f82db9eb80",
    type: "social",
    user: {
      email: "",
      id: "a4cdafc1-9da2-47ac-9bf7-e9f82db9eb80",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("a4cdafc1-9da2-47ac-9bf7-e9f82db9eb80"),
      followers: 1000,
      following: 1000,
      hasFeed: true,
    },
    createdAt: "2025-07-11T09:20:12.345Z",
    information: {
      type: "follow",
    },
  },
];

// Aside
export const mockPopularAccounts: ProfileSearchItem[] = [
  {
    isFollowing: false,
    email: "",
    id: "057b50c5-4646-42bf-98ea-933c108f2671",
    username: "wbale0",
    displayName: "Werner Bale",
    avatar: getRandomFile("057b50c5-4646-42bf-98ea-933c108f2671"),
    bio: "Travel photographer | Adventure seeker | Coffee enthusiast",
    backgroundImage: backgroundImg[0],
  },
  {
    isFollowing: false,
    email: "",
    id: "ca0f9eb5-c789-4e50-9f8c-457ff3b9f964",
    username: "tech_jason",
    displayName: "Jason Chen",
    avatar: getRandomFile("ca0f9eb5-c789-4e50-9f8c-457ff3b9f964"),
  },
  {
    isFollowing: false,
    email: "",
    id: "90946704-51dc-4a73-9f56-99531bc3db7b",
    username: "foodie_sophie",
    displayName: "Sophie Rodriguez",
    avatar: getRandomFile("90946704-51dc-4a73-9f56-99531bc3db7b"),
    bio: "Food blogger | Recipe developer | Always hungry",
    backgroundImage: backgroundImg[1],
  },
  {
    isFollowing: false,
    email: "",
    id: "92a1e004-8ddf-46ab-8811-28a6e1bb7a60",
    username: "fitness_marcus",
    displayName: "Marcus Johnson",
    avatar: getRandomFile("92a1e004-8ddf-46ab-8811-28a6e1bb7a60"),
    bio: "Personal trainer | Nutrition coach | Wellness advocate",
    backgroundImage: backgroundImg[1],
  },
];
