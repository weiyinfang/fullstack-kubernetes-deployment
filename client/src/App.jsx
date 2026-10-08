import { useState } from 'react'
import Courses from './components/Courses'
import Students from './components/Students'
import Professors from './components/Professors'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <Courses />
      case 'students':
        return <Students />
      case 'professors':
        return <Professors />
      default:
        return (
          <div className="flex flex-col items-center justify-center min-w-[80vw] text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-white mb-4">
                Welcome to the
              </h1>
              <h2 className="text-5xl font-bold text-blue-400">
                University Management System
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
              Manage your academic institution with ease. Organize courses, track students, 
              and coordinate with professors all in one comprehensive platform.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-lg font-bold text-blue-400 mb-2">Courses</div>
                <div className="text-sm text-gray-300">Manage academic courses</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-lg font-bold text-blue-400 mb-2">Students</div>
                <div className="text-sm text-gray-300">Track student records</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="text-lg font-bold text-blue-400 mb-2">Professors</div>
                <div className="text-sm text-gray-300">Manage faculty data</div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <nav className="bg-blue-600 shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">
                University Management System
              </span>
            </div>
            <div className="flex space-x-1 ml-auto">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'home'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'courses'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'students'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('professors')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'professors'
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                Professors
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className={`flex-1 w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-6 ${activeTab === 'home' ? 'flex items-center justify-center' : ''}`}>
        <div className={`bg-gray-800 rounded-xl shadow-lg w-full overflow-hidden ${activeTab === 'home' ? 'h-[50vh] flex items-center justify-center' : 'min-h-[80vh]'}`}>
          <div className="p-10">
            {renderContent()}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-gray-400 text-sm">
            © CSS 2025
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
