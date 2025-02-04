import { Router } from "express";
import { transactionController } from "../controllers";
import { authenticate } from "../middleware";

const router = Router();

router.post(
  "/create-transaction",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  transactionController.create
);

router.put(
  "/update-transaction/:transactionId",
  authenticate.authenticateToken,
  transactionController.update
);

router.delete(
  "/delete-transaction/:transactionId",
  authenticate.authenticateToken,
  transactionController.delete
);

router.get(
  "/user-transactions",
  authenticate.authenticateToken,
  authenticate.checkCompanyId,
  transactionController.getUserTransactions
);

router.get(
  "/all",
  authenticate.checkCompanyId,
  transactionController.getAllTransactions
);

router.get(
  "/get-transaction/:transactionId",
  authenticate.authenticateToken,
  transactionController.getTransactionById
);

export default router;
