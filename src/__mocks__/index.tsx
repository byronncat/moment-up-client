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

const audio = [sound1, sound2];

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
  if (type === "audio") return audio[seed % audio.length];
  return avatar[seed % avatar.length];
}

// Feeds mock data
export const mockFeeds: FeedNotification[] = [
  {
    id: "033794b7-df1f-4d8b-b42e-64b980f303fd",
    user: {
      id: "5f93e68e-aeeb-4246-a7a0-adf033c1b03c",
      displayName: "Scotti Wilds",
      avatar: getRandomFile("5f93e68e-aeeb-4246-a7a0-adf033c1b03c"),
      isViewed: false,
    },
    latestFeedTime: new Date("10/28/2024"),
  },
  {
    id: "ed4e3c51-fbc3-45e7-a84b-9f7aa6cf8b5e",
    user: {
      id: "c725caa6-63f4-48e3-bc5e-a2b435799590",
      displayName: "Emmalyn Riguard",
      avatar: getRandomFile("c725caa6-63f4-48e3-bc5e-a2b435799590"),
      isViewed: true,
    },
    latestFeedTime: new Date("1/26/2025"),
  },
  {
    id: "edad6651-dde3-4505-857d-3506b3a1d67a",
    user: {
      id: "6d9ac04f-dea5-477a-876a-265f236c9f33",
      displayName: "Glenn Maddison",
      avatar: getRandomFile("6d9ac04f-dea5-477a-876a-265f236c9f33"),
      isViewed: true,
    },
    latestFeedTime: new Date("10/24/2024"),
  },
  {
    id: "fefddf01-93f5-4f75-baae-0dcea6fde3de",
    user: {
      id: "2a70eafb-81b5-48f7-ac2e-6710aaad390d",
      displayName: "Wallis Klimecki",
      avatar: getRandomFile("2a70eafb-81b5-48f7-ac2e-6710aaad390d"),
      isViewed: false,
    },
    latestFeedTime: new Date("5/31/2024"),
  },
  {
    id: "c9293268-8fc7-4a52-b4cd-b1c7c53410a8",
    user: {
      id: "a4d27e3a-61d2-4a54-ba98-6d005632c0b3",
      displayName: "Tannie Normanville",
      avatar: getRandomFile("a4d27e3a-61d2-4a54-ba98-6d005632c0b3"),
      isViewed: false,
    },
    latestFeedTime: new Date("1/16/2025"),
  },
  {
    id: "1d86b12d-c764-4de4-a8b8-81c3c01d4fda",
    user: {
      id: "a0e20552-439f-42ba-9c59-060083501cfe",
      displayName: "Haleigh Brodley",
      avatar: getRandomFile("a0e20552-439f-42ba-9c59-060083501cfe"),
      isViewed: false,
    },
    latestFeedTime: new Date("4/3/2025"),
  },
  {
    id: "765d396b-c3d8-4dd3-878d-5654be131a02",
    user: {
      id: "32afbf0e-8298-477e-8269-506bf5997d46",
      displayName: "Noach Wilsey",
      avatar: getRandomFile("32afbf0e-8298-477e-8269-506bf5997d46"),
      isViewed: false,
    },
    latestFeedTime: new Date("8/1/2024"),
  },
  {
    id: "b432afac-4752-4f4e-ba4d-10b6ede9d3bf",
    user: {
      id: "648f9e3f-9ad2-4e30-9064-780e0f13f5e2",
      displayName: "Carree Negri",
      avatar: getRandomFile("648f9e3f-9ad2-4e30-9064-780e0f13f5e2"),
      isViewed: true,
    },
    latestFeedTime: new Date("5/28/2024"),
  },
  {
    id: "1388d404-55dc-4b0b-9082-fe6a7733d5ab",
    user: {
      id: "564f8288-c6d4-465a-aa0a-f96ba7a2336b",
      displayName: "Cleve Matskevich",
      avatar: getRandomFile("564f8288-c6d4-465a-aa0a-f96ba7a2336b"),
      isViewed: true,
    },
    latestFeedTime: new Date("1/17/2025"),
  },
  {
    id: "08ed2e00-4dc4-4466-8c84-c0ce27bac584",
    user: {
      id: "dd1f5358-e0fd-462a-9ef2-725b7ff5762c",
      displayName: "Pammy Melby",
      avatar: getRandomFile("dd1f5358-e0fd-462a-9ef2-725b7ff5762c"),
      isViewed: false,
    },
    latestFeedTime: new Date("9/25/2024"),
  },
  {
    id: "976908be-7129-48db-9f26-ddcda7937412",
    user: {
      id: "e2afcdea-9472-4bf5-9929-e1006a240043",
      displayName: "Dorelle Castelow",
      avatar: getRandomFile("e2afcdea-9472-4bf5-9929-e1006a240043"),
      isViewed: true,
    },
    latestFeedTime: new Date("9/1/2024"),
  },
  {
    id: "1f3be3fa-72ed-4236-afa7-2b150fe76df2",
    user: {
      id: "d5b7a123-dc9f-4b34-b65f-bb57259bf8f9",
      displayName: "Antony Taffe",
      avatar: getRandomFile("d5b7a123-dc9f-4b34-b65f-bb57259bf8f9"),
      isViewed: true,
    },
    latestFeedTime: new Date("6/28/2024"),
  },
  {
    id: "5fbe4b6d-2c5d-40bd-9d8d-f19fc4a072ef",
    user: {
      id: "15beb04c-4df3-4bde-828e-914b02b340e2",
      displayName: "Ginni Hestrop",
      avatar: getRandomFile("15beb04c-4df3-4bde-828e-914b02b340e2"),
      isViewed: true,
    },
    latestFeedTime: new Date("4/11/2025"),
  },
  {
    id: "a07c5630-d4e3-4ae4-93bb-c4e931259a76",
    user: {
      id: "3fbc69e7-3d1a-4946-ae8c-790db31ceb6d",
      displayName: "Kelsey Mattiazzo",
      avatar: getRandomFile("3fbc69e7-3d1a-4946-ae8c-790db31ceb6d"),
      isViewed: true,
    },
    latestFeedTime: new Date("3/10/2025"),
  },
  {
    id: "b22bfa1e-a282-468a-95eb-78002df79868",
    user: {
      id: "22fe505f-0517-43c7-99d2-0a5ef80c6f9f",
      displayName: "Laurena Szimoni",
      avatar: getRandomFile("22fe505f-0517-43c7-99d2-0a5ef80c6f9f"),
      isViewed: true,
    },
    latestFeedTime: new Date("8/17/2024"),
  },
  {
    id: "1dfa7dc6-8c67-4a6b-991d-14f24de988e9",
    user: {
      id: "d1e65277-e60c-41bd-baaa-5d401d60240c",
      displayName: "Bev Dod",
      avatar: getRandomFile("d1e65277-e60c-41bd-baaa-5d401d60240c"),
      isViewed: false,
    },
    latestFeedTime: new Date("5/10/2024"),
  },
];

