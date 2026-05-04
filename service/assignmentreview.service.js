
import { getPending , getassignmentById , getassignmentGrade , publishassignment, getSubmissionassignment } from "../api/auth/assignment.review";

export const getPendingService = async (params) =>{
    const res = await getPending(params);
    return res;
};

export const getassignemntService = async (id) => {
    const res = await getassignmentById(id);
    return res.data;
}

export const getassignmentGradeService = async (id , data) => {
    const res = await getassignmentGrade(id , data);
    return res.data;
}

export const publishassignmentService = async (id) => {
    const res = await publishassignment(id);
    return res.data;
}

export const getSubmissionassignmentService = async (assignmentId) => {
    const res = await getSubmissionassignment(assignmentId);
    return res.data;
}