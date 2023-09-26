import fs from "fs";

class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./dao/fileSystem/carrito.json";
    this.id = 0;
  }
  addCart = async (prods) => {
    try {
      let carts = await this.sendCarts();
      this.id = carts.length === 0 ? 0 : carts[carts.length - 1].id;
      let cart = {
        id: ++this.id,
        products: [...prods],
      };
      carts.push(cart);
      this.carts = carts;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t"),
      );
      return "Carrito agregado correctamente!";
    } catch (error) {
      return "Error al agregar carrito";
    }
  };
  getCartById = async (id) => {
    try {
      let carts = await this.sendCarts();
      return carts.find((cart) => cart.id === id).products;
    } catch (error) {
      return error.message;
    }
  };
  addProductToCart = async (idCart, idProd) => {
    try {
      let prod = {
        product: idProd,
        quantity: 1,
      };
      let carts = await this.sendCarts();
      let coincidenciasCart = carts.findIndex((cart) => cart.id === idCart);
      if (coincidenciasCart === -1) {
        throw new Error("Carrito no encontrado");
      } else {
        let coincidenciasProd = carts[coincidenciasCart].products.findIndex(
          (prod) => prod.product === idProd,
        );

        if (coincidenciasProd === -1) {
          carts[coincidenciasCart].products.push(prod);
        } else {
          carts[coincidenciasCart].products[coincidenciasProd].quantity++;
        }
        this.carts = carts;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.carts, null, "\t"),
        );
        return "Producto agregado correctamente al carrito!";
      }
    } catch (error) {
      return error.message;
    }
  };
  sendCarts = async () => {
    try {
      if (this.carts.length === 0) {
        const carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
      } else {
        return this.carts;
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export default CartManager;
