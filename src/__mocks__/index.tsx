import type {
  UserProfileInfo,
  UserCardDisplayInfo,
  NotificationInfo,
  CommentInfo,
  FeedInfo,
  ProfileSearchItem,
} from "api";
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

export const mockFeed: FeedInfo[] = [
  // {
  //   user: {
  //     id: "1",
  //     username: "Renata Fan",
  //     displayName: "Renata Fan",
  //     avatar: getRandomFile("renata_fan"),
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
  //       createdAt: "2025-07-11T09:20:12.345Z",
  //     },
  //     {
  //       id: "4",
  //       content: "This is a test! And this is a test!",
  //       createdAt: "2025-07-11T09:20:12.345Z",
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
  //       createdAt: "2025-07-11T09:20:12.345Z",
  //     },
  //     {
  //       id: "3",
  //       content: {
  //         id: "3",
  //         type: "video",
  //         url: getRandomFile("video", "3"),
  //       },
  //       createdAt: "2025-07-11T09:20:12.345Z",
  //     },
  //   ],
  // },
  // {
  //   user: {
  //     id: "2",
  //     username: "Feint heart",
  //     displayName: "Feint heart",
  //     avatar: getRandomFile("feint_heart"),
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
  //       createdAt: "2025-07-11T09:20:12.345Z",
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
  //       createdAt: "2025-07-11T09:20:12.345Z",
  //     },
  //   ],
  // },
];

