"use client";

import { useDashboardStore } from "../store/dashboard.store";

export const useDashboard = () => {
  const {
    dashboard,
    loading,
    error,
    fetchDashboard,
    clearError,
    reset,
  } = useDashboardStore();

  return {
    // Raw dashboard object
    dashboard,

    // Extracted data
    student: dashboard?.student || null,

    stats: dashboard?.stats || {
      totalEnrolledCourses: 0,
      pendingAssignments: 0,
      upcomingClasses: 0,
    },

    enrolledCourses: dashboard?.enrolledCourses || [],

    upcomingClasses: dashboard?.upcomingClasses || [],

    pendingAssignments: dashboard?.pendingAssignments || [],

    recentActivity: dashboard?.recentActivity || [],

    announcements: dashboard?.announcements || [],

    // State
    loading,
    error,

    // Actions
    fetchDashboard,
    clearError,
    reset,
  };
};