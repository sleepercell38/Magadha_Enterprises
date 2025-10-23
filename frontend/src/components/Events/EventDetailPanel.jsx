import React from "react";
import { 
  PackageIcon,
  CalendarIcon,
  FileTextIcon,
  TrashIcon
} from "lucide-react";

const EventDetailPanel = ({ 
  selectedEvent, 
  onStatusUpdate, 
  onDelete,
  getStatusColor,
  getStatusIcon,
  getEventIcon
}) => {
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (!selectedEvent) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-900/20">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <PackageIcon className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">Select an event to view details</p>
            <p className="text-gray-500 text-sm mt-2">
              Click on any event from the timeline
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900/20">
      <div className="p-6">
        {/* Event Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center
                ${getStatusColor(selectedEvent.status)}
              `}>
                {getEventIcon(selectedEvent.type)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedEvent.typeLabel || selectedEvent.type}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {formatDate(selectedEvent.eventDate)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(selectedEvent._id)}
              className="p-2 hover:bg-gray-700 rounded-lg text-red-400 transition-all"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Current Status:</span>
            <div className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full
              ${selectedEvent.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
              ${selectedEvent.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${selectedEvent.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
            `}>
              {getStatusIcon(selectedEvent.status)}
              <span className="capitalize font-medium">{selectedEvent.status}</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-400" />
            Event Information
          </h3>
          <div className="space-y-4">
            {Object.entries(selectedEvent.data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start py-3 border-b border-gray-700 last:border-0">
                <span className="text-gray-400 font-medium">
                  {formatFieldName(key)}
                </span>
                <span className="text-white text-right max-w-[60%]">
                  {value || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Actions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Update Status</h3>
          <div className="flex gap-3">
            <button
              onClick={() => onStatusUpdate(selectedEvent._id, "pending")}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all
                ${selectedEvent.status === 'pending' 
                  ? 'bg-gray-600 text-white cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}
              `}
              disabled={selectedEvent.status === 'pending'}
            >
              Mark as Pending
            </button>
            <button
              onClick={() => onStatusUpdate(selectedEvent._id, "in-progress")}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all
                ${selectedEvent.status === 'in-progress' 
                  ? 'bg-yellow-600 text-white cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-yellow-600 text-gray-300'}
              `}
              disabled={selectedEvent.status === 'in-progress'}
            >
              Mark as In Progress
            </button>
            <button
              onClick={() => onStatusUpdate(selectedEvent._id, "completed")}
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium transition-all
                ${selectedEvent.status === 'completed' 
                  ? 'bg-green-600 text-white cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-green-600 text-gray-300'}
              `}
              disabled={selectedEvent.status === 'completed'}
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPanel;