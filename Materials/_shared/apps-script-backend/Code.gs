/**
 * UBUS 670 — Quiz & Lab Submission Tracking Backend
 *
 * Deploy as: Web App → Execute as: Me → Access: Anyone
 *
 * Google Sheet "UBUS 670 Submissions" is created automatically on first run.
 * Two tabs: "Quiz Submissions" and "Lab Submissions".
 *
 * SETUP:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Paste this entire file as Code.gs
 * 3. Set HMAC_SECRET below to a random string (keep it secret!)
 * 4. Deploy → New deployment → Web app → Execute as Me, Anyone can access
 * 5. Copy the deployment URL into SUBMISSION_CONFIG.appsScriptUrl in each HTML file
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/** HMAC secret — change this to a random string. Keep it private. */
const HMAC_SECRET = 'CHANGE_ME_TO_A_RANDOM_SECRET_STRING';

/** Max attempts per type */
const MAX_QUIZ_ATTEMPTS = 3;
const MAX_LAB_ATTEMPTS = 1;

/** Optional domain restriction (null = allow all, array = restrict) */
const ALLOWED_DOMAINS = null;
// const ALLOWED_DOMAINS = ['students.niu.edu', 'niu.edu'];

/** Sheet name — created automatically if it doesn't exist */
const SHEET_NAME = 'UBUS 670 Submissions';
const QUIZ_TAB = 'Quiz Submissions';
const LAB_TAB = 'Lab Submissions';

// ═══════════════════════════════════════════════════════════════
// WEB APP ENTRY POINTS
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  var params = e.parameter;
  var action = params.action;

  if (action === 'check') {
    return handleCheck(params);
  }

  // Submit via GET to avoid CORS/redirect issues with POST
  if (action === 'submit') {
    var body;
    try {
      body = JSON.parse(params.payload);
    } catch (err) {
      return jsonResponse({ error: 'Invalid payload JSON' }, 400);
    }
    return handleSubmit(body);
  }

  return jsonResponse({ error: 'Unknown action' }, 400);
}

function doPost(e) {
  // Fallback POST handler (may not work due to CORS/redirect)
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  if (body.action === 'submit') {
    return handleSubmit(body);
  }

  return jsonResponse({ error: 'Unknown action' }, 400);
}

// ═══════════════════════════════════════════════════════════════
// CHECK ATTEMPTS (GET)
// ═══════════════════════════════════════════════════════════════

function handleCheck(params) {
  var email = (params.email || '').toLowerCase().trim();
  var type = params.type; // 'quiz' or 'lab'
  var day = parseInt(params.day, 10);
  var labVariant = params.labVariant || 'lab';

  if (!email || !type || isNaN(day)) {
    return jsonResponse({ error: 'Missing required params: email, type, day' }, 400);
  }

  if (!checkDomain(email)) {
    return jsonResponse({ error: 'Email domain not allowed' }, 403);
  }

  var maxAttempts = type === 'quiz' ? MAX_QUIZ_ATTEMPTS : MAX_LAB_ATTEMPTS;
  var sheet = getOrCreateSheet(type);
  var rows = sheet.getDataRange().getValues();

  // Find matching submissions
  var history = [];
  for (var i = 1; i < rows.length; i++) { // skip header
    var rowEmail = (rows[i][1] || '').toLowerCase().trim();
    var rowDay = parseInt(rows[i][3], 10);

    if (rowEmail === email && rowDay === day) {
      if (type === 'quiz') {
        history.push({
          attempt: rows[i][4],
          score: rows[i][5],
          percentage: rows[i][6],
          timestamp: rows[i][0],
          verification: rows[i][8]
        });
      } else {
        // For labs, also check variant
        var rowVariant = rows[i][4] || 'lab';
        if (rowVariant === labVariant) {
          history.push({
            attempt: 1,
            stepsCompleted: rows[i][5],
            timestamp: rows[i][0],
            verification: rows[i][7]
          });
        }
      }
    }
  }

  var attempts = history.length;

  // Find best score for quizzes
  var bestScore = null;
  var bestPercentage = 0;
  var bestVerification = null;
  if (type === 'quiz') {
    for (var j = 0; j < history.length; j++) {
      var pct = parseFloat(history[j].percentage) || 0;
      if (pct > bestPercentage) {
        bestPercentage = pct;
        bestScore = history[j].score;
        bestVerification = history[j].verification;
      }
    }
  }

  return jsonResponse({
    attempts: attempts,
    maxAttempts: maxAttempts,
    bestScore: bestScore,
    bestPercentage: bestPercentage,
    bestVerification: bestVerification,
    history: history
  });
}

// ═══════════════════════════════════════════════════════════════
// LOG SUBMISSION (POST)
// ═══════════════════════════════════════════════════════════════

