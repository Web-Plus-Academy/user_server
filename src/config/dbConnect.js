import cron from 'node-cron';
import mongoose from 'mongoose';
import getUserModelForBatch from '../models/user.model.js';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in connecting DB", error.message);
  }
};



// Schedule the cron job to run every minute for testing purposes
cron.schedule('* * * * *', async () => {
  console.log("Cron job started");
  try {
    const batchNumbers = [1, 2, 3]; // Replace with your actual batch numbers
    for (const batchNumber of batchNumbers) {
      console.log(`Processing batch number: ${batchNumber}`);
      const UserModel = getUserModelForBatch(batchNumber);
      if (!UserModel) {
        console.error(`User model for batch ${batchNumber} not found`);
        continue;
      }
      const result = await UserModel.updateMany(
        { podSubmissionStatus: true },
        { $set: { podSubmissionStatus: false } }
      );
      console.log(`POD submission status reset for batch ${batchNumber}. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    }
    console.log("Cron job completed successfully");
  } catch (error) {
    console.error('Error resetting POD submission status:', error.message);
  }
});

export default connectToMongoDB;
