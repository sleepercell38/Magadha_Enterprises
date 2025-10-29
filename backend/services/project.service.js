import Project from "../models/project.model.js";

// Create a new project
export const createProjectService = async (adminId, projectData) => {
  const { clientName, projectName, clientEmail, clientPhone, startDate } = projectData;

  const newProject = await Project.create({
    admin: adminId,
    clientName,
    projectName,
    clientEmail,
    clientPhone,
    startDate,
    status: "active",
  });

  return newProject;
};

export const getProjectsByAdminService = async (adminId) => {
  const projects = await Project.find({ admin: adminId }).sort({ createdAt: -1 });
  return projects;
};

export const getProjectByIdService = async (adminId, projectId) => {
  const project = await Project.findOne({ _id: projectId, admin: adminId });
  if (!project) throw new Error("Project not found or access denied");
  return project;
};

export const deleteProjectService = async (adminId, projectId) => {
  const deleted = await Project.findOneAndDelete({ _id: projectId, admin: adminId });
  if (!deleted) throw new Error("Project not found or access denied");
  return deleted;
};

export const updateProjectService = async (adminId, projectId, updateData) => {
  if (updateData.status && !["active", "completed"].includes(updateData.status)) {
    throw new Error("Invalid status value");
  }

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProject) throw new Error("Project not found or access denied");

  return updatedProject;
};

// ============= BILLING SERVICES =============

// Add billing entry with status support
export const addBillingEntryService = async (adminId, projectId, billingData) => {
  const { billingAmount, recipient, additionalNotes, date, status } = billingData;

  // Validate status if provided
  if (status && !['credited', 'debited', 'pending'].includes(status)) {
    throw new Error("Invalid status value. Must be 'credited', 'debited', or 'pending'");
  }

  const billingEntry = {
    date: date || Date.now(),
    billingAmount,
    recipient,
    status: status || 'pending',
    additionalNotes,
  };

  const project = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    {
      $push: { billing: billingEntry },
    },
    { new: true, runValidators: true }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};

// Get all billing entries for a project
export const getBillingEntriesService = async (adminId, projectId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId },
    { billing: 1, projectName: 1, clientName: 1 }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};

// Update a specific billing entry with status support
export const updateBillingEntryService = async (adminId, projectId, billingId, updateData) => {
  // Validate status if provided
  if (updateData.status && !['credited', 'debited', 'pending'].includes(updateData.status)) {
    throw new Error("Invalid status value. Must be 'credited', 'debited', or 'pending'");
  }

  const updateFields = {};
  
  // Build update fields dynamically
  if (updateData.billingAmount !== undefined) {
    updateFields["billing.$.billingAmount"] = updateData.billingAmount;
  }
  if (updateData.recipient !== undefined) {
    updateFields["billing.$.recipient"] = updateData.recipient;
  }
  if (updateData.additionalNotes !== undefined) {
    updateFields["billing.$.additionalNotes"] = updateData.additionalNotes;
  }
  if (updateData.date !== undefined) {
    updateFields["billing.$.date"] = updateData.date;
  }
  if (updateData.status !== undefined) {
    updateFields["billing.$.status"] = updateData.status;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      admin: adminId,
      "billing._id": billingId,
    },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!project) throw new Error("Billing entry not found or access denied");
  return project;
};

// Delete a specific billing entry
export const deleteBillingEntryService = async (adminId, projectId, billingId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    {
      $pull: { billing: { _id: billingId } },
    },
    { new: true }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};

// Get billing summary with status breakdown
export const getBillingSummaryService = async (adminId, projectId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId },
    { billing: 1, projectName: 1 }
  );

  if (!project) throw new Error("Project not found or access denied");

  // Calculate totals by status
  const statusBreakdown = {
    credited: { count: 0, amount: 0 },
    debited: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
  };

  project.billing.forEach(entry => {
    const status = entry.status || 'pending';
    statusBreakdown[status].count++;
    statusBreakdown[status].amount += entry.billingAmount || 0;
  });

  const totalBillingAmount = project.billing.reduce(
    (sum, entry) => sum + (entry.billingAmount || 0),
    0
  );

  return {
    projectName: project.projectName,
    totalEntries: project.billing.length,
    totalBillingAmount,
    statusBreakdown,
    billingHistory: project.billing.sort((a, b) => b.date - a.date),
  };
};

// ============= BUDGET SERVICES =============

export const setBudgetService = async (adminId, projectId, budgetData) => {
  const { areaInSqFeet, workDetails } = budgetData;

  const updateObject = {};
  
  if (areaInSqFeet !== undefined) {
    updateObject["budget.areaInSqFeet"] = areaInSqFeet;
  }
  
  if (workDetails) {
    if (workDetails.totalAmount !== undefined) {
      updateObject["budget.workDetails.totalAmount"] = workDetails.totalAmount;
    }
    if (workDetails.items) {
      updateObject["budget.workDetails.items"] = workDetails.items;
    }
  }

  const project = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    { $set: updateObject },
    { new: true, runValidators: true }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};

export const addBudgetItemService = async (adminId, projectId, itemData) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    {
      $push: { "budget.workDetails.items": itemData },
      $inc: { "budget.workDetails.totalAmount": itemData.amount || 0 }
    },
    { new: true, runValidators: true }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};

export const updateBudgetItemService = async (adminId, projectId, itemId, updateData) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId }
  );
  
  if (!project) throw new Error("Project not found or access denied");
  
  const currentItem = project.budget?.workDetails?.items?.id(itemId);
  if (!currentItem) throw new Error("Budget item not found");
  
  const amountDiff = (updateData.amount || 0) - (currentItem.amount || 0);
  
  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
      admin: adminId,
      "budget.workDetails.items._id": itemId,
    },
    {
      $set: {
        "budget.workDetails.items.$.cumulativeWork": updateData.cumulativeWork,
        "budget.workDetails.items.$.cumulativePercentage": updateData.cumulativePercentage,
        "budget.workDetails.items.$.amount": updateData.amount,
      },
      $inc: { "budget.workDetails.totalAmount": amountDiff }
    },
    { new: true, runValidators: true }
  );

  return updatedProject;
};

export const deleteBudgetItemService = async (adminId, projectId, itemId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId }
  );
  
  if (!project) throw new Error("Project not found or access denied");
  
  const itemToDelete = project.budget?.workDetails?.items?.id(itemId);
  const amountToSubtract = itemToDelete?.amount || 0;
  
  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    {
      $pull: { "budget.workDetails.items": { _id: itemId } },
      $inc: { "budget.workDetails.totalAmount": -amountToSubtract }
    },
    { new: true }
  );

  return updatedProject;
};

export const getBudgetService = async (adminId, projectId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId },
    { budget: 1, projectName: 1, clientName: 1 }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};