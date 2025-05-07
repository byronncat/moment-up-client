import type {
  AccountInfo,
  DetailedMoment,
  SearchItem,
  UserInfo,
  FeedNotification,
  FeedInfo,
} from "api";
import { HashtagItem } from "schema";
import sound1 from "./1.mp3";
import sound2 from "./2.mp3";

const isDev = process.env.NODE_ENV === "development";

const avatar = isDev
  ? [
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
      "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GkREMhqbAAIEd5S?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
      "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
      "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
      "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
      "https://pbs.twimg.com/media/Fi2-RJ9acAA7gYr?format=jpg&name=large",
      "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
      "https://pbs.twimg.com/media/GoXF5VOXcAA5W_F?format=jpg&name=large",
      "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
      "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
      "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",
      "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
      "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
    ]
  : [];

const audio = [
  "https://cdn.freesound.org/previews/688/688211_10564589-hq.mp3",
  sound1,
  sound2,
];

export function getUserAvatar(userId: number | string) {
  const seed =
    typeof userId === "string"
      ? userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : userId;
  return avatar[seed % avatar.length];
}

export function getRandomFile(type: "image" | "video" | "audio", text: string) {
  const seed = text
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (type === "video") {
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  }
  if (type === "audio") {
    return audio[seed % audio.length];
  }
  return avatar[seed % avatar.length];
}

