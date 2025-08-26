import { StoryFontFamily } from "@/constants/serverConfig";
import {
  merriweather,
  roboto,
  sourceCodePro,
  yesteryear,
} from "@/styles/fonts";

export const ControlStyles = {
  borderColor: "#444444",
  cornerColor: "#444444",
  cornerStrokeColor: "#fff",
  transparentCorners: false,
  cornerStyle: "circle" as const,
};

export const CursorStyles = {
  defaultCursor: "crosshair",
  freeDrawingCursor: "crosshair",
  moveCursor: "move",
  hoverCursor: "move",
  rotationCursor: "crosshair",
};

export const PositionStyles = (width: number, height: number) => ({
  left: width / 2,
  top: height / 2,
  originX: "center" as const,
  originY: "center" as const,
});

export const Font = [
  {
    label: "Roboto",
    family: roboto.style.fontFamily,
    className: "text-2xl font-semibold",
    value: StoryFontFamily.ROBOTO,
  },
  {
    label: "Yesteryear",
    family: yesteryear.style.fontFamily,
    className: "text-4xl font-thin tracking-wider",
    value: StoryFontFamily.YESTERYEAR,
  },
  {
    label: "Source Code Pro",
    family: sourceCodePro.style.fontFamily,
    className: "text-2xl font-semibold",
    value: StoryFontFamily.SOURCE_CODE_PRO,
  },
  {
    label: "Merriweather",
    family: merriweather.style.fontFamily,
    className: "text-2xl font-semibold",
    value: StoryFontFamily.MERRIWEATHER,
  },
];

export const TextColors = [
  "#1a1a1a",
  "#3f92b6",
  "#7f3f3f",
  "#f8805c",
  "#6ed9ff",
  "#f2ca4e",
  "#9a9ea6",
  "#94c65d",
  "#cfeff9",
  "#d3d5d8",
  "#e0d7f1",
  "#fb52aa",
  "#c0fcd0",
  "#415889",
  "#f59d4e",
  "#fad0d6",
  "#9f36b9",
  "#f95151",
  "#694fa4",
  "#ffffff",
  "#f9e55e",
];
