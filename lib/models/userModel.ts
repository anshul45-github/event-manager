import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    token: { type: String, required: true },
})

const user = mongoose.models.user || mongoose.model('user', userSchema);

export default user;