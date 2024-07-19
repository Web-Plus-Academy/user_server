import cron from 'node-cron';
import mongoose from 'mongoose';
import  getUserModelForBatch  from '../models/user.model.js';

const connectToMongoDB = async()=>{
    try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB Connected")        
    } catch (error) {
        console.log("Error in connecting DB",error.message)
    }
}

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const batchNumbers = [1, 2, 3]; // Replace with your actual batch numbers
    for (const batchNumber of batchNumbers) {
        const UserModel = getUserModelForBatch(batchNumber);
        await UserModel.updateMany(
            { podSubmissionStatus: true },
            { $set: { podSubmissionStatus: false} }
        );
        console.log(`POD submission status reset for batch ${batchNumber}`);
    }
} catch (error) {
    console.error('Error resetting POD submission status:', error.message);
}
});



export default connectToMongoDB;