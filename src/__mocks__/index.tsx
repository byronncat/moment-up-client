import type { AccountInfo, MomentUI, SearchItem, UserInfo } from "api";

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
];

export function getRandomAvatar() {
  // Use a deterministic approach based on the current time in minutes
  // This ensures the same avatar is selected for the same minute
  const currentMinute = Math.floor(Date.now() / (1000 * 60));
  return avatar[currentMinute % avatar.length];
}

export function getUserAvatar(userId: number | string) {
  // Create a deterministic seed based on the user ID
  const seed =
    typeof userId === "string"
      ? userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : userId;
  return avatar[seed % avatar.length];
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
// Current user mock data
export const mockCurrentUsers: AccountInfo[] = [
  {
    id: "me",
    username: "ThinhNgo",
    displayName: "Thinh Ngo",
    avatar: getUserAvatar("hanoi"),
  },
  {
    id: "anotherMe",
    username: "BaoTrung",
    displayName: "Bao Trung",
    avatar: getUserAvatar("tu_pham"),
  },
];

export const mockMoments: MomentUI[] = [];
// export const mockMoments: MomentUI[] = [
//   {
//     id: 1,
//     user_id: "1",
//     username: "alice",
//     avatar:
//       "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 2,
//     user_id: "2",
//     username: "bob",
//     avatar: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GPwTSoQW8AA0aH2?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
//       },
//     ],
//     likes: 5678,
//     comments: 123,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 3,
//     user_id: "3",
//     username: "charlie",
//     avatar: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
//       },
//     ],
//     likes: 1500000,
//     comments: 8760,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 4,
//     user_id: "4",
//     username: "dan",
//     avatar: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
//       },
//     ],
//     likes: 2750000,
//     comments: 12500,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 5,
//     user_id: "5",
//     username: "eve",
//     avatar: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
//       },
//     ],
//     likes: 4200000000,
//     comments: 780000,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 6,
//     user_id: "6",
//     username: "frank",
//     avatar: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 7,
//     user_id: "7",
//     username: "george",
//     avatar: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 8,
//     user_id: "8",
//     username: "harry",
//     avatar:
//       "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 9,
//     user_id: "9",
//     username: "irene",
//     avatar:
//       "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 10,
//     user_id: "10",
//     username: "jose",
//     avatar:
//       "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 11,
//     user_id: "11",
//     username: "kate",
//     avatar:
//       "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 12,
//     user_id: "12",
//     username: "linda",
//     avatar:
//       "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "video",
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 13,
//     user_id: "13",
//     username: "mary",
//     avatar: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 14,
//     user_id: "14",
//     username: "nancy",
//     avatar:
//       "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 15,
//     user_id: "15",
//     username: "olivia",
//     avatar: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GnmzBjbbcAAn9Ou?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 16,
//     user_id: "16",
//     username: "pat",
//     avatar: getUserAvatar(16),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GkREMhqbAAIEd5S?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 17,
//     user_id: "17",
//     username: "pat",
//     avatar: getUserAvatar(17),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 177,
//     user_id: "177",
//     username: "pat",
//     avatar: getUserAvatar(177),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 19,
//     user_id: "19",
//     username: "pat",
//     avatar: getUserAvatar(19),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 20,
//     user_id: "20",
//     username: "pat",
//     avatar: getUserAvatar(20),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GoXF5VOXcAA5W_F?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 21,
//     user_id: "21",
//     username: "pat",
//     avatar: getUserAvatar(21),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 22,
//     user_id: "22",
//     username: "pat",
//     avatar: getUserAvatar(22),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
//   {
//     id: 23,
//     user_id: "23",
//     username: "pat",
//     avatar: getUserAvatar(23),
//     text: "Beautiful day at the beach 🌊",
//     files: [
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
//       },
//       {
//         type: "image",
//         url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
//       },
//     ],
//     likes: 1234,
//     comments: 45,
//     created_at: new Date(),
//     isLiked: false,
//   },
// ];

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
    id: 1,
    type: "user" as const,
    username: "sophia_design",
    displayName: "Sophia Chen",
    avatar: getUserAvatar("sophia_design"),
    verified: true,
  },
  {
    id: 2,
    type: "user" as const,
    username: "alex_walker",
    displayName: "Alex Walker",
    avatar: getUserAvatar("alex_walker"),
    verified: false,
  },
  {
    id: 3,
    type: "user" as const,
    username: "dev_marcus",
    displayName: "Marcus Johnson",
    avatar: getUserAvatar("dev_marcus"),
    verified: true,
  },
  {
    id: 4,
    type: "user" as const,
    username: "emily_photos",
    displayName: "Emily Rodriguez",
    avatar: getUserAvatar("emily_photos"),
    verified: false,
  },
  {
    id: 5,
    type: "user" as const,
    username: "tech_jamie",
    displayName: "Jamie Williams",
    avatar: getUserAvatar("tech_jamie"),
    verified: true,
  },
  {
    id: 6,
    type: "user" as const,
    username: "design_priya",
    displayName: "Priya Patel",
    avatar: getUserAvatar("design_priya"),
    verified: false,
  },
  {
    id: 7,
    type: "user" as const,
    username: "travel_noah",
    displayName: "Noah Garcia",
    avatar: getUserAvatar("travel_noah"),
    verified: true,
  },
  {
    id: 8,
    type: "user" as const,
    username: "coffee_zoe",
    displayName: "Zoe Thompson",
    avatar: getUserAvatar("coffee_zoe"),
    verified: false,
  },
  {
    id: 9,
    type: "user" as const,
    username: "fitness_liam",
    displayName: "Liam Wilson",
    avatar: getUserAvatar("fitness_liam"),
    verified: true,
  },
  {
    id: 10,
    type: "user" as const,
    username: "chef_olivia",
    displayName: "Olivia Martinez",
    avatar: getUserAvatar("chef_olivia"),
    verified: false,
  },
  {
    id: 11,
    type: "search" as const,
    query: "design inspiration",
  },
  {
    id: 12,
    type: "search" as const,
    query: "travel destinations 2024",
  },
  {
    id: 13,
    type: "search" as const,
    query: "coding bootcamp reviews",
  },
  { id: 14, type: "hashtag" as const, tag: "travel", count: 1223 },
  { id: 15, type: "hashtag" as const, tag: "photography", count: 945 },
  { id: 16, type: "hashtag" as const, tag: "nature", count: 876 },
  { id: 17, type: "hashtag" as const, tag: "food", count: 732 },
  { id: 18, type: "hashtag" as const, tag: "art", count: 625 },
  { id: 19, type: "hashtag" as const, tag: "fashion", count: 589 },
  { id: 20, type: "hashtag" as const, tag: "fitness", count: 478 },
  { id: 21, type: "hashtag" as const, tag: "music", count: 412 },
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

// Trending topics mock data
export const mockTrendingTopics = [
  {
    id: 1,
    name: "Hoyo",
    category: "Trending",
    posts: 8193,
  },
  {
    id: 2,
    name: "Kuro",
    category: "Gaming · Trending",
    posts: 1250000,
  },
  {
    id: 3,
    name: "Genshin",
    category: "Gaming · Trending",
    posts: 42400000,
  },
  {
    id: 4,
    name: "ardelle h'ad",
    category: "Trending in Vietnam",
    posts: 3500000000,
  },
  {
    id: 5,
    name: "Anthony Pompliano",
    category: "From the Desk of Anthony Pompliano",
    posts: 3000,
    isLive: true,
    avatar: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
  },
];
