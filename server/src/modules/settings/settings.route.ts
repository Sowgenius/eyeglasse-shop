import { Router } from 'express';
import { verifyToken } from '@/middlewares/auth';
import { catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { prisma } from '@/lib/prisma';

const router = Router();

router.get(
  '/',
  verifyToken(),
  catchAsync(async (req, res) => {
    const settings = await prisma.settings.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    
    return sendResponse(res, {
      message: 'Settings retrieved successfully',
      data: settingsObj,
    });
  })
);

router.patch(
  '/',
  verifyToken(),
  catchAsync(async (req, res) => {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return sendResponse(res, {
        status: 400,
        message: 'Key and value are required',
      });
    }

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return sendResponse(res, {
      message: 'Setting updated successfully',
      data: { key: setting.key, value: setting.value },
    });
  })
);

router.patch(
  '/bulk',
  verifyToken(),
  catchAsync(async (req, res) => {
    const settings = req.body as Record<string, string>;
    
    if (!settings || typeof settings !== 'object') {
      return sendResponse(res, {
        status: 400,
        message: 'Settings object is required',
      });
    }

    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.settings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    const allSettings = await prisma.settings.findMany();
    const settingsObj: Record<string, string> = {};
    allSettings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    return sendResponse(res, {
      message: 'Settings updated successfully',
      data: settingsObj,
    });
  })
);

export const SettingsRoutes = router;
