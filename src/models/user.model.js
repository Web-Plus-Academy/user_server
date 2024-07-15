import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    //createdAt, updatedAt
},{timestamps:true})

const User = mongoose.model("User",UserSchema);

export default User;