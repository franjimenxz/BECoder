import { Router } from "express";
import mongoose from "mongoose";
import ProductDBService from "../../dao/services/db/ProductDBService.js";
import { productModel } from "../../dao/models/product.model.js";

const router = Router();
const ProductService = new ProductDBService();
router.get("/", async (req, res) => {
  try {
    let { limit, page, category, status, sort } = req.query;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }
    let query = category
      ? { category: category }
      : status
      ? { status: status }
      : {};

    let response = await ProductService.getProductsWithParams(
      limit,
      page,
      query,
      sort,
    );
    req.products = response;

    res.status(200).send({
      status: "success",
      payload: response.docs,
      totalPages: response.totalPages,
      prevPage: response.prevPage,
      nextPage: response.nextPage,
      page: response.page,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevLink: response.hasPrevPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${
            response.prevPage
          }${query.category ? `&category=${query.category}` : ""}${
            query.status ? `&status=${query.status}` : ""
          }${sort ? `&sort=${sort}` : ""}`
        : null,
      nextLink: response.hasNextPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${
            response.nextPage
          }${query.category ? `&category=${query.category}` : ""}${
            query.status ? `&status=${query.status}` : ""
          }${sort ? `&sort=${sort}` : ""}`
        : null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
      payload: [],
    });
  }
});

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  try {
    if (mongoose.Types.ObjectId.isValid(pid)) {
      let producto = await ProductService.getProductById(pid);
      res.status(200).send({
        status: "success",
        payload: producto,
      });
    } else {
      throw new Error("Id invalido");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
      payload: [],
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let response = await ProductService.addProduct(
      req.body.title || "Sin titulo",
      req.body.description || "Sin descripcion",
      req.body.price || 0,
      req.body.thumbnail || "Sin imagen",
      req.body.code || "Sin codigo",
      req.body.stock || 0,
      req.body.category || "Sin categoria",
    );
    res.send({
      status: "success",
      payload: response,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
      payload: [],
    });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    if (mongoose.Types.ObjectId.isValid(pid)) {
      let resp = await productModel.find({ _id: pid });
      if (resp.length === 0) {
        throw new Error("El producto no existe");
      }
      console.log(req.body);
      let response = await ProductService.updateProductById(pid, req.body);
      res.status(200).send({
        status: "success",
        payload: response,
      });
    } else {
      throw new Error("Id invalido");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
      payload: [],
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let pid = req.params.pid;
    if (mongoose.Types.ObjectId.isValid(pid)) {
      let response = await ProductService.deleteProductById(pid);
      res.status(200).send({
        status: "success",
        payload: response,
      });
    } else {
      throw new Error("Id invalido");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "error",
      message: error.message,
      payload: [],
    });
  }
});
export default router;
