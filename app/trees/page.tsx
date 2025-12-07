'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { treeAPI } from '@/lib/api';
import { Tree } from '@/types';

export default function TreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Tree>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterZone, setFilterZone] = useState('');

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const data = await treeAPI.getAll();
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
      alert('Failed to fetch trees. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tree: Tree) => {
    setEditingId(tree.treeId!);
    setFormData(tree);
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tree?')) return;
    
    try {
      await treeAPI.delete(id);
      await fetchTrees();
      alert('Tree deleted successfully!');
    } catch (error) {
      console.error('Error deleting tree:', error);
      alert('Failed to delete tree.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await treeAPI.update(editingId, formData as Tree);
        alert('Tree updated successfully!');
      } else {
        await treeAPI.create(formData as Omit<Tree, 'id'>);
        alert('Tree added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      await fetchTrees();
    } catch (error) {
      console.error('Error saving tree:', error);
      alert('Failed to save tree.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      commonName: '',
      scientificName: '',
      location: '',
      zone: '',
      heightMeters: 0,
      ageYears: 0,
      diameterCm: 0,
      healthStatus: '',
      plantationDate: new Date().toISOString().split('T')[0],
      treeType: ''
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      if (filterZone) {
        const data = await treeAPI.getByZone(filterZone);
        setTrees(data);
      } else {
        await fetchTrees();
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      alert('Failed to apply filters.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterZone('');
    fetchTrees();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
        style={{ backgroundImage: 'url(/trees.png)' }}
      />
      
      {/* Content */}
      <div className="relative z-10">
      <header className="bg-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white hover:text-green-100 transition-colors">
                ← Back
              </Link>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <img src="/trees-dashboard.png" alt="Trees" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-4xl font-bold">Trees Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Tree
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Filter by Zone"
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Tree' : 'Add New Tree'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Common Name</label>
                <input
                  type="text"
                  value={formData.commonName || ''}
                  onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  placeholder="e.g., Oak"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scientific Name</label>
                <input
                  type="text"
                  value={formData.scientificName || ''}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  placeholder="e.g., Quercus"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.heightMeters || 0}
                  onChange={(e) => setFormData({ ...formData, heightMeters: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={formData.ageYears || 0}
                  onChange={(e) => setFormData({ ...formData, ageYears: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diameter (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.diameterCm || 0}
                  onChange={(e) => setFormData({ ...formData, diameterCm: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  placeholder="e.g., North Forest Section 3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                <input
                  type="text"
                  value={formData.zone || ''}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  placeholder="e.g., Zone A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tree Type</label>
                <select
                  value={formData.treeType || ''}
                  onChange={(e) => setFormData({ ...formData, treeType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                >
                  <option value="">Select Type</option>
                  <option value="Deciduous">Deciduous</option>
                  <option value="Evergreen">Evergreen</option>
                  <option value="Coniferous">Coniferous</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Health Status</label>
                <select
                  value={formData.healthStatus || ''}
                  onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                >
                  <option value="">Select Status</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Needs Care">Needs Care</option>
                  <option value="Diseased">Diseased</option>
                  <option value="Dead">Dead</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plantation Date</label>
                <input
                  type="date"
                  value={formData.plantationDate || ''}
                  onChange={(e) => setFormData({ ...formData, plantationDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors shadow-md"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Common Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Scientific Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Height (m)</th>
                  <th className="px-6 py-4 text-left font-semibold">Age (years)</th>
                  <th className="px-6 py-4 text-left font-semibold">Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Health Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Plantation Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                      </div>
                    </td>
                  </tr>
                ) : trees.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No trees found. Add your first tree to get started!
                    </td>
                  </tr>
                ) : (
                  trees.map((tree, index) => (
                    <tr
                      key={tree.treeId}
                      className={`hover:bg-green-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{tree.treeId}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{tree.commonName}</td>
                      <td className="px-6 py-4 text-gray-700">{tree.scientificName}</td>
                      <td className="px-6 py-4 text-gray-700">{tree.heightMeters}</td>
                      <td className="px-6 py-4 text-gray-700">{tree.ageYears}</td>
                      <td className="px-6 py-4 text-gray-700">{tree.zone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tree.healthStatus === 'Healthy'
                              ? 'bg-green-100 text-green-800'
                              : tree.healthStatus === 'Needs Care'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {tree.healthStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {tree.plantationDate ? new Date(tree.plantationDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(tree)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tree.treeId!)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Trees</h3>
            <p className="text-3xl font-bold text-green-700">{trees.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Healthy Trees</h3>
            <p className="text-3xl font-bold text-green-600">
              {trees.filter((t) => t.healthStatus === 'Healthy').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Needs Care</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {trees.filter((t) => t.healthStatus === 'Needs Care').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Average Height</h3>
            <p className="text-3xl font-bold text-green-700">
              {trees.length > 0 ? (trees.reduce((sum, t) => sum + (t.heightMeters || 0), 0) / trees.length).toFixed(1) : 0}m
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