export const mockFeed: FeedInfo[] = [
  // {
  //   user: {
  //     id: "1",
  //     username: "Renata Fan",
  //     displayName: "Renata Fan",
  //     avatar: getRandomFile("renata_fan"),
  //     verified: false,
  //     isViewed: false,
  //   },
  //   feeds: [
  //     {
  //       id: "1",
  //       content: {
  //         id: "1",
  //         type: "image",
  //         url: getRandomFile("1"),
  //       },
  //       sound: {
  //         id: "1",
  //         type: "audio",
  //         url: audio[1],
  //       },
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: "4",
  //       content: "This is a test! And this is a test!",
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: "2",
  //       content: {
  //         id: "2",
  //         type: "image",
  //         url: getRandomFile("image", "3"),
  //       },
  //       sound: {
  //         id: "2",
  //         type: "audio",
  //         url: audio[2],
  //       },
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: "3",
  //       content: {
  //         id: "3",
  //         type: "video",
  //         url: getRandomFile("video", "3"),
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // },
  // {
  //   user: {
  //     id: "2",
  //     username: "Feint heart",
  //     displayName: "Feint heart",
  //     avatar: getRandomFile("feint_heart"),
  //     verified: false,
  //     isViewed: false,
  //   },
  //   feeds: [
  //     {
  //       id: "1",
  //       content: {
  //         id: "1",
  //         type: "image",
  //         url: getRandomFile("image", "thompson"),
  //       },
  //       createdAt: new Date(),
  //     },
  //     {
  //       id: "3",
  //       content: {
  //         id: "3",
  //         type: "image",
  //         url: getRandomFile("image", "omtspson"),
  //       },
  //       sound: {
  //         id: "2",
  //         type: "audio",
  //         url: getRandomFile("audio", "mockTrendingTopics"),
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // },
];

