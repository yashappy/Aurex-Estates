import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/auth';

export const projectsRouter = Router();

// GET /api/projects - Public: list all projects
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'all') {
      where.category = category.toLowerCase();
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const parsed = projects.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      amenities: JSON.parse(p.amenities || '[]'),
      highlights: JSON.parse(p.highlights || '[]'),
    }));

    return res.json({
      success: true,
      count: parsed.length,
      data: parsed,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error?.message,
    });
  }
});

// GET /api/projects/:id - Public: get single project
projectsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      data: {
        ...project,
        images: JSON.parse(project.images || '[]'),
        amenities: JSON.parse(project.amenities || '[]'),
        highlights: JSON.parse(project.highlights || '[]'),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error?.message,
    });
  }
});

// POST /api/projects - Protected: Create new project
projectsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.name || !body.category) {
      return res.status(400).json({
        success: false,
        message: 'Project name and category are required.',
      });
    }

    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const project = await prisma.project.create({
      data: {
        id,
        name: body.name,
        developer: body.developer || '',
        tagline: body.tagline || '',
        category: body.category.toLowerCase(),
        status: body.status || 'New Launch',
        location: body.location || '',
        city: body.city || 'Gurugram',
        priceRange: body.priceRange || 'On Request',
        priceNumeric: Number(body.priceNumeric) || 0,
        typology: body.typology || '',
        size: body.size || '',
        projectArea: body.projectArea || null,
        possessionYear: body.possessionYear || '2026',
        launchYear: body.launchYear || null,
        description: body.description || '',
        thumbnail: body.thumbnail || '',
        images: JSON.stringify(body.images || []),
        amenities: JSON.stringify(body.amenities || []),
        highlights: JSON.stringify(body.highlights || []),
        brochureUrl: body.brochureUrl || null,
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error?.message,
    });
  }
});

// PUT /api/projects/:id - Protected: Update project
projectsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const data: any = { ...body };
    if (data.images && typeof data.images !== 'string') {
      data.images = JSON.stringify(data.images);
    }
    if (data.amenities && typeof data.amenities !== 'string') {
      data.amenities = JSON.stringify(data.amenities);
    }
    if (data.highlights && typeof data.highlights !== 'string') {
      data.highlights = JSON.stringify(data.highlights);
    }
    if (data.category) {
      data.category = data.category.toLowerCase();
    }
    delete data.id;

    const updated = await prisma.project.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error?.message,
    });
  }
});

// DELETE /api/projects/:id - Protected: Delete project
projectsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error?.message,
    });
  }
});
