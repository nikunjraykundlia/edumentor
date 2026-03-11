const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                'Please enter a valid email',
            ],
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['student', 'teacher'],
            required: [true, 'Role is required'],
        },
        enrolledSubjects: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        ],
        createdSubjects: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        ],
        refreshToken: { type: String, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// ── Pre-save hook: hash password ──
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

// ── Instance method: compare password ──
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// ── Strip sensitive fields from JSON ──
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    delete obj.refreshToken;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
