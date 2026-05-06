import { create } from "zustand";
import {createAnnouncementService , getAnnouncementsService, getSingleAnnouncementService} from "../service/announcemnets.service";


const useAnnouncementStore = create (( set, get) => ({
    announcements: [],
    signgleAnnouncement: null,
    loading: false,
    error: null,


    fetchAnnouncements: async () => {
        set({ loading: true , error: null});
        try {
            const data = await getAnnouncementsService();
            set({ announcements:data , loading: false});
        } catch (error) {
           set({ error: error.message || "Failed to fetch announcements", loading: false });  
        }
    },
    fetchSingleAnnouncement: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getSingleAnnouncementService(id);
      set({ singleAnnouncement: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch announcement", loading: false });
    }
  },
  addAnnouncement: async (announcementData) => {
    set({ loading: true, error: null });
    try {
      const newAnnouncement = await createAnnouncementService(announcementData);
      set((state) => ({
        announcements: [newAnnouncement, ...state.announcements],
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || "Failed to create announcement", loading: false });
    }
  },

}));



export default useAnnouncementStore;