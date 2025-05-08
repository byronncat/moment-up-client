export default function throttle<T>(
  callback: (args: T) => void,
  delay: number
) {
  let isThrottled = false;
  return (args: T) => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, delay);
    callback(args);
  };
}
