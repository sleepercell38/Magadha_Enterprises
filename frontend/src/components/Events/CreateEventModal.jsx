import React, { useState } from "react";
import { XIcon } from "lucide-react";

const CreateEventModal = ({ metadata, onClose, onCreate }) => {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setFormData({});
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedType) {
      newErrors.eventType = "Please select an event type";
      setErrors(newErrors);
      return false;
    }

    const fields = metadata[selectedType]?.fields || [];
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]?.toString().trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // Email validation
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }
      
      // Phone validation
      if (field.type === "tel" && formData[field.name]) {
        const phoneRegex = /^\d{10}$/;
        const cleanPhone = formData[field.name].replace(/\D/g, "");
        if (cleanPhone && !phoneRegex.test(cleanPhone)) {
          newErrors[field.name] = "Please enter a valid 10-digit phone number";
        }
      }
      
      // Number range validation
      if (field.type === "number" && formData[field.name]) {
        const value = parseFloat(formData[field.name]);
        if (field.min !== undefined && value < field.min) {
          newErrors[field.name] = `Minimum value is ${field.min}`;
        }
        if (field.max !== undefined && value > field.max) {
          newErrors[field.name] = `Maximum value is ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Find field configuration
    const field = metadata[selectedType]?.fields?.find(f => f.name === name);
    
    // Format phone numbers
    if (field?.type === "tel") {
      const formatted = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCreate({
        type: selectedType,
        data: formData,
        eventDate: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneDisplay = (phone) => {
    if (phone && phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const renderField = (field) => {
    const baseClass = `w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500 ${
      errors[field.name] ? "ring-2 ring-red-500" : ""
    }`;
    
    if (field.type === "textarea") {
      return (
        <>
          <textarea
            name={field.name}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name] || ""}
            onChange={handleChange}
            rows={field.rows || 4}
            className={`${baseClass} resize-none`}
            disabled={isSubmitting}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </>
      );
    }
    
    if (field.type === "select") {
      return (
        <>
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={baseClass}
            disabled={isSubmitting}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </>
      );
    }

    // Special handling for phone input
    if (field.type === "tel") {
      return (
        <>
          <input
            type="tel"
            name={field.name}
            placeholder={field.placeholder || "(555) 123-4567"}
            value={formatPhoneDisplay(formData[field.name] || "")}
            onChange={handleChange}
            maxLength="14"
            className={baseClass}
            disabled={isSubmitting}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </>
      );
    }

    // Date input with dark theme
    if (field.type === "date" || field.type === "datetime-local") {
      return (
        <>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            className={baseClass}
            style={{ colorScheme: 'dark' }}
            disabled={isSubmitting}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </>
      );
    }
    
    return (
      <>
        <input
          type={field.type || "text"}
          name={field.name}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          value={formData[field.name] || ""}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          step={field.step}
          className={baseClass}
          disabled={isSubmitting}
        />
        {errors[field.name] && (
          <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
        )}
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-[90%] max-w-5xl max-h-[90vh] overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-900 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Create New Event</h2>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Select an event type and fill in the details
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Event Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className={`w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.eventType ? "ring-2 ring-red-500" : ""
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select an event type...</option>
              {Object.entries(metadata).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            {errors.eventType && (
              <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>
            )}
          </div>

          {/* Dynamic Form Fields */}
          {selectedType && metadata[selectedType] && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Details Card */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                  {metadata[selectedType].label} Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {metadata[selectedType].fields.map((field) => (
                    <div 
                      key={field.name}
                      className={field.fullWidth ? "md:col-span-2" : ""}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {field.hint && (
                          <span className="text-xs text-gray-500 ml-2">({field.hint})</span>
                        )}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="none" 
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                        />
                      </svg>
                      Creating Event...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Empty State */}
          {!selectedType && (
            <div className="text-center py-12">
              <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
                <svg 
                  className="w-16 h-16 mx-auto text-gray-600 mb-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-gray-400">
                  Select an event type above to continue
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;