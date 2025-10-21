import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (!this.username) this.username = this.email;
  next();
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model('User', userSchema);

