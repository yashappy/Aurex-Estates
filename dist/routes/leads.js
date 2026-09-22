"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
exports.leadsRouter = (0, express_1.Router)();
// POST /api/leads - Public: Capture new lead
exports.leadsRouter.post('/', async (req, res) => {
    try {
        const { name, phone, email, type, projectId, projectName, brochureName, notes } = req.body;
        if (!name || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name, phone, and email are required.',
            });
        }
        const lead = await db_1.prisma.lead.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to record lead',
            error: error?.message,
        });
    }
});
// GET /api/leads - Protected: List leads
exports.leadsRouter.get('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const leads = await db_1.prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json({
            success: true,
            count: leads.length,
            data: leads,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch leads',
            error: error?.message,
        });
    }
});
// GET /api/leads/export/csv - Protected: Export leads to CSV
exports.leadsRouter.get('/export/csv', auth_1.requireAdmin, async (req, res) => {
    try {
        const leads = await db_1.prisma.lead.findMany({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to export leads',
            error: error?.message,
        });
    }
});
// DELETE /api/leads/:id - Protected: Delete lead
exports.leadsRouter.delete('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.prisma.lead.delete({
            where: { id },
        });
        return res.json({
            success: true,
            message: 'Lead deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete lead',
            error: error?.message,
        });
    }
});
