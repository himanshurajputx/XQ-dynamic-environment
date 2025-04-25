import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TABLE_ } from "../../shared";
import { Model } from "mongoose";
import { LeadInterface } from "./lead.interface";
import { LeadDto } from "./dto/lead.dto";
import { paginate } from "../../shared/pagination/paginate";
import { PaginationQuery } from "../../shared/pagination/pagination-query.dto";

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(TABLE_.LEAD)
    private readonly leadModel: Model<LeadInterface>,
  ) {}

  async create(body?: LeadDto, user?: object) {
    try {
      const id = user == undefined ? null : user["_id"];
      return await this.leadModel.create({ ...body, created_by: id });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getLeads(query?: any, user?: object) {
    try {
      const id = user == undefined ? null : user["_id"];
      // return await this.userModel.find({});
      return paginate({
        model: this.leadModel,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        query,
        searchFields: ["full_name", "email", "phone_number", "source"],
        filterFields: ["full_name", "email", "phone_number", "source"], // allow filters on these
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async paginatedList(
    query?: PaginationQuery,
    user?: any,
  ): Promise<[any[], number]> {
    const { limit = 10, page = 1, sort, search, ...filters } = query ?? {};
    const skip = (page - 1) * limit;

    const mongoFilter: Record<string, any> = { ...filters };

    // Apply search (basic OR across fields)
    if (search) {
      mongoFilter["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Apply sorting
    let sortObj: Record<string, 1 | -1> = {};
    if (sort) {
      sort.split(",").forEach((field) => {
        if (!field) return;
        const direction = field.startsWith("-") ? -1 : 1;
        const key = field.replace(/^-/, "");
        sortObj[key] = direction;
      });
    } else {
      sortObj = { createdAt: -1 }; // default sort
    }

    const [items, total] = await Promise.all([
      this.leadModel.find(mongoFilter).skip(skip).limit(limit).sort(sortObj),
      this.leadModel.countDocuments(mongoFilter),
    ]);

    return [items, total];
  }

  async getDetails(id?: any, user?: any) {
    return this.leadModel.findById(id);
  }
  async update(id?: any, body?: any, user?: any) {
    const lead = await this.leadModel.findById(id);
    if (lead == null) throw new BadRequestException("Lead not found");
    // @ts-ignore
    return this.leadModel.updateOne(id, body);
  }
}
