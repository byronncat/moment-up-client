export function parseText(text: string) {
  // eslint-disable-next-line react/no-array-index-key
  return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
}
