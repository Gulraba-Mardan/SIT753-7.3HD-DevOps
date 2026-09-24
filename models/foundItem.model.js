const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    foundAt: {
      type: Date,
      required: true,
    },
    campusLocation: {
      type: String,
      required: true,
      trim: true,
    },
    photos: {
      type: [String],
      validate: {
        validator: (photos) => photos.length <= 3,
        message: "A found item report can contain up to three photos.",
      },
    },
    contactMethod: {
      type: String,
      required: true,
      enum: ["email", "collection"],
    },
    collectionLocation: {
      type: String,
      trim: true,
      required() {
        return this.contactMethod === "collection";
      },
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("FoundItem", foundItemSchema);
