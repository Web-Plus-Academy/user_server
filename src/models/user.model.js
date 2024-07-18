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
    }
}, { timestamps: true });

// Function to get the model for a specific batch
const getUserModelForBatch = (batchNumber) => {
    const collectionName = `users_batch_${batchNumber}`;
    return mongoose.model(collectionName, UserSchema, collectionName);
};

export {getUserModelForBatch, UserSchema};
