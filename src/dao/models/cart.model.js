import mongoose, { Schema } from "mongoose";

const cartCollection = "carts";

const itemCartSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: {
    type: [itemCartSchema],
    required: true,
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.product");
});
export const cartModel = mongoose.model(cartCollection, cartSchema);
