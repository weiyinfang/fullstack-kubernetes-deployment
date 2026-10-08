import api from './api';

const getStudents = async () => {
    const response = await api.get('/api/students');
    return response.data;
}

const getStudent = async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
}

const createStudent = async (studentData) => {
    const response = await api.post('/api/students', studentData);
    return response.data;
}

const updateStudent = async (id, studentData) => {
    const response = await api.put(`/api/students/${id}`, studentData);
    return response.data;
}

const deleteStudent = async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
}

const getStudentCourses = async (id) => {
    const response = await api.get(`/api/students/${id}/courses`);
    return response.data;
}

const enrollInCourse = async (studentId, courseId) => {
    const response = await api.post(`/api/students/${studentId}/courses/${courseId}`);
    return response.data;
}

const unenrollFromCourse = async (studentId, courseId) => {
    const response = await api.delete(`/api/students/${studentId}/courses/${courseId}`);
    return response.data;
}

export { 
    getStudents, 
    getStudent, 
    createStudent, 
    updateStudent, 
    deleteStudent,
    getStudentCourses,
    enrollInCourse,
    unenrollFromCourse
};