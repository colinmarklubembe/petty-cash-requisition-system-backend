import { Request, Response } from "express";
import { responses } from "../../utils";
import userService from "../auth/services/userService";
import { RequisitionStatus } from "../models/enums/RequisitionStatus";
import { requisitionService } from "../services";
import { mapStringToEnum } from "../../utils";
import { ObjectId } from "mongodb";

interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

class RequisitionController {
  async createRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { title, description, amount } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const data = {
        title,
        description,
        amount,
        status: RequisitionStatus.PENDING,
        user: user,
        createdAt: new Date(),
        updaredAt: new Date(),
      };

      const requisition = await requisitionService.createRequisition(data);

      return responses.successResponse(
        res,
        201,
        "Requisition created successfully",
        { requisition: requisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async updateRequisition(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { requisitionId } = req.params;
      const { title, description, amount, status } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );
      console.log(requisition);
      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }
      console.log(email);
      console.log(requisition.user);

      if (requisition.user?.email !== email) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to update this requisition"
        );
      }

      let mappedStatus: any;
      mappedStatus = mapStringToEnum.mapStringToRequisitionStatus(status);

      const newData = {
        title,
        description,
        amount,
        status: mappedStatus,
        updatedAt: new Date(),
      };

      const updatedRequisition = await requisitionService.updateRequisition(
        requisitionId,
        newData
      );

      return responses.successResponse(
        res,
        200,
        "Requisition updated successfully",
        { requisition: updatedRequisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }

  async getRequisitionById(req: AuthenticatedRequest, res: Response) {
    try {
      const { email } = req.user!;
      const { requisitionId } = req.params;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responses.errorResponse(res, 404, "User not found");
      }

      const requisition = await requisitionService.findRequisitionById(
        requisitionId
      );

      if (!requisition) {
        return responses.errorResponse(res, 404, "Requisition not found");
      }

      if (requisition.user?.email !== email) {
        return responses.errorResponse(
          res,
          403,
          "You are not allowed to view this requisition"
        );
      }

      return responses.successResponse(
        res,
        200,
        "Requisition retrieved successfully",
        { requisition: requisition }
      );
    } catch (error: any) {
      return responses.errorResponse(res, 500, error.message);
    }
  }
}

export default new RequisitionController();
