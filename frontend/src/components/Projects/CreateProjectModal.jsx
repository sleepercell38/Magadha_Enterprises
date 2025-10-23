import React, { useState } from "react";

const CreateProjectModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    projectName: "",
    clientEmail: "",
    clientPhone: "",
    startDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md text-white relative">
        <h2 className="text-2xl font-bold mb-4">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 px-3 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 px-3 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="email"
            name="clientEmail"
            placeholder="Client Email"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 px-3 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="clientPhone"
            placeholder="Client Phone (10 digits)"
            value={formData.clientPhone}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 px-3 py-2 rounded-lg focus:outline-none"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 px-3 py-2 rounded-lg focus:outline-none"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
