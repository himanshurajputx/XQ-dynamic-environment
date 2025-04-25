import { Document } from "mongoose";

export interface LeadInterface extends Document {
  readonly full_name: string;
  readonly email: string;
  readonly phone_number: string;
  readonly source: string;
  readonly campaign: string;
  readonly status: string;
  readonly notes: string;
  readonly tags: string;
  readonly created_by: string;
  readonly assignedTo: string;
  readonly lead_for: string;
}
