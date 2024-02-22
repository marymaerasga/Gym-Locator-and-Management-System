import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const reviewSchema = mongoose.Schema({
  gymname: {
    type: String,
    required: true,
  },
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  isJoined: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const membershipSchema = mongoose.Schema(
  {
    gym: {
      type: {
        gymname: {
          type: String,
          required: true,
        },
        ownerId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
      required: true,
    },
    myPlan: {
      type: {
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
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
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
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    memberships: {
      type: [membershipSchema],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      required: true,
      default: [],
    },
    classes: {
      type: Array,
      required: true,
      default: [],
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("Users", userSchema);

export default User;
