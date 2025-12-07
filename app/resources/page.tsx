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
    setEditingId(resource.resourceId!);
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
        await resourceAPI.create(formData as Omit<Resource, 'resourceId'>);
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
      resourceName: '',
      resourceType: '',
      quantity: 0,
      unit: '',
      location: '',
      assignedZone: '',
      conditionStatus: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      cost: 0
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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <img src="/resources-dashboard.png" alt="Resources" className="w-full h-full object-cover" />
              </div>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Name</label>
                <input
                  type="text"
                  value={formData.resourceName || ''}
                  onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="e.g., Forest Patrol Vehicle"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Type</label>
                <select
                  value={formData.resourceType || ''}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="e.g., pcs, kg, liters"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="e.g., Storage Room A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Zone</label>
                <input
                  type="text"
                  value={formData.assignedZone || ''}
                  onChange={(e) => setFormData({ ...formData, assignedZone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                  placeholder="e.g., Zone A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition Status</label>
                <select
                  value={formData.conditionStatus || ''}
                  onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                >
                  <option value="">Select Condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost || 0}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Date</label>
                <input
                  type="date"
                  value={formData.purchaseDate || ''}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Maintenance Date</label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate || ''}
                  onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Next Maintenance Date</label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate || ''}
                  onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
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
                  <th className="px-6 py-4 text-left font-semibold">Resource Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold">Unit</th>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                  <th className="px-6 py-4 text-left font-semibold">Assigned Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Condition</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                      </div>
                    </td>
                  </tr>
                ) : resources.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No resources found. Add your first resource to get started!
                    </td>
                  </tr>
                ) : (
                  resources.map((resource, index) => (
                    <tr
                      key={resource.resourceId}
                      className={`hover:bg-red-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{resource.resourceId}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{resource.resourceName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {resource.resourceType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{resource.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">{resource.unit}</td>
                      <td className="px-6 py-4 text-gray-700">{resource.location}</td>
                      <td className="px-6 py-4 text-gray-700">{resource.assignedZone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          resource.conditionStatus === 'Excellent' ? 'bg-green-100 text-green-800' :
                          resource.conditionStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                          resource.conditionStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resource.conditionStatus}
                        </span>
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
                            onClick={() => handleDelete(resource.resourceId!)}
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
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Cost</h3>
            <p className="text-3xl font-bold text-green-600">
              ${resources.reduce((sum, r) => sum + (r.cost || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unique Types</h3>
            <p className="text-3xl font-bold text-red-700">
              {new Set(resources.map((r) => r.resourceType)).size}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
