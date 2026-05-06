import { useEffect } from "react";
import useAnnouncementStore from "../store/announcements.store";

export const useAnnouncements = () => {
    const {announcements , fetchAnnouncements , loading , error} = useAnnouncementStore();

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    return {announcements, loading , error , refetch: fetchAnnouncements};
};


export const useSingleAnnouncement = (id) => {
  const { singleAnnouncement, fetchSingleAnnouncement, loading, error } = useAnnouncementStore();

  useEffect(() => {
    if (id) fetchSingleAnnouncement(id);
  }, [id, fetchSingleAnnouncement]);

  return { singleAnnouncement, loading, error, refetch: () => fetchSingleAnnouncement(id) };
};



export const useCreateAnnouncement = () => {
  const { addAnnouncement, loading, error } = useAnnouncementStore();

  const create = async (data) => {
    await addAnnouncement(data);
  };

  return { createAnnouncement: create, loading, error };
};


