import { FORMS_CONFIG } from '../config/forms';
import { cmsStore } from './cmsStore';

export interface GlobalLeadPayload {
  name: string;
  phone: string;
  email: string;
  projectName?: string;
  brochureName?: string;
  type?: 'brochure-download' | 'consultation' | 'site-visit' | 'general' | 'chatbot' | 'career';
  message?: string;
  source?: string;
}

/**
 * Universal lead submission service:
 * 1. Posts to Google Apps Script Webhook (attached Google Sheet / Excel + Email alert to aurex.estates01@gmail.com)
 * 2. Saves to CMS Store for instant dashboard viewing and CSV/Excel download
 * 3. Sends to backend /api/leads endpoint
 */
export async function submitLeadGlobally(payload: GlobalLeadPayload): Promise<boolean> {
  const cleanName = (payload.name || '').trim();
  const cleanPhone = (payload.phone || '').trim();
  const cleanEmail = (payload.email || '').trim();
  const cleanProject = (payload.projectName || 'General Inquiry').trim();
  const cleanBrochure = (payload.brochureName || '').trim();
  const leadType = payload.type || 'general';

  // 1. Submit to Google Apps Script Webhook (Single Google Sheet for Entire Website)
  try {
    const istTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://aurexestates.co.in';

    const postData: Record<string, string> = {
      // Primary keys expected by google-apps-script.js
      timestamp: istTimestamp,
      fullName: cleanName,
      name: cleanName,
      phoneNumber: cleanPhone,
      phone: cleanPhone,
      mobile: cleanPhone,
      emailAddress: cleanEmail,
      email: cleanEmail,
      category: cleanProject,
      projectName: cleanProject,
      project: cleanProject,
      brochureName: cleanBrochure,
      brochure: cleanBrochure,
      leadType: leadType,
      type: leadType,
      message: payload.message || `Lead submitted from ${payload.source || 'Website'}`,
      notes: payload.message || `Lead submitted from ${payload.source || 'Website'}`,
      pageUrl: currentUrl,
      source: payload.source || 'Aurex Estates Website',
      status: 'New',
    };

    const webhookUrl =
      (typeof cmsStore !== 'undefined' && cmsStore.getPageContent?.()?.contact?.googleSheetsWebhook) ||
      FORMS_CONFIG.googleScriptUrl;

    if (webhookUrl) {
      // Build URL with query parameters so both e.parameter and e.postData.contents in Apps Script receive all fields
      let targetUrl = webhookUrl;
      try {
        const urlObj = new URL(webhookUrl);
        Object.entries(postData).forEach(([k, v]) => {
          if (v) urlObj.searchParams.set(k, v);
        });
        targetUrl = urlObj.toString();
      } catch {
        targetUrl = webhookUrl;
      }

      await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(postData),
        mode: 'no-cors',
      });
    }
  } catch (err) {
    console.warn('Google Sheets lead webhook dispatch warning:', err);
  }

  // 2. Record lead in local CMS Store for instant live viewing in Admin CMS & CSV export
  try {
    cmsStore.addLead({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      projectName: cleanProject,
      brochureName: cleanBrochure || undefined,
      type: leadType === 'chatbot' ? 'consultation' : (leadType as any),
    });
  } catch (err) {
    console.warn('CMS Store local lead recording warning:', err);
  }

  // 3. Post to backend Express API if running
  try {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        type: leadType,
        projectName: cleanProject,
        notes: payload.message || `Lead submitted via ${payload.source || 'Website'}`,
      }),
    }).catch(() => {
      // Backend may be offline in static mode; fail silently
    });
  } catch {
    // Ignore backend fetch errors
  }

  return true;
}
