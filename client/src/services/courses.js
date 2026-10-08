import api from './api';

const getCourses = async () => {
    const response = await api.get('/api/courses');
    return response.data;
}

const getCourse = async (id) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
}

const createCourse = async (courseData) => {
    const response = await api.post('/api/courses', courseData);
    return response.data;
}

const updateCourse = async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
}

const deleteCourse = async (id) => {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
}

const addStudentToCourse = async (courseId, studentId) => {
    const response = await api.post(`/api/courses/${courseId}/students/${studentId}`);
    return response.data;
}

const removeStudentFromCourse = async (courseId, studentId) => {
    const response = await api.delete(`/api/courses/${courseId}/students/${studentId}`);
    return response.data;
}

export { 
    getCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse,
    addStudentToCourse,
    removeStudentFromCourse
};