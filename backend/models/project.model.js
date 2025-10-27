import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    billing: [{
      date: {
        type: Date,
        default: Date.now,
      },
      billingAmount: {
        type: Number,
        min: 0,
      },
      recipient: {
        type: String,
        trim: true,
      },
      additionalNotes: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    }],
    budget: {
      areaInSqFeet: {
        type: Number,
        min: 0,
      },
      workDetails: {
        totalAmount: {
          type: Number,
          min: 0,
          default: 0,
        },
        items: [{
          cumulativeWork: {
            type: String,
            trim: true,
          },
          cumulativePercentage: {
            type: Number,
            min: 0,
            max: 100,
          },
          amount: {
            type: Number,
            min: 0,
          },
        }],
      },
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;