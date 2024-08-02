import { responses } from "../../../utils";
import { Request, Response } from "express";
import { companyService } from "../../services";
import userService from "../../auth/services/userService";

interface AuthenticatedRequest extends Request {
  company?: { companyId: string };
}

class GetUserController {
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();

      if (!users) {
        return responses.errorResponse(res, 404, "No users found");
      }

      responses.successResponse(res, 200, "Users:", users);
    } catch (error: any) {
      responses.errorResponse(res, 500, error.message);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = id;

      const user = await userService.findUserById(userId);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      responses.successResponse(res, 200, "User:", user);
    } catch (error: any) {
      responses.errorResponse(res, 500, error.message);
    }
  };

  async getCompanyUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId } = req.company!;

      const users = await companyService.getCompanyUsers(companyId);

      return responses.successResponse(
        res,
        200,
        "Company users retrieved successfully",
        users
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new GetUserController();
