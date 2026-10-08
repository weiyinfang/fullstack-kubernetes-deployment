import { useState, useEffect } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../services/students'
import Modal from './Modal'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    student_number: ''
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      setError('Failed to fetch students')
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (type, student = null) => {
    setModalType(type)
    setSelectedStudent(student)
    if (type === 'create') {
      setFormData({
        name: '',
        student_number: ''
      })
    } else if (type === 'edit' && student) {
      setFormData({
        name: student.name,
        student_number: student.student_number || ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedStudent(null)
    setFormData({
      name: '',
      student_number: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const studentData = {
        name: formData.name,
        student_number: formData.student_number ? parseInt(formData.student_number) : null
      }

      if (modalType === 'create') {
        await createStudent(studentData)
      } else if (modalType === 'edit') {
        await updateStudent(selectedStudent.id, studentData)
      }
      
      await fetchStudents()
      closeModal()
    } catch (err) {
      console.error('Error saving student:', err)
      setError('Failed to save student')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteStudent(selectedStudent.id)
      await fetchStudents()
      closeModal()
    } catch (err) {
      console.error('Error deleting student:', err)
      setError('Failed to delete student')
    }
  }

  const getInitials = (name) => {
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Students Management</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-300">Loading students...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Students Management</h2>
        </div>
        <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Students Management</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Student
        </button>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-2">Student Overview</h3>
        <p className="text-gray-300">
          Manage student information, enrollment status, academic records, and course registrations.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Total students: {students.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials(student.name)}
              </div>
              <div>
                <h4 className="font-semibold text-white">{student.name}</h4>
                <p className="text-gray-300 text-sm">Student #{student.student_number}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">ID: {student.id}</span>
              <div className="flex flex-col items-end">
                {student.courses && student.courses.length > 0 && (
                  <span className="text-gray-400 text-xs mb-1">
                    {student.courses.length} course{student.courses.length !== 1 ? 's' : ''}
                  </span>
                )}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openModal('edit', student)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => openModal('delete', student)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <div className="bg-gray-700 p-8 rounded-lg border border-gray-600 border-dashed flex items-center justify-center col-span-full">
            <div className="text-center">
              <p className="text-gray-300 mb-2">No students found</p>
              <button 
                onClick={() => openModal('create')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Add First Student
              </button>
            </div>
          </div>
        )}
      </div>


      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'create' ? 'Add New Student' :
          modalType === 'edit' ? 'Edit Student' : 'Delete Student'
        }
      >
        {modalType === 'delete' ? (
          <div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{selectedStudent?.name}"? This action cannot be undone and will remove the student from all courses.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Student Number
                </label>
                <input
                  type="number"
                  name="student_number"
                  value={formData.student_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12345"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {modalType === 'create' ? 'Create' : 'Save'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default Students
