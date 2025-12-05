'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { plantAPI } from '@/lib/api';
import { Plant } from '@/types';

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Plant>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const data = await plantAPI.getAll();
      setPlants(data);
    } catch (error) {
      console.error('Error fetching plants:', error);
      alert('Failed to fetch plants. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plant: Plant) => {
    setEditingId(plant.id);
    setFormData(plant);
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    
    try {
      await plantAPI.delete(id);
      await fetchPlants();
      alert('Plant deleted successfully!');
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Failed to delete plant.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await plantAPI.update(editingId, formData as Plant);
        alert('Plant updated successfully!');
      } else {
        await plantAPI.create(formData as Omit<Plant, 'id'>);
        alert('Plant added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setFormData({});
      await fetchPlants();
    } catch (error) {
      console.error('Error saving plant:', error);
      alert('Failed to save plant.');
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
      species: '',
      coverage: 0,
      medicinalUse: '',
      zone: ''
    });
  };

  const filterMedicinal = async () => {
    try {
      setLoading(true);
      const data = await plantAPI.getMedicinal();
      setPlants(data);
    } catch (error) {
      console.error('Error filtering medicinal plants:', error);
      alert('Failed to filter medicinal plants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white hover:text-emerald-100 transition-colors">
                ← Back
              </Link>
              <span className="text-4xl">🌿</span>
              <h1 className="text-4xl font-bold">Plants Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Plant
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Filters</h3>
          <div className="flex gap-4">
            <button
              onClick={filterMedicinal}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Show Medicinal Plants
            </button>
            <button
              onClick={fetchPlants}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Show All
            </button>
          </div>
        </div>

        {(showAddForm || editingId) && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-emerald-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Species</label>
                <input
                  type="text"
                  value={formData.species || ''}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Aloe Vera"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Coverage (sq m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.coverage || 0}
                  onChange={(e) => setFormData({ ...formData, coverage: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Medicinal Use</label>
                <input
                  type="text"
                  value={formData.medicinalUse || ''}
                  onChange={(e) => setFormData({ ...formData, medicinalUse: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Skin care, wound healing"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                <input
                  type="text"
                  value={formData.zone || ''}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Zone A"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md"
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
              <thead className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Species</th>
                  <th className="px-6 py-4 text-left font-semibold">Coverage (sq m)</th>
                  <th className="px-6 py-4 text-left font-semibold">Medicinal Use</th>
                  <th className="px-6 py-4 text-left font-semibold">Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : plants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No plants found. Add your first plant to get started!
                    </td>
                  </tr>
                ) : (
                  plants.map((plant, index) => (
                    <tr
                      key={plant.id}
                      className={`hover:bg-emerald-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{plant.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{plant.species}</td>
                      <td className="px-6 py-4 text-gray-700">{plant.coverage}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {plant.medicinalUse ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {plant.medicinalUse}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{plant.zone}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plant)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(plant.id)}
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
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Plants</h3>
            <p className="text-3xl font-bold text-emerald-600">{plants.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Medicinal Plants</h3>
            <p className="text-3xl font-bold text-green-600">
              {plants.filter((p) => p.medicinalUse && p.medicinalUse.trim() !== '').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Coverage</h3>
            <p className="text-3xl font-bold text-emerald-600">
              {plants.reduce((sum, p) => sum + (p.coverage || 0), 0).toFixed(1)} sq m
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
