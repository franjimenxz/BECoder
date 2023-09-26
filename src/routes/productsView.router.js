import { Router } from "express";
import ProductDBService from "../../dao/services/db/ProductDBService.js";
import axios from "axios";

const router = Router();

router.get("/", async (req, res) => {
  try {
    console.log(req.url);
    const { data } = await axios.get(
      `http://localhost:8080/api/products${req.url}`,
    );
    console.log(data);
    let formatData = {
      ...data,
      prevLink: data.prevLink
        ? data.prevLink.replace(
            "http://localhost:8080/api",
            "http://localhost:8080",
          )
        : data.prevLink,
      nextLink: data.nextLink
        ? data.nextLink.replace(
            "http://localhost:8080/api",
            "http://localhost:8080",
          )
        : data.nextLink,
    };
    res.render("products", {
      products: formatData.payload,
      ...formatData,
      title: "Productos",
      style: "styles.css",
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
