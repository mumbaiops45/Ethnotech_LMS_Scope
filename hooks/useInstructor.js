import { useInstructorStore } from "../store/instructor.store";

export const useInstructor = () => {
    const {
        courses,
        batches,
        students,
        dashboard,
        loading ,
        error ,
        fetchCourses,
        fetchBatches,
        fetchStudents,
        fetchDashboard
    } = useInstructorStore();


     return {
    courses,
    batches,
    students,
    dashboard,
    loading,
    error,
    fetchCourses,
    fetchBatches,
    fetchStudents,
    fetchDashboard
  };
}