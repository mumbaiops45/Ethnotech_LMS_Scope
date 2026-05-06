import {createAnnouncement , getAnnouncements , getSingleAnnouncement} from "../api/auth/announcements.api";


export const createAnnouncementService = async (data) =>{
    const response = await createAnnouncement(data);
    return response;
}

export const getAnnouncementsService = async (data) =>{
    const response = await getAnnouncements(data);
    return response;
}


export const getSingleAnnouncementService = async (id) =>{
    const response = await getSingleAnnouncement(id);
    return response;
} 