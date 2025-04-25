// utils/paginate.ts
import { Model } from "mongoose";

interface PaginateOptions {
  model: Model<any>;
  query?: any; // query params
  searchFields?: string[]; // fields to apply search on
  filterFields?: string[]; // optional filters
  defaultLimit?: number;
}

export const paginate = async ({
  model,
  query = {},
  searchFields = [],
  filterFields = [],
  defaultLimit = 10,
}: PaginateOptions) => {
  const {
    page = 1,
    limit = defaultLimit,
    search,
    sort = "-createdAt", // default sort: latest first
    ...filters
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const mongoQuery: any = {};

  // Add search condition
  if (search && searchFields.length > 0) {
    const regex = new RegExp(search, "i");
    mongoQuery.$or = searchFields.map((field) => ({ [field]: regex }));
  }

  // Add individual filters
  for (const field of filterFields) {
    if (filters[field]) {
      mongoQuery[field] = new RegExp(filters[field], "i");
    }
  }

  const [data, total] = await Promise.all([
    model.find(mongoQuery).sort(sort).skip(skip).limit(Number(limit)),
    model.countDocuments(mongoQuery),
  ]);

  return {
    data,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};
