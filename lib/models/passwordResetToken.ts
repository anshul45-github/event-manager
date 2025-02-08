import mongoose from "mongoose";

const passwordResetToken = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
})

const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetToken);

export default PasswordResetToken;