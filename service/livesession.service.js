
import { 
    createLiveSession, 
    getLiveSession, 
    getSingleLiveSession, 
    updateLiveSession,
    cancelLiveSession,
    deleteLiveSession,
    recordingLiveSession
} from "../api/auth/livesession.api";

export const createLiveSessionService = async (data) => {
    const res = await createLiveSession(data);
    return res?.data ?? res; 
}

export const getLiveSessionService = async (params) => {
    const res = await getLiveSession(params);
    return res?.data ?? res; 
}

export const getSingleLiveSessionId = async (id) => {
    const res = await getSingleLiveSession(id);
    return res?.data ?? res;
}

export const updateLiveSessionService = async (id, data) => {
    const res = await updateLiveSession(id, data);
    return res?.data ?? res;
}

export const cancelLiveSessionService = async (id) => {
    const res = await cancelLiveSession(id);
    return res?.data ?? res;
}

export const deleteLiveSessionService = async (id) => {
    const res = await deleteLiveSession(id);
    return res?.data ?? res;
}

export const recordingLiveSessionService = async (id) => {
    const res = await recordingLiveSession(id);
    return res?.data ?? res;
}