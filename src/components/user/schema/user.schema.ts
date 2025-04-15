import * as mongoose from "mongoose";
import { hashGenerate } from "../../../shared";
import { v4 as uuidv4 } from "uuid";

export const UsersSchema = new mongoose.Schema({
  _id: {
    type: String,
    index: true,
    default: () => uuidv4(),
  },
  first_name: {
    type: String,
    default: "",
    lowercase: true,
  },
  last_name: {
    type: String,
    default: "",
    lowercase: true,
  },
  organization_name: {
    type: String,
    default: "",
    lowercase: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  phone_number: {
    type: String,
    default: "",
    index: true,
  },
  status: {
    type: Boolean,
    default: true,
    index: true,
  },
  user_type: {
    type: String,
    index: true,
    enum: ["user", "partner", "master"],
    default: "user",
  },
  parent_id: {
    type: String,
    default: "",
  },
  profile: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others", "N/A"],
    default: "N/A",
  },
  address: {},
  salt: String,
  password: String,
  created_by: String,
  created_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  update_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  delete_at: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

//schema middleware to apply before saving
UsersSchema.pre("save", async function (next) {
  // @ts-ignore
  const { hash, salt } = await hashGenerate(this.password, 16);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  this.password = hash;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  this.salt = salt;
  next();
});

UsersSchema.pre("updateOne", async function (next) {
  const data = this.getUpdate();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { hash, salt } = await hashGenerate(data["$set"]["password"], 16);
  if (data) {
    this.set({
      password: hash,
      salt: salt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      passwordReset: data["$set"]["passwordReset"],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      email_verify: data["$set"]["email_verify"],
      update_at: Math.floor(Date.now() / 1000),
    });
  }
  next();
});

UsersSchema.pre("insertMany", async function (next, users) {
  if (Array.isArray(users) && users.length > 0) {
    const hashedUsers = users.map(async (user) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
      return await new Promise(async () => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const { hash, salt } = await hashGenerate(user.password, 16);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        user.password = hash;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        user.salt = salt;

        // this.passwordConfirm = undefined;
        next();
      });
    });
    await Promise.all(hashedUsers);
    next();
  } else return next(new Error("User list should not be empty"));
});

UsersSchema.post("save", function (error, doc, next) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.name === "MongoServerError" && error.code === 11000) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    next({
      message: "Duplicate key error: A record with this ID already exists. ",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      key: error.keyPattern,
    });
    //   next((error));
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    next();
  }
});

UsersSchema.post("aggregate", function (result) {
  // prints returned documents
  console.log("find() returned " + JSON.stringify(result));
  // prints number of milliseconds the query took
});
