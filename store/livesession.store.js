"use client";

import { create } from "zustand";
import {createLiveSessionService , getLiveSessionService ,getSingleLiveSessionId , updateLiveSessionService , cancelLiveSessionService , recordingLiveSessionService} from "../service/livesession.service";

export const useLiveSessionStore = create((set) => ({
    sessions: [],
    singleSession: null,
    loading: false,
    error: null,

    fetchSessions: async (params) => {
        set({loading: true});
        try {
            const data = await getLiveSessionService(params);
            set({sessions: data , loading: false});
        } catch (error) {
            set({error, loading: false});
        }
    },

    fetchSingleSession: async(id) => {
        set({loading: true});
        try {
            const data = await getSingleLiveSessionId(id);
            set({singleSession: data , loading: false});
        } catch (error) {
            set({error, loading: false});
        }
    },

    createSession: async (payload) => {
        set({loading: true});
        try {
            await createLiveSessionService(payload);
            set({loading: false});
        } catch (error) {
            set({error , loading: false});
        }
    },
    updateSession: async (id , payload) => {
        set({loading: true});
        try {
            await updateLiveSessionService(id , payload);
            set({loading : false});
        } catch (error) {
            set({error , loading: false});
        }
    },
    deleteSession: async (id) => {
        set({loading:true , error: null});
        try {
            await cancelLiveSessionService(id);
            set({loading: false});
        } catch (error) {
            set({error , loading: false});
        }
    },
}));










