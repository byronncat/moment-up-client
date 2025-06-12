import type {
  AccountInfo,
  DetailedMoment,
  SearchItem,
  UserCardInfo,
  FeedNotification,
  FeedInfo,
  ProfileInfo,
  Notification,
  ProfileCardInfo,
} from "api";
import { HashtagItem } from "schema";
import sound1 from "./1.mp3";
import sound2 from "./2.mp3";

const isDev = process.env.NODE_ENV === "development";

const avatar = isDev
  ? [
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
    ]
  : [];

const backgroundImg = isDev
  ? [
      "https://pbs.twimg.com/media/GjlpiyBaIAENj43?format=jpg&name=large",
      "https://pbs.twimg.com/media/GRn1_2AaUAAT7JU?format=jpg&name=4096x4096",
    ]
  : [];

const audio = [sound1, sound2];

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
  if (type === "audio") return audio[seed % audio.length];
  return avatar[seed % avatar.length];
}

export const mockFeeds: FeedNotification[] = [
  {
    id: "033794b7-df1f-4d8b-b42e-64b980f303fd",
    userId: "5f93e68e-aeeb-4246-a7a0-adf033c1b03c",
    displayName: "Scotti Wilds",
    avatar: getRandomFile("5f93e68e-aeeb-4246-a7a0-adf033c1b03c"),
    viewed: false,
    latestFeedTime: new Date("10/28/2024"),
  },
  {
    id: "ed4e3c51-fbc3-45e7-a84b-9f7aa6cf8b5e",
    userId: "c725caa6-63f4-48e3-bc5e-a2b435799590",
    displayName: "Emmalyn Riguard",
    avatar: getRandomFile("c725caa6-63f4-48e3-bc5e-a2b435799590"),
    viewed: true,
    latestFeedTime: new Date("1/26/2025"),
  },
  {
    id: "edad6651-dde3-4505-857d-3506b3a1d67a",
    userId: "6d9ac04f-dea5-477a-876a-265f236c9f33",
    displayName: "Glenn Maddison",
    avatar: getRandomFile("6d9ac04f-dea5-477a-876a-265f236c9f33"),
    viewed: true,
    latestFeedTime: new Date("10/24/2024"),
  },
  {
    id: "fefddf01-93f5-4f75-baae-0dcea6fde3de",
    userId: "2a70eafb-81b5-48f7-ac2e-6710aaad390d",
    displayName: "Wallis Klimecki",
    avatar: getRandomFile("2a70eafb-81b5-48f7-ac2e-6710aaad390d"),
    viewed: false,
    latestFeedTime: new Date("5/31/2024"),
  },
  {
    id: "c9293268-8fc7-4a52-b4cd-b1c7c53410a8",
    userId: "a4d27e3a-61d2-4a54-ba98-6d005632c0b3",
    displayName: "Tannie Normanville",
    avatar: getRandomFile("a4d27e3a-61d2-4a54-ba98-6d005632c0b3"),
    viewed: false,
    latestFeedTime: new Date("1/16/2025"),
  },
  {
    id: "1d86b12d-c764-4de4-a8b8-81c3c01d4fda",
    userId: "a0e20552-439f-42ba-9c59-060083501cfe",
    displayName: "Haleigh Brodley",
    avatar: getRandomFile("a0e20552-439f-42ba-9c59-060083501cfe"),
    viewed: false,
    latestFeedTime: new Date("4/3/2025"),
  },
  {
    id: "765d396b-c3d8-4dd3-878d-5654be131a02",
    userId: "32afbf0e-8298-477e-8269-506bf5997d46",
    displayName: "Noach Wilsey",
    avatar: getRandomFile("32afbf0e-8298-477e-8269-506bf5997d46"),
    viewed: false,
    latestFeedTime: new Date("8/1/2024"),
  },
  {
    id: "b432afac-4752-4f4e-ba4d-10b6ede9d3bf",
    userId: "648f9e3f-9ad2-4e30-9064-780e0f13f5e2",
    displayName: "Carree Negri",
    avatar: getRandomFile("648f9e3f-9ad2-4e30-9064-780e0f13f5e2"),
    viewed: true,
    latestFeedTime: new Date("5/28/2024"),
  },
  {
    id: "1388d404-55dc-4b0b-9082-fe6a7733d5ab",
    userId: "564f8288-c6d4-465a-aa0a-f96ba7a2336b",
    displayName: "Cleve Matskevich",
    avatar: getRandomFile("564f8288-c6d4-465a-aa0a-f96ba7a2336b"),
    viewed: true,
    latestFeedTime: new Date("1/17/2025"),
  },
  {
    id: "08ed2e00-4dc4-4466-8c84-c0ce27bac584",
    userId: "dd1f5358-e0fd-462a-9ef2-725b7ff5762c",
    displayName: "Pammy Melby",
    avatar: getRandomFile("dd1f5358-e0fd-462a-9ef2-725b7ff5762c"),
    viewed: false,
    latestFeedTime: new Date("9/25/2024"),
  },
  {
    id: "976908be-7129-48db-9f26-ddcda7937412",
    userId: "e2afcdea-9472-4bf5-9929-e1006a240043",
    displayName: "Dorelle Castelow",
    avatar: getRandomFile("e2afcdea-9472-4bf5-9929-e1006a240043"),
    viewed: true,
    latestFeedTime: new Date("9/1/2024"),
  },
  {
    id: "1f3be3fa-72ed-4236-afa7-2b150fe76df2",
    userId: "d5b7a123-dc9f-4b34-b65f-bb57259bf8f9",
    displayName: "Antony Taffe",
    avatar: getRandomFile("d5b7a123-dc9f-4b34-b65f-bb57259bf8f9"),
    viewed: true,
    latestFeedTime: new Date("6/28/2024"),
  },
  {
    id: "5fbe4b6d-2c5d-40bd-9d8d-f19fc4a072ef",
    userId: "15beb04c-4df3-4bde-828e-914b02b340e2",
    displayName: "Ginni Hestrop",
    avatar: getRandomFile("15beb04c-4df3-4bde-828e-914b02b340e2"),
    viewed: true,
    latestFeedTime: new Date("4/11/2025"),
  },
  {
    id: "a07c5630-d4e3-4ae4-93bb-c4e931259a76",
    userId: "3fbc69e7-3d1a-4946-ae8c-790db31ceb6d",
    displayName: "Kelsey Mattiazzo",
    avatar: getRandomFile("3fbc69e7-3d1a-4946-ae8c-790db31ceb6d"),
    viewed: true,
    latestFeedTime: new Date("3/10/2025"),
  },
  {
    id: "b22bfa1e-a282-468a-95eb-78002df79868",
    userId: "22fe505f-0517-43c7-99d2-0a5ef80c6f9f",
    displayName: "Laurena Szimoni",
    avatar: getRandomFile("22fe505f-0517-43c7-99d2-0a5ef80c6f9f"),
    viewed: true,
    latestFeedTime: new Date("8/17/2024"),
  },
  {
    id: "1dfa7dc6-8c67-4a6b-991d-14f24de988e9",
    userId: "d1e65277-e60c-41bd-baaa-5d401d60240c",
    displayName: "Bev Dod",
    avatar: getRandomFile("d1e65277-e60c-41bd-baaa-5d401d60240c"),
    viewed: false,
    latestFeedTime: new Date("5/10/2024"),
  },
];

