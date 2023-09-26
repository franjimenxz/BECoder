import fs from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./dao/fileSystem/productos.json";
    this.id = 0;
  }

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  ) => {
    try {
      const products = await this.sendProducts();
      let coincidencias = products.findIndex((prod) => prod.code === code);
      if (coincidencias !== -1) {
        throw new Error("El producto ya existe");
      }
      this.id = products.length === 0 ? 0 : products[products.length - 1].id;
      const product = {
        id: ++this.id,
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        status: true,
        category: category,
      };

      products.push(product);
      this.products = products;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t"),
      );
      return "Producto agregado exitosamente!";
    } catch (error) {
      return error.message;
    }
  };

  sendProducts = async () => {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error(error);
      return this.products;
    }
  };

  getProductById = async (id) => {
    try {
      let productos = await this.sendProducts();
      let coincidencias = productos.filter((producto) => producto.id === id);

      if (coincidencias.length === 0) {
        throw new Error("Not Found");
      }
      return coincidencias;
    } catch (error) {
      return error.message;
    }
  };

  getProducts = async () => {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      return error.message;
    }
  };

  async deleteProduct(id) {
    const products = await this.sendProducts();

    const auxDelete = products.findIndex((prod) => prod.id === id);

    if (auxDelete === -1) {
      console.log("Not found");
    }

    const product = products[auxDelete];

    products.splice(auxDelete, 1);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t"),
      );

      return "Se ha eliminado el producto " + product.id + " exitosamente!";
    } catch (e) {
      return "No se ha podido eliminar el producto o el producto no existe";
    }
  }

  updateProduct = async (updateProduct) => {
    try {
      const prods = await this.sendProducts();

      let aux = prods.findIndex((prod) => prod.id === updateProduct.id);

      if (aux === -1) {
        return "Producto no encontrado";
      }
      prods[aux] = {
        ...prods[aux],
        ...updateProduct,
      };
      await fs.promises.writeFile(this.path, JSON.stringify(prods, null, "\t"));

      return "Producto Actualizado!";
    } catch (e) {
      return "Error al Actualizar el producto\n", e;
    }
  };
}

export default ProductManager;
