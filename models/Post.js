import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";

const { Schema } = mongoose;

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featureImage: {
      type: [String],
    },
    author: {
      ref: "users",
      type: Schema.Types.ObjectId,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.plugin(paginator);

export default mongoose.model("posts", postSchema);
