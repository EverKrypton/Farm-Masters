import mongoose from "mongoose"

const DepositSchema = new mongoose.Schema(
  {
    depositId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    trxAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "TRX",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "expired", "failed"],
      default: "pending",
    },
    trackId: {
      type: Number,
    },
    txId: {
      type: String,
    },
    payLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema)
