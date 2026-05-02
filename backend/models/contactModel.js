import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
    },
    subject: {
        type: String,
        default: null,
    },
    message: {
        type: String,
        required: [true, 'Please enter a message'],
    }
}, {
    timestamps: true,
    minimize: false
});

const contactModel = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export default contactModel;
