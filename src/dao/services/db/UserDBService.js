import userModel from "../../models/user.model.js";
import { createHash, isValidPassword } from "../../../utils/functionsUtil.js";

class UserDBService {
  async createUser(user) {
    try {
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

  async findUserByEmail(param) {
    try {
      return await userModel.findOne({ email: param });
    } catch (error) {
      throw new Error("Error al buscar usuario");
    }
  }
  async findUserById(id) {
    try {
      return await userModel.findById(id);
    } catch (error) {
      throw new Error("Error al buscar usuario");
    }
  }

  async findUserByUsername(username) {
    try {
        return await userModel.findOne({ username: username });
    }catch (error) {
        throw new Error("Error al buscar usuario");
    }
  }
}

export default UserDBService;
