/**
 * =========================================================================
 * AUREX ESTATES - GOOGLE SHEET & INSTANT EMAIL LEAD AUTOMATION
 * =========================================================================
 * Target Recipient: aurex.estates01@gmail.com
 * 
 * Features:
 * 1. Automatically initializes and styles Google Sheet headers on first run.
 * 2. Records: Timestamp (IST), Full Name, Phone Number, Email, Interest/Category,
 *    Message, Page URL, Source, Status.
 * 3. Immediately sends a luxury-styled HTML email notification to aurex.estates01@gmail.com
 *    with 1-tap "Call Client", "WhatsApp Client", and "Email Client" quick action links.
 * 4. Supports cross-origin POST submissions from the website seamlessly.
 */

// Configuration
var CONFIG = {
  NOTIFICATION_EMAIL: "aurex.estates01@gmail.com",
  SHEET_NAME: "Leads", // Name of the sheet tab
  COMPANY_NAME: "Aurex Estates",
  WEBSITE_URL: "https://aurexestates.co.in",
  BRAND_COLOR: "#6B39F4", // Aurex signature luxury purple
  BRAND_DARK: "#5222DE"
};

/**
 * Handles incoming POST requests from the Aurex Estates website forms
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for other processes to finish
  lock.tryLock(30000);

  try {
    var sheet = getOrCreateLeadsSheet();
    var payload = extractData(e);

    // 1. Append row to Google Sheet
    sheet.appendRow([
      payload.timestamp,
      payload.fullName,
      payload.phoneNumber,
      payload.emailAddress,
      payload.category,
      payload.message,
      payload.pageUrl,
      payload.source,
      "New" // Lead Status
    ]);

    // Format new row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 9).setVerticalAlignment("middle");
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 9).setHorizontalAlignment("center")
      .setFontWeight("bold")
      .setBackground("#F3EEFF")
      .setFontColor(CONFIG.BRAND_DARK);

    // 2. Send instant email notification to aurex.estates01@gmail.com
    sendLeadNotificationEmail(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Lead captured successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Test endpoint to verify that the Web App is live
 */
function doGet(e) {
  return ContentService
    .createTextOutput("✅ Aurex Estates Lead Automation Webhook is ACTIVE and operational.")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Retrieves the Leads sheet or creates it with formatted headers
 */
function getOrCreateLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Check if header row is present
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp (IST)",
      "Full Name",
      "Phone Number",
      "Email Address",
      "Interest / Category",
      "Client Message",
      "Page URL",
      "Source",
      "Status"
    ];

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight("bold");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setBackground(CONFIG.BRAND_COLOR);
    headerRange.setVerticalAlignment("middle");
    headerRange.setHorizontalAlignment("center");
    sheet.setRowHeight(1, 40);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Set practical column widths
    sheet.setColumnWidth(1, 170); // Timestamp
    sheet.setColumnWidth(2, 180); // Full Name
    sheet.setColumnWidth(3, 160); // Phone Number
    sheet.setColumnWidth(4, 220); // Email Address
    sheet.setColumnWidth(5, 200); // Category
    sheet.setColumnWidth(6, 320); // Message
    sheet.setColumnWidth(7, 220); // Page URL
    sheet.setColumnWidth(8, 160); // Source
    sheet.setColumnWidth(9, 100); // Status
  }

  return sheet;
}

/**
 * Extracts parameters safely from form-data or JSON payload
 */
function extractData(e) {
  var data = {};

  if (e && e.parameter) {
    data = e.parameter;
  }

  // Fallback to JSON payload if available
  if (e && e.postData && e.postData.contents) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      data = Object.assign({}, data, parsed);
    } catch (err) {}
  }

  // Clean phone number for WhatsApp link
  var rawPhone = data.phoneNumber || "";
  var cleanPhone = rawPhone.replace(/[^\d]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  // Default IST timestamp
  var istTimestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a");

  return {
    fullName: data.fullName || "Valued Client",
    phoneNumber: rawPhone || "Not Provided",
    cleanPhone: cleanPhone,
    emailAddress: data.emailAddress || "Not Provided",
    category: data.category || "General Consultation",
    message: data.message || "No specific note provided.",
    pageUrl: data.pageUrl || CONFIG.WEBSITE_URL,
    source: data.source || "Website Form",
    timestamp: data.timestamp || istTimestamp
  };
}

