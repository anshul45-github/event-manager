import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface EventType {
    email: string;
    title: string;
    description: string;
    imageUrl: string;
    time: Date;
    isPublished: boolean;
    categoryId: string;
}

const eventSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    userId: { type: String },
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    fee: { type: String },
    time: { type: Date },
    location: { type: String },
    isPublished: { type: Boolean, default: false },
    categoryId: { type: Number },
    brochureUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const event = mongoose.models.event || mongoose.model('event', eventSchema);

export default event;