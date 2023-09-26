import userModel from "../../models/user.model.js";
import {
  createHash,
  isValidPassword,
} from "../../../src/utils/functionsUtil.js";

class UserDBService {
  async createUser(user) {
    try {
      user.password = createHash(user.password);
      return await userModel.create(user);
    } catch (error) {
      throw new Error(error.message.replace(/"/g, "'"));
    }
  }

  async login(email, password) {
    try {
      const user = await userModel.find({
        email: email,
      });

      if (user.length > 0 && isValidPassword(user[0], password)) {
        return user[0];
      }

      throw new Error("Login failed");
    } catch (error) {
      throw new Error(error.message.replace(/"/g, "'"));
    }
  }
}

export default UserDBService;
