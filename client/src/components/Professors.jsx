import { useState, useEffect } from 'react'
import { getProfessors, createProfessor, updateProfessor, deleteProfessor } from '../services/professors'
import Modal from './Modal'

function Professors() {
  const [professors, setProfessors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const data = await getProfessors()
      setProfessors(data)
    } catch (err) {
      setError('Failed to fetch professors')
      console.error('Error fetching professors:', err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (type, professor = null) => {
    setModalType(type)
    setSelectedProfessor(professor)
    if (type === 'create') {
      setFormData({
        name: '',
        email: ''
      })
    } else if (type === 'edit' && professor) {
      setFormData({
        name: professor.name,
        email: professor.email
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedProfessor(null)
    setFormData({
      name: '',
      email: ''
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
      const professorData = {
        name: formData.name,
        email: formData.email
      }

      if (modalType === 'create') {
        await createProfessor(professorData)
      } else if (modalType === 'edit') {
        await updateProfessor(selectedProfessor.id, professorData)
      }
      
      await fetchProfessors()
      closeModal()
    } catch (err) {
      console.error('Error saving professor:', err)
      setError('Failed to save professor')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProfessor(selectedProfessor.id)
      await fetchProfessors()
      closeModal()
    } catch (err) {
      console.error('Error deleting professor:', err)
      setError('Failed to delete professor. Make sure the professor has no assigned courses.')
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
          <h2 className="text-3xl font-bold text-white">Professors Management</h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-300">Loading professors...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-3xl font-bold text-white">Professors Management</h2>
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
        <h2 className="text-3xl font-bold text-white">Professors Management</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Professor
        </button>
      </div>
      
      <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-2">Faculty Overview</h3>
        <p className="text-gray-300">
          Manage faculty information, course assignments, academic credentials, and teaching schedules.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Total professors: {professors.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professors.map((professor) => (
          <div key={professor.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getInitials(professor.name)}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-1">
                  {professor.name}
                </h4>
                <p className="text-gray-300 mb-2">Professor</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                  <span>{professor.email}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {professor.courses && professor.courses.length > 0 ? (
                    professor.courses.map((course) => (
                      <span key={course.id} className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs font-medium">
                        {course.name}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs font-medium">
                      No courses assigned
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openModal('edit', professor)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => openModal('delete', professor)}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {professors.length === 0 && (
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors col-span-full">
            <div className="text-center">
              <p className="text-gray-300 mb-2">No professors found</p>
              <button 
                onClick={() => openModal('create')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Add First Professor
              </button>
            </div>
          </div>
        )}
      </div>


      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'create' ? 'Add New Professor' :
          modalType === 'edit' ? 'Edit Professor' : 'Delete Professor'
        }
      >
        {modalType === 'delete' ? (
          <div>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{selectedProfessor?.name}"? This action cannot be undone. 
              Note: Professors with assigned courses cannot be deleted.
            </p>
            {selectedProfessor?.courses?.length > 0 && (
              <div className="bg-yellow-900 border border-yellow-700 p-3 rounded mb-4">
                <p className="text-yellow-200 text-sm">
                  This professor has {selectedProfessor.courses.length} assigned course(s). 
                  Please reassign or delete the courses first.
                </p>
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={selectedProfessor?.courses?.length > 0}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
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
                  Professor Name *
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
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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

export default Professors
