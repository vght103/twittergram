import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const getRelativeTime = (date: string) => {
  const now = dayjs();
  const targetDate = dayjs(date);
  const diffMinutes = now.diff(targetDate, "minute");
  const diffHours = now.diff(targetDate, "hour");
  const diffDays = now.diff(targetDate, "day");

  // 1분 미만
  if (diffMinutes < 1) {
    return "방금 전";
  }

  // 1시간 미만
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  // 24시간 미만
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 1일 이상
  if (diffDays === 1) {
    return "1일 전";
  }

  // 2일 이상 - 날짜 표시
  return targetDate.format("YYYY.MM.DD");
};
