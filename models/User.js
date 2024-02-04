const { Schema, model } = require("mongoose");
const thoughtsSchema = require("./Thoughts");

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: /^\S+@\S+\.\S+$/,
        },
        thoughts: [thoughtsSchema],
        friends: [userSchema],
    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);

userSchema.virtual("friendCount").get(function () {
    return this.friends.length
})

const User = model("user", userSchema)

module.exports = User;