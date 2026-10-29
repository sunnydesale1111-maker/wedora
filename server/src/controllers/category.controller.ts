import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export class CategoryController {
  public static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.serviceCategory.findMany({
        include: {
          _count: {
            select: { services: true },
          },
        },
        orderBy: { categoryName: 'asc' },
      });

      res.json({ success: true, data: categories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
