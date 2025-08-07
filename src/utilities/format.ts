import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

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

function _relativeTime(dateInput: string | Date) {
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);

  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "now",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1mo",
      MM: "%dmo",
      y: "1y",
      yy: "%dy",
    },
  });

  return dayjs(dateInput).fromNow();
}

const Format = {
  number,
  date,
  relativeTime: _relativeTime,
};

export default Format;