// Current user mock data
export const mockCurrentUsers: AccountInfo[] = [
  {
    id: "me",
    username: "ThinhNgo",
    displayName: "Thinh Ngo",
    avatar: getRandomFile("hanoi"),
    verified: true,
  },
  {
    id: "anotherMe",
    username: "BaoTrung",
    displayName: "Bao Trung",
    avatar: getRandomFile("tu_pham"),
    verified: true,
  },
];

export const mockMoments: DetailedMoment[] = [];
// isDev
//   ? [
//       {
//         id: "1",
//         user: {
//           id: "1",
//           username: "alice",
//           displayName: "Alice",
//           avatar:
//             "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "2",
//         user: {
//           id: "2",
//           username: "bob",
//           displayName: "Bob",
//           avatar:
//             "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
//           verified: false,
//           followers: 5678,
//           following: 890,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GPwTSoQW8AA0aH2?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
//             },
//           ],
//           likes: 5678,
//           comments: 123,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "3",
//         user: {
//           id: "3",
//           username: "charlie",
//           displayName: "Charlie",
//           avatar:
//             "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
//           verified: true,
//           followers: 1500000,
//           following: 2000,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
//             },
//           ],
//           likes: 1500000,
//           comments: 8760,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "4",
//         user: {
//           id: "4",
//           username: "dan",
//           displayName: "Dan",
//           avatar:
//             "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
//           verified: false,
//           followers: 2750000,
//           following: 1500,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
//             },
//           ],
//           likes: 2750000,
//           comments: 12500,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "5",
//         user: {
//           id: "5",
//           username: "eve",
//           displayName: "Eve",
//           avatar:
//             "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
//           verified: true,
//           followers: 4200000000,
//           following: 2500,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
//             },
//           ],
//           likes: 4200000000,
//           comments: 780000,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "6",
//         user: {
//           id: "6",
//           username: "frank",
//           displayName: "Frank",
//           avatar:
//             "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "7",
//         user: {
//           id: "7",
//           username: "george",
//           displayName: "George",
//           avatar:
//             "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "8",
//         user: {
//           id: "8",
//           username: "harry",
//           displayName: "Harry",
//           avatar:
//             "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "9",
//         user: {
//           id: "9",
//           username: "irene",
//           displayName: "Irene",
//           avatar:
//             "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "10",
//         user: {
//           id: "10",
//           username: "jose",
//           displayName: "Jose",
//           avatar:
//             "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "11",
//         user: {
//           id: "11",
//           username: "kate",
//           displayName: "Kate",
//           avatar:
//             "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
//             },
//             {
//               id: "4",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "12",
//         user: {
//           id: "12",
//           username: "linda",
//           displayName: "Linda",
//           avatar:
//             "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "video",
//               url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "13",
//         user: {
//           id: "13",
//           username: "mary",
//           displayName: "Mary",
//           avatar:
//             "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "14",
//         user: {
//           id: "14",
//           username: "nancy",
//           displayName: "Nancy",
//           avatar:
//             "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "15",
//         user: {
//           id: "15",
//           username: "olivia",
//           displayName: "Olivia",
//           avatar:
//             "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GnmzBjbbcAAn9Ou?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "16",
//         user: {
//           id: "16",
//           username: "pat",
//           displayName: "Pat",
//           avatar: getRandomFile(16),
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GkREMhqbAAIEd5S?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "17",
//         user: {
//           id: "17",
//           username: "pat",
//           displayName: "Patrick",
//           avatar: getRandomFile(17),
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "177",
//         user: {
//           id: "177",
//           username: "pat",
//           displayName: "Patricia",
//           avatar: getRandomFile(177),
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
//             },
//             {
//               id: "4",
//               type: "image",
//               url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
//             },
//             {
//               id: "5",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "19",
//         user: {
//           id: "19",
//           username: "pat",
//           displayName: "Patrick S.",
//           avatar: getRandomFile(19),
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "20",
//         user: {
//           id: "20",
//           username: "pat",
//           displayName: "Patty",
//           avatar: getRandomFile(20),
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GoXF5VOXcAA5W_F?format=jpg&name=large",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
//             },
//             {
//               id: "4",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "21",
//         user: {
//           id: "21",
//           username: "pat",
//           displayName: "Patrick M.",
//           avatar: getRandomFile(21),
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "22",
//         user: {
//           id: "22",
//           username: "pat",
//           displayName: "Pat T.",
//           avatar: getRandomFile(22),
//           verified: false,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//       {
//         id: "23",
//         user: {
//           id: "23",
//           username: "pat",
//           displayName: "Patrick B.",
//           avatar: getRandomFile(23),
//           verified: true,
//           followers: 1234,
//           following: 567,
//         },
//         post: {
//           text: "Beautiful day at the beach 🌊",
//           files: [
//             {
//               id: "1",
//               type: "image",
//               url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
//             },
//             {
//               id: "2",
//               type: "image",
//               url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
//             },
//             {
//               id: "3",
//               type: "image",
//               url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
//             },
//           ],
//           likes: 1234,
//           comments: 45,
//           created_at: new Date(),
//           isLiked: false,
//         },
//       },
//     ]
//   : [];

