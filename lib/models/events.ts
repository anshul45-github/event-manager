import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    email: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    time: { type: Date },
    isPublished: { type: Boolean },
    categoryId: { type: String },
})

const event = mongoose.models.event || mongoose.model('event', eventSchema);

export default event;