// Feeds mock data
export const mockFeeds: FeedNotification[] = [
  {
    id: "1",
    user: {
      id: "1",
      displayName: "Renata Fan",
      avatar: getUserAvatar("renata_fan"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "2",
    user: {
      id: "2",
      displayName: "Thompson",
      avatar: getUserAvatar("thompson"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "3",
    user: {
      id: "3",
      displayName: "Jamie",
      avatar: getUserAvatar("jamie"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "4",
    user: {
      id: "4",
      displayName: "Ceribelli",
      avatar: getUserAvatar("ceribelli"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "5",
    user: {
      id: "5",
      displayName: "Mathias",
      avatar: getUserAvatar("mathias"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "6",
    user: {
      id: "6",
      displayName: "Barreto",
      avatar: getUserAvatar("barreto"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "7",
    user: {
      id: "7",
      displayName: "Silveira",
      avatar: getUserAvatar("silveira"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "8",
    user: {
      id: "8",
      displayName: "Agostini",
      avatar: getUserAvatar("agostini"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "9",
    user: {
      id: "9",
      displayName: "Souza",
      avatar: getUserAvatar("souza"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "10",
    user: {
      id: "10",
      displayName: "Vasconcellos",
      avatar: getUserAvatar("vasconcellos"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "11",
    user: {
      id: "11",
      displayName: "Capucci",
      avatar: getUserAvatar("capucci"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "12",
    user: {
      id: "12",
      displayName: "Heilborn",
      avatar: getUserAvatar("heilborn"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "13",
    user: {
      id: "13",
      displayName: "Mendonça",
      avatar: getUserAvatar("mendonca"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "14",
    user: {
      id: "14",
      displayName: "Abreu",
      avatar: getUserAvatar("abreu"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "15",
    user: {
      id: "15",
      displayName: "Banhara",
      avatar: getUserAvatar("banhara"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "16",
    user: {
      id: "16",
      displayName: "Sorrah",
      avatar: getUserAvatar("sorrah"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "17",
    user: {
      id: "17",
      displayName: "Castro",
      avatar: getUserAvatar("castro"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "18",
    user: {
      id: "18",
      displayName: "Campos",
      avatar: getUserAvatar("campos"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "19",
    user: {
      id: "19",
      displayName: "Flores",
      avatar: getUserAvatar("flores"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "20",
    user: {
      id: "20",
      displayName: "Gomes",
      avatar: getUserAvatar("gomes"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "21",
    user: {
      id: "21",
      displayName: "Lima",
      avatar: getUserAvatar("lima"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "22",
    user: {
      id: "22",
      displayName: "Martins",
      avatar: getUserAvatar("martins"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "23",
    user: {
      id: "23",
      displayName: "Nunes",
      avatar: getUserAvatar("nunes"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "24",
    user: {
      id: "24",
      displayName: "Renata Oliveira",
      avatar: getUserAvatar("renata_oliveira"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "25",
    user: {
      id: "25",
      displayName: "Renata Pereira",
      avatar: getUserAvatar("renata_pereira"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "26",
    user: {
      id: "26",
      displayName: "Renata Quintana",
      avatar: getUserAvatar("renata_quintana"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "27",
    user: {
      id: "27",
      displayName: "Renata Ribeiro",
      avatar: getUserAvatar("renata_ribeiro"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "28",
    user: {
      id: "28",
      displayName: "Santos",
      avatar: getUserAvatar("santos"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "29",
    user: {
      id: "29",
      displayName: "Teixeira",
      avatar: getUserAvatar("teixeira"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
  {
    id: "30",
    user: {
      id: "30",
      displayName: "asconcelos",
      avatar: getUserAvatar("vasconcelos"),
      isViewed: false,
    },
    latestFeedTime: new Date(),
  },
];

export const mockFeed: FeedInfo[] = [
  {
    user: {
      id: "1",
      username: "Renata Fan",
      displayName: "Renata Fan",
      avatar: getUserAvatar("renata_fan"),
      verified: false,
      isViewed: false,
    },
    feeds: [
      {
        id: "1",
        content: {
          id: "1",
          type: "image",
          url: getRandomFile("image", "1"),
        },
        sound: {
          id: "1",
          type: "audio",
          url: audio[1],
        },
        createdAt: new Date(),
      },
      {
        id: "4",
        content: "This is a test! And this is a test!",
        createdAt: new Date(),
      },
      {
        id: "2",
        content: {
          id: "2",
          type: "image",
          url: getRandomFile("image", "3"),
        },
        sound: {
          id: "2",
          type: "audio",
          url: audio[2],
        },
        createdAt: new Date(),
      },
      {
        id: "3",
        content: {
          id: "3",
          type: "video",
          url: getRandomFile("video", "3"),
        },
        createdAt: new Date(),
      },
    ],
  },
  {
    user: {
      id: "2",
      username: "Feint heart",
      displayName: "Feint heart",
      avatar: getUserAvatar("feint_heart"),
      verified: false,
      isViewed: false,
    },
    feeds: [
      {
        id: "1",
        content: {
          id: "1",
          type: "image",
          url: getRandomFile("image", "thompson"),
        },
        createdAt: new Date(),
      },
      {
        id: "3",
        content: {
          id: "3",
          type: "image",
          url: getRandomFile("image", "omtspson"),
        },
        sound: {
          id: "2",
          type: "audio",
          url: getRandomFile("audio", "mockTrendingTopics"),
        },
        createdAt: new Date(),
      },
    ],
  },
];

// Current user mock data
export const mockCurrentUsers: AccountInfo[] = [
  {
    id: "me",
    username: "ThinhNgo",
    displayName: "Thinh Ngo",
    avatar: getUserAvatar("hanoi"),
    verified: true,
  },
  {
    id: "anotherMe",
    username: "BaoTrung",
    displayName: "Bao Trung",
    avatar: getUserAvatar("tu_pham"),
    verified: true,
  },
];

export const mockMoments: DetailedMoment[] = isDev
  ? [
      {
        id: "1",
        user: {
          id: "1",
          username: "alice",
          displayName: "Alice",
          avatar:
            "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "2",
        user: {
          id: "2",
          username: "bob",
          displayName: "Bob",
          avatar:
            "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
          verified: false,
          followers: 5678,
          following: 890,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GPwTSoQW8AA0aH2?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
            },
          ],
          likes: 5678,
          comments: 123,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "3",
        user: {
          id: "3",
          username: "charlie",
          displayName: "Charlie",
          avatar:
            "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
          verified: true,
          followers: 1500000,
          following: 2000,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
            },
          ],
          likes: 1500000,
          comments: 8760,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "4",
        user: {
          id: "4",
          username: "dan",
          displayName: "Dan",
          avatar:
            "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
          verified: false,
          followers: 2750000,
          following: 1500,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
            },
          ],
          likes: 2750000,
          comments: 12500,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "5",
        user: {
          id: "5",
          username: "eve",
          displayName: "Eve",
          avatar:
            "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
          verified: true,
          followers: 4200000000,
          following: 2500,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
            },
          ],
          likes: 4200000000,
          comments: 780000,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "6",
        user: {
          id: "6",
          username: "frank",
          displayName: "Frank",
          avatar:
            "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "7",
        user: {
          id: "7",
          username: "george",
          displayName: "George",
          avatar:
            "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "8",
        user: {
          id: "8",
          username: "harry",
          displayName: "Harry",
          avatar:
            "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "9",
        user: {
          id: "9",
          username: "irene",
          displayName: "Irene",
          avatar:
            "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "10",
        user: {
          id: "10",
          username: "jose",
          displayName: "Jose",
          avatar:
            "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "11",
        user: {
          id: "11",
          username: "kate",
          displayName: "Kate",
          avatar:
            "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "12",
        user: {
          id: "12",
          username: "linda",
          displayName: "Linda",
          avatar:
            "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "video",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "13",
        user: {
          id: "13",
          username: "mary",
          displayName: "Mary",
          avatar:
            "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "14",
        user: {
          id: "14",
          username: "nancy",
          displayName: "Nancy",
          avatar:
            "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "15",
        user: {
          id: "15",
          username: "olivia",
          displayName: "Olivia",
          avatar:
            "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GnmzBjbbcAAn9Ou?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "16",
        user: {
          id: "16",
          username: "pat",
          displayName: "Pat",
          avatar: getUserAvatar(16),
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GkREMhqbAAIEd5S?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "17",
        user: {
          id: "17",
          username: "pat",
          displayName: "Patrick",
          avatar: getUserAvatar(17),
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "177",
        user: {
          id: "177",
          username: "pat",
          displayName: "Patricia",
          avatar: getUserAvatar(177),
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
            },
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "19",
        user: {
          id: "19",
          username: "pat",
          displayName: "Patrick S.",
          avatar: getUserAvatar(19),
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "20",
        user: {
          id: "20",
          username: "pat",
          displayName: "Patty",
          avatar: getUserAvatar(20),
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GoXF5VOXcAA5W_F?format=jpg&name=large",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "21",
        user: {
          id: "21",
          username: "pat",
          displayName: "Patrick M.",
          avatar: getUserAvatar(21),
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "22",
        user: {
          id: "22",
          username: "pat",
          displayName: "Pat T.",
          avatar: getUserAvatar(22),
          verified: false,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
      {
        id: "23",
        user: {
          id: "23",
          username: "pat",
          displayName: "Patrick B.",
          avatar: getUserAvatar(23),
          verified: true,
          followers: 1234,
          following: 567,
        },
        post: {
          text: "Beautiful day at the beach 🌊",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
            },
          ],
          likes: 1234,
          comments: 45,
          created_at: new Date(),
          isLiked: false,
        },
      },
    ]
  : [];

export const mockSuggestedUsers: UserInfo[] = [
  {
    id: "101",
    username: "traveler_emma",
    displayName: "Emma Wilson",
    avatar: getUserAvatar(101),
    verified: true,
    bio: "Travel photographer | Adventure seeker | Coffee enthusiast",
    followers: 15420,
    following: 843,
    followedBy: {
      displayItems: [
        {
          id: "3",
          displayName: "Alex Smith",
          avatar: getUserAvatar(3),
        },
      ],
      count: 1,
    },
  },
  {
    id: "102",
    username: "tech_jason",
    displayName: "Jason Chen",
    avatar: getUserAvatar(102),
    verified: false,
    followers: 7821,
    following: 532,
  },
  {
    id: "103",
    username: "foodie_sophie",
    displayName: "Sophie Rodriguez",
    avatar: getUserAvatar(103),
    verified: true,
    bio: "Food blogger | Recipe developer | Always hungry",
    followers: 2580000,
    following: 1247,
    followedBy: {
      displayItems: [
        {
          id: "5",
          displayName: "Mike Brown",
          avatar: getUserAvatar(5),
        },
        {
          id: "3",
          displayName: "Alex Smith",
          avatar: getUserAvatar(3),
        },
      ],
      count: 2,
    },
  },
  {
    id: "104",
    username: "fitness_marcus",
    displayName: "Marcus Johnson",
    avatar: getUserAvatar(104),
    verified: true,
    bio: "Personal trainer | Nutrition coach | Wellness advocate",
    followers: 28937,
    following: 921,
  },
  {
    id: "105",
    username: "artist_maya",
    displayName: "Maya Patel",
    avatar: getUserAvatar(105),
    verified: false,
    bio: "Digital artist | Illustrator | Dreamer",
    followers: 9642,
    following: 1105,
    followedBy: {
      displayItems: [
        {
          id: "4",
          displayName: "Sarah Jones",
          avatar: getUserAvatar(4),
        },
        {
          id: "5",
          displayName: "Mike Brown",
          avatar: getUserAvatar(5),
        },
        {
          id: "2",
          displayName: "Jane Doe",
          avatar: getUserAvatar(2),
        },
      ],
      count: 67,
    },
  },
  {
    id: "106",
    username: "music_noah",
    displayName: "Noah Garcia",
    avatar: getUserAvatar(106),
    verified: true,
    bio: "Music producer | DJ | Creating vibes",
    followers: 3500000000,
    following: 758,
    followedBy: {
      displayItems: [
        {
          id: "1",
          displayName: "John Doe",
          avatar: getUserAvatar(1),
        },
        {
          id: "5",
          displayName: "Mike Brown",
          avatar: getUserAvatar(5),
        },
        {
          id: "3",
          displayName: "Alex Smith",
          avatar: getUserAvatar(3),
        },
      ],
      count: 15,
    },
  },
  {
    id: "107",
    username: "writer_olivia",
    displayName: "Olivia Thompson",
    avatar: getUserAvatar(107),
    verified: false,
    bio: "Novelist | Poet | Storyteller",
    followers: 17382,
    following: 623,
    followedBy: {
      displayItems: [
        {
          id: "3",
          displayName: "Alex Smith",
          avatar: getUserAvatar(3),
        },
      ],
      count: 1,
    },
  },
];

// Search history mock data
export const mockSearches: SearchItem[] = [
  {
    id: "1",
    type: "user" as const,
    username: "sophia_design",
    displayName: "Sophia Chen",
    avatar: getUserAvatar("sophia_design"),
    verified: true,
  },
  {
    id: "2",
    type: "user" as const,
    username: "alex_walker",
    displayName: "Alex Walker",
    avatar: getUserAvatar("alex_walker"),
    verified: false,
  },
  {
    id: "3",
    type: "user" as const,
    username: "dev_marcus",
    displayName: "Marcus Johnson",
    avatar: getUserAvatar("dev_marcus"),
    verified: true,
  },
  {
    id: "4",
    type: "user" as const,
    username: "emily_photos",
    displayName: "Emily Rodriguez",
    avatar: getUserAvatar("emily_photos"),
    verified: false,
  },
  {
    id: "5",
    type: "user" as const,
    username: "tech_jamie",
    displayName: "Jamie Williams",
    avatar: getUserAvatar("tech_jamie"),
    verified: true,
  },
  {
    id: "6",
    type: "user" as const,
    username: "design_priya",
    displayName: "Priya Patel",
    avatar: getUserAvatar("design_priya"),
    verified: false,
  },
  {
    id: "7",
    type: "user" as const,
    username: "travel_noah",
    displayName: "Noah Garcia",
    avatar: getUserAvatar("travel_noah"),
    verified: true,
  },
  {
    id: "8",
    type: "user" as const,
    username: "coffee_zoe",
    displayName: "Zoe Thompson",
    avatar: getUserAvatar("coffee_zoe"),
    verified: false,
  },
  {
    id: "9",
    type: "user" as const,
    username: "fitness_liam",
    displayName: "Liam Wilson",
    avatar: getUserAvatar("fitness_liam"),
    verified: true,
  },
  {
    id: "10",
    type: "user" as const,
    username: "chef_olivia",
    displayName: "Olivia Martinez",
    avatar: getUserAvatar("chef_olivia"),
    verified: false,
  },
  {
    id: "11",
    type: "search" as const,
    query: "design inspiration",
  },
  {
    id: "12",
    type: "search" as const,
    query: "travel destinations 2024",
  },
  {
    id: "13",
    type: "search" as const,
    query: "coding bootcamp reviews",
  },
  {
    id: "14",
    type: "hashtag" as const,
    tag: "travel",
    count: 1223,
  },
  {
    id: "15",
    type: "hashtag" as const,
    tag: "photography",
    count: 945,
  },
  {
    id: "16",
    type: "hashtag" as const,
    tag: "nature",
    count: 876,
  },
  {
    id: "17",
    type: "hashtag" as const,
    tag: "food",
    count: 732,
  },
  {
    id: "18",
    type: "hashtag" as const,
    tag: "art",
    count: 625,
  },
  {
    id: "19",
    type: "hashtag" as const,
    tag: "fashion",
    count: 589,
  },
  {
    id: "20",
    type: "hashtag" as const,
    tag: "fitness",
    count: 478,
  },
  {
    id: "21",
    type: "hashtag" as const,
    tag: "music",
    count: 412,
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
    avatar: getUserAvatar("la_vie"),
    isActive: true,
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getUserAvatar("king_of_games"),
    isActive: true,
  },
  {
    id: "3",
    name: "John Doe",
    avatar: getUserAvatar("john_doe"),
    isActive: true,
  },
  {
    id: "4",
    name: "Jane Doe",
    avatar: getUserAvatar("jane_doe"),
    isActive: false,
  },
  {
    id: "5",
    name: "John Doe",
    avatar: getUserAvatar("john_doe"),
    isActive: false,
  },
  {
    id: "6",
    name: "John Doe",
    avatar: getUserAvatar("john_doe"),
    isActive: false,
  },
  {
    id: "7",
    name: "John Doe",
    avatar: getUserAvatar("john_doe"),
    isActive: false,
  },
];

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "La Vie",
    avatar: getUserAvatar("la_vie"),
    lastMessage: "Hi, Thinh! Please let us know how we can help you.",
    time: "2h",
    isActive: true,
    type: "user",
  },
  {
    id: "2",
    name: "KingOfGames",
    avatar: getUserAvatar("king_of_games"),
    lastMessage: "Phương reacted 👍 to your message",
    time: "2w",
    type: "user",
  },
  {
    id: "3",
    name: "Minh Thông",
    avatar: getUserAvatar("minh_thong"),
    lastMessage: "t đi trước rồi á, kkkk",
    time: "3w",
    type: "user",
  },
  {
    id: "4",
    name: "Meta AI",
    avatar: getUserAvatar("meta_ai"),
    lastMessage: "Tôi là Meta AI. Hãy coi tôi như một...",
    time: "4w",
    type: "user",
  },
  {
    id: "5",
    name: "Hà Minh",
    avatar: getUserAvatar("ha_minh"),
    lastMessage: "Messages and calls are secured with end-to-end encryption",
    time: "6w",
    type: "user",
  },
  {
    id: "6",
    name: "Phương Khanh",
    avatar: getUserAvatar("phuong_khanh"),
    lastMessage: "Reacted 😊 to your message",
    time: "7w",
    type: "user",
  },
  {
    id: "7",
    name: "Frontend Team",
    avatar: getUserAvatar("frontend_team"),
    lastMessage: "Alex: Let's meet tomorrow to discuss the UI updates",
    time: "1d",
    type: "group",
    members: [
      {
        id: "1",
        name: "Alex",
        avatar: getUserAvatar("alex_walker"),
      },
      {
        id: "2",
        name: "Sarah",
        avatar: getUserAvatar("emily_photos"),
      },
      {
        id: "3",
        name: "John",
        avatar: getUserAvatar("john_doe"),
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
        avatar: getUserAvatar("mom"),
      },
      {
        id: "2",
        name: "Dad",
        avatar: getUserAvatar("dad"),
      },
      {
        id: "3",
        name: "Sister",
        avatar: getUserAvatar("sister"),
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
        avatar: getUserAvatar("david"),
      },
      {
        id: "2",
        name: "Emma",
        avatar: getUserAvatar("emma"),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getUserAvatar("michael"),
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
        avatar: getUserAvatar("kevin"),
      },
      {
        id: "2",
        name: "John",
        avatar: getUserAvatar("john_doe"),
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
        avatar: getUserAvatar("kevin"),
      },
      {
        id: "2",
        name: "John",
        avatar: getUserAvatar("john_doe"),
      },
      {
        id: "3",
        name: "Michael",
        avatar: getUserAvatar("michael"),
      },
    ],
  },
  {
    id: "12",
    name: "Mom",
    avatar: getUserAvatar("mom"),
    lastMessage: "Mom: Don't forget the dinner on Sunday!",
    time: "3d",
    type: "user",
  },
  {
    id: "13",
    name: "Dad",
    avatar: getUserAvatar("dad"),
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
      avatar: getUserAvatar("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "2",
    text: "Hi, Thinh! Please let us know how we can help you.",
    user: {
      id: "1",
      name: "La Vie",
      avatar: getUserAvatar("la_vie"),
    },
    timestamp: "Just now",
  },
  {
    id: "3",
    text: "Can I learn more about your business?",
    user: {
      id: "2",
      name: "Byron",
      avatar: getUserAvatar("king_of_games"),
    },
    timestamp: "Just now",
  },
];

export const mockQuickReplies: string[] = [
  "Can I learn more about your business?",
  "Can you tell me more about your ad?",
  "Is anyone available to chat?",
];

export const mockNotifications = [
  {
    identity: {
      name: "Mei",
      avatar: getUserAvatar("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 1,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 2,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 3,
  },
  {
    identity: {
      name: "Mei",
      avatar: getUserAvatar("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 4,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 5,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 6,
  },
  {
    identity: {
      name: "Mei",
      avatar: getUserAvatar("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 7,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 8,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 9,
  },
  {
    identity: {
      name: "Mei",
      avatar: getUserAvatar("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 10,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 11,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 12,
  },
  {
    identity: {
      name: "Mei",
      avatar: getUserAvatar("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 13,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 14,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getUserAvatar("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 15,
  },
];

// Trending topics mock data
export const mockTrendingTopics: HashtagItem[] = [
  {
    id: "1",
    tag: "hoyo",
    count: 8193,
  },
  {
    id: "2",
    tag: "kuro",
    count: 1250000,
  },
  {
    id: "3",
    tag: "genshin",
    count: 42400000,
  },
  {
    id: "4",
    tag: "ardelle h'ad",
    count: 3500000000,
  },
  {
    id: "5",
    tag: "genshin",
    count: 42400000,
  },
];
