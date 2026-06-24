/**
 * MDCU Freshy Camp 2026 - Secure Kinship Database Web App API
 * 
 * Instructions to set up:
 * 1. Open your Google Sheet containing the freshman database.
 * 2. In the menu bar, go to Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs and paste this entire code block.
 * 4. Replace the sheetId value below with your Google Sheet ID (from the URL).
 * 5. Click Save (disk icon).
 * 6. Click Deploy -> New deployment.
 * 7. Choose type: Web App.
 * 8. Set Description: "MDCU Kinship API"
 * 9. Set Execute as: "Me" (your email) - This allows the script to read the sheet.
 * 10. Set Who has access: "Anyone" - This allows the React app to send GET requests (requests are secured by Google ID token validation below, preventing unauthorized access).
 * 11. Click Deploy and copy the Web App URL (starts with https://script.google.com/macros/s/...).
 * 12. Paste this URL into your React project's .env file as VITE_APPS_SCRIPT_URL.
 */

// REPLACE THIS WITH YOUR GOOGLE SHEET ID (can find it in your sheet's browser URL)
const GOOGLE_SHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

function doGet(e) {
  // Setup CORS support by creating a JSON response helper
  function jsonResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  // 1. Get the ID token from query parameters
  var idToken = e.parameter.id_token;
  if (!idToken) {
    return jsonResponse({ success: false, error: "Missing ID token" });
  }

  try {
    // 2. Contact Google API to verify the integrity and claims of the ID token
    var verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
    var response = UrlFetchApp.fetch(verifyUrl, { muteHttpExceptions: true });
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    var tokenInfo = JSON.parse(responseText);

    if (responseCode !== 200 || !tokenInfo.email || tokenInfo.email_verified !== "true") {
      return jsonResponse({ success: false, error: "Invalid or expired Google account token" });
    }

    var email = tokenInfo.email.toLowerCase().trim();

    // 3. Validate domain constraint
    if (!email.endsWith("@docchula.com")) {
      return jsonResponse({ success: false, error: "Access is restricted to @docchula.com Google accounts only" });
    }

    // 4. Load database from Google Sheet
    var spreadsheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
    var sheet = spreadsheet.getActiveSheet();
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    if (values.length <= 1) {
      return jsonResponse({ success: true, email: email, data: [] });
    }

    var headers = values[0];
    
    // Find column index for P_Docchula
    var pDocchulaIndex = -1;
    for (var col = 0; col < headers.length; col++) {
      if (String(headers[col]).trim() === "P_Docchula") {
        pDocchulaIndex = col;
        break;
      }
    }

    if (pDocchulaIndex === -1) {
      return jsonResponse({ success: false, error: "P_Docchula database column not found in Google Sheet" });
    }

    // 5. Query matching rows
    var matches = [];
    for (var row = 1; row < values.length; row++) {
      var rowEmail = String(values[row][pDocchulaIndex]).toLowerCase().trim();
      if (rowEmail === email) {
        var record = {};
        for (var col = 0; col < headers.length; col++) {
          var headerName = String(headers[col]).trim();
          record[headerName] = values[row][col];
        }
        matches.push(record);
      }
    }

    // 6. Return secure matching data
    return jsonResponse({
      success: true,
      email: email,
      data: matches
    });

  } catch (err) {
    return jsonResponse({ success: false, error: "Internal Server Error: " + err.toString() });
  }
}
