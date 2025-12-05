'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { animalAPI } from '@/lib/api';
import { Animal } from '@/types';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Animal>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [filterZone, setFilterZone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalAPI.getAll();
      setAnimals(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
      alert('Failed to fetch animals. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (animal: Animal) => {
    setEditingId(animal.id);
    setFormData(animal);
    setShowAddForm(false);
    setShowEditForm(true);
    setShowUpdateForm(false);
  };

  const handleUpdate = (animal: Animal) => {
    setEditingId(animal.id);
    setFormData({
      populationCount: animal.populationCount,
      zone: animal.zone,
      conservationStatus: animal.conservationStatus
    });
    setShowAddForm(false);
    setShowEditForm(false);
    setShowUpdateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this animal?')) return;
    
    try {
      await animalAPI.delete(id);
      await fetchAnimals();
      alert('Animal deleted successfully!');
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert('Failed to delete animal.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId && (showEditForm || showUpdateForm)) {
        // For update form, only update specific fields
        if (showUpdateForm) {
          const currentAnimal = animals.find(a => a.id === editingId);
          if (currentAnimal) {
            const updatedAnimal = {
              ...currentAnimal,
              populationCount: formData.populationCount ?? currentAnimal.populationCount,
              zone: formData.zone ?? currentAnimal.zone,
              conservationStatus: formData.conservationStatus ?? currentAnimal.conservationStatus
            };
            await animalAPI.update(editingId, updatedAnimal);
            alert('Animal updated successfully!');
          }
        } else {
          // For edit form, update all fields
          await animalAPI.update(editingId, formData as Animal);
          alert('Animal edited successfully!');
        }
      } else {
        await animalAPI.create(formData as Omit<Animal, 'id'>);
        alert('Animal added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setShowEditForm(false);
      setShowUpdateForm(false);
      setFormData({});
      await fetchAnimals();
    } catch (error) {
      console.error('Error saving animal:', error);
      alert('Failed to save animal.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setShowEditForm(false);
    setShowUpdateForm(false);
    setFormData({});
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setShowUpdateForm(false);
    setEditingId(null);
    setFormData({
      species: '',
      populationCount: 0,
      zone: '',
      conservationStatus: '',
      lastSeen: new Date().toISOString().split('T')[0]
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      if (filterZone) {
        const data = await animalAPI.getByZone(filterZone);
        setAnimals(data);
      } else if (filterStatus) {
        const data = await animalAPI.getByStatus(filterStatus);
        setAnimals(data);
      } else {
        await fetchAnimals();
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
    setFilterStatus('');
    fetchAnimals();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white hover:text-orange-100 transition-colors">
                ← Back
              </Link>
              <span className="text-4xl">🦁</span>
              <h1 className="text-4xl font-bold">Animals Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Animal
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filter by Zone"
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            />
            <input
              type="text"
              placeholder="Filter by Conservation Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
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

        {/* Add/Edit/Update Form */}
        {(showAddForm || showEditForm || showUpdateForm) && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showUpdateForm ? 'Quick Update Animal' : showEditForm ? 'Edit Animal Details' : 'Add New Animal'}
            </h2>
            {showUpdateForm ? (
              // Quick Update Form - Only Population, Zone, and Conservation Status
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Population Count</label>
                  <input
                  type="number"
                  value={formData.populationCount || 0}
                  onChange={(e) => setFormData({ ...formData, populationCount: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                  <input
                    type="text"
                  value={formData.zone || ''}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="e.g., Zone A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Conservation Status</label>
                  <select
                  value={formData.conservationStatus || ''}
                  onChange={(e) => setFormData({ ...formData, conservationStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  >
                    <option value="">Select Status</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Near Threatened">Near Threatened</option>
                    <option value="Least Concern">Least Concern</option>
                    <option value="Critically Endangered">Critically Endangered</option>
                  </select>
                </div>
              </div>
            ) : (
              // Full Form - All Fields for Add and Edit
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Species</label>
                  <input
                    type="text"
                  value={formData.species || ''}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  placeholder="e.g., Bengal Tiger"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Population Count</label>
                  <input
                    type="number"
                    value={formData.populationCount || 0}
                    onChange={(e) => setFormData({ ...formData, populationCount: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                  <input
                    type="text"
                    value={formData.zone || ''}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Zone A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Conservation Status</label>
                  <select
                    value={formData.conservationStatus || ''}
                    onChange={(e) => setFormData({ ...formData, conservationStatus: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Near Threatened">Near Threatened</option>
                    <option value="Least Concern">Least Concern</option>
                    <option value="Critically Endangered">Critically Endangered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Seen</label>
                  <input
                    type="date"
                  value={formData.lastSeen || ''}
                  onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md"
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Species</th>
                  <th className="px-6 py-4 text-left font-semibold">Population</th>
                  <th className="px-6 py-4 text-left font-semibold">Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Conservation Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Last Seen</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : animals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No animals found. Add your first animal to get started!
                    </td>
                  </tr>
                ) : (
                  animals.map((animal, index) => (
                    <tr
                      key={animal.id}
                      className={`hover:bg-orange-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{animal.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{animal.species}</td>
                      <td className="px-6 py-4 text-gray-700">{animal.populationCount}</td>
                      <td className="px-6 py-4 text-gray-700">{animal.zone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            animal.conservationStatus === 'Endangered' || animal.conservationStatus === 'Critically Endangered'
                              ? 'bg-red-100 text-red-800'
                              : animal.conservationStatus === 'Vulnerable'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {animal.conservationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {animal.lastSeen ? new Date(animal.lastSeen).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(animal)}
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                            title="Edit all animal details"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUpdate(animal)}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                            title="Quick update: Population, Zone, Status"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(animal.id)}
                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Animals</h3>
            <p className="text-3xl font-bold text-orange-600">{animals.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Population</h3>
            <p className="text-3xl font-bold text-orange-600">
              {animals.reduce((sum, a) => sum + (a.populationCount || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Endangered Species</h3>
            <p className="text-3xl font-bold text-red-600">
              {animals.filter((a) => a.conservationStatus === 'Endangered' || a.conservationStatus === 'Critically Endangered').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
