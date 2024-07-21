import prisma from "../../prisma/client";
import transaction from "../controllers/transaction";

class RequisitionService {
  async createRequisition(data: any) {
    return prisma.requisition.create({
      data,
    });
  }

  async updateRequisition(requisitionId: string, newData: any) {
    return prisma.requisition.update({
      where: { id: requisitionId },
      data: {
        ...newData,
      },
    });
  }

  async findRequisitionById(requisitionId: string) {
    return prisma.requisition.findUnique({
      where: { id: requisitionId },
      include: { transactions: true },
    });
  }

  async getAllRequisitions() {
    return prisma.requisition.findMany();
  }

  async getUserRequisitions(userId: string) {
    return prisma.requisition.findMany({
      where: { userId },
    });
  }

  async deleteRequisition(requisitionId: string) {
    return prisma.$transaction([
      prisma.requisition.delete({
        where: { id: requisitionId },
      }),
    ]);
  }
}

export default new RequisitionService();
