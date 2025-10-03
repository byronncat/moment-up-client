export function getRatioValue(ratio: "square" | "portrait" | "landscape") {
  switch (ratio) {
    case "square":
      return 1;
    case "portrait":
      return 4 / 5;
    case "landscape":
      return 1.91 / 1;
    default:
      return 1;
  }
}
