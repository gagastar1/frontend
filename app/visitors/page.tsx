'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { visitorAPI } from '@/lib/api';
import { Visitor } from '@/types';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Visitor>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await visitorAPI.getAll();
      setVisitors(data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      alert('Failed to fetch visitors. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingId(visitor.id);
    setFormData(visitor);
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this visitor?')) return;
    
    try {
      await visitorAPI.delete(id);
      await fetchVisitors();
      alert('Visitor deleted successfully!');
    } catch (error) {
      console.error('Error deleting visitor:', error);
      alert('Failed to delete visitor.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await visitorAPI.update(editingId, formData as Visitor);
        alert('Visitor updated successfully!');
      } else {
        await visitorAPI.create(formData as Omit<Visitor, 'id'>);
        alert('Visitor added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      await fetchVisitors();
    } catch (error) {
      console.error('Error saving visitor:', error);
      alert('Failed to save visitor.');
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
      contactNumber: '',
      visitDate: new Date().toISOString().split('T')[0],
      zone: '',
      permitNumber: ''
    });
  };

  const applyDateFilter = async () => {
    if (!filterStartDate || !filterEndDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    try {
      setLoading(true);
      const data = await visitorAPI.getByDateRange(filterStartDate, filterEndDate);
      setVisitors(data);
    } catch (error) {
      console.error('Error applying date filter:', error);
      alert('Failed to apply date filter.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    fetchVisitors();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white hover:text-purple-100 transition-colors">
                ← Back
              </Link>
              <span className="text-4xl">🎫</span>
              <h1 className="text-4xl font-bold">Visitors Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Visitor
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Date Range Filter</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyDateFilter}
                className="w-full bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors"
              >
                Apply
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Visitor' : 'Add New Visitor'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input
                  type="text"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visit Date</label>
                <input
                  type="date"
                  value={formData.visitDate || ''}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                <input
                  type="text"
                  value={formData.zone || ''}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., Zone A"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Permit Number</label>
                <input
                  type="text"
                  value={formData.permitNumber || ''}
                  onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  placeholder="e.g., PER-2025-001"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors shadow-md"
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
              <thead className="bg-gradient-to-r from-purple-700 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Contact Number</th>
                  <th className="px-6 py-4 text-left font-semibold">Visit Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Permit Number</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                      </div>
                    </td>
                  </tr>
                ) : visitors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No visitors found. Add your first visitor to get started!
                    </td>
                  </tr>
                ) : (
                  visitors.map((visitor, index) => (
                    <tr
                      key={visitor.id}
                      className={`hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{visitor.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{visitor.name}</td>
                      <td className="px-6 py-4 text-gray-700">{visitor.contactNumber}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {visitor.visitDate ? new Date(visitor.visitDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{visitor.zone}</td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {visitor.permitNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(visitor)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(visitor.id)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Visitors</h3>
            <p className="text-3xl font-bold text-purple-700">{visitors.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Today's Visitors</h3>
            <p className="text-3xl font-bold text-purple-600">
              {visitors.filter((v) => {
                const today = new Date().toISOString().split('T')[0];
                return v.visitDate === today;
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unique Zones</h3>
            <p className="text-3xl font-bold text-purple-700">
              {new Set(visitors.map((v) => v.zone)).size}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
