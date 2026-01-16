// Utility functions for Worker Dashboard

import type { ApiServiceRequest } from "@/types/workerDashboard";

// Status checking utilities
export const isConfirmedStatus = (status: string | null | undefined): boolean =>
  ["confirmed", "Confirmed", "accepted", "Accepted", "in_progress", "IN_PROGRESS"].includes(status || "");

export const isPendingStatus = (status: string | null | undefined): boolean =>
  ["pending", "Pending"].includes(status || "");

export const isCompletedStatus = (status: string | null | undefined): boolean =>
  ["completed", "Completed", "done", "Done"].includes(status || "");

export const isCancelledStatus = (status: string | null | undefined): boolean =>
  ["cancelled", "Cancelled", "canceled", "Canceled"].includes(status || "");

export const isCompletedByWorkerStatus = (status: string | null | undefined): boolean =>
  ["completed_by_worker", "COMPLETED_BY_WORKER"].includes(status || "");

export const isInProgressStatus = (status: string | null | undefined): boolean =>
  ["in_progress", "IN_PROGRESS", "confirmed", "Confirmed", "accepted", "Accepted"].includes(status || "");

// Date/Time utilities
export const isToday = (dateStr: string | null | undefined): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isFuture = (dateStr: string | null | undefined): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  return date > now;
};

export const getCountdown = (dateStr: string | null | undefined, timeStr?: string | null): string => {
  if (!dateStr) return "";
  let targetStr = dateStr;
  if (timeStr) {
    targetStr = `${dateStr.split("T")[0]}T${timeStr}`;
  }
  const target = new Date(targetStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export const getDefaultWorkTimes = (): { startTime: string; endTime: string } => {
  const now = new Date();
  const defaultEndTime = now.toTimeString().slice(0, 5);
  const startTime = new Date(now.getTime() - 60 * 60 * 1000);
  const defaultStartTime = startTime.toTimeString().slice(0, 5);
  return { startTime: defaultStartTime, endTime: defaultEndTime };
};

// Data filtering utilities
export const filterWorkHistory = (workHistory: ApiServiceRequest[]) => {
  const todaysWorks = workHistory.filter((w) => isToday(w.selected_date) && isConfirmedStatus(w.status));
  const upcomingWorks = workHistory.filter(
    (w) => isFuture(w.selected_date) && !isToday(w.selected_date) && isConfirmedStatus(w.status)
  );
  const confirmedWorks = workHistory.filter(
    (w) => isConfirmedStatus(w.status) && !isCompletedByWorkerStatus(w.status)
  );
  const pendingWorks = workHistory.filter((w) => isPendingStatus(w.status));
  const completedWorks = workHistory.filter((w) => isCompletedStatus(w.status));
  const cancelledWorks = workHistory.filter((w) => isCancelledStatus(w.status));
  const awaitingConfirmationWorks = workHistory.filter((w) => isCompletedByWorkerStatus(w.status));

  return {
    todaysWorks,
    upcomingWorks,
    confirmedWorks,
    pendingWorks,
    completedWorks,
    cancelledWorks,
    awaitingConfirmationWorks,
  };
};

export const calculateStats = (todaysWorks: ApiServiceRequest[], confirmedWorks: ApiServiceRequest[], pendingWorks: ApiServiceRequest[]) => {
  return {
    todayAppointments: todaysWorks.length,
    confirmed: confirmedWorks.length,
    pending: pendingWorks.length,
    availableSlots: 10 - todaysWorks.length,
  };
};

// Client info helper
export const getClientInfo = (request: ApiServiceRequest) => {
  const clientData = request.users_orders_client_idTousers;
  return {
    name: clientData?.select?.full_name || clientData?.full_name || "Client",
    picture: clientData?.select?.profile_picture || clientData?.profile_picture || null,
  };
};
