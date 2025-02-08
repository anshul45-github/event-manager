import mongoose from "mongoose";

const VerificationToken = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
})

const verificationToken = mongoose.models.verificationToken || mongoose.model('verificationToken', VerificationToken);

export default verificationToken;