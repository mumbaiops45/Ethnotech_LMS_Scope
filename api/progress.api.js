// import api from "../../utils/axios";
import api from "../utils/axios";

export const getMyProgress = async (courseId) => {
    const response = await api.get(`/progress/my/${courseId}`);
    return response.data?.data ?? response.data;
};

export const updateLessonProgress = async (body) => {
    const response = await api.post(`/progress/update-lesson`, body);
    // return response.data;
    return response.data?.data ?? response.data;
};

export const getPending = async (id, params) => {
    const response = await api.get(`/progress/batch/${id}`, { params });
    // return response.data;
    return response.data?.data ?? response.data;
};

export const getStudentProgress = async (studentId, courseId) => {
    const response = await api.get(`/progress/${studentId}/${courseId}`);
    // return response.data;
    return response.data?.data ?? response.data;
};