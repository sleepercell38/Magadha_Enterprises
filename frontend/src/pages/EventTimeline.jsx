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
import {
  fetchProjectById,
  updateProject,
  setBudget,
  fetchBudget
} from "../redux/Project/projectSlice";
import CreateEventModal from "../components/Events/CreateEventModal";
import EventDetailPanel from "../components/Events/EventDetailPanel";
import BudgetModal from "../components/Budget/BudgetModal";
import BillingView from "../components/Billing/BillingView"; // Import the new component
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
  FileTextIcon,
  CheckIcon,
  WalletIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  HomeIcon,
  IndianRupeeIcon,
  MenuIcon,
  XIcon
} from "lucide-react";

const EventTimeline = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { selectedProject, budget } = useSelector((state) => state.project);
  const { events, metadata, loading } = useSelector((state) => state.event);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [viewMode, setViewMode] = useState("timeline");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileEventDetail, setShowMobileEventDetail] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(fetchProjectById({ token, projectId }));
    dispatch(fetchProjectEvents({ token, projectId }));
    dispatch(fetchEventMetadata(token));
    dispatch(fetchBudget({ token, projectId }));
  }, [dispatch, token, projectId, navigate]);

  const handleCreateEvent = (eventData) => {
    dispatch(createProjectEvent({ token, projectId, eventData }))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        dispatch(fetchProjectEvents({ token, projectId }));
      });
  };

  const handleCreateBudget = (budgetData) => {
    dispatch(setBudget({ token, projectId, budgetData }))
      .unwrap()
      .then(() => {
        setIsBudgetModalOpen(false);
        dispatch(fetchBudget({ token, projectId }));
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
        setShowMobileEventDetail(false);
      }
    }
  };

  const handleMarkProjectCompleted = () => {
    setIsUpdatingStatus(true);
    dispatch(updateProject({
      token,
      projectId,
      updateData: { status: "completed" }
    }))
      .unwrap()
      .then(() => {
        setIsUpdatingStatus(false);
      })
      .catch(() => {
        setIsUpdatingStatus(false);
      });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    // On mobile, show the detail view
    if (window.innerWidth < 1024) {
      setShowMobileEventDetail(true);
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
      case "completed": return <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "in-progress": return <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />;
      default: return <AlertCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "siteVisiting": return <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "materialDelivery": return <TruckIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "meetingScheduled": return <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "siteInspection": return <FileTextIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <PackageIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
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
      {/* Header - More Compact and Sleek */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <button
                onClick={() => navigate("/profile")}
                className="p-1 sm:p-1.5 lg:p-2 hover:bg-gray-700 rounded-md lg:rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base lg:text-xl font-bold truncate">
                  {selectedProject?.projectName || "Project"}
                </h1>
                <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm truncate">
                  Client: {selectedProject?.clientName}
                </p>
              </div>
            </div>

            {/* Desktop Menu - More Compact */}
            <div className="hidden lg:flex items-center gap-2">
              {/* View Toggle Buttons - Smaller */}
              <div className="flex bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === "timeline"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode("billing")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === "billing"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <IndianRupeeIcon className="w-4 h-4" />
                  Billings
                </button>
              </div>

              {viewMode === "timeline" && (
                <>
                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <WalletIcon className="w-4 h-4" />
                    {budget.data ? "Budget" : "Add Budget"}
                  </button>

                  {selectedProject?.status === "active" && (
                    <button
                      onClick={handleMarkProjectCompleted}
                      disabled={isUpdatingStatus}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      {isUpdatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Complete</span>
                        </>
                      )}
                    </button>
                  )}

                  {selectedProject?.status === "completed" && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Event
                  </button>
                </>
              )}
            </div>

            {/* Mobile/Tablet Menu Button - Smaller */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 sm:p-1.5 hover:bg-gray-700 rounded-md transition-all"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              ) : (
                <MenuIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              )}
            </button>
          </div>

          {/* Mobile/Tablet Menu - More Compact */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 sm:mt-3 pb-2 flex flex-col gap-1.5 sm:gap-2">
              {/* View Mode Toggle - Inline Style */}
              <div className="flex bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    setViewMode("timeline");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs ${
                    viewMode === "timeline"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <CalendarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Timeline
                </button>

                <button
                  onClick={() => {
                    setViewMode("billing");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex-1 px-2.5 py-1.5 sm:py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs ${
                    viewMode === "billing"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <IndianRupeeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Billings
                </button>
              </div>

              {/* Action Buttons for Timeline View - Smaller */}
              {viewMode === "timeline" && (
                <div className="flex flex-col gap-1.5 sm:gap-2 mt-1">
                  <div className="flex gap-1.5 sm:gap-2">
                    <button
                      onClick={() => {
                        setIsBudgetModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-2.5 py-1.5 sm:py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs"
                    >
                      <WalletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {budget.data ? "Budget" : "Add Budget"}
                    </button>

                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 sm:py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs"
                    >
                      <PlusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Add Event
                    </button>
                  </div>

                  {selectedProject?.status === "active" && (
                    <button
                      onClick={() => {
                        handleMarkProjectCompleted();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isUpdatingStatus}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-2.5 py-1.5 sm:py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs"
                    >
                      {isUpdatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>
                  )}

                  {selectedProject?.status === "completed" && (
                    <div className="w-full bg-green-500/20 text-green-400 px-2.5 py-1.5 sm:py-2 rounded-md font-medium flex items-center justify-center gap-1.5 text-[11px] sm:text-xs">
                      <CheckCircleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === "billing" ? (
        <BillingView 
          projectId={projectId} 
          token={token} 
          budget={budget.data || selectedProject?.budget} 
        />
      ) : (
        <>
          {/* Budget Summary Bar - More Compact */}
          {(budget.data || selectedProject?.budget) && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-700/30">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 text-[10px] sm:text-xs lg:text-sm">
                    {/* Total Budget */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <WalletIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-green-400" />
                      <span className="text-gray-300">Budget:</span>
                      <span className="font-bold text-green-400">
                        ₹{(budget.data?.workDetails?.totalAmount || selectedProject?.budget?.workDetails?.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Work Items Count - Hidden on mobile */}
                    {(budget.data?.workDetails?.items?.length > 0 || selectedProject?.budget?.workDetails?.items?.length > 0) && (
                      <div className="hidden sm:flex items-center gap-1.5">
                        <BriefcaseIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                        <span className="text-gray-400">
                          {budget.data?.workDetails?.items?.length || selectedProject?.budget?.workDetails?.items?.length} Items
                        </span>
                      </div>
                    )}

                    {/* Area - Hidden on mobile */}
                    {(budget.data?.areaInSqFeet || selectedProject?.budget?.areaInSqFeet) && (
                      <div className="hidden md:flex items-center gap-1.5">
                        <HomeIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                        <span className="text-gray-400">
                          {budget.data?.areaInSqFeet || selectedProject?.budget?.areaInSqFeet} sq.ft
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="text-[10px] sm:text-xs lg:text-sm text-green-400 hover:text-green-300 transition-all flex items-center gap-0.5 sm:gap-1"
                  >
                    Edit
                    <ArrowRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Split Screen Layout - Responsive */}
          <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-80px)]">
            {/* Timeline Panel - Full width on mobile, left panel on desktop */}
            <div className={`
              w-full lg:w-2/5 
              ${showMobileEventDetail ? 'hidden lg:block' : 'block'}
              lg:border-r border-gray-700 
              overflow-y-auto bg-gray-900/30
            `}>
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Project Timeline
                </h2>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-10">
                    <PackageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 text-sm sm:text-base">No events yet</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Click "Add Event" to start tracking</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                    {/* Timeline Events */}
                    <div className="space-y-3 sm:space-y-4">
                      {events.map((event) => (
                        <div
                          key={event._id}
                          onClick={() => handleEventClick(event)}
                          className={`relative flex gap-2.5 sm:gap-3 cursor-pointer group transition-all ${
                            selectedEvent?._id === event._id ? 'scale-[1.01]' : ''
                          }`}
                        >
                          {/* Timeline Dot - Smaller */}
                          <div className={`
                            relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                            ${getStatusColor(event.status)} 
                            ${selectedEvent?._id === event._id ? 'ring-4 ring-blue-500/30' : ''}
                            transition-all group-hover:scale-110
                          `}>
                            {getStatusIcon(event.status)}
                          </div>

                          {/* Event Card - Smaller text and padding */}
                          <div className={`
                            flex-1 bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 
                            ${selectedEvent?._id === event._id ? 'bg-gray-700 border-2 border-blue-500' : 'hover:bg-gray-750'}
                            transition-all
                          `}>
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className="text-blue-400">
                                  {getEventIcon(event.type)}
                                </div>
                                <h3 className="font-semibold text-xs sm:text-sm">
                                  {event.typeLabel || event.type}
                                </h3>
                              </div>
                              <span className={`
                                text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full
                                ${event.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                                ${event.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                ${event.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
                              `}>
                                {event.status}
                              </span>
                            </div>

                            <p className="text-[10px] sm:text-xs text-gray-400 mb-1.5">
                              {formatDate(event.eventDate)}
                            </p>

                            {/* Preview of first few fields - Smaller text */}
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {Object.entries(event.data).slice(0, 2).map(([key, value]) => (
                                <p key={key} className="truncate leading-tight">
                                  {formatFieldName(key)}: {value}
                                </p>
                              ))}
                              {Object.keys(event.data).length > 2 && (
                                <p className="text-blue-400 mt-0.5 text-[10px] sm:text-xs">View more →</p>
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

            {/* Event Details Panel - Mobile View */}
            {showMobileEventDetail && selectedEvent && (
              <div className="lg:hidden fixed inset-0 bg-gray-900 z-50 overflow-y-auto">
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileEventDetail(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold flex-1">Event Details</h2>
                </div>
                <EventDetailPanel
                  selectedEvent={selectedEvent}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDeleteEvent}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getEventIcon={getEventIcon}
                  isMobile={true}
                />
              </div>
            )}

            {/* Event Details Panel - Desktop View */}
            <div className="hidden lg:block lg:flex-1">
              <EventDetailPanel
                selectedEvent={selectedEvent}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteEvent}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getEventIcon={getEventIcon}
                isMobile={false}
              />
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {isModalOpen && (
        <CreateEventModal
          metadata={metadata}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {isBudgetModalOpen && (
        <BudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onCreate={handleCreateBudget}
          existingBudget={budget.data || selectedProject?.budget}
        />
      )}
    </div>
  );
};

export default EventTimeline;