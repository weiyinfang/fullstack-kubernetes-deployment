const { Student, Course, Professor } = require('../models');

const studentController = {
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.findAll({
        include: [{ model: Course, as: 'courses' }]
      });
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(id, {
        include: [{ 
          model: Course, 
          as: 'courses',
          include: [{ model: Professor, as: 'professor' }]
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  },

  createStudent: async (req, res) => {
    try {
      const { name, student_number } = req.body;

      // Validate required fields
      if (!name || !student_number) {
        return res.status(400).json({ 
          error: 'Name and student number are required' 
        });
      }

      // Check if student number already exists
      if (student_number) {
        const existingStudent = await Student.findOne({ 
          where: { student_number } 
        });
        if (existingStudent) {
          return res.status(400).json({ 
            error: 'Student number already exists' 
          });
        }
      }

      const student = await Student.create({
        name,
        student_number
      });

      // Fetch the created student with relationships
      const createdStudent = await Student.findByPk(student.id, {
        include: [{ model: Course, as: 'courses' }]
      });

      res.status(201).json(createdStudent);
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ error: 'Failed to create student' });
    }
  },

  // PUT /api/students/:id - Update student
  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, student_number } = req.body;

      const student = await Student.findByPk(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Check if student number already exists (but not for current student)
      if (student_number && student_number !== student.student_number) {
        const existingStudent = await Student.findOne({ 
          where: { student_number } 
        });
        if (existingStudent) {
          return res.status(400).json({ 
            error: 'Student number already exists' 
          });
        }
      }

      await student.update({
        name: name || student.name,
        student_number: student_number !== undefined ? student_number : student.student_number
      });

      // Fetch updated student with relationships
      const updatedStudent = await Student.findByPk(id, {
        include: [{ model: Course, as: 'courses' }]
      });

      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  },

  // DELETE /api/students/:id - Delete student
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      await student.destroy();
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  },

  // POST /api/students/:id/courses/:courseId - Enroll student in course
  enrollInCourse: async (req, res) => {
    try {
      const { id, courseId } = req.params;

      const student = await Student.findByPk(id);
      const course = await Course.findByPk(courseId);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      await student.addCourse(course);
      
      // Return updated student with courses
      const updatedStudent = await Student.findByPk(id, {
        include: [{ model: Course, as: 'courses' }]
      });

      res.json(updatedStudent);
    } catch (error) {
      console.error('Error enrolling student in course:', error);
      res.status(500).json({ error: 'Failed to enroll student in course' });
    }
  },

  // DELETE /api/students/:id/courses/:courseId - Unenroll student from course
  unenrollFromCourse: async (req, res) => {
    try {
      const { id, courseId } = req.params;

      const student = await Student.findByPk(id);
      const course = await Course.findByPk(courseId);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      await student.removeCourse(course);
      
      // Return updated student with courses
      const updatedStudent = await Student.findByPk(id, {
        include: [{ model: Course, as: 'courses' }]
      });

      res.json(updatedStudent);
    } catch (error) {
      console.error('Error unenrolling student from course:', error);
      res.status(500).json({ error: 'Failed to unenroll student from course' });
    }
  },

  // GET /api/students/:id/courses - Get courses for a specific student
  getStudentCourses: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await Student.findByPk(id, {
        include: [{ 
          model: Course, 
          as: 'courses',
          include: [{ model: Professor, as: 'professor' }]
        }]
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student.courses);
    } catch (error) {
      console.error('Error fetching student courses:', error);
      res.status(500).json({ error: 'Failed to fetch student courses' });
    }
  }
};

module.exports = studentController;