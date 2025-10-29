import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingEntries,
  addBillingEntry,
  updateBillingEntry,
  deleteBillingEntry,
  fetchBillingSummary,
} from "../../redux/Project/projectSlice";
import {
  PlusIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ReceiptIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  IndianRupeeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
} from "lucide-react";

const BillingView = ({ projectId, token, budget }) => {
  const dispatch = useDispatch();
  const { billing } = useSelector((state) => state.project);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchBillingEntries({ token, projectId }));
    dispatch(fetchBillingSummary({ token, projectId }));
  }, [dispatch, token, projectId]);

  const filteredEntries = billing.entries.filter((entry) => {
    if (filterStatus === "all") return true;
    return entry.status === filterStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "credited":
        return <ArrowDownIcon className="w-3 h-3" />;
      case "debited":
        return <ArrowUpIcon className="w-3 h-3" />;
      case "pending":
        return <ClockIcon className="w-3 h-3" />;
      default:
        return <ClockIcon className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "credited":
        return "bg-green-500/20 text-green-400";
      case "debited":
        return "bg-red-500/20 text-red-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Budget Card */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <IndianRupeeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <span className="text-xs text-gray-400">Budget</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            ₹{(budget?.workDetails?.totalAmount || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400 mt-2">Total allocated</p>
        </div>

        {/* Total Credited */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingDownIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <span className="text-xs text-gray-400">Credited</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            ₹{(billing.summary?.statusBreakdown?.credited?.amount || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-green-400 mt-2">
            {billing.summary?.statusBreakdown?.credited?.count || 0} transactions
          </p>
        </div>

        {/* Total Debited */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <TrendingUpIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            <span className="text-xs text-gray-400">Debited</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            ₹{(billing.summary?.statusBreakdown?.debited?.amount || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-red-400 mt-2">
            {billing.summary?.statusBreakdown?.debited?.count || 0} transactions
          </p>
        </div>

        {/* Pending */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            ₹{(billing.summary?.statusBreakdown?.pending?.amount || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-yellow-400 mt-2">
            {billing.summary?.statusBreakdown?.pending?.count || 0} pending
          </p>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-4">Cash Flow Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Inflow</p>
            <p className="text-2xl font-bold text-green-400">
              +₹{(billing.summary?.statusBreakdown?.credited?.amount || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Outflow</p>
            <p className="text-2xl font-bold text-red-400">
              -₹{(billing.summary?.statusBreakdown?.debited?.amount || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${
              ((billing.summary?.statusBreakdown?.credited?.amount || 0) - 
               (billing.summary?.statusBreakdown?.debited?.amount || 0)) >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}>
              ₹{(
                (billing.summary?.statusBreakdown?.credited?.amount || 0) -
                (billing.summary?.statusBreakdown?.debited?.amount || 0)
              ).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Billing Entries Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <ReceiptIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              Billing Entries
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Entry
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {["all", "credited", "debited", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-2 text-xs">
                    ({billing.entries.filter((e) => e.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Entries List */}
        <div className="p-4 sm:p-6">
          {billing.loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-10">
              <ReceiptIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No billing entries found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filterStatus !== "all" 
                  ? "Try changing the filter or add a new entry" 
                  : "Click 'Add Entry' to create your first billing entry"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-gray-900 rounded-lg p-4 sm:p-5 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-semibold text-white">{entry.recipient}</h3>
                        <span className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(entry.status)}`}>
                          {getStatusIcon(entry.status)}
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </div>
                      {entry.additionalNotes && (
                        <p className="text-sm text-gray-400 mb-2">{entry.additionalNotes}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="text-left sm:text-right flex-1 sm:flex-none">
                        <p className={`text-xl sm:text-2xl font-bold ${
                          entry.status === "credited" ? "text-green-400" : 
                          entry.status === "debited" ? "text-red-400" : "text-white"
                        }`}>
                          {entry.status === "credited" ? "+" : entry.status === "debited" ? "-" : ""}
                          ₹{entry.billingAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="p-2 text-blue-400 hover:bg-gray-800 rounded-lg transition-all"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this entry?")) {
                              dispatch(deleteBillingEntry({ token, projectId, billingId: entry._id }));
                            }
                          }}
                          className="p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingEntry) && (
        <BillingEntryModal
          entry={editingEntry}
          onClose={() => {
            setShowAddModal(false);
            setEditingEntry(null);
          }}
          onSave={(data) => {
            if (editingEntry) {
              dispatch(updateBillingEntry({
                token,
                projectId,
                billingId: editingEntry._id,
                updateData: data,
              }));
            } else {
              dispatch(addBillingEntry({
                token,
                projectId,
                billingData: data,
              }));
            }
            setShowAddModal(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
};

// Billing Entry Modal Component
const BillingEntryModal = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    billingAmount: entry?.billingAmount || "",
    recipient: entry?.recipient || "",
    status: entry?.status || "pending",
    date: entry?.date ? new Date(entry.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    additionalNotes: entry?.additionalNotes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      billingAmount: parseFloat(formData.billingAmount),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {entry ? "Edit Billing Entry" : "Add Billing Entry"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.billingAmount}
              onChange={(e) => setFormData({ ...formData, billingAmount: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient/Payer
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
              placeholder="Enter name or company"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="credited">Credited (Received)</option>
              <option value="debited">Debited (Paid)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              rows="3"
              maxLength="500"
              placeholder="Add any additional details..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all"
            >
              {entry ? "Update" : "Add"} Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingView;