function isHorizontal(ratio: string) {
  const aspectRatio = parse(ratio);
  return aspectRatio > 1;
}

function getValue(ratio: string) {
  switch (ratio) {
    case "1:1":
      return 1;
    case "9:16":
      return 9 / 16;
    case "4:5":
      return 4 / 5;
    case "1.91:1":
      return 1.91 / 1;
    default:
      return 1;
  }
}

function parse(ratio: string) {
  const [width, height] = ratio.split(":").map(Number);
  return width / height;
}

export const AspectRatioHelper = {
  isHorizontal,
  getValue,
  parse,
};
