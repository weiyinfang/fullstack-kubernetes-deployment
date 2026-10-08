const express = require('express');
require('dotenv').config();
const { courseController, studentController, professorController } = require('./controllers');

const app = express();

app.use(require('cors')());
app.use(express.json());

// Basic Routes
app.get('/', (req, res) => {
  res.json({ message: 'API Server Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Course Routes
app.get('/api/courses', courseController.getAllCourses);
app.get('/api/courses/:id', courseController.getCourseById);
app.post('/api/courses', courseController.createCourse);
app.put('/api/courses/:id', courseController.updateCourse);
app.delete('/api/courses/:id', courseController.deleteCourse);
app.post('/api/courses/:id/students/:studentId', courseController.addStudentToCourse);
app.delete('/api/courses/:id/students/:studentId', courseController.removeStudentFromCourse);

// Student Routes
app.get('/api/students', studentController.getAllStudents);
app.get('/api/students/:id', studentController.getStudentById);
app.post('/api/students', studentController.createStudent);
app.put('/api/students/:id', studentController.updateStudent);
app.delete('/api/students/:id', studentController.deleteStudent);
app.get('/api/students/:id/courses', studentController.getStudentCourses);
app.post('/api/students/:id/courses/:courseId', studentController.enrollInCourse);
app.delete('/api/students/:id/courses/:courseId', studentController.unenrollFromCourse);

// Professor Routes
app.get('/api/professors', professorController.getAllProfessors);
app.get('/api/professors/:id', professorController.getProfessorById);
app.post('/api/professors', professorController.createProfessor);
app.put('/api/professors/:id', professorController.updateProfessor);
app.delete('/api/professors/:id', professorController.deleteProfessor);
app.get('/api/professors/:id/courses', professorController.getProfessorCourses);
app.put('/api/professors/:id/courses/:courseId', professorController.assignCourse);
app.delete('/api/professors/:id/courses/:courseId', professorController.unassignCourse);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

module.exports = app;