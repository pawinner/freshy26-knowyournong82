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

// PRE-CONFIGURED WITH YOUR GOOGLE SHEET ID
const GOOGLE_SHEET_ID = "1Je7F67cS8A5HyoqWrVcPZEbEtATdpAgNm5o6VoA17s4";

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
    var sheet = spreadsheet.getSheetByName("WEB");
    if (!sheet) {
      return jsonResponse({ success: false, error: "Tab 'WEB' not found in Google Sheet" });
    }
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    if (values.length <= 1) {
      return jsonResponse({ success: true, email: email, data: [] });
    }

    var headers = values[0];
    
    // Find column indices
    var pDocchulaIndex = -1;
    var firstVisitCol = -1;
    var latestVisitCol = -1;
    
    for (var col = 0; col < headers.length; col++) {
      var headerName = String(headers[col]).trim();
      if (headerName === "P_Docchula") {
        pDocchulaIndex = col;
      } else if (headerName === "first_visit") {
        firstVisitCol = col;
      } else if (headerName === "latest_visit") {
        latestVisitCol = col;
      }
    }

    if (pDocchulaIndex === -1) {
      return jsonResponse({ success: false, error: "P_Docchula database column not found in Google Sheet" });
    }

    var formattedDate = Utilities.formatDate(new Date(), spreadsheet.getSpreadsheetTimeZone(), "dd/MM/yy HH:mm:ss");

    // 5. Query matching rows and update login timestamps
    var matches = [];
    for (var row = 1; row < values.length; row++) {
      var rowEmail = String(values[row][pDocchulaIndex]).toLowerCase().trim();
      if (rowEmail === email) {
        // Update first_visit or latest_visit dynamically
        if (firstVisitCol !== -1) {
          var currentFirstVisit = String(values[row][firstVisitCol]).trim();
          if (!currentFirstVisit) {
            // First time login: print on first_visit only
            sheet.getRange(row + 1, firstVisitCol + 1).setValue(formattedDate);
            values[row][firstVisitCol] = formattedDate;
          } else if (latestVisitCol !== -1) {
            // Upcoming times: overwrite latest_visit
            sheet.getRange(row + 1, latestVisitCol + 1).setValue(formattedDate);
            values[row][latestVisitCol] = formattedDate;
          }
        }

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
