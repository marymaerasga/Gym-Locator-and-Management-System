import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const specialtySchema = mongoose.Schema({
  specialtyName: {
    type: String,
    required: true,
  },
});

const certificationSchema = mongoose.Schema({
  certificateName: {
    type: String,
    required: true,
  },
});

const trainerSchema = mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  gymOwnerId: {
    type: mongoose.Types.ObjectId,
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
  email: {
    type: String,
    required: true,
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
  gender: {
    type: String,
    required: true,
  },
  classes: {
    type: Array,
    required: true,
    default: [],
  },
  certifications: {
    type: [certificationSchema],
    default: [],
  },
  specialties: {
    type: [specialtySchema],
    default: [],
  },
  yearsOfExperience: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

trainerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Trainer = mongoose.model("Trainers", trainerSchema);

export default Trainer;
