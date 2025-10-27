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
  PercentIcon,
  WalletIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  HomeIcon,
  ReceiptIcon,
  CreditCardIcon,
  IndianRupeeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon
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
  const [viewMode, setViewMode] = useState("timeline"); // Add view mode state

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

  // Billing View Component
  const BillingView = () => {
    // Sample billing data - replace with actual data from your backend
    const [billingData] = useState({
      totalBilled: 450000,
      totalPaid: 325000,
      pendingAmount: 125000,
      invoices: [
        {
          id: 1,
          invoiceNumber: "INV-001",
          date: "2024-01-15",
          amount: 150000,
          status: "paid",
          description: "First installment - Foundation work"
        },
        {
          id: 2,
          invoiceNumber: "INV-002",
          date: "2024-02-01",
          amount: 175000,
          status: "paid",
          description: "Second installment - Structure work"
        },
        {
          id: 3,
          invoiceNumber: "INV-003",
          date: "2024-03-01",
          amount: 125000,
          status: "pending",
          description: "Third installment - Finishing work"
        }
      ]
    });

    return (
      <div className="p-6">
        {/* Billing Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <DollarSignIcon className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-gray-400">Total Budget</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ₹{(budget.data?.workDetails?.totalAmount || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400 mt-2">Allocated amount</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingUpIcon className="w-8 h-8 text-green-400" />
              <span className="text-xs text-gray-400">Total Billed</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ₹{billingData.totalBilled.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-green-400 mt-2">
              {((billingData.totalBilled / (budget.data?.workDetails?.totalAmount || 1)) * 100).toFixed(1)}% of budget
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
              <span className="text-xs text-gray-400">Paid Amount</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ₹{billingData.totalPaid.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-400 mt-2">
              {((billingData.totalPaid / billingData.totalBilled) * 100).toFixed(1)}% collected
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <TrendingDownIcon className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ₹{billingData.pendingAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-orange-400 mt-2">To be collected</p>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ReceiptIcon className="w-6 h-6 text-blue-400" />
                Invoices
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Create Invoice
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {billingData.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-gray-900 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-white">
                          {invoice.invoiceNumber}
                        </h3>
                        <span className={`
                          text-xs px-3 py-1 rounded-full font-medium
                          ${invoice.status === 'paid' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-orange-500/20 text-orange-400'}
                        `}>
                          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {invoice.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ₹{invoice.amount.toLocaleString('en-IN')}
                      </p>
                      <button className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-all">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-blue-400" />
            Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Bank Transfer</p>
              <p className="font-medium">State Bank of India</p>
              <p className="text-xs text-gray-500">Account: ****4567</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">UPI</p>
              <p className="font-medium">business@paytm</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-3">
              {/* View Toggle Buttons */}
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === "timeline"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
                Timeline
              </button>

              <button
                onClick={() => setViewMode("billing")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === "billing"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <IndianRupeeIcon className="w-5 h-5" />
                Billings
              </button>

              {viewMode === "timeline" && (
                <>
                  {/* Budget Button */}
                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <WalletIcon className="w-5 h-5" />
                    {budget.data ? "Update Budget" : "Add Budget"}
                  </button>

                  {/* Mark as Completed Button */}
                  {selectedProject?.status === "active" && (
                    <button
                      onClick={handleMarkProjectCompleted}
                      disabled={isUpdatingStatus}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      {isUpdatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-5 h-5" />
                          <span>Mark as Completed</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Show completion badge */}
                  {selectedProject?.status === "completed" && (
                    <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Completed</span>
                    </div>
                  )}

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Event
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === "billing" ? (
        <BillingView />
      ) : (
        <>
          {/* Budget Summary Bar */}
          {(budget.data || selectedProject?.budget) && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-b border-green-700/30">
              <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Total Budget */}
                    <div className="flex items-center gap-2">
                      <WalletIcon className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-300">Total Budget:</span>
                      <span className="text-lg font-bold text-green-400">
                        ₹{(budget.data?.workDetails?.totalAmount || selectedProject?.budget?.workDetails?.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Work Items Count */}
                    {(budget.data?.workDetails?.items?.length > 0 || selectedProject?.budget?.workDetails?.items?.length > 0) && (
                      <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {budget.data?.workDetails?.items?.length || selectedProject?.budget?.workDetails?.items?.length} Work Items
                        </span>
                      </div>
                    )}

                    {/* Total Percentage */}
                    {(budget.data?.workDetails?.items || selectedProject?.budget?.workDetails?.items) && (
                      <div className="flex items-center gap-2">
                        <PercentIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {(() => {
                            const items = budget.data?.workDetails?.items || selectedProject?.budget?.workDetails?.items || [];
                            const totalPercentage = items.reduce((sum, item) => sum + (item.cumulativePercentage || 0), 0);
                            return (
                              <span className={totalPercentage > 100 ? 'text-red-400' : ''}>
                                {totalPercentage.toFixed(1)}% Allocated
                              </span>
                            );
                          })()}
                        </span>
                      </div>
                    )}

                    {/* Area */}
                    {(budget.data?.areaInSqFeet || selectedProject?.budget?.areaInSqFeet) && (
                      <div className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {budget.data?.areaInSqFeet || selectedProject?.budget?.areaInSqFeet} sq.ft
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="text-sm text-green-400 hover:text-green-300 transition-all flex items-center gap-1"
                  >
                    Edit Budget
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

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
        </>
      )}

      {/* Create Event Modal */}
      {isModalOpen && (
        <CreateEventModal
          metadata={metadata}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {/* Budget Modal */}
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