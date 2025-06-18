declare type uuidv4 = string;
declare type serial = number;

declare module "*.mp3" {
  const content: string;
  export default content;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}
