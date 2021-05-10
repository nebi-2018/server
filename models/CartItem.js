import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatarImage: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190704/ourmid/pngtree-businessman-user-avatar-free-vector-png-image_1538405.jpg",
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
