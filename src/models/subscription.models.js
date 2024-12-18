import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscribing: {
      type: Schema.Types.ObjectId,  // The USER who is subscribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,  // The USER whose account/channel is subscribed by subscriber
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);