import { create } from "zustand";
import {
    getMyProgressService , updateLessonProgressService,
    getPendingService , getStudentProgressService
} from "../service/progress.service";


export const useProgressStore = create((set , get) => ({
    myProgress: null,
    studentProgress: null,
    pending: null,

    // loading: false,
    myProgressLoading: false,
    studentProgressLoading: false,
    pendingLoading: false,
    updateLoading: false,

    error: null,

    getMyProgress: async (courseId) => {
        // set({loading: true , error: null});
         set({ myProgressLoading: true, error: null });

        try {
            const data = await getMyProgressService(courseId);
            console.log("STORE DATA:", data);
            set({myProgress: data, myProgressLoading: false});
            return data;
        } catch (error) {
            set({error: error.message , myProgressLoading: false});
        }
    },
    updateLessonProgress: async ( body) => {
        set({updateLoading: true , error: null});

        try {
            const data = await updateLessonProgressService(body);
            set({updateLoading: false});

            return data;
        } catch (error) {
             set({ error: error.message, updateLoading: false });
        }
    },
    getPending: async (id , params) => {
        set({pendingLoading: true , error: null});

        try {
            const data = await getPendingService(id , params);
            set({pending: data , pendingLoading: false});
            return data;
        } catch (error) {
           set({ error: error.message, pendingLoading: false });  
        }
    },

    getStudentProgress: async (studentId, courseId) => {
        set({studentProgressLoading: true , error: null});

        try {
            const data = await getStudentProgressService(studentId , courseId);
            set({studentProgress: data , studentProgressLoading: false});
            return data;
        } catch (error) {
            set({error: error.message , studentProgressLoading: false});
        }
    },

    resetProgress: () => {
        set({
            myProgress: null,
            studentProgress: null,
            pending: null,
            error: null
        });
    }

}))