// +++ TODO: Ongoing +++
import type { PostDto } from "api";

const HEADER_HEIGHT = 76;
const FOOTER_HEIGHT = 60;
const SINGLE_TEXT_HEIGHT = 28;
const MULTI_TEXT_HEIGHT = 72;
const BORDER_SIZE = 1;

export function getItemSize(
  index: number,
  post: PostDto | undefined,
  _width: number,
  firstItemHeight: number
) {
  if (index === 0) return firstItemHeight;

  const width = _width > 600 ? 600 : _width;
  if (!post) return 0;

  let height = HEADER_HEIGHT + FOOTER_HEIGHT + 2 * BORDER_SIZE;
  if (post.files?.length) {
    if (post.files.length === 1) {
      const file = post.files[0];
      switch (file.aspectRatio) {
        case "1:1":
          height += width; // Square
          break;
        case "4:5":
          height += (width * 5) / 4; // Portrait
          break;
        case "1.91:1":
          height += width / 1.91; // Landscape
          break;
        default:
          height += width; // Default to square
      }
    } else height += width; // Square

    if (post.text) height += SINGLE_TEXT_HEIGHT;
  } else if (post.text) height += MULTI_TEXT_HEIGHT;

  return height;
}
