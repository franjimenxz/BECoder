import { cartModel } from "../../models/cart.model.js";

class cartDBService {
  async addCart(cart) {
    try {
      let response = await cartModel.create({ products: cart.products || [] });
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear el carrito");
    }
  }
  async getCarts() {
    try {
      let response = await cartModel.find();
      return response;
    } catch (error) {
      throw new Error("Error al obtener los carritos");
    }
  }
  async getCartById(id) {
    try {
      let response = await cartModel.findOne({ _id: id });
      return response;
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(idCart, idProd, quantity) {
    try {
      let exist = await cartModel.findOne({
        _id: idCart,
        products: { $elemMatch: { product: idProd } },
      });
      if (exist) {
        return await this.updateProductFromCart(idCart, idProd, quantity);
      } else {
        return await cartModel.updateOne(
          {
            _id: idCart,
          },
          { $push: { products: { product: idProd, quantity: 1 } } },
        );
      }
    } catch (error) {
      throw new Error("Error al agregar el producto al carrito");
    }
  }
  async deleteCartById(id) {
    try {
      let response = await cartModel.updateOne(
        { _id: id },
        { $set: { cart: [] } },
      );
      return response;
    } catch (error) {
      throw new Error("Error al eliminar el carrito");
    }
  }

  async deleteProductFromCart(idCart, idProd) {
    try {
      return await cartModel.deleteOne({
        _id: idCart,
        products: { $elemMatch: { _id: idProd } },
      });
    } catch (error) {
      throw new Error("Error al eliminar el producto del carrito");
    }
  }
  async updateCart(id, cart) {
    try {
      return await cartModel.updateOne({ _id: id }, cart);
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }
  async updateProductFromCart(idCart, idProd, product) {
    try {
      return await cartModel.updateOne(
        {
          _id: idCart,
          products: { $elemMatch: { product: idProd } },
        },
        { $set: { "products.$.quantity": product.quantity } },
      );
    } catch (error) {
      throw new Error("Error al actualizar el producto del carrito");
    }
  }
}
export default cartDBService;
