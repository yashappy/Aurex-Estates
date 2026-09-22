import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';

export const leadsRouter = Router();

// POST /api/leads - Public: Capture new lead
leadsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, type, projectId, projectName, brochureName, notes } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and email are required.',
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        type: type || 'Consultation',
        projectId: projectId || null,
        projectName: projectName || null,
        brochureName: brochureName || null,
        notes: notes || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your details have been securely recorded. Our senior advisory desk will connect shortly.',
      leadId: lead.id,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record lead',
      error: error?.message,
    });
  }
});

// GET /api/leads - Protected: List leads
leadsRouter.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error?.message,
    });
  }
});

// GET /api/leads/export/csv - Protected: Export leads to CSV
leadsRouter.get('/export/csv', requireAdmin, async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Type', 'Project Name', 'Brochure Name', 'Created At'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.type}"`,
      `"${l.projectName || 'General'}"`,
      `"${l.brochureName || 'N/A'}"`,
      `"${l.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=aurex-leads-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to export leads',
      error: error?.message,
    });
  }
});

// DELETE /api/leads/:id - Protected: Delete lead
leadsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.lead.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error?.message,
    });
  }
});
