import mongoose from "mongoose";

const { Schema, model } = mongoose;

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    treks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trek",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Favorite = model("Favorite", favoriteSchema);
export default Favorite;
