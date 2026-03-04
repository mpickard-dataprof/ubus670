/**
 * UBUS 670 — Quiz & Lab Submission Tracking Backend
 *
 * Deploy as: Web App → Execute as: Me → Access: Anyone
 * Uses JSONP to bypass CORS restrictions on cross-origin requests.
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
var HMAC_SECRET = 'CHANGE_ME_TO_A_RANDOM_SECRET_STRING';

/** Max attempts per type */
var MAX_QUIZ_ATTEMPTS = 3;
var MAX_LAB_ATTEMPTS = 1;

/** Optional domain restriction (null = allow all, array = restrict) */
var ALLOWED_DOMAINS = null;
// var ALLOWED_DOMAINS = ['students.niu.edu', 'niu.edu'];

/** Sheet name — created automatically if it doesn't exist */
var SHEET_NAME = 'UBUS 670 Submissions';
var QUIZ_TAB = 'Quiz Submissions';
var LAB_TAB = 'Lab Submissions';

// Global JSONP callback name (set per-request)
var _jsonpCallback = null;

// ═══════════════════════════════════════════════════════════════
// WEB APP ENTRY POINT (GET only — JSONP for CORS)
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  var params = e.parameter;
  _jsonpCallback = params.callback || null;
  var action = params.action;

  if (action === 'check') {
    return handleCheck(params);
  }

  if (action === 'submit') {
    var body;
    try {
      body = JSON.parse(params.payload);
    } catch (err) {
      return respond({ error: 'Invalid payload JSON' });
    }
    return handleSubmit(body);
  }

  return respond({ error: 'Unknown action' });
}

// ═══════════════════════════════════════════════════════════════
// CHECK ATTEMPTS
// ═══════════════════════════════════════════════════════════════

function handleCheck(params) {
  var email = (params.email || '').toLowerCase().trim();
  var type = params.type;
  var day = parseInt(params.day, 10);
  var labVariant = params.labVariant || 'lab';

  if (!email || !type || isNaN(day)) {
    return respond({ error: 'Missing required params: email, type, day' });
  }

  if (!checkDomain(email)) {
    return respond({ error: 'Email domain not allowed' });
  }

  var maxAttempts = type === 'quiz' ? MAX_QUIZ_ATTEMPTS : MAX_LAB_ATTEMPTS;
  var sheet = getOrCreateSheet(type);
  var rows = sheet.getDataRange().getValues();

  var history = [];
  for (var i = 1; i < rows.length; i++) {
    var rowEmail = (rows[i][1] || '').toString().toLowerCase().trim();
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
        var rowVariant = (rows[i][4] || 'lab').toString();
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

  return respond({
    attempts: attempts,
    maxAttempts: maxAttempts,
    bestScore: bestScore,
    bestPercentage: bestPercentage,
    bestVerification: bestVerification,
    history: history
  });
}

// ═══════════════════════════════════════════════════════════════
// LOG SUBMISSION
// ═══════════════════════════════════════════════════════════════

function handleSubmit(body) {
  var email = (body.email || '').toLowerCase().trim();
  var name = body.name || '';
  var type = body.type;
  var day = parseInt(body.day, 10);
  var data = body.data || {};

  if (!email || !type || isNaN(day)) {
    return respond({ error: 'Missing required fields: email, type, day' });
  }

  if (!checkDomain(email)) {
    return respond({ error: 'Email domain not allowed' });
  }

  var maxAttempts = type === 'quiz' ? MAX_QUIZ_ATTEMPTS : MAX_LAB_ATTEMPTS;
  var sheet = getOrCreateSheet(type);
  var rows = sheet.getDataRange().getValues();
  var attemptCount = 0;

  for (var i = 1; i < rows.length; i++) {
    var rowEmail = (rows[i][1] || '').toString().toLowerCase().trim();
    var rowDay = parseInt(rows[i][3], 10);

    if (rowEmail === email && rowDay === day) {
      if (type === 'lab') {
        var rowVariant = (rows[i][4] || 'lab').toString();
        if (rowVariant === (data.labVariant || 'lab')) {
          attemptCount++;
        }
      } else {
        attemptCount++;
      }
    }
  }

  if (attemptCount >= maxAttempts) {
    return respond({
      error: 'Maximum attempts reached',
      attempts: attemptCount,
      maxAttempts: maxAttempts
    });
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
      timestamp, email, name, day, attemptNum,
      score, percentage, questionsJson, verification
    ]);
  } else {
    var stepsCompleted = data.stepsCompleted + '/' + data.stepsTotal;
    var labVariant = data.labVariant || 'lab';
    var reflectionsJson = JSON.stringify(data.reflections || []);
    verification = computeHMAC(email + '|' + day + '|' + stepsCompleted + '|' + timestamp);

    sheet.appendRow([
      timestamp, email, name, day, labVariant,
      stepsCompleted, reflectionsJson, verification
    ]);
  }

  return respond({
    success: true,
    attempt: attemptNum,
    timestamp: timestamp,
    verification: verification
  });
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Returns either JSONP (callback wrapper) or plain JSON.
 * JSONP is used for all browser requests to bypass CORS.
 */
function respond(data) {
  var json = JSON.stringify(data);
  if (_jsonpCallback) {
    var output = ContentService.createTextOutput(_jsonpCallback + '(' + json + ')');
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
    return output;
  }
  var output = ContentService.createTextOutput(json);
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function checkDomain(email) {
  if (!ALLOWED_DOMAINS || ALLOWED_DOMAINS.length === 0) return true;
  var domain = email.split('@')[1];
  return ALLOWED_DOMAINS.indexOf(domain) !== -1;
}

function computeHMAC(message) {
  var signature = Utilities.computeHmacSha256Signature(message, HMAC_SECRET);
  return signature.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('').substring(0, 16);
}

function getOrCreateSheet(type) {
  var tabName = type === 'quiz' ? QUIZ_TAB : LAB_TAB;

  // Use a specific spreadsheet ID to avoid name-collision issues
  var SPREADSHEET_ID = '1vUvigwzATLDZz7IjCXkJRJUXP5EkTw0Q3y3s8W1-8PU';
  var ss;

  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    // Fallback: search by name, then create
    var files = DriveApp.getFilesByName(SHEET_NAME);
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create(SHEET_NAME);
      initializeSheets(ss);
    }
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
  var quizSheet = ss.getActiveSheet();
  quizSheet.setName(QUIZ_TAB);
  quizSheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Attempt', 'Score', 'Percentage', 'Questions', 'Verification']);
  quizSheet.setFrozenRows(1);
  quizSheet.getRange(1, 1, 1, 9).setFontWeight('bold');

  var labSheet = ss.insertSheet(LAB_TAB);
  labSheet.appendRow(['Timestamp', 'Email', 'Name', 'Day', 'Lab Variant', 'Steps Completed', 'Reflections', 'Verification']);
  labSheet.setFrozenRows(1);
  labSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION UTILITY (run manually to verify a submission)
// ═══════════════════════════════════════════════════════════════

function verifySubmission() {
  var email = 'student@example.com';
  var day = '1';
  var score = '8/10';
  var timestamp = '2026-03-10T14:30:00.000Z';

  var expected = computeHMAC(email + '|' + day + '|' + score + '|' + timestamp);
  Logger.log('Expected verification: ' + expected);
}
