import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDate,
  getDaysInMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";

export function getMonthDays(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function formatMonthYear(date) {
  return format(date, "MMMM yyyy", { locale: es });
}

export function formatWeekRange(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`;
}

export function formatDayShort(date) {
  return format(date, "EEE", { locale: es });
}

export function formatDayNumber(date) {
  return getDate(date);
}

export function formatFullDate(date) {
  return format(date, "EEEE d 'de' MMMM", { locale: es });
}

export function dateKey(date) {
  return format(date, "yyyy-MM-dd");
}

export { isToday, addMonths, subMonths, addWeeks, subWeeks, getDaysInMonth };
