"use client";

import { useEffect } from "react";
import { useProgressStore } from "../store/progress.store";

export const useMyProgress = (courseId) => {
    const {
        myProgress,
        getMyProgress,
        myProgressLoading,
        error
    } = useProgressStore();

    useEffect(() => {
         console.log("HOOK courseId:", courseId);
        if (courseId) {
            getMyProgress(courseId);
        }
    }, [courseId ]);

    return {
        myProgress,
        loading: myProgressLoading,
        error,
        refetch: () => getMyProgress(courseId),
    };
};

export const useStudentProgress = (studentId, courseId) => {
    const {
        studentProgress,
        getStudentProgress,
        studentProgressLoading,
        error
    } = useProgressStore();

    useEffect(() => {
        if (studentId && courseId) {
            getStudentProgress(studentId, courseId);
        }
    }, [studentId, courseId, getStudentProgress]);

    return {
        studentProgress,
        loading: studentProgressLoading,
        error,
        refetch: () => getStudentProgress(studentId, courseId),
    };
};

export const usePending = (id, params) => {
    const {
        pending,
        getPending,
        pendingLoading,
        error
    } = useProgressStore();

    useEffect(() => {
        if (id) {
            getPending(id, params);
        }
    }, [id , getPending ]);

    return {
        pending,
        loading: pendingLoading,
        error,
        refetch: () => getPending(id, params),
    };
};

export const useUpdateLessonProgress = () => {
    const {
        updateLessonProgress,
        updateLoading,
        error
    } = useProgressStore();

    return {
        updateLessonProgress,
        loading: updateLoading,
        error,
    };
};


