import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  task: { type: Number, required: true },
  isSubmitted: { type: Boolean, default: false },
  credit: { type: Number, required: true, default: -1 },
  link: { type: String, required: true },
  allocDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  taskSubmitted: { type: String, default: null },  // URL or link for the task submission (e.g., GitHub link)
  submittedTime: { type: Date, default: null }  // Time when the task was submitted
});


const DailyWorkSheetSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  work: { type: String, required: true }
});

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], required: true }
});

const ReportCardSchema = new mongoose.Schema({
  sem: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  card: { type: String, required: true }
});

const SemProjSchema = new mongoose.Schema({
  sem: { type: Number, required: true  },
  gitlink: { type: String, required: true },
  livelink: { type: String, required: true },
});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  email: {
    type: String,
    required: true,
  },
  POD: {
    type: Number,
    default: 0
  },
  podSubmissionStatus: {
    type: Boolean,
    default: false
  },
  task: {
    sem1: [TaskSchema],
    sem2: [TaskSchema],
    sem3: [TaskSchema]
  },
  semproj:[SemProjSchema],
  DailyWorkSheet: [DailyWorkSheetSchema],
  attendance: [AttendanceSchema],
  enrollmentLetter: { type: String },
  reportcard: [ReportCardSchema],
  finalreportcard: { type: String },
  certificate: { type: String },
  mentorID: { type: String}
}, { timestamps: true });

// Function to get the model for a specific batch
const getUserModelForBatch = (batchNumber) => {
  const collectionName = `FSD_B${batchNumber}`;
  return mongoose.model(collectionName, UserSchema, collectionName);
};

export default getUserModelForBatch;
