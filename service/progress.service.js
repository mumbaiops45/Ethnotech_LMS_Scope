// import {getMyProgress , updateLessonProgress ,getPending , getStudentProgress,  } from "../api/auth/progress.api";
import { getMyProgress , updateLessonProgress , getPending,getStudentProgress  } from "../api/progress.api";


export const getMyProgressService = async (courseId) => {
    const res = await getMyProgress(courseId);
  console.log("SERVICE RESPONSE:", res);
    return res;
}

export const updateLessonProgressService = async (body) =>{
    const res = await updateLessonProgress(body);
    return res;
}


export const getPendingService = async (id , params) => {
    const res = await getPending(id ,params);
    return res;
}

export  const getStudentProgressService = async(studentId, courseId) => {
    const res = await getStudentProgress(studentId, courseId);
    return res;
}
