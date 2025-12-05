'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { resourceAPI } from '@/lib/api';
import { Resource } from '@/types';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceAPI.getAll();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      alert('Failed to fetch resources. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setFormData(resource);
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await resourceAPI.delete(id);
      await fetchResources();
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await resourceAPI.update(editingId, formData as Resource);
        alert('Resource updated successfully!');
      } else {
        await resourceAPI.create(formData as Omit<Resource, 'id'>);
        alert('Resource added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      await fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource.');
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
      name: '',
      type: '',
      quantity: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      assignedOfficerId: undefined
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      if (filterType) {
        const data = await resourceAPI.getByType(filterType);
        setResources(data);
      } else {
        await fetchResources();
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      alert('Failed to apply filters.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterType('');
    fetchResources();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white hover:text-red-100 transition-colors">
                ← Back
              </Link>
              <span className="text-4xl">🛠️</span>
              <h1 className="text-4xl font-bold">Resources Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Resource
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
              placeholder="Filter by Type (e.g., Vehicle, Equipment, Tools)"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
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
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-red-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="e.g., Forest Patrol Vehicle"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                >
                  <option value="">Select Type</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Tools">Tools</option>
                  <option value="Communication">Communication</option>
                  <option value="Safety Gear">Safety Gear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity || 0}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Maintenance</label>
                <input
                  type="date"
                  value={formData.lastMaintenance || ''}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Officer ID (Optional)</label>
                <input
                  type="number"
                  value={formData.assignedOfficerId || ''}
                  onChange={(e) => setFormData({ ...formData, assignedOfficerId: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="Officer ID"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors shadow-md"
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
              <thead className="bg-gradient-to-r from-red-700 to-red-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold">Last Maintenance</th>
                  <th className="px-6 py-4 text-left font-semibold">Assigned Officer</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                      </div>
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No resources found. Add your first resource to get started!
                    </td>
                  </tr>
                ) : (
                  resources.map((resource, index) => (
                    <tr
                      key={resource.id}
                      className={`hover:bg-red-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{resource.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{resource.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{resource.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {resource.lastMaintenance ? new Date(resource.lastMaintenance).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {resource.assignedOfficerId ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Officer #{resource.assignedOfficerId}
                          </span>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
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
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Resources</h3>
            <p className="text-3xl font-bold text-red-700">{resources.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Quantity</h3>
            <p className="text-3xl font-bold text-red-600">
              {resources.reduce((sum, r) => sum + (r.quantity || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Assigned</h3>
            <p className="text-3xl font-bold text-green-600">
              {resources.filter((r) => r.assignedOfficerId).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unique Types</h3>
            <p className="text-3xl font-bold text-red-700">
              {new Set(resources.map((r) => r.type)).size}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
