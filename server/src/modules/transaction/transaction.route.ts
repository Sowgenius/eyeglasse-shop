import { verifyToken } from '@/middlewares/auth';
import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Router } from 'express';
import { prisma } from '@/lib/prisma';

const router = Router();

router.get(
  '/',
  verifyToken(),
  catchAsync(async (req, res) => {
    const userId = req.jwtPayload.userId;
    
    const transactions = await prisma.product.findMany({
      where: {
        userId,
      },
      select: {
        _count: {
          select: {
            stockMovements: true,
          },
        },
      },
    });

    return sendResponse(res, {
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  })
);

export const TransactionRoutes = router;
