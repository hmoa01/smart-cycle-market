import { DateTime } from "luxon";

const customizeRelativeDate = (relativeDate: string | null) => {
  if (relativeDate) {
    return (relativeDate = relativeDate
      .replace("hours", "hrs")
      .replace("hour", "hr")
      .replace("minutes", "min")
      .replace("minute", "min")
      .replace("seconds", "sec")
      .replace("second", "sec"));
  }
};

export const formatDate = (dateString: string, format = "") => {
  const date = DateTime.fromISO(dateString);
  if (format) {
    return date.toFormat(format);
  }

  const now = DateTime.now();

  // If the date is within the last 7 days
  if (date.hasSame(now, "day")) {
    return customizeRelativeDate(date.toRelative());
  }
  //checking if it is yesterday
  else if (date.hasSame(now.minus({ days: 1 }), "day")) {
    return "Yesterday";
  }
  // if this is from the same week
  else if (date > now.minus({ days: 6 })) {
    // "EEE" format for day of the week
    return date.toFormat("EEE");
  } else {
    //older then a week, show full date
    return date.toFormat("dd/MM/yy");
  }
};
