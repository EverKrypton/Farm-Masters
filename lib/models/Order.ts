import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Number,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "partial", "cancelled", "refunded"],
      default: "pending",
    },
    smmFlareOrderId: {
      type: Number,
    },
    startCount: {
      type: String,
    },
    remains: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
