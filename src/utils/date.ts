
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM d, yyyy");
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM d, yyyy h:mm a");
};

export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const isDateAfter = (date: Date | string, compareDate: Date | string): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const compareDateObj = typeof compareDate === "string" ? parseISO(compareDate) : compareDate;
  return isAfter(dateObj, compareDateObj);
};

export const isDateBefore = (date: Date | string, compareDate: Date | string): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const compareDateObj = typeof compareDate === "string" ? parseISO(compareDate) : compareDate;
  return isBefore(dateObj, compareDateObj);
};

export const isEventLive = (startDate: Date | string, endDate: Date | string): boolean => {
  const now = new Date();
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  return isAfter(now, start) && isBefore(now, end);
};

export const isEventUpcoming = (startDate: Date | string): boolean => {
  const now = new Date();
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  return isAfter(start, now);
};

export const isEventPast = (endDate: Date | string): boolean => {
  const now = new Date();
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  return isAfter(now, end);
};

export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  
  // If same day
  if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return `${format(start, "MMMM d, yyyy")} · ${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  }
  
  // Different days
  return `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`;
};
