import React, { useState, useEffect } from "react";
import { 
  XIcon, 
  PlusIcon, 
  TrashIcon, 
  CalculatorIcon,
  HomeIcon,
  BriefcaseIcon,
  PercentIcon
} from "lucide-react";

const BudgetModal = ({ isOpen, onClose, onCreate, existingBudget }) => {
  const [budgetData, setBudgetData] = useState({
    areaInSqFeet: existingBudget?.areaInSqFeet || "",
    workDetails: {
      totalAmount: existingBudget?.workDetails?.totalAmount || 0,
      items: existingBudget?.workDetails?.items?.length > 0 
        ? existingBudget.workDetails.items.map(item => ({
            ...item,
            id: item._id || Date.now() + Math.random()
          }))
        : [{ cumulativeWork: "", cumulativePercentage: "", amount: "", id: Date.now() }]
    }
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Calculate totals whenever items change
  useEffect(() => {
    const amountTotal = budgetData.workDetails.items.reduce((sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);
    
    const percentageTotal = budgetData.workDetails.items.reduce((sum, item) => {
      const percentage = parseFloat(item.cumulativePercentage) || 0;
      return sum + percentage;
    }, 0);
    
    setTotalAmount(amountTotal);
    setTotalPercentage(percentageTotal);
  }, [budgetData.workDetails.items]);

  const addBudgetItem = () => {
    setBudgetData({
      ...budgetData,
      workDetails: {
        ...budgetData.workDetails,
        items: [
          ...budgetData.workDetails.items,
          { cumulativeWork: "", cumulativePercentage: "", amount: "", id: Date.now() }
        ]
      }
    });
  };

  const removeBudgetItem = (id) => {
    if (budgetData.workDetails.items.length > 1) {
      setBudgetData({
        ...budgetData,
        workDetails: {
          ...budgetData.workDetails,
          items: budgetData.workDetails.items.filter(item => item.id !== id)
        }
      });
    }
  };

  const updateBudgetItem = (id, field, value) => {
    setBudgetData({
      ...budgetData,
      workDetails: {
        ...budgetData.workDetails,
        items: budgetData.workDetails.items.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty items and prepare data
    const validItems = budgetData.workDetails.items.filter(
      item => item.cumulativeWork && item.amount
    );

    const finalBudgetData = {
      areaInSqFeet: parseFloat(budgetData.areaInSqFeet) || 0,
      workDetails: {
        totalAmount: totalAmount,
        items: validItems.map(item => ({
          cumulativeWork: item.cumulativeWork,
          cumulativePercentage: parseFloat(item.cumulativePercentage) || 0,
          amount: parseFloat(item.amount) || 0
        }))
      }
    };

    onCreate(finalBudgetData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CalculatorIcon className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                {existingBudget ? "Update Budget" : "Set Project Budget"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Area Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <HomeIcon className="w-4 h-4" />
              Project Area (sq.ft)
            </label>
            <input
              type="number"
              value={budgetData.areaInSqFeet}
              onChange={(e) => setBudgetData({ ...budgetData, areaInSqFeet: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Enter project area in square feet"
            />
          </div>

          {/* Budget Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <BriefcaseIcon className="w-4 h-4" />
                Work Items & Budget
              </label>
              <button
                type="button"
                onClick={addBudgetItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {budgetData.workDetails.items.map((item, index) => (
                <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 mb-1 block">Work Description</label>
                      <input
                        type="text"
                        value={item.cumulativeWork}
                        onChange={(e) => updateBudgetItem(item.id, 'cumulativeWork', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                        placeholder={`Work item ${index + 1} description`}
                        required
                      />
                    </div>
                    
                    <div className="w-32">
                      <label className="text-xs text-gray-400 mb-1 block">Percentage</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={item.cumulativePercentage}
                          onChange={(e) => updateBudgetItem(item.id, 'cumulativePercentage', e.target.value)}
                          className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <PercentIcon className="absolute right-2 top-3 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="w-40">
                      <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">₹</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateBudgetItem(item.id, 'amount', e.target.value)}
                          className="w-full px-3 py-2 pl-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                          placeholder="0"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => removeBudgetItem(item.id)}
                        disabled={budgetData.workDetails.items.length === 1}
                        className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600/20 to-sky-600/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalculatorIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Total Amount</span>
                </div>
                <span className="text-xl font-bold text-blue-400">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            <div className={`bg-gradient-to-r ${totalPercentage > 100 ? 'from-red-600/20 to-orange-600/20 border-red-500/30' : 'from-green-600/20 to-emerald-600/20 border-green-500/30'} border rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PercentIcon className={`w-5 h-5 ${totalPercentage > 100 ? 'text-red-400' : 'text-green-400'}`} />
                  <span className="text-sm font-medium text-gray-300">Total Percentage</span>
                </div>
                <span className={`text-xl font-bold ${totalPercentage > 100 ? 'text-red-400' : 'text-green-400'}`}>
                  {totalPercentage.toFixed(2)}%
                </span>
              </div>
              {totalPercentage > 100 && (
                <p className="text-xs text-red-400 mt-2">Warning: Total exceeds 100%</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={totalAmount === 0 || budgetData.workDetails.items.every(item => !item.cumulativeWork || !item.amount)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <CalculatorIcon className="w-5 h-5" />
              {existingBudget ? "Update Budget" : "Set Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;