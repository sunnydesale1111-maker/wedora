import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const MAX_FAMILY_PROFILES = 5;

export class ProfileController {
  // --- Customer Family Profiles ---

  public static async getCustomerProfiles(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // If user is a customer, fetch all family profiles belonging to this primary account
      const profiles = await prisma.customerFamilyProfile.findMany({
        where: {
          OR: [
            { primaryUserId: user.userId },
            { email: user.email },
          ],
        },
        include: {
          sharedEvents: {
            include: {
              event: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      res.json({ data: profiles });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch profiles' });
    }
  }

  public static async createFamilyProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { name, email, relationship, avatar, canViewBudget, sharedEventIds } = req.body;

      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required for a family profile' });
        return;
      }

      // Enforce constraint: Maximum of 5 additional family profiles per primary account
      const existingFamilyCount = await prisma.customerFamilyProfile.count({
        where: {
          primaryUserId: user.userId,
          role: 'FAMILY_MEMBER',
        },
      });

      if (existingFamilyCount >= MAX_FAMILY_PROFILES) {
        res.status(400).json({
          error: 'A primary customer account cannot exceed 5 additional family profiles (maximum reached).',
          code: 'PRIMARY_ACCOUNT_FAMILY_LIMIT_EXCEEDED',
        });
        return;
      }

      const defaultPermissions = {
        canViewEvents: true,
        canViewVendors: true,
        canViewTasks: true,
        canViewBudgets: Boolean(canViewBudget),
        canViewBookings: true,
        canMakeBookings: false,
        canManagePayments: false,
        canManageEvents: false,
        canModifyBudgets: false,
        canUpdateTasks: false,
        canManageProfiles: false,
        canInviteMembers: false,
      };

      const newProfile = await prisma.customerFamilyProfile.create({
        data: {
          primaryUserId: user.userId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          relationship: relationship || 'Family Member',
          avatar: avatar || 'avatar-2',
          role: 'FAMILY_MEMBER',
          permissions: defaultPermissions,
          sharedEvents: {
            create: (sharedEventIds || []).map((eventId: string) => ({
              eventId,
              canViewBudget: Boolean(canViewBudget),
            })),
          },
        },
        include: {
          sharedEvents: true,
        },
      });

      res.status(201).json({ data: newProfile });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create family profile' });
    }
  }

  public static async updateFamilyProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { name, relationship, avatar, canViewBudget, sharedEventIds } = req.body;

      const profile = await prisma.customerFamilyProfile.findUnique({
        where: { id },
      });

      if (!profile || profile.primaryUserId !== user.userId) {
        res.status(403).json({ error: 'Forbidden or profile not found' });
        return;
      }

      const currentPerms = (profile.permissions as any) || {};
      const updatedPerms = {
        ...currentPerms,
        ...(canViewBudget !== undefined ? { canViewBudgets: Boolean(canViewBudget) } : {}),
      };

      // Update basic fields
      const updated = await prisma.customerFamilyProfile.update({
        where: { id },
        data: {
          ...(name ? { name: name.trim() } : {}),
          ...(relationship ? { relationship } : {}),
          ...(avatar ? { avatar } : {}),
          permissions: updatedPerms,
        },
      });

      // Update shared events if provided
      if (Array.isArray(sharedEventIds)) {
        await prisma.customerProfileEventAccess.deleteMany({
          where: { profileId: id },
        });
        await prisma.customerProfileEventAccess.createMany({
          data: sharedEventIds.map((eventId: string) => ({
            profileId: id,
            eventId,
            canViewBudget: Boolean(canViewBudget ?? true),
          })),
        });
      }

      res.json({ data: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update profile' });
    }
  }

  public static async deleteFamilyProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const profile = await prisma.customerFamilyProfile.findUnique({
        where: { id },
      });

      if (!profile || profile.primaryUserId !== user.userId) {
        res.status(403).json({ error: 'Forbidden or profile not found' });
        return;
      }

      if (profile.role === 'PRIMARY') {
        res.status(400).json({ error: 'Cannot remove the primary customer profile' });
        return;
      }

      await prisma.customerFamilyProfile.delete({
        where: { id },
      });

      res.json({ message: 'Family profile removed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to remove profile' });
    }
  }

  // --- Professional Organizer Client Profiles ---

  public static async getOrganizerClients(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const clients = await prisma.organizerClientProfile.findMany({
        where: { organizerUserId: user.userId },
        include: {
          events: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ data: clients });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch organizer clients' });
    }
  }

  public static async createOrganizerClient(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { clientName, clientEmail, clientPhone, company, notes } = req.body;

      if (!clientName || !clientEmail) {
        res.status(400).json({ error: 'Client name and email are required' });
        return;
      }

      const newClient = await prisma.organizerClientProfile.create({
        data: {
          organizerUserId: user.userId,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim().toLowerCase(),
          clientPhone: clientPhone || '',
          company: company || null,
          notes: notes || null,
          status: 'ACTIVE',
        },
      });

      res.status(201).json({ data: newClient });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create client profile' });
    }
  }

  public static async updateOrganizerClient(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { clientName, clientEmail, clientPhone, company, status, notes } = req.body;

      const client = await prisma.organizerClientProfile.findUnique({
        where: { id },
      });

      if (!client || client.organizerUserId !== user.userId) {
        res.status(403).json({ error: 'Forbidden or client not found' });
        return;
      }

      const updated = await prisma.organizerClientProfile.update({
        where: { id },
        data: {
          ...(clientName ? { clientName: clientName.trim() } : {}),
          ...(clientEmail ? { clientEmail: clientEmail.trim().toLowerCase() } : {}),
          ...(clientPhone ? { clientPhone } : {}),
          ...(company !== undefined ? { company } : {}),
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      });

      res.json({ data: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update client profile' });
    }
  }

  public static async archiveOrganizerClient(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const client = await prisma.organizerClientProfile.findUnique({
        where: { id },
      });

      if (!client || client.organizerUserId !== user.userId) {
        res.status(403).json({ error: 'Forbidden or client not found' });
        return;
      }

      const updated = await prisma.organizerClientProfile.update({
        where: { id },
        data: {
          status: client.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED',
        },
      });

      res.json({ data: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to archive client profile' });
    }
  }
}