export const mockSuggestedUsers: UserInfo[] = [];
// [
//   {
//     id: "101",
//     username: "traveler_emma",
//     displayName: "Emma Wilson",
//     avatar: getRandomFile(101),
//     verified: true,
//     bio: "Travel photographer | Adventure seeker | Coffee enthusiast",
//     followers: 15420,
//     following: 843,
//     followedBy: {
//       displayItems: [
//         {
//           id: "3",
//           displayName: "Alex Smith",
//           avatar: getRandomFile(3),
//         },
//       ],
//       count: 1,
//     },
//   },
//   {
//     id: "102",
//     username: "tech_jason",
//     displayName: "Jason Chen",
//     avatar: getRandomFile(102),
//     verified: false,
//     followers: 7821,
//     following: 532,
//   },
//   {
//     id: "103",
//     username: "foodie_sophie",
//     displayName: "Sophie Rodriguez",
//     avatar: getRandomFile(103),
//     verified: true,
//     bio: "Food blogger | Recipe developer | Always hungry",
//     followers: 2580000,
//     following: 1247,
//     followedBy: {
//       displayItems: [
//         {
//           id: "5",
//           displayName: "Mike Brown",
//           avatar: getRandomFile(5),
//         },
//         {
//           id: "3",
//           displayName: "Alex Smith",
//           avatar: getRandomFile(3),
//         },
//       ],
//       count: 2,
//     },
//   },
//   {
//     id: "104",
//     username: "fitness_marcus",
//     displayName: "Marcus Johnson",
//     avatar: getRandomFile(104),
//     verified: true,
//     bio: "Personal trainer | Nutrition coach | Wellness advocate",
//     followers: 28937,
//     following: 921,
//   },
//   {
//     id: "105",
//     username: "artist_maya",
//     displayName: "Maya Patel",
//     avatar: getRandomFile(105),
//     verified: false,
//     bio: "Digital artist | Illustrator | Dreamer",
//     followers: 9642,
//     following: 1105,
//     followedBy: {
//       displayItems: [
//         {
//           id: "4",
//           displayName: "Sarah Jones",
//           avatar: getRandomFile(4),
//         },
//         {
//           id: "5",
//           displayName: "Mike Brown",
//           avatar: getRandomFile(5),
//         },
//         {
//           id: "2",
//           displayName: "Jane Doe",
//           avatar: getRandomFile(2),
//         },
//       ],
//       count: 67,
//     },
//   },
//   {
//     id: "106",
//     username: "music_noah",
//     displayName: "Noah Garcia",
//     avatar: getRandomFile(106),
//     verified: true,
//     bio: "Music producer | DJ | Creating vibes",
//     followers: 3500000000,
//     following: 758,
//     followedBy: {
//       displayItems: [
//         {
//           id: "1",
//           displayName: "John Doe",
//           avatar: getRandomFile(1),
//         },
//         {
//           id: "5",
//           displayName: "Mike Brown",
//           avatar: getRandomFile(5),
//         },
//         {
//           id: "3",
//           displayName: "Alex Smith",
//           avatar: getRandomFile(3),
//         },
//       ],
//       count: 15,
//     },
//   },
//   {
//     id: "107",
//     username: "writer_olivia",
//     displayName: "Olivia Thompson",
//     avatar: getRandomFile(107),
//     verified: false,
//     bio: "Novelist | Poet | Storyteller",
//     followers: 17382,
//     following: 623,
//     followedBy: {
//       displayItems: [
//         {
//           id: "3",
//           displayName: "Alex Smith",
//           avatar: getRandomFile(3),
//         },
//       ],
//       count: 1,
//     },
//   },
// ];

