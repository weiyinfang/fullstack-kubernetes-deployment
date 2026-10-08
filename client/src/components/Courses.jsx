import { useState, useEffect } from 'react'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/courses'
import { getProfessors } from '../services/professors'
import Modal from './Modal'

function Courses() {
  const [courses, setCourses] = useState([])
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    professor_id: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, professorsData] = await Promise.all([
          getCourses(),
          getProfessors()
        ])
        setCourses(coursesData)
        setProfessors(professorsData)
      } catch (err) {
        setError('Failed to fetch data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (err) {
      console.error('Error refreshing courses:', err)
    }
  }

  const openModal = (type, course = null) => {
    setModalType(type)
    setSelectedCourse(course)
    if (type === 'create') {
      setFormData({
        name: '',
        description: '',
        tags: '',
        professor_id: ''
      })
    } else if (type === 'edit' && course) {
      setFormData({
        name: course.name,
        description: course.description,
        tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
        professor_id: course.professor_id || ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedCourse(null)
    setFormData({
      name: '',
      description: '',
      tags: '',
      professor_id: ''
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
      const courseData = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        professor_id: formData.professor_id || null
      }

      if (modalType === 'create') {
        await createCourse(courseData)
      } else if (modalType === 'edit') {
        await updateCourse(selectedCourse.id, courseData)
      }
      
      await refreshCourses()
      closeModal()
    } catch (err) {
      console.error('Error saving course:', err)
      setError('Failed to save course')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCourse(selectedCourse.id)
      await refreshCourses()
      closeModal()
    } catch (err) {
      console.error('Error deleting course:', err)
      setError('Failed to delete course')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Courses Management</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-300">Loading courses...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Courses Management</h2>
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
        <h2 className="text-3xl font-bold text-white">Courses Management</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Course
        </button>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-2">Course Overview</h3>
        <p className="text-gray-300">
          Manage all university courses, including course details, schedules, and enrollment information.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Total courses: {courses.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
            <h4 className="font-semibold text-white mb-2">{course.name}</h4>
            <p className="text-gray-300 text-sm mb-2">{course.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {course.tags && course.tags.map((tag, index) => (
                <span key={index} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">
                {course.students?.length || 0} student{course.students?.length !== 1 ? 's' : ''}
              </span>
              <div className="flex flex-col items-end">
                {course.professor && (
                  <span className="text-gray-400 text-xs mb-1">
                    Prof. {course.professor.name}
                  </span>
                )}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openModal('edit', course)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => openModal('delete', course)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="bg-gray-700 p-8 rounded-lg border border-gray-600 border-dashed flex items-center justify-center col-span-full">
            <div className="text-center">
              <p className="text-gray-300 mb-2">No courses found</p>
              <button 
                onClick={() => openModal('create')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Add First Course
              </button>
            </div>
          </div>
        )}
      </div>


      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'create' ? 'Add New Course' :
          modalType === 'edit' ? 'Edit Course' : 'Delete Course'
        }
      >
        {modalType === 'delete' ? (
          <div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{selectedCourse?.name}"? This action cannot be undone.
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
                  Course Name *
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
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="programming, web, javascript"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Professor
                </label>
                <select
                  name="professor_id"
                  value={formData.professor_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Professor</option>
                  {professors.map(professor => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
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

export default Courses
