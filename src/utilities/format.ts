import dayjs from "dayjs";

function number(value: number) {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value;
}

function date(dateInput: string | Date) {
  const postDate = dayjs(dateInput);
  const now = dayjs();

  if (postDate.isSame(now, "day")) return postDate.format("h:mm A");
  if (postDate.isSame(now, "year")) return postDate.format("D MMM");
  return postDate.format("MMM YYYY");
}

const format = {
  number,
  date,
};

export default format;
