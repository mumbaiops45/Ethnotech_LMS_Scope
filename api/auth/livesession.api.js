import api from "../../utils/axios";


export const createLiveSession = async(data) =>{
 const response = await api.post("/live-sessions", data);
 return response.data;
}


export const getLiveSession = async(params) => {
    const response = await api.get("/live-sessions", params);
    return response.data;
}


export const getSingleLiveSession = async(id) => {
    const response = await api.get(`/live-sessions/${id}`);
    return response.data;
}


export const updateLiveSession = async (id , data) => {
    const response = await api.put(`/live-sessions/${id}`, data);
    return response.data;
}

export const cancelLiveSession = async (id , data) => {
    const response = await api.patch(`/live-sessions/${id}/cancel` , data);
    return response.data;
}

export const recordingLiveSession = async (id , data) => {
    const response = await api.patch(`/live-sessions/${id}/recording`, data);
    return response.data;
}


export const joinLiveSessions = async (id , data) => {
    const response = await api.get(`/live-sessions/${id}/join`, data) ;
    return response.data;
}