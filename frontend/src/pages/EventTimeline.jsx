import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchProjectEvents, 
  fetchEventMetadata,
  createProjectEvent,
  updateEventStatus,
  deleteEvent 
} from "../redux/Project/eventSlice";
import { fetchProjectById } from "../redux/Project/projectSlice";
import CreateEventModal from "../components/Events/CreateEventModal";
import EventDetailPanel from "../components/Events/EventDetailPanel";
import { 
  PlusIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  AlertCircleIcon,
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon
} from "lucide-react";

const EventTimeline = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { token } = useSelector((state) => state.auth);
  const { selectedProject } = useSelector((state) => state.project);
  const { events, metadata, loading } = useSelector((state) => state.event);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    dispatch(fetchProjectById({ token, projectId }));
    dispatch(fetchProjectEvents({ token, projectId }));
    dispatch(fetchEventMetadata(token));
  }, [dispatch, token, projectId, navigate]);

  const handleCreateEvent = (eventData) => {
    dispatch(createProjectEvent({ token, projectId, eventData }))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        dispatch(fetchProjectEvents({ token, projectId }));
      });
  };

  const handleStatusUpdate = (eventId, newStatus) => {
    dispatch(updateEventStatus({ token, eventId, status: newStatus }));
    if (selectedEvent?._id === eventId) {
      setSelectedEvent({ ...selectedEvent, status: newStatus });
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent({ token, eventId }));
      if (selectedEvent?._id === eventId) {
        setSelectedEvent(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircleIcon className="w-5 h-5" />;
      case "in-progress": return <ClockIcon className="w-5 h-5 animate-pulse" />;
      default: return <AlertCircleIcon className="w-5 h-5" />;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "siteVisiting": return <MapPinIcon className="w-5 h-5" />;
      case "materialDelivery": return <TruckIcon className="w-5 h-5" />;
      case "meetingScheduled": return <UserIcon className="w-5 h-5" />;
      case "siteInspection": return <FileTextIcon className="w-5 h-5" />;
      default: return <PackageIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {selectedProject?.projectName || "Project"}
                </h1>
                <p className="text-gray-400 text-sm">
                  Client: {selectedProject?.clientName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Timeline */}
        <div className="w-full lg:w-2/5 border-r border-gray-700 overflow-y-auto bg-gray-900/30">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              Project Timeline
            </h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-10">
                <PackageIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No events yet</p>
                <p className="text-sm text-gray-500 mt-2">Click "Add Event" to start tracking</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {/* Timeline Events */}
                <div className="space-y-6">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      onClick={() => setSelectedEvent(event)}
                      className={`relative flex gap-4 cursor-pointer group transition-all ${
                        selectedEvent?._id === event._id ? 'scale-[1.02]' : ''
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                        ${getStatusColor(event.status)} 
                        ${selectedEvent?._id === event._id ? 'ring-4 ring-blue-500/30' : ''}
                        transition-all group-hover:scale-110
                      `}>
                        {getStatusIcon(event.status)}
                      </div>

                      {/* Event Card */}
                      <div className={`
                        flex-1 bg-gray-800 rounded-xl p-4 
                        ${selectedEvent?._id === event._id ? 'bg-gray-700 border-2 border-blue-500' : 'hover:bg-gray-750'}
                        transition-all
                      `}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="text-blue-400">
                              {getEventIcon(event.type)}
                            </div>
                            <h3 className="font-semibold">
                              {event.typeLabel || event.type}
                            </h3>
                          </div>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${event.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                            ${event.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                            ${event.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
                          `}>
                            {event.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2">
                          {formatDate(event.eventDate)}
                        </p>

                        {/* Preview of first few fields */}
                        <div className="text-xs text-gray-500">
                          {Object.entries(event.data).slice(0, 2).map(([key, value]) => (
                            <p key={key} className="truncate">
                              {formatFieldName(key)}: {value}
                            </p>
                          ))}
                          {Object.keys(event.data).length > 2 && (
                            <p className="text-blue-400 mt-1">View more →</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Event Details */}
        <EventDetailPanel
          selectedEvent={selectedEvent}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteEvent}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getEventIcon={getEventIcon}
        />
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <CreateEventModal
          metadata={metadata}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default EventTimeline;