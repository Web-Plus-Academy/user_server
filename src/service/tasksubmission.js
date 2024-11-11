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


export const getUserSemProj = async (req, res) => {
    try {
        const { username } = req.body;
        const batchnumber = parseInt(username[4]);
        const User = getUserModelForBatch(batchnumber);
        
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Retrieve the user's semproj data
        const semproj = user.semproj;

        return res.status(200).json(semproj); // Send semproj data to the frontend
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while fetching semester projects' });
    }
};


export const submitSemProj = async (req, res) => {
    const { username, projId, gitLink, liveLink, submittedTime, semester } = req.body;
    const semesterNumber = semester;

    console.log(`Semester: sem${semesterNumber}, ProjectID: ${projId}`); // Debug log

    try {
        // Extract batch number from username (e.g., 'FSDB410' → 4)
        const batchnumber = parseInt(username[4]);
        const User = getUserModelForBatch(batchnumber);
        
        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize the semproj for the given semester if not already present
        if (!user.semproj[`sem${semesterNumber}`]) {
            user.semproj[`sem${semesterNumber}`] = [];
        }

        // Convert projId to ObjectId if it's not already in that format
        const projIdObject = new mongoose.Types.ObjectId(projId);

        // Find the project index by comparing ObjectIds
        const projIndex = user.semproj.findIndex(
            proj => proj._id.toString() === projIdObject.toString()
        );



        if (projIndex === -1) {
            return res.status(404).json({ message: `Project with ID ${projId} not found in semester sem${semesterNumber}` });
        }

        // Update project submission details
        const proj = user.semproj[projIndex];

        console.log(proj)
        
        // Update only the relevant fields
        proj.gitlink = gitLink; // Allow null or empty links
        proj.livelink = liveLink; // Allow null or empty links
        proj.submittedTime = new Date(submittedTime); // Ensure proper time format
        proj.isSubmitted = true; // Mark as submitted

        // Save the updated user data
        await user.save();

        return res.status(200).json({ message: 'Project submitted successfully' });
    } catch (error) {
        console.error('Error submitting project:', error);
        return res.status(500).json({ message: 'Error submitting project' });
    }
};