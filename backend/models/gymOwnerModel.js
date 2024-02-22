import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const memberPlanSchema = mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Date,
    // required: true,
    default: null,
  },
  endTime: {
    type: Date,
    // required: true,
    default: null,
  },
  planStatus: {
    type: String,
    enum: ["active", "expired", "pending", "rejected"],
    default: "pending",
  },
  proofOfPayment: {
    type: mongoose.Schema.Types.Mixed,
    // required: true,
    default: null,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "cancelled", "pending", "rejected"],
    default: "pending",
  },
  _id: false,
});

const memberSchema = mongoose.Schema(
  {
    user: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        firstname: {
          type: String,
          required: true,
        },
        middlename: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        contact: {
          type: String,
          required: true,
        },
        gender: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: Date,
          required: true,
        },
      },
      required: true,
    },
    plan: {
      type: memberPlanSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const announcementSchema = mongoose.Schema({
  announcement: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const amenitySchema = mongoose.Schema({
  amenityName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenityImage: {
    type: Object,
    required: true,
  },
});

const serviceSchema = mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  serviceImage: {
    type: Object,
    required: true,
  },
});

const planSchema = mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const equipmentSchema = mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  equipmentImage: {
    type: Object,
    required: true,
  },
});

const scheduleSchema = mongoose.Schema({
  startday: {
    type: String,
    required: true,
  },
  endday: {
    type: String,
    required: true,
  },
  opentime: {
    type: String,
    required: true,
  },
  closetime: {
    type: String,
    required: true,
  },
});

const gymSchema = mongoose.Schema({
  gymname: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  gcashNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gymLocation: {
    type: Array,
    required: true,
  },
  schedule: {
    type: scheduleSchema,
    required: true,
  },
  permitImage: {
    type: Object,
    required: true,
  },
  gymImage: {
    type: Object,
    required: true,
  },
  equipments: {
    type: [equipmentSchema],
    default: [],
  },
  plans: {
    type: [planSchema],
    default: [],
  },
  services: {
    type: [serviceSchema],
    default: [],
  },
  trainers: {
    type: Array,
    default: [],
  },
  amenities: {
    type: [amenitySchema],
    default: [],
  },
  announcements: {
    type: [announcementSchema],
    default: [],
  },
  classes: {
    type: Array,
    default: [],
  },
  isApproved: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
  members: {
    type: [memberSchema],
    default: [],
  },
  reviews: {
    type: Array,
    required: true,
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const gymOwnerSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gym: {
      type: gymSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

gymOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

gymOwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const GymOwner = mongoose.model("Gymowners", gymOwnerSchema);

export default GymOwner;
