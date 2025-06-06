export const formatRelativeTime = (date: Date): string => {
  const now = new Date().getTime();
  const diff = Math.floor((now - date.getTime()) / 1000);

  const units = [
    { max: 60, value: 1, name: "second" },
    { max: 3600, value: 60, name: "minute" },
    { max: 86400, value: 3600, name: "hour" },
    { max: 604800, value: 86400, name: "day" },
    { max: 2419200, value: 604800, name: "week" },
  ];

  for (const unit of units) {
    if (diff < unit.max) {
      const amount = Math.floor(diff / unit.value);
      const plural = amount === 1 ? "" : "s";
      return `Last edit ${amount} ${unit.name}${plural} ago`;
    }
  }

  return `Last edit ${date.toLocaleDateString()}`;
};
