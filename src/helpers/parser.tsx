export function parseText(text: string) {
  return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
}
