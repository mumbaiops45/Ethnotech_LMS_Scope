import api from "../../utils/axios";

export const MyCourse = async (data) => {
    const response = await api.get("/instructor/my-courses", data);
    return response.data;
}


export const getMyBatches = async (data) =>{
    const response = await api.get("/instructor/my-batches", data);
    return response.data;
}

export const getMyStudents = async (data) => {
    const response = await api.get("/instructor/my-students", data);
    return response.data;
}

export const getMyDashboard = async (data) => {
    const response = await api.get("/instructor/my-dashboard", data);
    return response.data;
}


