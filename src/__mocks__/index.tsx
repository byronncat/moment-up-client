import type { MomentUI } from "api";

const avatar = [
  "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
  "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
  "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
  "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
  "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
  "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",

  "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
  "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
  "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",

  "https://pbs.twimg.com/media/GoFJ8_PbYAAGVxY?format=jpg&name=large",
  "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
  "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",

  "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
  "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
  "https://pbs.twimg.com/media/GnmzBjbbcAAn9Ou?format=jpg&name=4096x4096",

  "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GkREMhqbAAIEd5S?format=jpg&name=4096x4096",
  "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
];

export function getRandomAvatar() {
  // Use a deterministic approach based on the current time in minutes
  // This ensures the same avatar is selected for the same minute
  const currentMinute = Math.floor(Date.now() / (1000 * 60));
  return avatar[currentMinute % avatar.length];
}

// Feeds mock data
// export const mockFeeds = []
export const mockFeeds = [
  {
    id: 1,
    name: "Renata Fan",
    image: getRandomAvatar(),
  },
  {
    id: 2,
    name: "Renata Saldanha",
    image: getRandomAvatar(),
  },
  {
    id: 3,
    name: "Renata Lo Prete",
    image: getRandomAvatar(),
  },
  {
    id: 4,
    name: "Renata Ceribelli",
    image: getRandomAvatar(),
  },
  {
    id: 5,
    name: "Renata Mathias",
    image: getRandomAvatar(),
  },
  {
    id: 6,
    name: "Renata Barreto",
    image: getRandomAvatar(),
  },
  {
    id: 7,
    name: "Renata Silveira",
    image: getRandomAvatar(),
  },
  {
    id: 8,
    name: "Renata Agostini",
    image: getRandomAvatar(),
  },
  {
    id: 9,
    name: "Renata Souza",
    image: getRandomAvatar(),
  },
  {
    id: 10,
    name: "Renata Vasconcellos",
    image: getRandomAvatar(),
  },
  {
    id: 11,
    name: "Renata Capucci",
    image: getRandomAvatar(),
  },
  {
    id: 12,
    name: "Renata Heilborn",
    image: getRandomAvatar(),
  },
  {
    id: 13,
    name: "Renata Mendonça",
    image: getRandomAvatar(),
  },
  {
    id: 14,
    name: "Renata Abreu",
    image: getRandomAvatar(),
  },
  {
    id: 15,
    name: "Renata Banhara",
    image: getRandomAvatar(),
  },
  {
    id: 16,
    name: "Renata Sorrah",
    image: getRandomAvatar(),
  },
  {
    id: 17,
    name: "Renata Castro",
    image: getRandomAvatar(),
  },
  {
    id: 18,
    name: "Renata Campos",
    image: getRandomAvatar(),
  },
  {
    id: 19,
    name: "Renata Flores",
    image: getRandomAvatar(),
  },
  {
    id: 20,
    name: "Renata Gomes",
    image: getRandomAvatar(),
  },
  {
    id: 21,
    name: "Renata Lima",
    image: getRandomAvatar(),
  },
  {
    id: 22,
    name: "Renata Martins",
    image: getRandomAvatar(),
  },
  {
    id: 23,
    name: "Renata Nunes",
    image: getRandomAvatar(),
  },
  {
    id: 24,
    name: "Renata Oliveira",
    image: getRandomAvatar(),
  },
  {
    id: 25,
    name: "Renata Pereira",
    image: getRandomAvatar(),
  },
  {
    id: 26,
    name: "Renata Quintana",
    image: getRandomAvatar(),
  },
  {
    id: 27,
    name: "Renata Ribeiro",
    image: getRandomAvatar(),
  },
  {
    id: 28,
    name: "Renata Santos",
    image: getRandomAvatar(),
  },
  {
    id: 29,
    name: "Renata Teixeira",
    image: getRandomAvatar(),
  },
  {
    id: 30,
    name: "Renata Vasconcelos",
    image: getRandomAvatar(),
  },
];

// Footer links mock data
export const mockFooterLinks = [
  { text: "About", href: "#" },
  { text: "Help", href: "#" },
  { text: "Press", href: "#" },
  { text: "API", href: "#" },
  { text: "Jobs", href: "#" },
  { text: "Privacy", href: "#" },
  { text: "Terms", href: "#" },
  { text: "Locations", href: "#" },
  { text: "Language", href: "#" },
  { text: "Meta Verified", href: "#" },
];

