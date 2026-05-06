import { useCertificateStore } from "../store/certificate.store";


export const useCertificate =() =>{
    const {
        courses,
        students,
        certificates,
        allCertificates,
        downloadLogs,
        loading,
        error,
        fetchMyCertificates,
        downloadCertificateById,
        fetchAllCertificates,
        triggerAutoGeneration,
        manualGenerate,
        fetchDownloadLogs,
        fetchCourses,
        fetchStudents
        
    } = useCertificateStore();

    return {
        courses,
        students,
        certificates,
        allCertificates,
        downloadLogs,
        loading,
        error,
        fetchMyCertificates,
        downloadCertificateById,
        fetchAllCertificates,
        triggerAutoGeneration,
        manualGenerate,
        fetchDownloadLogs,
        fetchCourses,
        fetchStudents

    };
}