import { useLiveSessionStore } from "../store/livesession.store";

export const useLiveSession = () => {
    const { sessions, singleSession, loading, error, fetchSessions, fetchSingleSession , createSession , updateSession , deleteSession } = useLiveSessionStore();

    return {
    sessions,
    singleSession,
    loading,
    error,
    fetchSessions,
    fetchSingleSession,
    createSession,
    updateSession,
    deleteSession,
  };

}