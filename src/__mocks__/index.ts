import type { MomentUI } from "api";

// Feeds mock data
export const mockFeeds = [
  {
    id: 1,
    name: "Renata Fan",
    image:
      "https://pbs.twimg.com/media/Ey_iMF0VcAImHMn?format=jpg&name=4096x4096",
  },
  {
    id: 2,
    name: "Renata Saldanha",
    image: "https://pbs.twimg.com/media/F5QLnHfbIAAdrzv?format=jpg&name=large",
  },
  {
    id: 3,
    name: "Renata Lo Prete",
    image:
      "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
  },
  {
    id: 4,
    name: "Renata Ceribelli",
    image:
      "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
  },
  {
    id: 5,
    name: "Renata Mathias",
    image:
      "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
  },
  {
    id: 6,
    name: "Renata Barreto",
    image:
      "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
  },
  {
    id: 7,
    name: "Renata Silveira",
    image: "https://pbs.twimg.com/media/GOesRcMaUAAr4Fn?format=jpg&name=large",
  },
  {
    id: 8,
    name: "Renata Agostini",
    image: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
  },
  {
    id: 9,
    name: "Renata Souza",
    image: "https://pbs.twimg.com/media/FQwnzejVEAcC3__?format=jpg&name=large",
  },
  {
    id: 10,
    name: "Renata Vasconcellos",
    image: "https://pbs.twimg.com/media/GmfBfSba4AE474E?format=jpg&name=large",
  },
  {
    id: 11,
    name: "Renata Capucci",
    image: "https://pbs.twimg.com/media/GDI8eMpboAAFxSg?format=jpg&name=medium",
  },
  {
    id: 12,
    name: "Renata Heilborn",
    image: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
  },
  {
    id: 13,
    name: "Renata Mendonça",
    image: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
  },
  {
    id: 14,
    name: "Renata Abreu",
    image: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
  },
  {
    id: 15,
    name: "Renata Banhara",
    image: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
  },
  {
    id: 16,
    name: "Renata Sorrah",
    image: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
  },
  {
    id: 17,
    name: "Renata Castro",
    image: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
  },
  {
    id: 18,
    name: "Renata Campos",
    image: "https://pbs.twimg.com/media/FQwnzejVEAcC3__?format=jpg&name=large",
  },
  {
    id: 19,
    name: "Renata Flores",
    image: "https://pbs.twimg.com/media/GmfBfSba4AE474E?format=jpg&name=large",
  },
  {
    id: 20,
    name: "Renata Gomes",
    image: "https://pbs.twimg.com/media/GDI8eMpboAAFxSg?format=jpg&name=medium",
  },
  {
    id: 21,
    name: "Renata Lima",
    image: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
  },
  {
    id: 22,
    name: "Renata Martins",
    image: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
  },
  {
    id: 23,
    name: "Renata Nunes",
    image: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
  },
  {
    id: 24,
    name: "Renata Oliveira",
    image: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
  },
  {
    id: 25,
    name: "Renata Pereira",
    image: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
  },
  {
    id: 26,
    name: "Renata Quintana",
    image: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
  },
  {
    id: 27,
    name: "Renata Ribeiro",
    image: "https://pbs.twimg.com/media/FQwnzejVEAcC3__?format=jpg&name=large",
  },
  {
    id: 28,
    name: "Renata Santos",
    image: "https://pbs.twimg.com/media/GmfBfSba4AE474E?format=jpg&name=large",
  },
  {
    id: 29,
    name: "Renata Teixeira",
    image: "https://pbs.twimg.com/media/GDI8eMpboAAFxSg?format=jpg&name=medium",
  },
  {
    id: 30,
    name: "Renata Vasconcelos",
    image: "https://pbs.twimg.com/media/Ge83sUkbwAETM10?format=jpg&name=large",
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

export const mockMoments: MomentUI[] = [
  {
    id: 1,
    user_id: "1",
    username: "alice",
    text: "Beautiful day at the beach 🌊",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
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
    text: "City lights and night vibes ✨",
    files: [
      {
        type: "image",
        url: "https://scontent-hkg1-2.cdninstagram.com/v/t51.2885-15/484396236_17855197362398163_2489887654681098974_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-hkg1-2.cdninstagram.com&_nc_oc=Q6cZ2QEM9pyT59uCPkJgav10bu7X4YHhfZZ6Wke-tbEg7x-Dcif_LsiPZCtM0rjbF9wqFH9OPz7_DcMSlad3bKluduzu&_nc_ohc=FV5wBT-BL2gQ7kNvwGBIKkK&_nc_gid=wC-T5Qg7SQVeyCR4ks-rQw&edm=AFY8k0kBAAAA&ig_cache_key=MzU4ODgwODAyNzQ2ODExMDY0Ng%3D%3D.3-ccb7-5&oh=00_AfFMfhWR9fOKtz_lSevQqHLOXJXot_Il-e8VjeJ0KVfnSg&oe=67F85377",
      },
      {
        type: "image",
        url: "https://scontent-hkg1-2.cdninstagram.com/v/t51.2885-15/484404902_17855197365398163_2363485767902053897_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-hkg1-2.cdninstagram.com&_nc_oc=Q6cZ2QFx6t5UobXCLdRI46Otf5-1UmnHHNTldyrIUm6QfyAleidD67Kqtwut12SEYoIXRTcQtKODkOFYYO1tB4oFZtI_&_nc_ohc=_zdtAxEjHW8Q7kNvwGpuj96&_nc_gid=zLaZBpCb04Aw2pUh3arCGA&edm=AFY8k0kBAAAA&ig_cache_key=MzU4ODgwODAyNzYwMjE2MzQ0OA%3D%3D.3-ccb7-5&oh=00_AfESJMSwCYiewGH09KDV6ZUeuas4-VT3xrUdAdYkm-s8Og&oe=67F882B6",
      },
    ],
    likes: 2345,
    comments: 67,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 3,
    user_id: "3",
    username: "charlie",
    text: "Sunset vibes 🌅",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GkUVxpLaIAAK5fK?format=jpg&name=large",
      },
    ],
    likes: 3456,
    comments: 89,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 4,
    user_id: "4",
    username: "dave",
    text: "Exploring new places 🗺️",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/Ey_iMF0VcAImHMn?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/F5QLnHfbIAAdrzv?format=jpg&name=large",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
      },
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
      },
    ],
    likes: 4567,
    comments: 90,
    created_at: new Date(),
    isLiked: true,
  },
  {
    id: 5,
    user_id: "5",
    username: "eve",
    text: "Coffee and good vibes ☕️",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
      },
    ],
    likes: 5678,
    comments: 123,
    created_at: new Date(),
    isLiked: true,
  },
  {
    id: 6,
    user_id: "5",
    username: "eve",
    text: "Weekend getaway 🏖️",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
      },
    ],
    likes: 5678,
    comments: 123,
    created_at: new Date(),
    isLiked: true,
  },
  {
    id: 7,
    user_id: "6",
    username: "frank",
    text: "Just sharing my thoughts for today... Life is beautiful when you appreciate the little things. Every moment counts, and I'm grateful for all the experiences that shape who I am. 🌟",
    likes: 1234,
    comments: 45,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 8,
    user_id: "7",
    username: "grace",
    text: "Check out this amazing video! 🎥",
    files: [
      {
        type: "video",
        url: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
      },
    ],
    likes: 2345,
    comments: 67,
    created_at: new Date(),
    isLiked: false,
  },
  {
    id: 9,
    user_id: "8",
    username: "henry",
    text: "A beautiful day captured in both words and images 🌞",
    files: [
      {
        type: "image",
        url: "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
      },
      {
        type: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    ],
    likes: 3456,
    comments: 89,
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
    avatar: "https://pbs.twimg.com/media/F5QLnHfbIAAdrzv?format=jpg&name=large",
    followedBy: "user123",
  },
  {
    id: 2,
    username: "janedoe",
    name: "Jane Doe",
    avatar:
      "https://pbs.twimg.com/media/GI7zp-magAAYFAr?format=jpg&name=4096x4096",
    followedBy: "user456",
  },
  {
    id: 3,
    username: "alexsmith",
    name: "Alex Smith",
    avatar:
      "https://pbs.twimg.com/media/GHv15bhbwAAXQlJ?format=jpg&name=4096x4096",
    followedBy: "user789",
  },
  {
    id: 4,
    username: "sarahjones",
    name: "Sarah Jones",
    avatar:
      "https://pbs.twimg.com/media/GHWbMb9W8AE1aXK?format=jpg&name=4096x4096",
    followedBy: "user101",
  },
  {
    id: 5,
    username: "mikebrown",
    name: "Mike Brown",
    avatar:
      "https://pbs.twimg.com/media/F1IgZYmagAAbcwm?format=jpg&name=4096x4096",
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
    avatar: "https://pbs.twimg.com/media/GOesRcMaUAAr4Fn?format=jpg&name=large",
    verified: false,
  },
  {
    id: 2,
    type: "user" as const,
    username: "renataSaldanha",
    name: "Renata Saldanha",
    avatar: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
    verified: true,
  },
  {
    id: 3,
    type: "user" as const,
    username: "RenataFan",
    name: "Renata Fan",
    avatar: "https://pbs.twimg.com/media/FQwnzejVEAcC3__?format=jpg&name=large",
    verified: true,
  },
  {
    id: 4,
    type: "user" as const,
    username: "renataloprete",
    name: "Renata Lo Prete",
    avatar: "https://pbs.twimg.com/media/GmfBfSba4AE474E?format=jpg&name=large",
    verified: true,
  },
  {
    id: 5,
    type: "user" as const,
    username: "renataceribelli",
    name: "renata ceribelli",
    avatar: "https://pbs.twimg.com/media/Gn_pHDrbkAE1pt4?format=jpg&name=large",
    verified: false,
  },
  {
    id: 6,
    type: "user" as const,
    username: "renatamathias",
    name: "Renata Mathias",
    avatar: "https://pbs.twimg.com/media/Giqex77bEAA2Ig4?format=jpg&name=large",
    verified: false,
  },
  {
    id: 7,
    type: "user" as const,
    username: "renatabarreto",
    name: "Renata Barreto",
    avatar: "https://pbs.twimg.com/media/GateEGjaAAE601y?format=jpg&name=large",
    verified: true,
  },
  {
    id: 8,
    type: "user" as const,
    username: "renataSilveira",
    name: "Renata Silveira",
    avatar: "https://pbs.twimg.com/media/GatcCLqbAAA7dte?format=jpg&name=large",
    verified: false,
  },
  {
    id: 9,
    type: "user" as const,
    username: "renataagostini",
    name: "Renata Agostini",
    avatar: "https://pbs.twimg.com/media/GE2MoDBbcAAMPYH?format=jpg&name=large",
    verified: false,
  },
  {
    id: 10,
    type: "user" as const,
    username: "renataSouza",
    name: "Renata Souza",
    avatar: "https://pbs.twimg.com/media/FQwnzejVEAcC3__?format=jpg&name=large",
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
