import Project from "../models/project.model.js";

//  Create a new project
export const createProjectService = async (adminId, projectData) => {
  const { clientName, projectName, clientEmail, clientPhone, startDate } = projectData;

  const newProject = await Project.create({
    admin: adminId,
    clientName,
    projectName,
    clientEmail,
    clientPhone,
    startDate,
    status: "active", // default status
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

//  Update a project (can update any field including status)
export const updateProjectService = async (adminId, projectId, updateData) => {
  // Optional: restrict status to only valid values
  if (updateData.status && !["active", "completed"].includes(updateData.status)) {
    throw new Error("Invalid status value");
  }

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    updateData,
    { new: true, runValidators: true } // return updated doc and validate schema
  );

  if (!updatedProject) throw new Error("Project not found or access denied");

  return updatedProject;
};

export const addBillingEntryService = async (adminId, projectId, billingData) => {
  const { billingAmount, recipient, additionalNotes, date } = billingData;

  const project = await Project.findOneAndUpdate(
    { _id: projectId, admin: adminId },
    {
      $push: {
        billing: {
          date: date || Date.now(),
          billingAmount,
          recipient,
          additionalNotes,
        },
      },
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

// Update a specific billing entry
export const updateBillingEntryService = async (adminId, projectId, billingId, updateData) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      admin: adminId,
      "billing._id": billingId,
    },
    {
      $set: {
        "billing.$.billingAmount": updateData.billingAmount,
        "billing.$.recipient": updateData.recipient,
        "billing.$.additionalNotes": updateData.additionalNotes,
        "billing.$.date": updateData.date,
      },
    },
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

// Get billing summary (total amount, count, etc.)
export const getBillingSummaryService = async (adminId, projectId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId },
    { billing: 1, projectName: 1 }
  );

  if (!project) throw new Error("Project not found or access denied");

  const totalBillingAmount = project.billing.reduce(
    (sum, entry) => sum + (entry.billingAmount || 0),
    0
  );

  return {
    projectName: project.projectName,
    totalEntries: project.billing.length,
    totalBillingAmount,
    billingHistory: project.billing.sort((a, b) => b.date - a.date),
  };
};

// ============= BUDGET SERVICES =============

// Set or update project budget
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

// Add a single work item to budget
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

// Update a specific budget item
export const updateBudgetItemService = async (adminId, projectId, itemId, updateData) => {
  // First get the current item to calculate amount difference
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

// Delete a budget item
export const deleteBudgetItemService = async (adminId, projectId, itemId) => {
  // First get the item to subtract its amount from total
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

// Get budget details for a project
export const getBudgetService = async (adminId, projectId) => {
  const project = await Project.findOne(
    { _id: projectId, admin: adminId },
    { budget: 1, projectName: 1, clientName: 1 }
  );

  if (!project) throw new Error("Project not found or access denied");
  return project;
};