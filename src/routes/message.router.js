import { Router } from "express";
import MessageDBService from "../../dao/services/db/MessageDBService.js";
const router = Router();

export const MessageService = new MessageDBService();
router.get("/", async (req, res) => {
  try {
    let response = await MessageService.getMessages();
    req.io.sockets.emit("messageLogs", response);
    res.render("chat", { title: "Chat", style: "styles.css" });
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