// Search history mock data
export const mockSearches: SearchItem[] = [
  {
    id: "1",
    type: "user" as const,
    username: "sophia_design",
    displayName: "Sophia Chen",
    avatar: getRandomFile("sophia_design"),
    verified: true,
  },
  {
    id: "2",
    type: "user" as const,
    username: "alex_walker",
    displayName: "Alex Walker",
    avatar: getRandomFile("alex_walker"),
    verified: false,
  },
  {
    id: "3",
    type: "user" as const,
    username: "dev_marcus",
    displayName: "Marcus Johnson",
    avatar: getRandomFile("dev_marcus"),
    verified: true,
  },
  {
    id: "4",
    type: "user" as const,
    username: "emily_photos",
    displayName: "Emily Rodriguez",
    avatar: getRandomFile("emily_photos"),
    verified: false,
  },
  {
    id: "5",
    type: "user" as const,
    username: "tech_jamie",
    displayName: "Jamie Williams",
    avatar: getRandomFile("tech_jamie"),
    verified: true,
  },
  {
    id: "6",
    type: "user" as const,
    username: "design_priya",
    displayName: "Priya Patel",
    avatar: getRandomFile("design_priya"),
    verified: false,
  },
  {
    id: "7",
    type: "user" as const,
    username: "travel_noah",
    displayName: "Noah Garcia",
    avatar: getRandomFile("travel_noah"),
    verified: true,
  },
  {
    id: "8",
    type: "user" as const,
    username: "coffee_zoe",
    displayName: "Zoe Thompson",
    avatar: getRandomFile("coffee_zoe"),
    verified: false,
  },
  {
    id: "9",
    type: "user" as const,
    username: "fitness_liam",
    displayName: "Liam Wilson",
    avatar: getRandomFile("fitness_liam"),
    verified: true,
  },
  {
    id: "10",
    type: "user" as const,
    username: "chef_olivia",
    displayName: "Olivia Martinez",
    avatar: getRandomFile("chef_olivia"),
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

export const mockNotifications = [
  {
    identity: {
      name: "Mei",
      avatar: getRandomFile("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 1,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 2,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 3,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomFile("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 4,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 5,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 6,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomFile("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 7,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 8,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 9,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomFile("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 10,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 11,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "3h",
    id: 12,
  },
  {
    identity: {
      name: "Mei",
      avatar: getRandomFile("mei"),
    },
    content:
      "Có đăng nhập vào tài khoản @ThnhNg81335456 của bạn từ một thiết bị mới trên Mar 26, 2025. Xem lại ngay.",
    timestamp: "1h",
    id: 13,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
    },
    content: "Thinh đã theo dõi bạn.",
    timestamp: "2h",
    id: 14,
  },
  {
    identity: {
      name: "Thinh",
      avatar: getRandomFile("thinh"),
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
