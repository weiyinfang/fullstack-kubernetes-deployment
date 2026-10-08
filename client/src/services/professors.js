import api from "./api";

const getProfessors = async () => {
    const response = await api.get('/api/professors');
    return response.data;
}

const getProfessor = async (id) => {
    const response = await api.get(`/api/professors/${id}`);
    return response.data;
}

const createProfessor = async (professorData) => {
    const response = await api.post('/api/professors', professorData);
    return response.data;
}

const updateProfessor = async (id, professorData) => {
    const response = await api.put(`/api/professors/${id}`, professorData);
    return response.data;
}

const deleteProfessor = async (id) => {
    const response = await api.delete(`/api/professors/${id}`);
    return response.data;
}

const getProfessorCourses = async (id) => {
    const response = await api.get(`/api/professors/${id}/courses`);
    return response.data;
}

const assignCourse = async (professorId, courseId) => {
    const response = await api.put(`/api/professors/${professorId}/courses/${courseId}`);
    return response.data;
}

const unassignCourse = async (professorId, courseId) => {
    const response = await api.delete(`/api/professors/${professorId}/courses/${courseId}`);
    return response.data;
}

export { 
    getProfessors, 
    getProfessor, 
    createProfessor, 
    updateProfessor, 
    deleteProfessor,
    getProfessorCourses,
    assignCourse,
    unassignCourse
};