/**
 * Dispatches a high-priority, branded HTML email notification to aurex.estates01@gmail.com
 */
function sendLeadNotificationEmail(lead) {
  var subject = "Website Form Filled";

  var waUrl = lead.cleanPhone ? "https://wa.me/" + lead.cleanPhone : "";
  var telUrl = lead.phoneNumber ? "tel:" + lead.phoneNumber.replace(/\s+/g, "") : "";
  var mailUrl = lead.emailAddress ? "mailto:" + lead.emailAddress : "";

  var htmlBody = `
    <div style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F9FD; color: #1e293b;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #6B39F4 0%, #4615B2 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
          <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #E9D5FF; font-weight: 600;">
            Aurex Estates Lead Alert
          </p>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
            Website Form Filled
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #f1f5f9; opacity: 0.9;">
            Received at ${lead.timestamp} (IST)
          </p>
        </div>

        <!-- Quick Action CTAs -->
        <div style="padding: 16px 28px; background-color: #faf5ff; border-bottom: 1px solid #f3e8ff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              ${telUrl ? `<td style="padding: 4px;"><a href="${telUrl}" style="display: block; text-align: center; padding: 10px 14px; background-color: #6B39F4; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px;">📞 Call Client</a></td>` : ''}
              ${waUrl ? `<td style="padding: 4px;"><a href="${waUrl}" style="display: block; text-align: center; padding: 10px 14px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px;">💬 WhatsApp</a></td>` : ''}
              ${mailUrl ? `<td style="padding: 4px;"><a href="${mailUrl}" style="display: block; text-align: center; padding: 10px 14px; background-color: #1e293b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px;">✉️ Reply</a></td>` : ''}
            </tr>
          </table>
        </div>

        <!-- Lead Details Table -->
        <div style="padding: 28px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500; width: 140px;">Full Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a; font-size: 15px;">${lead.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">Phone Number:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #6B39F4;">
                <a href="${telUrl}" style="color: #6B39F4; text-decoration: none;">${lead.phoneNumber}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">Email Address:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">
                <a href="${mailUrl}" style="color: #0f172a; text-decoration: none;">${lead.emailAddress}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">Category / Interest:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="display: inline-block; padding: 4px 10px; background-color: #f3eeff; color: #6B39F4; border-radius: 6px; font-weight: 600; font-size: 12px;">
                  ${lead.category}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: 500;">Page Source:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px;">
                <a href="${lead.pageUrl}" style="color: #64748b; text-decoration: underline;" target="_blank">${lead.pageUrl}</a>
              </td>
            </tr>
          </table>

          <!-- Message Box -->
          <div style="margin-top: 24px; padding: 18px; background-color: #f8fafc; border-left: 4px solid #6B39F4; border-radius: 6px;">
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Client Message / Specific Requirements:</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; font-style: italic;">
              "${lead.message}"
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            Aurex Estates Real Estate Advisory • Automatic Lead Sync to Google Sheets
          </p>
        </div>

      </div>
    </div>
  `;

  // Fallback plain text version
  var plainText = [
    "Website Form Filled",
    "---------------------------------",
    "Time: " + lead.timestamp,
    "Full Name: " + lead.fullName,
    "Phone: " + lead.phoneNumber,
    "Email: " + lead.emailAddress,
    "Category: " + lead.category,
    "Message: " + lead.message,
    "Page URL: " + lead.pageUrl,
    "Source: " + lead.source
  ].join("\n");

  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    name: "Aurex Estates Leads"
  });
}

/**
 * Quick Test Function: Run this directly in Apps Script to verify Sheet & Email delivery
 */
function testLeadSubmission() {
  var dummyEvent = {
    parameter: {
      fullName: "Rajesh Kapoor (Test)",
      phoneNumber: "+91 98111 22334",
      emailAddress: "test.lead@aurexestates.com",
      category: "Golf Course Extension Road",
      message: "Looking for a 4 BHK luxury duplex on Golf Course Extension Road. Budget approx 8-10 Cr.",
      source: "Manual Apps Script Test",
      pageUrl: "https://aurexestates.co.in/contact",
      timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy, hh:mm:ss a")
    }
  };

  var response = doPost(dummyEvent);
  Logger.log("Test Result: " + response.getContent());
}
