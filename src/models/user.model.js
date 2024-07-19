import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  batchnumber: {
    type: Number,
    required: true
  },
  POD: {
    type: Number,
    default: 0 // Initialize with 0
  },
  podSubmissionStatus: {
    type: Boolean,
    default: false // Track if the POD has been submitted today
  },
}, { timestamps: true });

// Function to get the model for a specific batch
const getUserModelForBatch = (batchNumber) => {
  const collectionName = `FSD_B${batchNumber}`;
  return mongoose.model(collectionName, UserSchema, collectionName);
};

export default getUserModelForBatch;
