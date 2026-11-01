import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai.service.js';
import { N8NService } from '../services/n8n.service.js';
import { ENV } from '../config/env.js';

export class AIController {
  public static async getStatus(req: Request, res: Response): Promise<void> {
    const isGeminiConfigured = Boolean(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== '');
    const isN8nConfigured = Boolean(
      (ENV.N8N_MCP_TOKEN && ENV.N8N_MCP_TOKEN.trim() !== '') ||
      (ENV.N8N_CUSTOMER_WEBHOOK_URL && ENV.N8N_CUSTOMER_WEBHOOK_URL.trim() !== '') ||
      (ENV.N8N_VENDOR_WEBHOOK_URL && ENV.N8N_VENDOR_WEBHOOK_URL.trim() !== '')
    );

    res.json({
      success: true,
      isConfigured: isN8nConfigured || isGeminiConfigured,
      provider: isN8nConfigured ? 'n8n AI Workflow Engine' : 'Google Gemini (gemini-1.5-flash)',
      mode: isN8nConfigured ? 'N8N_INTEGRATED' : (isGeminiConfigured ? 'LIVE_LLM' : 'DEMO_FALLBACK'),
      n8nStatus: {
        isConfigured: isN8nConfigured,
        mcpEndpoint: ENV.N8N_MCP_URL,
        hasToken: Boolean(ENV.N8N_MCP_TOKEN),
        customerWebhookConfigured: Boolean(ENV.N8N_CUSTOMER_WEBHOOK_URL),
        vendorWebhookConfigured: Boolean(ENV.N8N_VENDOR_WEBHOOK_URL),
        organizerWebhookConfigured: Boolean(ENV.N8N_ORGANIZER_WEBHOOK_URL),
      },
      message: isN8nConfigured
        ? 'n8n AI Workflow Integration active'
        : (isGeminiConfigured ? 'Live LLM integration active' : 'Deterministic Demo Fallback active.'),
    });
  }

  public static async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { message, conversationId, eventId, role, eventContext, vendorContext } = req.body;

      if (!message || message.trim() === '') {
        res.status(400).json({ success: false, error: 'Message cannot be empty' });
        return;
      }

      // If role or context is provided, route through N8NService with role awareness
      const resolvedRole: 'CUSTOMER' | 'VENDOR' | 'PLANNER' = 
        role === 'VENDOR' || req.user.role === 'VENDOR' ? 'VENDOR' :
        role === 'PLANNER' || req.user.role === 'PLANNER' ? 'PLANNER' : 'CUSTOMER';

      const response = await N8NService.processMessage({
        userId: req.user.id,
        role: resolvedRole,
        message,
        conversationId,
        eventContext: eventContext || (eventId ? { eventId } : undefined),
        vendorContext,
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