function handleSubmit(body) {
  var email = (body.email || '').toLowerCase().trim();
  var name = body.name || '';
  var type = body.type; // 'quiz' or 'lab'
  var day = parseInt(body.day, 10);
  var data = body.data || {};

  if (!email || !type || isNaN(day)) {
    return jsonResponse({ error: 'Missing required fields: email, type, day' }, 400);
  }

  if (!checkDomain(email)) {
    return jsonResponse({ error: 'Email domain not allowed' }, 403);
  }

  var maxAttempts = type === 'quiz' ? MAX_QUIZ_ATTEMPTS : MAX_LAB_ATTEMPTS;
  var sheet = getOrCreateSheet(type);

  // Count existing attempts (server-side enforcement)
  var rows = sheet.getDataRange().getValues();
  var attemptCount = 0;

  for (var i = 1; i < rows.length; i++) {
    var rowEmail = (rows[i][1] || '').toLowerCase().trim();
    var rowDay = parseInt(rows[i][3], 10);

    if (rowEmail === email && rowDay === day) {
      if (type === 'lab') {
        var rowVariant = rows[i][4] || 'lab';
        if (rowVariant === (data.labVariant || 'lab')) {
          attemptCount++;
        }
      } else {
        attemptCount++;
      }
    }
  }

  if (attemptCount >= maxAttempts) {
    return jsonResponse({
      error: 'Maximum attempts reached',
      attempts: attemptCount,
      maxAttempts: maxAttempts
    }, 403);
  }

  var timestamp = new Date().toISOString();
  var attemptNum = attemptCount + 1;
  var verification;

  if (type === 'quiz') {
    var score = data.score + '/' + data.total;
    var percentage = Math.round((data.score / data.total) * 100);
    var questionsJson = JSON.stringify(data.questions || []);
    verification = computeHMAC(email + '|' + day + '|' + score + '|' + timestamp);

    sheet.appendRow([
      timestamp,
      email,
      name,
      day,
      attemptNum,
      score,
      percentage,
      questionsJson,
      verification
    ]);
  } else {
    var stepsCompleted = data.stepsCompleted + '/' + data.stepsTotal;
    var labVariant = data.labVariant || 'lab';
    var reflectionsJson = JSON.stringify(data.reflections || []);
    verification = computeHMAC(email + '|' + day + '|' + stepsCompleted + '|' + timestamp);

    sheet.appendRow([
      timestamp,
      email,
      name,
      day,
      labVariant,
      stepsCompleted,
      reflectionsJson,
      verification
    ]);
  }

  return jsonResponse({
    success: true,
    attempt: attemptNum,
    timestamp: timestamp,
    verification: verification
  });
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function checkDomain(email) {
  if (!ALLOWED_DOMAINS || ALLOWED_DOMAINS.length === 0) return true;
  var domain = email.split('@')[1];
  return ALLOWED_DOMAINS.indexOf(domain) !== -1;
}

function computeHMAC(message) {
  var signature = Utilities.computeHmacSha256Signature(message, HMAC_SECRET);
  return signature.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('').substring(0, 16); // First 16 hex chars for brevity
}

function getOrCreateSheet(type) {
  var tabName = type === 'quiz' ? QUIZ_TAB : LAB_TAB;

  // Try to find existing spreadsheet by name
  var files = DriveApp.getFilesByName(SHEET_NAME);
  var ss;

  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet
    ss = SpreadsheetApp.create(SHEET_NAME);
    initializeSheets(ss);
  }

  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    if (type === 'quiz') {
      sheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Attempt', 'Score', 'Percentage', 'Questions', 'Verification']);
    } else {
      sheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Lab Variant', 'Steps Completed', 'Reflections', 'Verification']);
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  }

  return sheet;
}

function initializeSheets(ss) {
  // Create Quiz tab
  var quizSheet = ss.getActiveSheet();
  quizSheet.setName(QUIZ_TAB);
  quizSheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Attempt', 'Score', 'Percentage', 'Questions', 'Verification']);
  quizSheet.setFrozenRows(1);
  quizSheet.getRange(1, 1, 1, 9).setFontWeight('bold');

  // Create Lab tab
  var labSheet = ss.insertSheet(LAB_TAB);
  labSheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Lab Variant', 'Steps Completed', 'Reflections', 'Verification']);
  labSheet.setFrozenRows(1);
  labSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
}

function jsonResponse(data, code) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION UTILITY (run manually to verify a submission)
// ═══════════════════════════════════════════════════════════════

/**
 * Run this function from the Apps Script editor to verify a PDF's code.
 * Enter the parameters in the Logger or modify them here.
 */
function verifySubmission() {
  var email = 'student@example.com';
  var day = '1';
  var score = '8/10';
  var timestamp = '2026-03-10T14:30:00.000Z';

  var expected = computeHMAC(email + '|' + day + '|' + score + '|' + timestamp);
  Logger.log('Expected verification: ' + expected);
}
