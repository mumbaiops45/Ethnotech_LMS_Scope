import api from "../../utils/axios";


export const createAnnouncement = async (data) =>{
    const response = await api.post("/announcements", data);
   return response.data;
}


export const getAnnouncements = async (data)  =>{
    const response = await api.get("/announcements", data);
    return response.data;
}


export const getSingleAnnouncement = async(id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
}