"use client";

import { create } from "zustand";
import {
    createLiveSessionService,
    getLiveSessionService,
    getSingleLiveSessionId,
    updateLiveSessionService,
    cancelLiveSessionService,
    deleteLiveSessionService 
} from "../service/livesession.service";

export const useLiveSessionStore = create((set) => ({
    sessions: [],
    singleSession: null,
    loading: false,
    error: null,

    fetchSessions: async (params) => {
        set({ loading: true, error: null });
        try {
            const data = await getLiveSessionService(params);
            
            const list = Array.isArray(data) ? data : data?.sessions ?? [];
            set({ sessions: list, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchSingleSession: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await getSingleLiveSessionId(id);
            set({ singleSession: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    createSession: async (payload) => {
        set({ loading: true, error: null });
        try {
            await createLiveSessionService(payload);
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    updateSession: async (id, payload) => {
        set({ loading: true, error: null });
        try {
            await updateLiveSessionService(id, payload); 
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    deleteSession: async (id) => {
        set({ loading: true, error: null });
        try {
            await deleteLiveSessionService(id); 
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    cancelSession: async (id) => {
        set({ loading: true, error: null });
        try {
            await cancelLiveSessionService(id);
            set({ loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));