// Current user mock data
export const mockCurrentUser = {
  id: "me",
  username: "current_user",
  name: "Your Name",
  avatar: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
};

// export const mockMoments: MomentUI[] =[]
export const mockMoments: MomentUI[] = [
  {
    id: 1,
    user_id: "1",
    username: "alice",
    profile_image:
      "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 2,
    user_id: "2",
    username: "bob",
    profile_image:
      "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GPwTSoQW8AA0aH2?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 3,
    user_id: "3",
    username: "charlie",
    profile_image:
      "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 4,
    user_id: "4",
    username: "dan",
    profile_image:
      "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 5,
    user_id: "5",
    username: "eve",
    profile_image:
      "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 6,
    user_id: "6",
    username: "frank",
    profile_image:
      "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 7,
    user_id: "7",
    username: "george",
    profile_image:
      "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 8,
    user_id: "8",
    username: "harry",
    profile_image:
      "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 9,
    user_id: "9",
    username: "irene",
    profile_image:
      "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 10,
    user_id: "10",
    username: "jose",
    profile_image:
      "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 11,
    user_id: "11",
    username: "kate",
    profile_image:
      "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 12,
    user_id: "12",
    username: "linda",
    profile_image:
      "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 13,
    user_id: "13",
    username: "mary",
    profile_image:
      "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 14,
    user_id: "14",
    username: "nancy",
    profile_image:
      "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 15,
    user_id: "15",
    username: "olivia",
    profile_image:
      "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GnmzBjbbcAAn9Ou?format=jpg&name=4096x4096",
      },
    ],
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
];

// Suggested users mock data
export const mockSuggestedUsers = [
  {
    id: 1,
    username: "johndoe",
    name: "John Doe",
    avatar: getRandomAvatar(),
    followedBy: "user123",
  },
  {
    id: 2,
    username: "janedoe",
    name: "Jane Doe",
    avatar: getRandomAvatar(),
    followedBy: "user456",
  },
  {
    id: 3,
    username: "alexsmith",
    name: "Alex Smith",
    avatar: getRandomAvatar(),
    followedBy: "user789",
  },
  {
    id: 4,
    username: "sarahjones",
    name: "Sarah Jones",
    avatar: getRandomAvatar(),
    followedBy: "user101",
  },
  {
    id: 5,
    username: "mikebrown",
    name: "Mike Brown",
    avatar: getRandomAvatar(),
    followedBy: "user202",
  },
];

