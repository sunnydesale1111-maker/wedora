import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai.service.js';
import { ENV } from '../config/env.js';

export class AIController {
  public static async getStatus(req: Request, res: Response): Promise<void> {
    const isConfigured = Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== '');
    res.json({
      success: true,
      isConfigured,
      provider: 'Google Gemini (gemini-1.5-flash)',
      mode: isConfigured ? 'LIVE_LLM' : 'DEMO_FALLBACK',
      message: isConfigured
        ? 'Live LLM integration active'
        : 'GEMINI_API_KEY not configured. Deterministic Demo Fallback active.',
    });
  }

  public static async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { message, conversationId, eventId } = req.body;

      if (!message || message.trim() === '') {
        res.status(400).json({ success: false, error: 'Message cannot be empty' });
        return;
      }

      const response = await AIService.processMessage({
        userId: req.user.id,
        conversationId,
        eventId,
        message,
      });

      res.json({ success: true, ...response });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getConversation(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const conversation = await prisma.aIConversation.findUnique({
        where: { id },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });

      if (!conversation) {
        res.status(404).json({ success: false, error: 'Conversation not found' });
        return;
      }

      if (conversation.userId !== req.user.id) {
        res.status(403).json({ success: false, error: 'Unauthorized to access this conversation' });
        return;
      }

      res.json({ success: true, data: conversation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async listConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const conversations = await prisma.aIConversation.findMany({
        where: { userId: req.user.id },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      res.json({ success: true, data: conversations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
