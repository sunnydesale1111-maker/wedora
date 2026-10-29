import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { generateToken, AuthRequest } from '../middleware/auth.js';
import { Role } from '@prisma/client';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, role, vendorDetails } = req.body;

      if (!name || !email || !phone || !password || !role) {
        res.status(400).json({ success: false, error: 'Name, email, phone, password, and role are required' });
        return;
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(400).json({ success: false, error: 'User with this email already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email,
            phone,
            passwordHash,
            role: role as Role,
          },
        });

        if (role === Role.VENDOR && vendorDetails) {
          const newVendor = await tx.vendor.create({
            data: {
              userId: newUser.id,
              businessName: vendorDetails.businessName || name,
              businessDescription: vendorDetails.businessDescription || '',
              primaryCity: vendorDetails.primaryCity || 'Pune',
              contactPerson: vendorDetails.contactPerson || name,
              businessAddress: vendorDetails.businessAddress || null,
            },
          });

          // Add initial service areas if provided
          if (vendorDetails.serviceAreas && Array.isArray(vendorDetails.serviceAreas)) {
            for (const area of vendorDetails.serviceAreas) {
              await tx.vendorServiceArea.create({
                data: {
                  vendorId: newVendor.id,
                  city: area.city || vendorDetails.primaryCity || 'Pune',
                  area: area.area || area,
                },
              });
            }
          }

          // Add initial services if provided
          if (vendorDetails.services && Array.isArray(vendorDetails.services)) {
            for (const s of vendorDetails.services) {
              await tx.vendorService.create({
                data: {
                  vendorId: newVendor.id,
                  categoryId: s.categoryId,
                  serviceDescription: s.serviceDescription || '',
                  maximumGuestCapacity: s.maximumGuestCapacity || null,
                  maximumSimultaneousBookings: s.maximumSimultaneousBookings || 1,
                  startingPrice: s.startingPrice || null,
                },
              });
            }
          }
        }

        return newUser;
      });

      const token = generateToken({ id: user.id, role: user.role });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          token,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Registration failed' });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: { vendor: true },
      });

      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
        return;
      }

      const token = generateToken({ id: user.id, role: user.role });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            vendorId: user.vendor?.id,
            vendor: user.vendor,
          },
          token,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Login failed' });
    }
  }

  public static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          vendor: {
            include: {
              services: { include: { category: true } },
              serviceAreas: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const { passwordHash, ...safeUser } = user;
      res.json({ success: true, data: { user: safeUser } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Logged out successfully' });
  }
}