// Search history mock data
export const mockRecentSearches = [
  {
    id: 1,
    type: "user" as const,
    username: "renata",
    name: "Renata",
    avatar: getRandomAvatar(),
    verified: false,
  },
  {
    id: 2,
    type: "user" as const,
    username: "renataSaldanha",
    name: "Renata Saldanha",
    avatar: getRandomAvatar(),
    verified: true,
  },
  {
    id: 3,
    type: "user" as const,
    username: "RenataFan",
    name: "Renata Fan",
    avatar: getRandomAvatar(),
    verified: true,
  },
  {
    id: 4,
    type: "user" as const,
    username: "renataloprete",
    name: "Renata Lo Prete",
    avatar: getRandomAvatar(),
    verified: true,
  },
  {
    id: 5,
    type: "user" as const,
    username: "renataceribelli",
    name: "renata ceribelli",
    avatar: getRandomAvatar(),
    verified: false,
  },
  {
    id: 6,
    type: "user" as const,
    username: "renatamathias",
    name: "Renata Mathias",
    avatar: getRandomAvatar(),
    verified: false,
  },
  {
    id: 7,
    type: "user" as const,
    username: "renatabarreto",
    name: "Renata Barreto",
    avatar: getRandomAvatar(),
    verified: true,
  },
  {
    id: 8,
    type: "user" as const,
    username: "renataSilveira",
    name: "Renata Silveira",
    avatar: getRandomAvatar(),
    verified: false,
  },
  {
    id: 9,
    type: "user" as const,
    username: "renataagostini",
    name: "Renata Agostini",
    avatar: getRandomAvatar(),
    verified: false,
  },
  {
    id: 10,
    type: "user" as const,
    username: "renataSouza",
    name: "Renata Souza",
    avatar: getRandomAvatar(),
    verified: true,
  },
  {
    id: 11,
    type: "search" as const,
    query: "renata",
  },
  {
    id: 12,
    type: "search" as const,
    query: "renata saldanha",
  },
  {
    id: 13,
    type: "search" as const,
    query: "renata bbb",
  },
];

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
    avatar: getRandomAvatar(),
    isActive: true,
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getRandomAvatar(),
    isActive: true,
  },
  {
    id: "3",
    name: "John Doe",
    avatar: getRandomAvatar(),
    isActive: true,
  },
  {
    id: "4",
    name: "Jane Doe",
    avatar: getRandomAvatar(),
    isActive: false,
  },
  {
    id: "5",
    name: "John Doe",
    avatar: getRandomAvatar(),
    isActive: false,
  },
  {
    id: "6",
    name: "John Doe",
    avatar: getRandomAvatar(),
    isActive: false,
  },
  {
    id: "7",
    name: "John Doe",
    avatar: getRandomAvatar(),
    isActive: false,
  },
];

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "La Vie",
    avatar: getRandomAvatar(),
    lastMessage: "Hi, Thinh! Please let us know how we can help you.",
    time: "2h",
    isActive: true,
    type: "user",
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getRandomAvatar(),
    lastMessage: "Phương reacted 👍 to your message",
    time: "2w",
    type: "user",
  },
  {
    id: "3",
    name: "Minh Thông",
    avatar: getRandomAvatar(),
    lastMessage: "t đi trước rồi á, kkkk",
    time: "3w",
    type: "user",
  },
  {
    id: "4",
    name: "Meta AI",
    avatar: getRandomAvatar(),
    lastMessage: "Tôi là Meta AI. Hãy coi tôi như một...",
    time: "4w",
    type: "user",
  },
  {
    id: "5",
    name: "Hà Minh",
    avatar: getRandomAvatar(),
    lastMessage: "Messages and calls are secured with end-to-end encryption",
    time: "6w",
    type: "user",
  },
  {
    id: "6",
    name: "Phương Khanh",
    avatar: getRandomAvatar(),
    lastMessage: "Reacted 😊 to your message",
    time: "7w",
    type: "user",
  },
  {
    id: "7",
    name: "Frontend Team",
    avatar: getRandomAvatar(),
    lastMessage: "Alex: Let's meet tomorrow to discuss the UI updates",
    time: "1d",
    type: "group",
    members: [
      {
        id: "1",
        name: "Alex",
        avatar: getRandomAvatar(),
      },
      {
        id: "2",
        name: "Sarah",
        avatar: getRandomAvatar(),
      },
      {
        id: "3",
        name: "John",
        avatar: getRandomAvatar(),
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
        avatar: getRandomAvatar(),
      },
      {
        id: "2",
        name: "Dad",
        avatar: getRandomAvatar(),
      },
      {
        id: "3",
        name: "Sister",
        avatar: getRandomAvatar(),
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
        avatar: getRandomAvatar(),
      },
      {
        id: "2",
        name: "Emma",
        avatar: getRandomAvatar(),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getRandomAvatar(),
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
        avatar: getRandomAvatar(),
      },
      {
        id: "2",
        name: "John",
        avatar: getRandomAvatar(),
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
        avatar: getRandomAvatar(),
      },
      {
        id: "2",
        name: "John",
        avatar: getRandomAvatar(),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getRandomAvatar(),
      },
    ],
  },
  {
    id: "12",
    name: "Mom",
    avatar: getRandomAvatar(),
    lastMessage: "Mom: Don't forget the dinner on Sunday!",
    time: "3d",
    type: "user",
  },
  {
    id: "13",
    name: "Dad",
    avatar: getRandomAvatar(),
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
      avatar: getRandomAvatar(),
    },
    timestamp: "Just now",
  },
  {
    id: "2",
    text: "Hi, Thinh! Please let us know how we can help you.",
    user: {
      id: "1",
      name: "La Vie",
      avatar: getRandomAvatar(),
    },
    timestamp: "Just now",
  },
  {
    id: "3",
    text: "Can I learn more about your business?",
    user: {
      id: "2",
      name: "Byron",
      avatar: getRandomAvatar(),
    },
    timestamp: "Just now",
  },
];

import { Twitter } from "lucide-react";

export const mockQuickReplies: string[] = [
  "Can I learn more about your business?",
  "Can you tell me more about your ad?",
  "Is anyone available to chat?",
];

export const mockNotifications = [
  {
    identity: {
      name: "Mei",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 1,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 2,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 3,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 4,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 5,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 6,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 7,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 8,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 9,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 10,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 11,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 12,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 13,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 14,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomAvatar(),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 15,
  },
];