export const mockMoments: any[] = isDev
  ? [
      {
        id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735b9",
        user: {
          id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735b9",
          email: "",
          username: "anonymous",
          displayName: "Anonymous",
          avatar: getRandomFile("b9a6a3a4-02e1-47f0-8cbe-73dc2a15735b9"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GtQ6RRjb0AA0ZkV?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "0",
              type: "image",
              url: "https://pbs.twimg.com/media/GrAW1FlXkAAgu1O?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GtbCig-bIAAqvrd?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-47f0-8cbe-69dc2a15735b9",
        user: {
          id: "b9a6a3a4-02e1-47f0-8cbe-69dc2a15735b9",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-47f0-8cbe-69dc2a15735b9"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nProin dignissim iaculis posuere. Nulla facilisi.\nIn ultrices, tortor quis ultrices pharetra, mauris tortor tempor turpis, sed pretium nisl nibh ac risus.\nSed elementum justo at arcu gravida aliquet et vitae nulla.",
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c8",
        user: {
          id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c8",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-47f0-8cbe-73dc2a15735c8"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Aliquam eget lectus eget felis aliquam rhoncus eget at augue. Ut quis tincidunt nibh. Fusce tincidunt tincidunt dui, et condimentum orci ornare non. Mauris laoreet ante nec mi rutrum, ac rhoncus lorem ultricies. In scelerisque ut ipsum ut viverra. Nullam posuere lectus eget odio mollis, ut varius enim tristique. Integer vitae nisl ac metus tempus vulputate non non diam. Cras cursus viverra feugiat. Nulla sed dolor est.\nQuisque et lectus id magna laoreet dapibus. Morbi feugiat libero non mattis bibendum. Morbi sem augue, pretium tristique nibh in, suscipit pulvinar arcu. Aenean ultrices tellus et sapien egestas pulvinar. Aenean ipsum risus, fringilla et luctus id, dignissim at tellus. Etiam aliquam posuere ultricies. Phasellus placerat nunc eget hendrerit dignissim. Mauris purus dolor, facilisis at nulla id, finibus tincidunt felis. In ullamcorper ullamcorper ligula, in ultricies justo faucibus ut. Aenean porttitor dictum nibh, eget mollis tellus pellentesque ut. Pellentesque luctus lorem et mi mollis, eget lacinia mauris viverra. Morbi sit amet commodo dolor. Cras orci enim, varius non molestie eu, facilisis in ligula. Ut ornare fermentum velit quis semper. Nam non viverra neque. Cras ac eros rhoncus, vehicula quam nec, eleifend arcu.\nCras sagittis quam id sem vehicula placerat. Nunc condimentum mattis leo, non mollis odio maximus luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent semper, risus at faucibus varius, tellus orci semper ligula, nec posuere turpis mauris ac leo. Praesent sed ipsum volutpat, imperdiet lorem et, hendrerit diam. Proin ut auctor purus. Morbi porta neque at dui vestibulum posuere. Fusce nec velit et elit volutpat posuere id at velit. In nec accumsan lacus, in luctus purus. Quisque venenatis ac ipsum vel efficitur. Donec sed mauris vehicula, tempor nibh sed, fringilla magna. Integer ornare dui non libero tincidunt, quis pulvinar nunc porttitor. Ut efficitur sagittis pharetra. Ut in augue et turpis placerat pretium pulvinar vitae sapien.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Gdtc9TWWYAA7DUE?format=jpg&name=4096x4096",
              aspectRatio: "1.91:1",
            },
            {
              id: "0",
              type: "image",
              url: " https://pbs.twimg.com/media/GX4zYoXaUAAb3hr?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GLpnRIWa8AAjVjt?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9b6a3a4-02e1-47f0-8cbe-73dc2a1573566c",
        user: {
          id: "b9b6a3a4-02e1-47f0-8cbe-73dc2a1573566c",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9b6a3a4-02e1-47f0-8cbe-73dc2a1573566c"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt.",
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735ba",
        user: {
          id: "b9a6a3a4-02e1-47f0-8cbe-73dc2a15735ba",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-47f0-8cbe-73dc2a15735ba"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Aliquam eget lectus eget felis aliquam rhoncus eget at augue. Ut quis tincidunt nibh. Fusce tincidunt tincidunt dui, et condimentum orci ornare non. Mauris laoreet ante nec mi rutrum, ac rhoncus lorem ultricies. In scelerisque ut ipsum ut viverra. Nullam posuere lectus eget odio mollis, ut varius enim tristique. Integer vitae nisl ac metus tempus vulputate non non diam. Cras cursus viverra feugiat. Nulla sed dolor est.\nQuisque et lectus id magna laoreet dapibus. Morbi feugiat libero non mattis bibendum. Morbi sem augue, pretium tristique nibh in, suscipit pulvinar arcu. Aenean ultrices tellus et sapien egestas pulvinar. Aenean ipsum risus, fringilla et luctus id, dignissim at tellus. Etiam aliquam posuere ultricies. Phasellus placerat nunc eget hendrerit dignissim. Mauris purus dolor, facilisis at nulla id, finibus tincidunt felis. In ullamcorper ullamcorper ligula, in ultricies justo faucibus ut. Aenean porttitor dictum nibh, eget mollis tellus pellentesque ut. Pellentesque luctus lorem et mi mollis, eget lacinia mauris viverra. Morbi sit amet commodo dolor. Cras orci enim, varius non molestie eu, facilisis in ligula. Ut ornare fermentum velit quis semper. Nam non viverra neque. Cras ac eros rhoncus, vehicula quam nec, eleifend arcu.\nCras sagittis quam id sem vehicula placerat. Nunc condimentum mattis leo, non mollis odio maximus luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent semper, risus at faucibus varius, tellus orci semper ligula, nec posuere turpis mauris ac leo. Praesent sed ipsum volutpat, imperdiet lorem et, hendrerit diam. Proin ut auctor purus. Morbi porta neque at dui vestibulum posuere. Fusce nec velit et elit volutpat posuere id at velit. In nec accumsan lacus, in luctus purus. Quisque venenatis ac ipsum vel efficitur. Donec sed mauris vehicula, tempor nibh sed, fringilla magna. Integer ornare dui non libero tincidunt, quis pulvinar nunc porttitor. Ut efficitur sagittis pharetra. Ut in augue et turpis placerat pretium pulvinar vitae sapien.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GKi4QHnboAAJWYV?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "0",
              type: "image",
              url: "https://pbs.twimg.com/media/FvWhCjEakAAeQ6C?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "c4b07087-f164-405d-86ac-4b54870b29d3",
        user: {
          id: "c4b07087-f164-405d-86ac-4b54870b29d3",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("c4b07087-f164-405d-86ac-4b54870b29d3"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
              aspectRatio: "1:1",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9b6a3a4-02e1-47f0-8cbe-73dc2a15735c",
        user: {
          id: "b9b6a3a4-02e1-47f0-8cbe-73dc2a15735c",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9b6a3a4-02e1-47f0-8cbe-73dc2a15735c"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt. Integer lectus tortor, sollicitudin consequat est id, ultrices gravida neque. Etiam congue arcu quam. Praesent quis interdum diam. Donec cursus nulla ligula, eget imperdiet neque posuere in. Nulla gravida, ipsum lacinia aliquet suscipit, magna leo tincidunt ligula, sed congue eros ipsum sit amet erat. Pellentesque elementum ultricies lorem, sed imperdiet enim. Cras et velit nunc. Aenean sem eros, vehicula ac mauris a, venenatis fringilla sapien. Integer posuere, dui ac posuere bibendum, magna massa sagittis ante, dignissim rutrum libero dui in libero.\nAliquam eget lectus eget felis aliquam rhoncus eget at augue. Ut quis tincidunt nibh. Fusce tincidunt tincidunt dui, et condimentum orci ornare non. Mauris laoreet ante nec mi rutrum, ac rhoncus lorem ultricies. In scelerisque ut ipsum ut viverra. Nullam posuere lectus eget odio mollis, ut varius enim tristique. Integer vitae nisl ac metus tempus vulputate non non diam. Cras cursus viverra feugiat. Nulla sed dolor est.",
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "e449b4ff-3f2c-4ffc-ba19-244f918b2662",
        user: {
          id: "e449b4ff-3f2c-4ffc-ba19-244f918b2662",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("e449b4ff-3f2c-4ffc-ba19-244f918b2662"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
              aspectRatio: "1:1",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "73a1e6f0-12ce-49bc-b393-ed42599efa9",
        user: {
          id: "73a1e6f0-12ce-49bc-b393-ed42599efa9",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("73a1e6f0-12ce-49bc-b393-ed42599efa9"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GDxlKAwbkAAEEH4?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/FbT-hSnaMAITR81?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/Fsh9DaOakAEL7B1?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "73a1e6f0-12ce-49bc-b393-ed42599ef2a9",
        user: {
          id: "73a1e6f0-12ce-49bc-b393-ed42599ef2a9",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("73a1e6f0-12ce-49bc-b393-ed42599ef2a9"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsVFvbYAU2ZpA?format=jpg&name=large",
              aspectRatio: "1.91:1",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "d807583d-69c5-4a00-8927-ba263cd100fb",
        user: {
          id: "d807583d-69c5-4a00-8927-ba263cd100fb",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("d807583d-69c5-4a00-8927-ba263cd100fb"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GTP4USoaYAMKWLD?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GoFJ8_PbYAAGVxY?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GmE2QNobcAE18qo?format=jpg&name=medium",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "da8a84c3-4ed5-4751-b1cd-9fade2f20fa2",
        user: {
          id: "da8a84c3-4ed5-4751-b1cd-9fade2f20fa2",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("da8a84c3-4ed5-4751-b1cd-9fade2f20fa2"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/F7_0tmmbMAAuv6G?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GgHsRA8akAAeirJ?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/GNVppwoakAA3Yxq?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GCpqzHQbwAABMGr?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/F-I4FN2bgAAbsbE?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "6",
              type: "image",
              url: "https://pbs.twimg.com/media/GLGU7XDbEAADwGY?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "54a7ea30-66a9-444e-aaf4-20d44ec7f10b",
        user: {
          id: "54a7ea30-66a9-444e-aaf4-20d44ec7f10b",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("54a7ea30-66a9-444e-aaf4-20d44ec7f10b"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GgC22OAaMAAmA9I?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GCsUDkvaQAASmNU?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GllqHMLa4AATGzZ?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GlLNYbPbIAANJjZ?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/Gdm5F3mboAgSG_x?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "ce90e671-35b8-4ed9-bcba-5951861851a3",
        user: {
          id: "ce90e671-35b8-4ed9-bcba-5951861851a3",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("ce90e671-35b8-4ed9-bcba-5951861851a3"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Fi2-RJ9acAA7gYr?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "96f6153d-87be-43df-a602-2c31bcafda3b",
        user: {
          id: "96f6153d-87be-43df-a602-2c31bcafda3b",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("96f6153d-87be-43df-a602-2c31bcafda3b"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GowgbJ9aIAADxvn?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Ghvkngoa0AAZBHM?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj8UYDjbEAAVJeD?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "7aaabed3-d3b1-4db3-a979-55e3ce0551c2",
        user: {
          id: "7aaabed3-d3b1-4db3-a979-55e3ce0551c2",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("7aaabed3-d3b1-4db3-a979-55e3ce0551c2"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GmkyyAnaEAA3K9v?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "d3c53881-ddb9-423e-bcd3-b206feedc085",
        user: {
          id: "d3c53881-ddb9-423e-bcd3-b206feedc085",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("d3c53881-ddb9-423e-bcd3-b206feedc085"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Gj_e2lNbEAAWF9u?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "fcdacfcb-630c-43ca-a7a7-68bac9592e07",
        user: {
          id: "fcdacfcb-630c-43ca-a7a7-68bac9592e07",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("fcdacfcb-630c-43ca-a7a7-68bac9592e07"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GjMsVS9a0AA66Tb?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "c2a29470-68ff-4e07-a7eb-726bddd2d7f7",
        user: {
          id: "c2a29470-68ff-4e07-a7eb-726bddd2d7f7",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("c2a29470-68ff-4e07-a7eb-726bddd2d7f7"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GgLvSHibYAMCR1k?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "4a6918cb-7af3-4aba-9fe5-430addd54d84",
        user: {
          id: "4a6918cb-7af3-4aba-9fe5-430addd54d84",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("4a6918cb-7af3-4aba-9fe5-430addd54d84"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/Gs_YbumagAAJKWg?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GtErX2oaIAAUAwM?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "a0fa3c9e-11da-43b8-92cf-090e69e8bd39",
        user: {
          id: "a0fa3c9e-11da-43b8-92cf-090e69e8bd39",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("a0fa3c9e-11da-43b8-92cf-090e69e8bd39"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/FtEzdouaQAARPKN?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "0f4aeda5-7217-45c7-998c-3c8087bf8531",
        user: {
          id: "0f4aeda5-7217-45c7-998c-3c8087bf8531",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("0f4aeda5-7217-45c7-998c-3c8087bf8531"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GicHHmPaYAAfESg?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/FkXOfZCaEAAR2pX?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/FWHk8VgUIAANFcX?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/FgzKZewagAAtE2G?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "0f5aeda5-7217-45c7-998c-3c8087bf8531",
        user: {
          id: "0f5aeda5-7217-45c7-998c-3c8087bf8531",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("0f5aeda5-7217-45c7-998c-3c8087bf8531"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GN8JrXEaUAAvgQu?format=jpg&name=large",
              aspectRatio: "1.91:1",
            },
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GsxybX8bQAEQ8sW?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GjPNWTNb0AAZvar?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "0f6aeda5-7217-45c7-998c-3c8087bf8531",
        user: {
          id: "0f6aeda5-7217-45c7-998c-3c8087bf8531",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("0f6aeda5-7217-45c7-998c-3c8087bf8531"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GgwpklCa0AA8MkD?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GKYSLwTaAAA7Uu9?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GEwApvjaMAAX2R6?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "0f5aeda5-7217-45c7-998c-3c8087bf8532",
        user: {
          id: "0f5aeda5-7217-45c7-998c-3c8087bf8532",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("0f5aeda5-7217-45c7-998c-3c8087bf8531"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GnHpja0b0AAqHkB?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/GiQ95fjbAAAL1ZK?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "0f7aeda5-7217-45c7-998c-3c8087bf8531",
        user: {
          id: "0f7aeda5-7217-45c7-998c-3c8087bf8531",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("0f7aeda5-7217-45c7-998c-3c8087bf8531"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "5",
              type: "image",
              url: "https://pbs.twimg.com/media/GjZDOyAa8AArPqh?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1b",
        user: {
          id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1",
          username: "sunny11___",
          displayName: "sunny11",
          avatar: getRandomFile("8e5bee7f-0df3-41fe-9c58-b62615bafd1"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/Gryah3uXkAAvDtT?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GqpnuaVXAAAYrhH?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/Gs6j_R2bsAAL5cL?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1a",
        user: {
          id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1a",
          username: "sunny11___",
          displayName: "sunny11",
          avatar: getRandomFile("8e5bee7f-0df3-41fe-9c58-b62615bafd1a"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GaARflpbEAAGnmH?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gc6Be8_bkAAXjoB?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1c",
        user: {
          id: "8e5bee7f-0df3-41fe-9c58-b62615bafd1c",
          username: "sunny11___",
          displayName: "sunny11",
          avatar: getRandomFile("8e5bee7f-0df3-41fe-9c58-b62615bafd1c"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GLiajEDboAAnccH?format=jpg&name=large",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GEmDEA9bcAAOfmP?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GHvc3k-bEAAtwWN?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "8e5bee7f-0df3-tsrehj44s-9c58-b62615bafd1c",
        user: {
          id: "8e5bee7f-0df3-tsrehj44s-9c58-b62615bafd1c",
          username: "sunny11___",
          displayName: "sunny11",
          avatar: getRandomFile("8e5bee7f-0df3-tsrehj44s-9c58-b62615bafd1c"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/FrZfFNvaQAAxuxq?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GFEigYqa0AAqYjf?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/GHvc3k-bEAAtwWN?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b9",
        user: {
          id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b9",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-470-8cbe-69dc2a15735b9"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nProin dignissim iaculis posuere. Nulla facilisi.\nIn ultrices, tortor quis ultrices pharetra, mauris tortor tempor turpis, sed pretium nisl nibh ac risus.\nSed elementum justo at arcu gravida aliquet et vitae nulla.",
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b10",
        user: {
          id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b10",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-470-8cbe-69dc2a15735b10"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nProin dignissim iaculis posuere. Nulla facilisi.\nIn ultrices, tortor quis ultrices pharetra, mauris tortor tempor turpis, sed pretium nisl nibh ac risus.\nSed elementum justo at arcu gravida aliquet et vitae nulla.",
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GSapLb6W0AADWqy?format=jpg&name=4096x4096",
              aspectRatio: "1.91:1",
            },
            {
              id: "2",
              type: "image",
              url: "https://pbs.twimg.com/media/Gt4gzd7XEAAXFTb?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "3",
              type: "image",
              url: "https://pbs.twimg.com/media/GcZL3OJaAAATqcq?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
            {
              id: "4",
              type: "image",
              url: "https://pbs.twimg.com/media/F7Uf7RWaMAABcWG?format=jpg&name=large",
              aspectRatio: "1.91:1",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b11",
        user: {
          id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b11",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-470-8cbe-69dc2a15735b11"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/GDdhBdYbwAA1BIE?format=jpg&name=large",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
      {
        id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b12",
        user: {
          id: "b9a6a3a4-02e1-470-8cbe-69dc2a15735b12",
          username: "anonymous",
          displayName: "Anonymous",
          email: "",
          avatar: getRandomFile("b9a6a3a4-02e1-470-8cbe-69dc2a15735b12"),
          followers: 1000,
          following: 1000,
          isFollowing: false,
          hasFeed: true,
        },
        post: {
          files: [
            {
              id: "1",
              type: "image",
              url: "https://pbs.twimg.com/media/FJrSq89UUAIGhDT?format=jpg&name=4096x4096",
              aspectRatio: "4:5",
            },
          ],
          likes: 1000,
          comments: 1000,
          createdAt: "2025-07-11T09:20:12.345Z",
          isLiked: false,
          isBookmarked: false,
        },
      },
    ]
  : [];

export const mockComments: CommentInfo[] = [
  {
    id: "979491b0-13a7-41c7-9b5e-1c60c96684b2",
    content:
      "Aliquam eget lectus eget felis aliquam rhoncus eget at augue. Ut quis tincidunt nibh. Fusce tincidunt tincidunt dui, et condimentum orci ornare non. Mauris laoreet ante nec mi rutrum, ac rhoncus lorem ultricies. In scelerisque ut ipsum ut viverra. Nullam posuere lectus eget odio mollis, ut varius enim tristique. Integer vitae nisl ac metus tempus vulputate non non diam. Cras cursus viverra feugiat. Nulla sed dolor est./nQuisque et lectus id magna laoreet dapibus. Morbi feugiat libero non mattis bibendum. Morbi sem augue, pretium tristique nibh in, suscipit pulvinar arcu. Aenean ultrices tellus et sapien egestas pulvinar. Aenean ipsum risus, fringilla et luctus id, dignissim at tellus. Etiam aliquam posuere ultricies. Phasellus placerat nunc eget hendrerit dignissim. Mauris purus dolor, facilisis at nulla id, finibus tincidunt felis. In ullamcorper ullamcorper ligula, in ultricies justo faucibus ut. Aenean porttitor dictum nibh, eget mollis tellus pellentesque ut. Pellentesque luctus lorem et mi mollis, eget lacinia mauris viverra. Morbi sit amet commodo dolor. Cras orci enim, varius non molestie eu, facilisis in ligula. Ut ornare fermentum velit quis semper. Nam non viverra neque. Cras ac eros rhoncus, vehicula quam nec, eleifend arcu./nCras sagittis quam id sem vehicula placerat. Nunc condimentum mattis leo, non mollis odio maximus luctus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent semper, risus at faucibus varius, tellus orci semper ligula, nec posuere turpis mauris ac leo. Praesent sed ipsum volutpat, imperdiet lorem et, hendrerit diam. Proin ut auctor purus. Morbi porta neque at dui vestibulum posuere. Fusce nec velit et elit volutpat posuere id at velit. In nec accumsan lacus, in luctus purus. Quisque venenatis ac ipsum vel efficitur. Donec sed mauris vehicula, tempor nibh sed, fringilla magna. Integer ornare dui non libero tincidunt, quis pulvinar nunc porttitor. Ut efficitur sagittis pharetra. Ut in augue et turpis placerat pretium pulvinar vitae sapien.",
    user: {
      email: "",
      id: "979491b0-13a7-41c7-9b5e-1c60c96684b2",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("979491b0-13a7-41c7-9b5e-1c60c96684b2"),
      followers: 1000,
      following: 1000,
      isFollowing: false,
      hasFeed: true,
    },
    likes: 10000,
    isLiked: true,
    createdAt: "2025-07-11T09:20:12.345Z",
  },
  {
    id: "979491b0-13a7-41c7-9b5e-1c60c96684b3",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt. Integer lectus tortor, sollicitudin consequat est id, ultrices gravida neque. Etiam congue arcu quam. Praesent quis interdum diam. Donec cursus nulla ligula, eget imperdiet neque posuere in.",
    user: {
      email: "",
      id: "979491b0-13a7-41c7-9b5e-1c60c96684b3",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("979491b0-13a7-41c7-9b5e-1c60c96684b3"),
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt. Integer lectus tortor, sollicitudin consequat est id, ultrices gravida neque. Etiam congue arcu quam. Praesent quis interdum diam. Donec cursus nulla ligula, eget imperdiet neque posuere in.",
      followers: 1000,
      following: 1000,
      isFollowing: false,
      hasFeed: true,
    },
    likes: 30000,
    isLiked: false,
    createdAt: "2004-07-12T00:00:00.000Z",
  },
  {
    id: "979491b0-13a7-41c7-9b5e-1c60c96684b4",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan et diam vitae tincidunt. Integer lectus tortor, sollicitudin consequat est id, ultrices gravida neque. Etiam congue arcu quam. Praesent quis interdum diam. Donec cursus nulla ligula, eget imperdiet neque posuere in.",
    user: {
      email: "",
      id: "979491b0-13a7-41c7-9b5e-1c60c96684b4",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("979491b0-13a7-41c7-9b5e-1c60c96684b4"),
      followers: 1000,
      following: 1000,
      isFollowing: false,
      hasFeed: true,
    },
    likes: 70000,
    isLiked: false,
    createdAt: "2003-07-12T00:00:00.000Z",
  },
  {
    id: "979491b0-13a7-41c7-9b5e-1c60c9668467",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: {
      email: "",
      id: "979491b0-13a7-41c7-9b5e-1c60c9668467",
      username: "anonymous",
      displayName: "Anonymous",
      avatar: getRandomFile("979491b0-13a7-41c7-9b5e-1c60c9668467"),
      followers: 1000,
      following: 1000,
      isFollowing: false,
      hasFeed: true,
    },
    likes: 70000,
    isLiked: false,
    createdAt: "2025-07-12T00:00:00.000Z",
  },
];

export const mockProfile: UserProfileInfo = {
  id: "a9a6d7c2-1e20-2439-a50b-51a1deh131da1",
  email: "",
  username: "byronat445",
  displayName: "Byron Atwood",
  avatar: getRandomFile("byronat445"),
  backgroundImage: isDev
    ? "https://pbs.twimg.com/media/GjlpiyBaIAENj43?format=jpg&name=large"
    : undefined,
  hasFeed: true,
  bio: "I'm a software engineer and a coffee addict.",
  followers: 1234,
  following: 567,
  isFollowing: false,
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

export const mockCurrentUsers: Omit<
  UserCardDisplayInfo,
  "followedBy" | "isFollowing"
>[] = [
  {
    id: "thinhngo",
    email: "",
    username: "byronat445",
    displayName: "Thinh Ngo",
    avatar: getRandomFile("byronat445"),
    followers: 1000,
    following: 1000,
    hasFeed: true,
  },
  {
    id: "anotherMe",
    email: "",
    username: "hkbtrung",
    displayName: "Bao Trung",
    avatar: getRandomFile("hkbtrung"),
    followers: 1000,
    following: 1000,
    hasFeed: true,
  },
];
