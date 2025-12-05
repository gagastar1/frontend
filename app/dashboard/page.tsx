'use client';

import Link from 'next/link';

export default function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🌲 Forest Management System</h1>
              <p className="text-green-100 mt-2">Comprehensive Wildlife and Resource Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Forest Management</h2>
          <p className="text-gray-600 text-lg">
            Manage and monitor forest resources, wildlife, personnel, and visitor activities all in one place.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Animals Module */}
          <Link href="/animals" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-orange-500">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🦁</span>
                <h3 className="text-2xl font-bold text-gray-800">Animals</h3>
              </div>
              <p className="text-gray-600">Track wildlife species, population counts, and conservation status</p>
              <div className="mt-4 text-orange-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Animals →
              </div>
            </div>
          </Link>

          {/* Trees Module */}
          <Link href="/trees" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-600">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🌳</span>
                <h3 className="text-2xl font-bold text-gray-800">Trees</h3>
              </div>
              <p className="text-gray-600">Monitor tree inventory, health status, and plantation records</p>
              <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Trees →
              </div>
            </div>
          </Link>

          {/* Plants Module */}
          <Link href="/plants" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-emerald-500">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🌿</span>
                <h3 className="text-2xl font-bold text-gray-800">Plants</h3>
              </div>
              <p className="text-gray-600">Catalog plant species, medicinal uses, and coverage areas</p>
              <div className="mt-4 text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Plants →
              </div>
            </div>
          </Link>

          {/* Forest Officers Module */}
          <Link href="/officers" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">👮</span>
                <h3 className="text-2xl font-bold text-gray-800">Forest Officers</h3>
              </div>
              <p className="text-gray-600">Manage staff assignments, zones, and contact information</p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Officers →
              </div>
            </div>
          </Link>

          {/* Visitors Module */}
          <Link href="/visitors" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-600">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🎫</span>
                <h3 className="text-2xl font-bold text-gray-800">Visitors</h3>
              </div>
              <p className="text-gray-600">Track visitor entries, permits, and forest zone visits</p>
              <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Visitors →
              </div>
            </div>
          </Link>

          {/* Resources Module */}
          <Link href="/resources" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-red-600">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">🛠️</span>
                <h3 className="text-2xl font-bold text-gray-800">Resources</h3>
              </div>
              <p className="text-gray-600">Monitor equipment, vehicles, and resource allocation</p>
              <div className="mt-4 text-red-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Manage Resources →
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Forest Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
