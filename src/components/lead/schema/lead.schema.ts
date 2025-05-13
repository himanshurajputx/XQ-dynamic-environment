import * as mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TABLE_ } from "../../../shared";

export const LeadSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      index: true,
      default: () => uuidv4(),
    },
    full_name: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      index: true,
    },
    phone_number: {
      type: String,
      default: "",
      index: true,
    },
    country_code: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },

    employment_type: {
      type: String,
      enum: [
        "salaried",
        "self-employed",
        "others",
        "retired",
        "student",
        "business",
      ],
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    pin_code: {
      type: String,
      default: "",
    },
    loan_product: {
      type: String,
      default: "",
    },
    loan_amount: {
      type: String,
      default: "",
    },
    monthly_income: {
      type: String,
      default: "",
    },
    cibil_score: {
      type: String,
      default: "",
    },
    pan: {
      type: String,
      default: "",
    },
    preferred_lending_partner: {
      type: String,
      default: "",
    },

    source: {
      type: String, // e.g., 'Facebook', 'Google Ads', 'Website'
      trim: true,
    },
    campaign: {
      type: String, // Specific campaign name or ID
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "converted"],
      default: "new",
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: String,
      ref: TABLE_.USERS,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    created_by: {
      type: String,
      ref: TABLE_.USERS,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  },
);
