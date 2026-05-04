
import api from "../../utils/axios";

export const getPending = async (params) =>{
    const response = await api.get("/submissions/pending", {params});
    return response.data;
}

export const getassignmentById = async(id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
}

export const getassignmentGrade = async(id , data) => {
    const response = await api.put(`/submissions/${id}/grade`, data);
    return response.data;
}

export const publishassignment = async (id ) => {
    const response = await api.patch(`/submissions/${id}/publish`);
    return response.data;
}

export const getSubmissionassignment = async (assignmentId , data) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);

    return response.data;
}