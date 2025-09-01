import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    occupation: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    phone: { type: String },
    address: { type: String },
    website: { type: String },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String }
    }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export default User; 