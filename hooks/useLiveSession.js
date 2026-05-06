import { useLiveSessionStore } from "../store/livesession.store";

export const useLiveSession = () => {
    const { sessions, singleSession, loading, error, fetchSessions, fetchSingleSession , createSession , updateSession , cancelSession , deleteSession } = useLiveSessionStore();

    return {
    sessions,
    singleSession,
    loading,
    error,
    fetchSessions,
    fetchSingleSession,
    createSession,
    updateSession,
    cancelSession,
    deleteSession,
  };

}