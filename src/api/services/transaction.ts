import prisma from "../../prisma/client";
import requisition from "./requisition";

class TransactionService {
  async getTransactions() {
    return prisma.transaction.findMany();
  }

  async getTransactionById(transactionId: string) {
    return prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
  }

  async createTransaction(data: any) {
    return prisma.transaction.create({
      data,
    });
  }

  async updateTransaction(transactionId: string, newData: any) {
    return prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        ...newData,
      },
    });
  }

  async deleteTransaction(transactionId: string) {
    return prisma.$transaction([
      prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      }),
    ]);
  }

  async getTransactionsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: {
        userId,
      },
    });
  }

  async getAllTransactions(companyId: string) {
    return prisma.transaction.findMany({
      where: {
        companyId,
      },
      include: {
        user: true,
        requisition: true,
        pettyCashFund: true,
      },
    });
  }

  async getTransactionsByMonth(userId: string, companyId: string) {
    return prisma.transaction.findMany({
      where: {
        userId,
        companyId,
      },
    });
  }
}

export default new TransactionService();
