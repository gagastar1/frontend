'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { officerAPI } from '@/lib/api';
import { ForestOfficer } from '@/types';

export default function OfficersPage() {
  const [officers, setOfficers] = useState<ForestOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ForestOfficer>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditStatusForm, setShowEditStatusForm] = useState(false);
  const [showUpdateDataForm, setShowUpdateDataForm] = useState(false);
  const [filterZone, setFilterZone] = useState('');

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const data = await officerAPI.getAll();
      setOfficers(data);
    } catch (error) {
      console.error('Error fetching officers:', error);
      alert('Failed to fetch officers. Make sure the backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStatus = (officer: ForestOfficer) => {
    setEditingId(officer.officerId!);
    setFormData({ status: officer.status });
    setShowAddForm(false);
    setShowEditStatusForm(true);
    setShowUpdateDataForm(false);
  };

  const handleUpdateData = (officer: ForestOfficer) => {
    setEditingId(officer.officerId!);
    setFormData({
      firstName: officer.firstName,
      lastName: officer.lastName,
      designation: officer.designation,
      assignedZone: officer.assignedZone,
      contactNumber: officer.contactNumber
    });
    setShowAddForm(false);
    setShowEditStatusForm(false);
    setShowUpdateDataForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this officer?')) return;
    
    try {
      await officerAPI.delete(id);
      await fetchOfficers();
      alert('Officer deleted successfully!');
    } catch (error) {
      console.error('Error deleting officer:', error);
      alert('Failed to delete officer.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingId && (showEditStatusForm || showUpdateDataForm)) {
        const currentOfficer = officers.find(o => o.officerId === editingId);
        if (currentOfficer) {
          if (showEditStatusForm) {
            // Update only status
            const updatedOfficer = {
              ...currentOfficer,
              status: formData.status ?? currentOfficer.status
            };
            await officerAPI.update(editingId, updatedOfficer);
            alert('Officer status updated successfully!');
          } else {
            // Update officer data
            const updatedOfficer = {
              ...currentOfficer,
              firstName: formData.firstName ?? currentOfficer.firstName,
              lastName: formData.lastName ?? currentOfficer.lastName,
              designation: formData.designation ?? currentOfficer.designation,
              assignedZone: formData.assignedZone ?? currentOfficer.assignedZone,
              contactNumber: formData.contactNumber ?? currentOfficer.contactNumber
            };
            await officerAPI.update(editingId, updatedOfficer);
            alert('Officer data updated successfully!');
          }
        }
      } else {
        await officerAPI.create(formData as Omit<ForestOfficer, 'officerId'>);
        alert('Officer added successfully!');
      }
      setEditingId(null);
      setShowAddForm(false);
      setShowEditStatusForm(false);
      setShowUpdateDataForm(false);
      setFormData({});
      await fetchOfficers();
    } catch (error) {
      console.error('Error saving officer:', error);
      alert('Failed to save officer.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setShowEditStatusForm(false);
    setShowUpdateDataForm(false);
    setFormData({});
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setShowEditStatusForm(false);
    setShowUpdateDataForm(false);
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      employeeId: '',
      designation: '',
      department: '',
      assignedZone: '',
      contactNumber: '',
      email: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      if (filterZone) {
        const data = await officerAPI.getByZone(filterZone);
        setOfficers(data);
      } else {
        await fetchOfficers();
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
    fetchOfficers();
  };

  const filterActive = async () => {
    try {
      setLoading(true);
      const data = await officerAPI.getActive();
      setOfficers(data);
    } catch (error) {
      console.error('Error filtering active officers:', error);
      alert('Failed to filter active officers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
        style={{ backgroundImage: 'url(/officers.png)' }}
      />
      
      {/* Content */}
      <div className="relative z-10">
      <header className="bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-white hover:text-blue-100 transition-colors">
                ← Back
              </Link>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                <img src="/officers.png" alt="Officers" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-4xl font-bold">Forest Officers Management</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
            >
              + Add New Officer
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filter by Zone"
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              onClick={filterActive}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Active Officers Only
            </button>
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
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

        {(showAddForm || showEditStatusForm || showUpdateDataForm) && (
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {showEditStatusForm ? 'Edit Officer Status' : showUpdateDataForm ? 'Update Officer Data' : 'Add New Officer'}
            </h2>
            {showEditStatusForm ? (
              // Edit Status Form - Only Status
              <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg">
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            ) : showUpdateDataForm ? (
              // Update Data Form - All fields except status
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., Forest Ranger"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Zone</label>
                  <input
                    type="text"
                  value={formData.assignedZone || ''}
                  onChange={(e) => setFormData({ ...formData, assignedZone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., Zone A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="text"
                  value={formData.contactNumber || ''}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., +1234567890"
                  />
                </div>
              </div>
            ) : (
              // Add New Form - All fields
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId || ''}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., EMP001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Forest Ranger"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Wildlife Conservation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Zone</label>
                  <input
                    type="text"
                    value={formData.assignedZone || ''}
                    onChange={(e) => setFormData({ ...formData, assignedZone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., Zone A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="text"
                    value={formData.contactNumber || ''}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., +1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="e.g., john.doe@forest.gov"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate || ''}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
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
              <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Employee ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Designation</th>
                  <th className="px-6 py-4 text-left font-semibold">Assigned Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">Contact Number</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                      </div>
                    </td>
                  </tr>
                ) : officers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No officers found. Add your first officer to get started!
                    </td>
                  </tr>
                ) : (
                  officers.map((officer, index) => (
                    <tr
                      key={officer.officerId}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{officer.officerId}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{officer.firstName} {officer.lastName}</td>
                      <td className="px-6 py-4 text-gray-700">{officer.employeeId}</td>
                      <td className="px-6 py-4 text-gray-700">{officer.designation}</td>
                      <td className="px-6 py-4 text-gray-700">{officer.assignedZone}</td>
                      <td className="px-6 py-4 text-gray-700">{officer.contactNumber}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            officer.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {officer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditStatus(officer)}
                            className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold"
                            title="Edit officer status"
                          >
                            Edit Status
                          </button>
                          <button
                            onClick={() => handleUpdateData(officer)}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                            title="Update officer information"
                          >
                            Update Data
                          </button>
                          <button
                            onClick={() => handleDelete(officer.officerId!)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Officers</h3>
            <p className="text-3xl font-bold text-blue-700">{officers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Active Officers</h3>
            <p className="text-3xl font-bold text-green-600">
              {officers.filter((o) => o.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unique Zones</h3>
            <p className="text-3xl font-bold text-blue-700">
              {new Set(officers.map((o) => o.assignedZone)).size}
            </p>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
