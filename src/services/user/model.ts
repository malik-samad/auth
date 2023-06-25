import { Schema, model, CallbackError } from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    isGoogleAuth: { type: Boolean, default: false },
    role: { type: [String], default: [] }
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(15);
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash;
        next();
    } catch (err) {
        return next(err as CallbackError);
    }
})

UserSchema.pre("findOneAndUpdate", async function pre(next) {
    try {
        const update = this.getUpdate();
        if (update && !Array.isArray(update) && update.$set && update.$set.password) {
            const salt = await bcrypt.genSalt(15);
            const hash = await bcrypt.hash(update.$set.password, salt);
            this.setUpdate({ ...update, $set: { ...update.$set, password: hash } });
        }
        return next(null);
    } catch (error) {
        return next(error as CallbackError);
    }
});

export default model("User", UserSchema);