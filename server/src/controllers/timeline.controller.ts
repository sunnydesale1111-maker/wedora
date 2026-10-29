import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { TaskStatus } from '@prisma/client';

export class TimelineController {
  public static async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventId, taskName, deadline, assignedUserId, relatedBookingId, status } = req.body;

      if (!eventId || !taskName) {
        res.status(400).json({ success: false, error: 'eventId and taskName are required' });
        return;
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      if (event.ownerUserId !== req.user.id) {
        res.status(403).json({ success: false, error: 'Unauthorized: You do not own this event' });
        return;
      }

      const task = await prisma.timelineTask.create({
        data: {
          eventId,
          taskName,
          deadline: deadline ? new Date(deadline) : null,
          assignedUserId: assignedUserId || null,
          relatedBookingId: relatedBookingId || null,
          status: (status as TaskStatus) || TaskStatus.PENDING,
        },
        include: {
          assignedUser: { select: { id: true, name: true, email: true } },
          relatedBooking: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
            },
          },
        },
      });

      res.status(201).json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getTasksByEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params; // event id

      const tasks = await prisma.timelineTask.findMany({
        where: { eventId: id },
        include: {
          assignedUser: { select: { id: true, name: true, email: true } },
          relatedBooking: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
            },
          },
        },
        orderBy: { deadline: 'asc' },
      });

      res.json({ success: true, data: tasks });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { taskName, deadline, assignedUserId, relatedBookingId, status } = req.body;

      const task = await prisma.timelineTask.findUnique({
        where: { id },
        include: { event: true },
      });

      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      if (task.event.ownerUserId !== req.user?.id && task.assignedUserId !== req.user?.id) {
        res.status(403).json({ success: false, error: 'Unauthorized to modify this task' });
        return;
      }

      const updated = await prisma.timelineTask.update({
        where: { id },
        data: {
          taskName: taskName ?? task.taskName,
          deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : task.deadline,
          assignedUserId: assignedUserId !== undefined ? assignedUserId : task.assignedUserId,
          relatedBookingId: relatedBookingId !== undefined ? relatedBookingId : task.relatedBookingId,
          status: status ? (status as TaskStatus) : task.status,
        },
        include: {
          assignedUser: { select: { id: true, name: true, email: true } },
          relatedBooking: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
            },
          },
        },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const task = await prisma.timelineTask.findUnique({
        where: { id },
        include: { event: true },
      });

      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }

      if (task.event.ownerUserId !== req.user?.id) {
        res.status(403).json({ success: false, error: 'Unauthorized to delete this task' });
        return;
      }

      await prisma.timelineTask.delete({ where: { id } });

      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
