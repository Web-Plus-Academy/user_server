import getUserModelForBatch from '../models/user.model.js';
import mongoose from 'mongoose';

export const getUserTasks = async (req, res) => {

    try {
        const { username } = req.body;
        const batchnumber = parseInt(username[4]);
        const User = getUserModelForBatch(batchnumber);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const tasks = user.task;

        return res.status(200).json(tasks); // Send tasks data to the frontend
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while fetching tasks' });
    }
};

export const submitTask = async (req, res) => {
    const { username, taskId, taskLink, submittedTime, semester } = req.body;
    const semesterNumber = semester.match(/\d+/)[0];  // Extract the first sequence of digits
    console.log(`Semester: sem${semesterNumber}, TaskID: ${taskId}`);  // Debug log

    try {
        const batchnumber = parseInt(username[4]);

        const User = getUserModelForBatch(batchnumber);

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the semester exists for the user
        if (!user.task[`sem${semesterNumber}`]) {
            return res.status(404).json({ message: `Semester sem${semesterNumber} not found for user` });
        }

        console.log(user.task[`sem${semesterNumber}`]); // Log all tasks for that semester

        const taskIdObject = new mongoose.Types.ObjectId(taskId);  // Convert string to ObjectId

        const taskIndex = user.task[`sem${semesterNumber}`].findIndex(task => task._id.toString() === taskIdObject.toString());

        if (taskIndex === -1) {
            return res.status(404).json({ message: `Task with ID ${taskId} not found in semester sem${semesterNumber}` });
        }

        user.task[`sem${semesterNumber}`][taskIndex].taskSubmitted = taskLink;
        user.task[`sem${semesterNumber}`][taskIndex].submittedTime = new Date(submittedTime);
        user.task[`sem${semesterNumber}`][taskIndex].isSubmitted = true;

        await user.save(); // Save the updated user data

        return res.status(200).json({ message: 'Task submitted successfully' });
    } catch (error) {
        console.error('Error submitting task:', error);
        return res.status(500).json({ message: 'Error submitting task' });
    }
};
