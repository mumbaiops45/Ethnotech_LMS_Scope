import {MyCourse , getMyBatches , getMyStudents , getMyDashboard } from "../api/auth/instructor.api";


export const getMyCourseService = async (params) => {
    const res = await MyCourse(params);
    return res;
}

export const getMyBatchesService = async (params) => {
    const res = await getMyBatches(params);
    return res;
}

export const getMyStudentsService = async (params) => {
    const res = await getMyStudents(params);
    return res;
}

export const getMyDashboardService  = async (params) =>{
    const res = await getMyDashboard(params);
    return res;
}


