// createLiveSession
import { createLiveSession  , getLiveSession, getSingleLiveSession, updateLiveSession,
    cancelLiveSession, recordingLiveSession
} from "../api/auth/livesession.api";


export const createLiveSessionService = async (data) => {
    const res = await createLiveSession(data);
    return res.data;
}


export const getLiveSessionService = async (params) => {
    const res = await getLiveSession(params);
    return res.data;
}

export const getSingleLiveSessionId = async (id) => {
    const res = await getSingleLiveSession(id);
    return res.data;
}

export const updateLiveSessionService = async (id , data) =>{
    const res = await updateLiveSession(id);
    return res.data;
}


export const cancelLiveSessionService = async (id , data) => {
    const res = await cancelLiveSession(id);
    return res.data;
}

export const recordingLiveSessionService = async (id, data) =>{
    const res = await recordingLiveSession(id);
    return res.data;
}