export const mockSearches: SearchItem[] = [
  {
    id: "45d49f7d-d07f-4eae-abcf-2f61ced287a2",
    type: "user" as const,
    username: "mbontoft0",
    displayName: "Mac Bontoft",
    avatar: getRandomFile("45d49f7d-d07f-4eae-abcf-2f61ced287a2"),
    verified: true,
  },
  {
    id: "hello",
    type: "hashtag" as const,
    count: 100,
  },
  {
    id: "7ptf82a-0407-4fa4-9fdf-106a681tttt6c",
    type: "search" as const,
    query: "general",
  },
  {
    id: "7b0bf82a-0407-4fa4-9fdf-106a681a626c",
    type: "user" as const,
    username: "ssauven1",
    displayName: "Stanislaw Sauven",
    avatar: getRandomFile("7b0bf82a-0407-4fa4-9fdf-106a681a626c"),
    verified: false,
  },
  {
    id: "e0e16793-c56f-4456-80d9-9767d5e3c3da",
    type: "user" as const,
    username: "ahaccleton2",
    displayName: "Aurie Haccleton",
    avatar: getRandomFile("e0e16793-c56f-4456-80d9-9767d5e3c3da"),
    verified: true,
  },
  {
    id: "d576a73e-b60e-46ba-947f-9807a63cc997",
    type: "search" as const,
    query: "software",
  },
  {
    id: "261c65cb-4646-47ba-a65a-262d7242ee9f",
    type: "user" as const,
    username: "droderham3",
    displayName: "Dannie Roderham",
    avatar: getRandomFile("261c65cb-4646-47ba-a65a-262d7242ee9f"),
    verified: true,
  },
  {
    id: "4bef2e89-8dc0-4dd4-8b82-219b13d4ae0d",
    type: "user" as const,
    username: "tronald4",
    displayName: "Timmie Ronald",
    avatar: getRandomFile("4bef2e89-8dc0-4dd4-8b82-219b13d4ae0d"),
    verified: false,
  },
  {
    id: "16280b1f-3118-44f7-8f94-bfc3d30919fd",
    type: "search" as const,
    query: "education",
  },
  {
    id: "60edd744-11e7-497f-9077-491a49369b18",
    type: "user" as const,
    username: "hhartley5",
    displayName: "Hyacinthe Hartley",
    avatar: getRandomFile("60edd744-11e7-497f-9077-491a49369b18"),
    verified: true,
  },
  {
    type: "hashtag" as const,
    id: "faucibus",
    count: 967001,
  },
  {
    type: "hashtag" as const,
    id: "maecenas",
    count: 773000,
  },
  {
    id: "382d48f6-a932-410b-8309-ff0b9b6024e4",
    type: "user" as const,
    username: "vblacklock6",
    displayName: "Virginie Blacklock",
    avatar: getRandomFile("382d48f6-a932-410b-8309-ff0b9b6024e4"),
    verified: true,
  },
  {
    id: "766e49e6-46b7-4104-bfa1-aed763262d57",
    type: "user" as const,
    username: "jsevern7",
    displayName: "Justin Severn",
    avatar: getRandomFile("766e49e6-46b7-4104-bfa1-aed763262d57"),
    verified: false,
  },
  {
    id: "41e5323f-0ce9-4d37-a8db-46d4ca0a8809",
    type: "user" as const,
    username: "bakers8",
    displayName: "Berry Akers",
    avatar: getRandomFile("41e5323f-0ce9-4d37-a8db-46d4ca0a8809"),
    verified: false,
  },
  {
    id: "a2f41718-2ddb-4c03-bdda-f80c5373cd96",
    type: "user" as const,
    username: "smcwilliam9",
    displayName: "Spense McWilliam",
    avatar: getRandomFile("a2f41718-2ddb-4c03-bdda-f80c5373cd96"),
    verified: true,
  },
  {
    type: "hashtag" as const,
    id: "purus",
    count: 502053,
  },
  {
    type: "hashtag" as const,
    id: "bibendum",
    count: 999040,
  },
  {
    type: "hashtag" as const,
    id: "morbi",
    count: 580656,
  },
  {
    id: "6934603c-5bd1-40c5-a298-3d0cde2de578",
    type: "user" as const,
    username: "bsantea",
    displayName: "Bernetta Sante",
    avatar: getRandomFile("6934603c-5bd1-40c5-a298-3d0cde2de578"),
    verified: true,
  },
  {
    id: "c6ad53bf-1252-4911-bef7-a9bb13f26aed",
    type: "user" as const,
    username: "mpackingtonb",
    displayName: "Morse Packington",
    avatar: getRandomFile("c6ad53bf-1252-4911-bef7-a9bb13f26aed"),
    verified: false,
  },
  {
    type: "hashtag" as const,
    id: "diam",
    count: 785210,
  },
  {
    type: "hashtag" as const,
    id: "nascetur",
    count: 771306,
  },
  {
    type: "hashtag" as const,
    id: "vestibulum",
    count: 560842,
  },
  {
    type: "hashtag" as const,
    id: "amet",
    count: 262813,
  },
  {
    type: "hashtag" as const,
    id: "nec",
    count: 576860,
  },
  {
    type: "hashtag" as const,
    id: "ultrices",
    count: 698670,
  },
  {
    type: "hashtag" as const,
    id: "vel",
    count: 797545,
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

export const mockMoments: DetailedMoment[] = isDev
  ? [
      {
        id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c",
        user: {
          id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt. Integer lectus tortor, sollicitudin consequat est id, ultrices gravida neque. Etiam congue arcu quam.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "c4b07087-f164-405d-86ac-4b54870b29d3",
        user: {
          id: "c4b07087-f164-405d-86ac-4b54870b29d3",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("c4b07087-f164-405d-86ac-4b54870b29d3"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
              aspect_ratio: "1:1",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "e449b4ff-3f2c-4ffc-ba19-244f918b2662",
        user: {
          id: "e449b4ff-3f2c-4ffc-ba19-244f918b2662",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("e449b4ff-3f2c-4ffc-ba19-244f918b2662"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
              aspect_ratio: "1:1",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "73a1e6f0-12ce-49bc-b393-ed42599ef2a9",
        user: {
          id: "73a1e6f0-12ce-49bc-b393-ed42599ef2a9",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("73a1e6f0-12ce-49bc-b393-ed42599ef2a9"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
              aspect_ratio: "1.91:1",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "d807583d-69c5-4a00-8927-ba263cd100fb",
        user: {
          id: "d807583d-69c5-4a00-8927-ba263cd100fb",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("d807583d-69c5-4a00-8927-ba263cd100fb"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GoFJ8_PbYAAGVxY?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "da8a84c3-4ed5-4751-b1cd-9fade2f20fa2",
        user: {
          id: "da8a84c3-4ed5-4751-b1cd-9fade2f20fa2",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("da8a84c3-4ed5-4751-b1cd-9fade2f20fa2"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "6",
              type: "image",
              url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "54a7ea30-66a9-444e-aaf4-20d44ec7f10b",
        user: {
          id: "54a7ea30-66a9-444e-aaf4-20d44ec7f10b",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("54a7ea30-66a9-444e-aaf4-20d44ec7f10b"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "ce90e671-35b8-4ed9-bcba-5951861851a3",
        user: {
          id: "ce90e671-35b8-4ed9-bcba-5951861851a3",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("ce90e671-35b8-4ed9-bcba-5951861851a3"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Fi2-RJ9acAA7gYr?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "96f6153d-87be-43df-a602-2c31bcafda3b",
        user: {
          id: "96f6153d-87be-43df-a602-2c31bcafda3b",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("96f6153d-87be-43df-a602-2c31bcafda3b"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "7aaabed3-d3b1-4db3-a979-55e3ce0551c2",
        user: {
          id: "7aaabed3-d3b1-4db3-a979-55e3ce0551c2",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("7aaabed3-d3b1-4db3-a979-55e3ce0551c2"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "d3c53881-ddb9-423e-bcd3-b206feedc085",
        user: {
          id: "d3c53881-ddb9-423e-bcd3-b206feedc085",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("d3c53881-ddb9-423e-bcd3-b206feedc085"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "fcdacfcb-630c-43ca-a7a7-68bac9592e07",
        user: {
          id: "fcdacfcb-630c-43ca-a7a7-68bac9592e07",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("fcdacfcb-630c-43ca-a7a7-68bac9592e07"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "c2a29470-68ff-4e07-a7eb-726bddd2d7f7",
        user: {
          id: "c2a29470-68ff-4e07-a7eb-726bddd2d7f7",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("c2a29470-68ff-4e07-a7eb-726bddd2d7f7"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "4a6918cb-7af3-4aba-9fe5-430addd54d84",
        user: {
          id: "4a6918cb-7af3-4aba-9fe5-430addd54d84",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("4a6918cb-7af3-4aba-9fe5-430addd54d84"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Gs_YbumagAAJKWg?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GtErX2oaIAAUAwM?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "a0fa3c9e-11da-43b8-92cf-090e69e8bd39",
        user: {
          id: "a0fa3c9e-11da-43b8-92cf-090e69e8bd39",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("a0fa3c9e-11da-43b8-92cf-090e69e8bd39"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
      {
        id: "0f4aeda5-7217-45c7-998c-3c8087bf8531",
        user: {
          id: "0f4aeda5-7217-45c7-998c-3c8087bf8531",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("0f4aeda5-7217-45c7-998c-3c8087bf8531"),
          verified: false,
          followers: 1000,
          following: 1000,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
              aspect_ratio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/FgzKZewagAAtE2G?format=jpg&name=large",
              aspect_ratio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          created_at: new Date(),
          isLiked: false,
          isBookmarked: false
        },
      },
    ]
  : // ? [
    //     {
    //       id: "a9a6d7c2-1e20-2439-a50b-51a1deh131da1",
    //       user: {
    //         id: "a9a6d7c2-1e20-2439-a50b-51a1deh131da1",
    //         username: "byronat445",
    //         displayName: "Justin Severn",
    //         avatar:
    //           "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 4235,
    //         following: 423,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar nisl et turpis ultrices, nec convallis mauris ultricies. Morbi sed magna fringilla, pretium nisl non, ultricies diam. Ut euismod semper massa id convallis. Phasellus a viverra diam, ut tincidunt quam. Integer nulla risus, laoreet ut mattis non, suscipit sed ante. Mauris vehicula odio felis, ac convallis lacus posuere vitae. Integer a congue leo, vel finibus sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    //         likes: 4235,
    //         comments: 423,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "a9a6d7c2-1e20-2439-a50b-51a1dtt45da1",
    //       user: {
    //         id: "a9a6d7c2-1e20-2439-a50b-51a1dtt45da1",
    //         username: "byronat445",
    //         displayName: "Justin Severn",
    //         avatar:
    //           "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 4235,
    //         following: 423,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar nisl et.",
    //         likes: 4235,
    //         comments: 423,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "a9a6d7c2-1e20-4439-a60b-51a188131da1",
    //       user: {
    //         id: "a9a6d7c2-1e20-4439-a60b-51a188131da1",
    //         username: "gespine0",
    //         displayName: "Guillema Espine",
    //         avatar:
    //           "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 5533,
    //         following: 30849,
    //         hasFeed: true,
    //       },
    //       post: {
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "f3d246a4-61f3-4b6e-a0ac-bac29a2b5b0e",
    //       user: {
    //         id: "f3d246a4-61f3-4b6e-a0ac-bac29a2b5b0e",
    //         username: "rgland1",
    //         displayName: "Rhodia Gland",
    //         avatar:
    //           "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
    //         verified: false,
    //         followers: 825084,
    //         following: 51202,
    //         hasFeed: false,
    //       },
    //       post: {
    //         text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar nisl et turpis ultrices, nec convallis mauris ultricies. Morbi sed magna fringilla, pretium nisl non, ultricies diam. Ut euismod semper massa id convallis. Phasellus a viverra diam, ut tincidunt quam. Integer nulla risus, laoreet ut mattis non, suscipit sed ante. Mauris vehicula odio felis, ac convallis lacus posuere vitae. Integer a congue leo, vel finibus sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GPwTSoQW8AA0aH2?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 5678,
    //         comments: 123,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "3",
    //       user: {
    //         id: "3",
    //         username: "charlie",
    //         displayName: "Charlie",
    //         avatar:
    //           "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
    //         verified: true,
    //         followers: 1500000,
    //         following: 2000,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1500000,
    //         comments: 8760,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "4",
    //       user: {
    //         id: "4",
    //         username: "dan",
    //         displayName: "Dan",
    //         avatar:
    //           "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
    //         verified: false,
    //         followers: 2750000,
    //         following: 1500,
    //         hasFeed: false,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 2750000,
    //         comments: 12500,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "5",
    //       user: {
    //         id: "5",
    //         username: "eve",
    //         displayName: "Eve",
    //         avatar:
    //           "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
    //         verified: true,
    //         followers: 4200000000,
    //         following: 2500,
    //         hasFeed: false,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GjPNWTNb0AAZvar?format=jpg&name=medium",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 4200000000,
    //         comments: 780000,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "6",
    //       user: {
    //         id: "6",
    //         username: "byronat445",
    //         displayName: "Frank",
    //         avatar:
    //           "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "aefa5f0b-ff4d-47a9-a6ad-25d5a0ef9ff6",
    //       user: {
    //         id: "aefa5f0b-ff4d-47a9-a6ad-25d5a0ef9ff6",
    //         username: "oshirase_gan",
    //         displayName: "千里GAN(活動縮小中",
    //         avatar: getRandomFile("aefa5f0b-ff4d-47a9-a6ad-25d5a0ef9ff6"),
    //         verified: true,
    //         followers: 86,
    //         following: 191,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: backgroundImg[1],
    //             aspect_ratio: "1.91:1",
    //           },
    //         ],
    //         likes: 943,
    //         comments: 142,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "7",
    //       user: {
    //         id: "7",
    //         username: "george",
    //         displayName: "George",
    //         avatar:
    //           "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "8",
    //       user: {
    //         id: "8",
    //         username: "byronat445",
    //         displayName: "Harry",
    //         avatar:
    //           "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "9",
    //       user: {
    //         id: "9",
    //         username: "irene",
    //         displayName: "Irene",
    //         avatar:
    //           "https://pbs.twimg.com/media/GgwpklCa0AA8MkD?format=jpg&name=4096x4096",
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgwpklCa0AA8MkD?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "10",
    //       user: {
    //         id: "10",
    //         username: "byronat445",
    //         displayName: "Jose",
    //         avatar:
    //           "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "11",
    //       user: {
    //         id: "11",
    //         username: "kate",
    //         displayName: "Kate",
    //         avatar:
    //           "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgHsZ5vakAAz5jI?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "4",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "12",
    //       user: {
    //         id: "12",
    //         username: "linda",
    //         displayName: "Linda",
    //         avatar:
    //           "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "video",
    //             url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    //             aspect_ratio: "1.91:1",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgHsgp1bQAAZcyW?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "13",
    //       user: {
    //         id: "13",
    //         username: "mary",
    //         displayName: "Mary",
    //         avatar:
    //           "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "14",
    //       user: {
    //         id: "14",
    //         username: "nancy",
    //         displayName: "Nancy",
    //         avatar:
    //           "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GPYqzecbsAAy4Ie?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "15",
    //       user: {
    //         id: "15",
    //         username: "olivia",
    //         displayName: "Olivia",
    //         avatar:
    //           "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "ec85c1c0-0416-4bf9-82fc-f0a7bb3e492d",
    //       user: {
    //         id: "ec85c1c0-0416-4bf9-82fc-f0a7bb3e492d",
    //         username: "pat",
    //         displayName: "Pat",
    //         avatar: getRandomFile("ec85c1c0-0416-4bf9-82fc-f0a7bb3e492d"),
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "61561c89-eb6f-4b70-bb0a-0ff75c0f89a9",
    //       user: {
    //         id: "61561c89-eb6f-4b70-bb0a-0ff75c0f89a9",
    //         username: "mharris5",
    //         displayName: "Maggie Harris",
    //         avatar: getRandomFile("61561c89-eb6f-4b70-bb0a-0ff75c0f89a9"),
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "b81ef1c7-dc91-484a-a38f-4efc3bcef406",
    //       user: {
    //         id: "b81ef1c7-dc91-484a-a38f-4efc3bcef406",
    //         username: "owasielewskib",
    //         displayName: "Osbourn Wasielewski",
    //         avatar: getRandomFile("b81ef1c7-dc91-484a-a38f-4efc3bcef40"),
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "4",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "5",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "741dba63-27a7-43b8-b6fd-2cecd4ad5a9b",
    //       user: {
    //         id: "741dba63-27a7-43b8-b6fd-2cecd4ad5a9b",
    //         username: "imarchantc",
    //         displayName: "Idalina Marchant",
    //         avatar: getRandomFile("741dba63-27a7-43b8-b6fd-2cecd4ad5a9b"),
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GfxwRq7a4AAlY6S?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "2b15a77e-fd97-445c-8056-344b7d1df5c2",
    //       user: {
    //         id: "2b15a77e-fd97-445c-8056-344b7d1df5c2",
    //         username: "sabbat",
    //         displayName: "Sam Abba",
    //         avatar: getRandomFile("2b15a77e-fd97-445c-8056-344b7d1df5c2"),
    //         verified: false,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GoXF5VOXcAA5W_F?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "4",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 363127,
    //         comments: 455,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "80a35216-a718-4238-b35d-e2ba95f6f43",
    //       user: {
    //         id: "80a35216-a718-4238-b35d-e2ba95f6f43",
    //         username: "wcotmank",
    //         displayName: "Wendie Cotman",
    //         avatar: getRandomFile("80a35216-a718-4238-b35d-e2ba95f6f43"),
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "86843c49-8cff-4671-baf5-b3cafd66b9bb",
    //       user: {
    //         id: "86843c49-8cff-4671-baf5-b3cafd66b9bb",
    //         username: "habelsf",
    //         displayName: "Hildagard Abels",
    //         avatar: getRandomFile("86843c49-8cff-4671-baf5-b3cafd66b9b"),
    //         verified: false,
    //         followers: 227776,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=medium",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 227776,
    //         comments: 86168,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "4010887c-e1cc-47a7-abd4-616cdd80f3e5",
    //       user: {
    //         id: "4010887c-e1cc-47a7-abd4-616cdd80f3e5",
    //         username: "alidgertwoodd",
    //         displayName: "Allys Lidgertwood",
    //         avatar: getRandomFile("4010887c-e1cc-47a7-abd4-616cdd80f3e5"),
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: false,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "9010887c-e1cc-47a7-abd4-616cdd80f3e5",
    //       user: {
    //         id: "9010887c-e1cc-47a7-abd4-616cdd80f3e5",
    //         username: "alidgertwoodd",
    //         displayName: "Allys Lidgertwood",
    //         avatar: getRandomFile("9010887c-e1cc-47a7-abd4-616cdd80f3e5"),
    //         verified: true,
    //         followers: 1234,
    //         following: 567,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/FTwr23WVIAA9yL3?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/FgzKZewagAAtE2G?format=jpg&name=large",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "3",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/Fqcy-h5aYAEUvQ3?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 1234,
    //         comments: 45,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "0c140867-69dc-4181-93de-f4aec644d1b0",
    //       user: {
    //         id: "0c140867-69dc-4181-93de-f4aec644d1b0",
    //         username: "alidgertwoodd",
    //         displayName: "Allys Lidgertwood",
    //         avatar: getRandomFile("0c140867-69dc-4181-93de-f4aec644d1b0"),
    //         verified: true,
    //         followers: 186,
    //         following: 26,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GKYSLwTaAAA7Uu9?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //           {
    //             id: "2",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GEwApvjaMAAX2R6?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 2320,
    //         comments: 3757,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "746c9f5c-1676-48e7-9fdc-cf5db40c2a3c",
    //       user: {
    //         id: "746c9f5c-1676-48e7-9fdc-cf5db40c2a3c",
    //         username: "alidgertwoodd",
    //         displayName: "Allys Lidgertwood",
    //         avatar: getRandomFile("746c9f5c-1676-48e7-9fdc-cf5db40c2a3c"),
    //         verified: true,
    //         followers: 86,
    //         following: 191,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GqGfFSebwAAxT4c?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 3234,
    //         comments: 57,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "14d62a13-3a63-4486-9af4-dd149279c2db",
    //       user: {
    //         id: "14d62a13-3a63-4486-9af4-dd149279c2db",
    //         username: "alidgertwoodd",
    //         displayName: "Allys Lidgertwood",
    //         avatar: getRandomFile("14d62a13-3a63-4486-9af4-dd149279c2db"),
    //         verified: true,
    //         followers: 86,
    //         following: 191,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GqGfFSebwAAxT4c?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 943,
    //         comments: 142,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "0be4e5fe-49ac-4d55-aee1-dab7d4b5a5bf",
    //       user: {
    //         id: "0be4e5fe-49ac-4d55-aee1-dab7d4b5a5bf",
    //         username: "luts7602",
    //         displayName: "manda",
    //         avatar: getRandomFile("0be4e5fe-49ac-4d55-aee1-dab7d4b5a5bf"),
    //         verified: true,
    //         followers: 86,
    //         following: 191,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: "https://pbs.twimg.com/media/GjZDOyAa8AArPqh?format=jpg&name=4096x4096",
    //             aspect_ratio: "4:5",
    //           },
    //         ],
    //         likes: 943,
    //         comments: 142,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //     {
    //       id: "e2f55ce8-f2fb-47e0-a739-40cba7885b62",
    //       user: {
    //         id: "e2f55ce8-f2fb-47e0-a739-40cba7885b62",
    //         username: "n_n_nima",
    //         displayName: "nima",
    //         avatar: getRandomFile("e2f55ce8-f2fb-47e0-a739-40cba7885b62"),
    //         verified: true,
    //         followers: 86,
    //         following: 191,
    //         hasFeed: true,
    //       },
    //       post: {
    //         text: "Beautiful day at the beach 🌊",
    //         files: [
    //           {
    //             id: "1",
    //             type: "image",
    //             url: backgroundImg[0],
    //             aspect_ratio: "1.91:1",
    //           },
    //         ],
    //         likes: 943,
    //         comments: 142,
    //         created_at: new Date(),
    //         isLiked: false,
    //       },
    //     },
    //   ]
    [];

export const mockProfile: ProfileInfo = {
  id: "a9a6d7c2-1e20-2439-a50b-51a1deh131da1",
  username: "byronat445",
  displayName: "Byron Atwood",
  avatar: getRandomFile("byronat445"),
  backgroundImage: isDev
    ? "https://pbs.twimg.com/media/GjlpiyBaIAENj43?format=jpg&name=large"
    : undefined,
  hasFeed: true,
  bio: "I'm a software engineer and a coffee addict.",
  verified: true,
  followers: 1234,
  following: 567,
};

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

export const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "1",
    created_at: new Date(),
    type: "security",
    information: "login",
  },
  {
    id: "2",
    user_id: "1",
    created_at: new Date(),
    type: "community",
    information: {
      type: "post",
      avatar: getRandomFile("byronat445"),
      displayName: "Byron Atwood",
      content: "Hello, how are you?",
    },
  },
  {
    id: "3",
    user_id: "1",
    created_at: new Date(),
    type: "community",
    information: {
      type: "mention",
      avatar: getRandomFile("ethan_byler"),
      displayName: "Ethan Byler",
      content: "That's me. Then, how about **Byron Atwood**?",
    },
  },
  {
    id: "4",
    user_id: "1",
    created_at: new Date(),
    type: "community",
    information: {
      type: "follow",
      avatar: getRandomFile("yuna"),
      displayName: "Yuna",
    },
  },
];

// Aside
export const mockPopularAccounts: ProfileCardInfo[] = [
  {
    id: "057b50c5-4646-42bf-98ea-933c108f2671",
    username: "wbale0",
    displayName: "Werner Bale",
    avatar: getRandomFile("057b50c5-4646-42bf-98ea-933c108f2671"),
    verified: true,
    bio: "Travel photographer | Adventure seeker | Coffee enthusiast",
    backgroundImage: backgroundImg[0],
  },
  {
    id: "ca0f9eb5-c789-4e50-9f8c-457ff3b9f964",
    username: "tech_jason",
    displayName: "Jason Chen",
    avatar: getRandomFile("ca0f9eb5-c789-4e50-9f8c-457ff3b9f964"),
    verified: false,
  },
  {
    id: "90946704-51dc-4a73-9f56-99531bc3db7b",
    username: "foodie_sophie",
    displayName: "Sophie Rodriguez",
    avatar: getRandomFile("90946704-51dc-4a73-9f56-99531bc3db7b"),
    verified: true,
    bio: "Food blogger | Recipe developer | Always hungry",
    backgroundImage: backgroundImg[1],
  },
  {
    id: "92a1e004-8ddf-46ab-8811-28a6e1bb7a60",
    username: "fitness_marcus",
    displayName: "Marcus Johnson",
    avatar: getRandomFile("92a1e004-8ddf-46ab-8811-28a6e1bb7a60"),
    verified: true,
    bio: "Personal trainer | Nutrition coach | Wellness advocate",
    backgroundImage: backgroundImg[1],
  },
];

export const mockSuggestedUsers: UserCardInfo[] = [
  {
    id: "057b50c5-4646-42bf-98ea-933c108f2671",
    username: "wbale0",
    displayName: "Werner Bale",
    avatar: getRandomFile("057b50c5-4646-42bf-98ea-933c108f2671"),
    verified: true,
    bio: "Travel photographer | Adventure seeker | Coffee enthusiast",
    followers: 642249,
    following: 236261,
    hasFeed: true,
    followedBy: {
      displayItems: [
        {
          id: "8b7c2c17-a3be-47db-b2c6-3070d6b93c96",
          displayName: "Cesar Sloan",
          avatar: getRandomFile("8b7c2c17-a3be-47db-b2c6-3070d6b93c96"),
        },
      ],
      count: 1,
    },
  },
  {
    id: "ca0f9eb5-c789-4e50-9f8c-457ff3b9f964",
    username: "tech_jason",
    displayName: "Jason Chen",
    avatar: getRandomFile("ca0f9eb5-c789-4e50-9f8c-457ff3b9f964"),
    verified: false,
    followers: 725940,
    following: 532,
    hasFeed: true,
  },
  {
    id: "90946704-51dc-4a73-9f56-99531bc3db7b",
    username: "foodie_sophie",
    displayName: "Sophie Rodriguez",
    avatar: getRandomFile("90946704-51dc-4a73-9f56-99531bc3db7b"),
    verified: true,
    bio: "Food blogger | Recipe developer | Always hungry",
    followers: 80078,
    following: 208034,
    hasFeed: false,
    followedBy: {
      displayItems: [
        {
          id: "7b41edc6-3590-46a9-9eee-88d3f603be0c",
          displayName: "Mike Brown",
          avatar: getRandomFile("7b41edc6-3590-46a9-9eee-88d3f603be0c"),
        },
        {
          id: "2a204883-b417-4d6b-b5df-c3c6184f4de6",
          displayName: "Alex Smith",
          avatar: getRandomFile("2a204883-b417-4d6b-b5df-c3c6184f4de6"),
        },
      ],
      count: 2,
    },
  },
  {
    id: "92a1e004-8ddf-46ab-8811-28a6e1bb7a60",
    username: "fitness_marcus",
    displayName: "Marcus Johnson",
    avatar: getRandomFile("92a1e004-8ddf-46ab-8811-28a6e1bb7a60"),
    verified: true,
    bio: "Personal trainer | Nutrition coach | Wellness advocate",
    followers: 28937,
    following: 21,
    hasFeed: false,
  },
  {
    id: "e879fbc3-4438-47c0-a68e-87c6a9e2fa59",
    username: "artist_maya",
    displayName: "Maya Patel",
    avatar: getRandomFile("e879fbc3-4438-47c0-a68e-87c6a9e2fa59"),
    verified: false,
    bio: "Digital artist | Illustrator | Dreamer",
    followers: 9642,
    following: 65475,
    hasFeed: true,
    followedBy: {
      displayItems: [
        {
          id: "b154dc99-9ecf-427f-9e81-faca1bcd3603",
          displayName: "Sarah Jones",
          avatar: getRandomFile("b154dc99-9ecf-427f-9e81-faca1bcd3603"),
        },
        {
          id: "66258213-11b2-4646-b7d6-20bf47379881",
          displayName: "Wynn Tumility",
          avatar: getRandomFile("66258213-11b2-4646-b7d6-20bf47379881"),
        },
        {
          id: "19a73186-4d88-41d8-8565-60bb19433b18",
          displayName: "Helyn Vooght",
          avatar: getRandomFile("19a73186-4d88-41d8-8565-60bb19433b18"),
        },
      ],
      count: 67,
    },
  },
  {
    id: "6a5d499b-073e-4253-890b-2f739b1de380",
    username: "music_noah",
    displayName: "Noah Garcia",
    avatar: getRandomFile("6a5d499b-073e-4253-890b-2f739b1de380"),
    verified: true,
    bio: "Music producer | DJ | Creating vibes",
    followers: 3500000000,
    following: 758,
    hasFeed: true,
    followedBy: {
      displayItems: [
        {
          id: "1524663d-ae03-43bc-80f3-488594f466fd",
          displayName: "Rosalie Rizon",
          avatar: getRandomFile("1524663d-ae03-43bc-80f3-488594f466fd"),
        },
        {
          id: "7911e7fa-2371-4914-9f1f-c7b266951dbe",
          displayName: "Karoly Faragher",
          avatar: getRandomFile("7911e7fa-2371-4914-9f1f-c7b266951dbe"),
        },
      ],
      count: 15,
    },
  },
  {
    id: "6a635b66-9923-4539-8a9c-5a12a14f879b",
    username: "writer_olivia",
    displayName: "Olivia Thompson",
    avatar: getRandomFile("6a635b66-9923-4539-8a9c-5a12a14f879b"),
    verified: false,
    bio: "Novelist | Poet | Storyteller",
    followers: 17382,
    following: 623,
    hasFeed: false,
    followedBy: {
      displayItems: [
        {
          id: "19a73186-4d88-41d8-8565-60bb19433b18",
          displayName: "Alex Smith",
          avatar: getRandomFile("19a73186-4d88-41d8-8565-60bb19433b18"),
        },
      ],
      count: 1,
    },
  },
  {
    id: "ffaeecbd-58a5-4235-95f5-f51c2471a842",
    username: "huhi_1211",
    displayName: "huhi | fevercell",
    avatar: getRandomFile("ffaeecbd-58a5-4235-95f5-f51c2471a842"),
    verified: false,
    bio: "Novelist | Poet | Storyteller",
    followers: 17382,
    following: 623,
    hasFeed: false,
    followedBy: {
      displayItems: [
        {
          id: "ffaeecbd-58a5-4235-95f5-f51c2471a842",
          displayName: "Alex Smith",
          avatar: getRandomFile("ffaeecbd-58a5-4235-95f5-f51c2471a842"),
        },
      ],
      count: 1,
    },
  },
];

export const mockTrendingTopics: HashtagItem[] = [
  {
    id: "hoyo",
    count: 8193,
  },
  {
    id: "kuro",
    count: 1250000,
  },
  {
    id: "genshin",
    count: 42400000,
  },
  {
    id: "ardelle h'ad",
    count: 3500000000,
  },
  {
    id: "grearye",
    count: 42400000,
  },
];

export const mockCurrentUsers: AccountInfo[] = [
  {
    id: "thinhngo",
    username: "byronat445",
    displayName: "Thinh Ngo",
    avatar: getRandomFile("byronat445"),
    verified: true,
  },
  {
    id: "anotherMe",
    username: "hkbtrung",
    displayName: "Bao Trung",
    avatar: getRandomFile("hkbtrung"),
    verified: true,
  },
];
