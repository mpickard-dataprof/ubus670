/**
 * quiz-firebase.js — Firebase Auth + Attempt Tracking + Verification Codes for Quizzes
 *
 * Drop-in script for UBUS 670 quiz pages. Requires:
 *   - <body data-quiz-id="day-X"> on the host page
 *   - Firebase project with Google Auth + Firestore enabled
 *   - Must be loaded AFTER the inline quiz <script> block
 *
 * Graceful degradation: if Firebase fails to load, quizzes work exactly as before.
 */

// ─── Firebase Config ────────────────────────────────────────────────────────
const QF_CONFIG = {
  apiKey: "AIzaSyD8vXhY9UYcodVB4KLTV10AGuZUKtNUSJ0",
  authDomain: "ubus-670-labs.firebaseapp.com",
  projectId: "ubus-670-labs",
  storageBucket: "ubus-670-labs.firebasestorage.app",
  messagingSenderId: "27233273185",
  appId: "1:27233273185:web:37a2cfdace34cb70747120"
};

// ─── Constants ──────────────────────────────────────────────────────────────
const QF_ALLOWED_DOMAINS = ['niu.edu', 'students.niu.edu'];
const QF_ALLOWED_EMAILS = ['matthew.david.pickard@gmail.com', '1999aparnaiyer@gmail.com', 'z2049004students.niu.edu@gmail.com'];
const QF_MAX_ATTEMPTS = 3;

// ─── State ──────────────────────────────────────────────────────────────────
let qfDb = null;
let qfAuth = null;
let qfUser = null;
let qfQuizId = null;
let qfAttemptsUsed = 0;
let qfAttempts = [];
let qfOrigShowResults = null;

// ─── Bootstrap ──────────────────────────────────────────────────────────────
(async function qfInit() {
  qfQuizId = document.body.dataset.quizId;
  if (!qfQuizId) {
    console.warn('[quiz-firebase] No data-quiz-id on <body>, skipping.');
    return;
  }

  // Override showResults immediately — it's a global function declaration,
  // so setTimeout(showResults, ...) in checkAnswer will resolve to our wrapper.
  if (typeof window.showResults === 'function') {
    qfOrigShowResults = window.showResults;
    window.showResults = qfShowResultsWrapper;
  }

  try {
    await qfLoadSDKs();
    qfInitFirebase();

    // Ensure DOM is ready (scripts at bottom of body, so usually already ready)
    if (document.readyState === 'loading') {
      await new Promise(r => document.addEventListener('DOMContentLoaded', r));
    }

    qfInjectAuthUI();
    qfInjectSignInGate();
    qfAuth.onAuthStateChanged(qfOnAuthChanged);
  } catch (err) {
    console.warn('[quiz-firebase] Init failed — quiz works without tracking.', err);
    if (qfOrigShowResults) window.showResults = qfOrigShowResults;
    qfRemoveSignInGate();
    qfShowQuizContent();
  }
})();

// ─── Load Firebase + jsPDF SDKs ─────────────────────────────────────────────
function qfLoadSDKs() {
  return new Promise((resolve, reject) => {
    const needed = [];

    // Check if Firebase is already loaded (e.g., lab-firebase.js loaded it)
    if (!(window.firebase && firebase.app && firebase.firestore)) {
      needed.push(
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
      );
    }
    if (!window.jspdf) {
      needed.push('https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js');
    }

    if (needed.length === 0) { resolve(); return; }

    function loadNext(i) {
      if (i >= needed.length) { resolve(); return; }
      const s = document.createElement('script');
      s.src = needed[i];
      s.onload = () => loadNext(i + 1);
      s.onerror = () => reject(new Error(`Failed to load ${needed[i]}`));
      document.head.appendChild(s);
    }
    loadNext(0);
  });
}

// ─── Initialize Firebase ────────────────────────────────────────────────────
function qfInitFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(QF_CONFIG);
  }
  qfAuth = firebase.auth();
  qfDb = firebase.firestore();
}

// ─── Auth UI ────────────────────────────────────────────────────────────────
function qfInjectAuthUI() {
  const navPills = document.querySelector('.nav-pills');
  if (!navPills || document.getElementById('qf-auth-ui')) return;

  const container = document.createElement('div');
  container.id = 'qf-auth-ui';
  container.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;';
  container.innerHTML = `
    <button id="qf-sign-in-btn" style="
      padding:8px 16px;border-radius:6px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:13px;
      cursor:pointer;font-family:'Montserrat',sans-serif;
      display:flex;align-items:center;gap:6px;transition:all 0.2s;
    ">Sign In</button>
    <span id="qf-user-info" style="
      font-size:12px;color:#666;font-family:'Montserrat',sans-serif;display:none;
    "></span>
    <button id="qf-sign-out-btn" style="
      padding:6px 12px;border-radius:6px;border:1px solid #ddd;
      background:white;color:#666;font-size:12px;cursor:pointer;
      font-family:'Montserrat',sans-serif;display:none;transition:all 0.2s;
    ">Sign Out</button>
  `;

  navPills.appendChild(container);
  document.getElementById('qf-sign-in-btn').addEventListener('click', qfSignIn);
  document.getElementById('qf-sign-out-btn').addEventListener('click', qfSignOut);
}

// ─── Sign-In Gate ───────────────────────────────────────────────────────────
function qfInjectSignInGate() {
  const container = document.querySelector('.quiz-container');
  if (!container || document.getElementById('qf-sign-in-gate')) return;

  // Hide quiz content
  qfHideQuizContent();

  const gate = document.createElement('div');
  gate.id = 'qf-sign-in-gate';
  gate.style.cssText = `
    background: white; padding: 60px 40px; border-radius: 12px;
    text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-top: 30px; font-family: 'Montserrat', sans-serif;
  `;
  gate.innerHTML = `
    <div style="font-size:48px;margin-bottom:20px;">&#128274;</div>
    <h2 style="color:#1D428A;margin:0 0 15px;">Sign In Required</h2>
    <p style="color:#666;margin:0 0 25px;max-width:400px;margin-left:auto;margin-right:auto;">
      Sign in with your NIU email to take this quiz. Your score and attempts will be tracked.
    </p>
    <button id="qf-gate-sign-in-btn" style="
      padding:12px 30px;border-radius:8px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:15px;
      cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;
    ">Sign In with Google</button>
  `;

  container.appendChild(gate);
  document.getElementById('qf-gate-sign-in-btn').addEventListener('click', qfSignIn);
}

function qfRemoveSignInGate() {
  const gate = document.getElementById('qf-sign-in-gate');
  if (gate) gate.remove();
}

function qfHideQuizContent() {
  const progress = document.querySelector('.quiz-progress');
  const questions = document.getElementById('questions-container');
  if (progress) progress.style.display = 'none';
  if (questions) questions.style.display = 'none';
  // Don't touch #results — it's already hidden by CSS (.results { display: none })
  // and setting inline display:none would block .results.show from working later.
}

function qfShowQuizContent() {
  const progress = document.querySelector('.quiz-progress');
  const questions = document.getElementById('questions-container');
  if (progress) progress.style.display = '';
  if (questions) questions.style.display = '';
}

// ─── Auth Handlers ──────────────────────────────────────────────────────────
async function qfSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ hd: 'niu.edu' });

  try {
    const result = await qfAuth.signInWithPopup(provider);
    if (!qfIsAllowedEmail(result.user.email || '')) {
      await qfAuth.signOut();
      alert('Please sign in with your NIU email address (@niu.edu or @students.niu.edu).');
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[quiz-firebase] Sign-in error:', err);
      alert('Sign-in failed. Please try again.');
    }
  }
}

async function qfSignOut() {
  try { await qfAuth.signOut(); } catch (err) {
    console.error('[quiz-firebase] Sign-out error:', err);
  }
}

function qfIsAllowedEmail(email) {
  const lower = email.toLowerCase();
  if (QF_ALLOWED_EMAILS.includes(lower)) return true;
  return QF_ALLOWED_DOMAINS.includes(lower.split('@')[1]);
}

// ─── Auth State Changed ─────────────────────────────────────────────────────
async function qfOnAuthChanged(user) {
  qfUser = user;
  qfUpdateAuthUI(user);

  if (user) {
    await qfLoadAttemptData();

    qfRemoveSignInGate();
    qfRemoveLockedMsg();

    if (qfAttemptsUsed >= QF_MAX_ATTEMPTS) {
      qfShowLockedMsg();
    } else {
      // If quiz was already completed this session (sign-out/re-sign-in), reload for fresh state
      const answeredCards = document.querySelectorAll('.question-card.answered-correct, .question-card.answered-wrong');
      if (answeredCards.length > 0) {
        location.reload();
        return;
      }
      qfShowQuizContent();
      qfUpdateAttemptsUI();
      qfSetupRetryButton();
    }
  } else {
    qfAttemptsUsed = 0;
    qfAttempts = [];
    qfRemoveLockedMsg();
    qfRemoveAttemptsUI();
    // Hide results panel if it was showing (prevents verification code exposure after sign-out)
    const results = document.getElementById('results');
    if (results) results.classList.remove('show');
    qfInjectSignInGate();
  }
}

function qfUpdateAuthUI(user) {
  const signInBtn = document.getElementById('qf-sign-in-btn');
  const userInfo = document.getElementById('qf-user-info');
  const signOutBtn = document.getElementById('qf-sign-out-btn');
  if (!signInBtn) return;

  if (user) {
    signInBtn.style.display = 'none';
    userInfo.style.display = 'inline';
    userInfo.textContent = user.email;
    signOutBtn.style.display = 'inline-block';
  } else {
    signInBtn.style.display = 'flex';
    userInfo.style.display = 'none';
    signOutBtn.style.display = 'none';
  }
}

// ─── Firestore ──────────────────────────────────────────────────────────────
function qfGetDocRef() {
  if (!qfUser || !qfQuizId) return null;
  return qfDb.collection('quizzes').doc(`${qfUser.uid}_${qfQuizId}`);
}

async function qfLoadAttemptData() {
  const ref = qfGetDocRef();
  if (!ref) return;

  try {
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      qfAttemptsUsed = data.attemptsUsed || 0;
      qfAttempts = data.attempts || [];
    } else {
      qfAttemptsUsed = 0;
      qfAttempts = [];
    }
  } catch (err) {
    console.error('[quiz-firebase] Failed to load attempts:', err);
  }
}

async function qfSaveAttempt(score, totalQuestions) {
  const ref = qfGetDocRef();
  if (!ref) return null;

  try {
    const result = await qfDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists ? snap.data() : { attempts: [], attemptsUsed: 0 };

      // Server-side attempt limit enforcement
      if (data.attemptsUsed >= QF_MAX_ATTEMPTS) {
        throw new Error('max_attempts_reached');
      }

      const attemptNumber = data.attemptsUsed + 1;
      const percentage = Math.round((score / totalQuestions) * 100);
      const verificationCode = qfGenerateVerificationCode(attemptNumber, score);

      const attempt = {
        attemptNumber,
        score,
        totalQuestions,
        percentage,
        verificationCode,
        timestamp: new Date().toISOString()
      };

      const newAttempts = [...(data.attempts || []), attempt];
      const bestScore = Math.max(score, ...(data.attempts || []).map(a => a.score));
      const bestPercentage = Math.round((bestScore / totalQuestions) * 100);

      tx.set(ref, {
        userId: qfUser.uid,
        email: qfUser.email,
        displayName: qfUser.displayName || '',
        quizId: qfQuizId,
        attempts: newAttempts,
        bestScore,
        bestPercentage,
        attemptsUsed: attemptNumber,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });

      return { verificationCode, attemptNumber, percentage, newAttempts };
    });

    qfAttemptsUsed = result.attemptNumber;
    qfAttempts = result.newAttempts;
    return result;
  } catch (err) {
    if (err.message === 'max_attempts_reached') {
      console.warn('[quiz-firebase] Max attempts reached.');
    } else {
      console.error('[quiz-firebase] Failed to save attempt:', err);
    }
    return null;
  }
}

// ─── Verification Code ──────────────────────────────────────────────────────
function qfGenerateVerificationCode(attemptNumber, score) {
  // Format: D1-4567-08-A3F2
  const dayNum = qfQuizId.replace(/\D/g, '');
  const prefix = `D${dayNum}`;

  const email = qfUser.email || '';
  const localPart = email.split('@')[0];
  const last4 = localPart.slice(-4).toUpperCase();

  const scorePad = String(score).padStart(2, '0');

  const hashInput = `${qfUser.uid}${qfQuizId}${attemptNumber}${score}`;
  const hash4 = qfHash(hashInput);

  return `${prefix}-${last4}-${scorePad}-${hash4}`;
}

function qfHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h).toString(16).toUpperCase().padStart(4, '0').slice(0, 4);
}

// ─── Attempts UI ────────────────────────────────────────────────────────────
function qfUpdateAttemptsUI() {
  let badge = document.getElementById('qf-attempts-badge');

  if (!badge) {
    const progress = document.querySelector('.quiz-progress');
    if (!progress) return;

    badge = document.createElement('div');
    badge.id = 'qf-attempts-badge';
    badge.style.cssText = `
      margin-top: 10px; font-family: 'Montserrat', sans-serif;
      font-size: 13px; color: #666;
    `;
    progress.appendChild(badge);
  }

  const remaining = QF_MAX_ATTEMPTS - qfAttemptsUsed;

  if (qfAttemptsUsed >= QF_MAX_ATTEMPTS) {
    badge.innerHTML = '<span style="color:#C8102E;font-weight:600;">All 3 attempts used</span>';
  } else {
    badge.textContent = `Attempts: ${qfAttemptsUsed}/${QF_MAX_ATTEMPTS} used (${remaining} remaining)`;
  }
}

function qfRemoveAttemptsUI() {
  const badge = document.getElementById('qf-attempts-badge');
  if (badge) badge.remove();
}

// ─── Locked (All Attempts Used) ─────────────────────────────────────────────
function qfShowLockedMsg() {
  qfHideQuizContent();

  const container = document.querySelector('.quiz-container');
  if (!container || document.getElementById('qf-locked-msg')) return;

  const bestAttempt = qfAttempts.reduce((best, a) =>
    (!best || a.score > best.score) ? a : best, null);

  const msg = document.createElement('div');
  msg.id = 'qf-locked-msg';
  msg.style.cssText = `
    background: white; padding: 40px; border-radius: 12px;
    text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-top: 30px; font-family: 'Montserrat', sans-serif;
  `;

  msg.innerHTML = `
    <h2 style="color:#1D428A;margin:0 0 15px;">All Attempts Used</h2>
    <p style="color:#666;margin:0 0 10px;">You have used all ${QF_MAX_ATTEMPTS} attempts for this quiz.</p>
    ${bestAttempt ? `
      <div style="margin:20px 0;">
        <div style="font-size:3rem;font-weight:700;color:#C8102E;">
          ${bestAttempt.score}/${bestAttempt.totalQuestions}
        </div>
        <div style="color:#666;margin-top:5px;">Best Score (${bestAttempt.percentage}%)</div>
      </div>
      <div style="background:#f0f4ff;padding:15px;border-radius:8px;display:inline-block;margin:15px 0;">
        <div style="font-size:12px;color:#666;margin-bottom:4px;">Best Attempt Verification Code</div>
        <div style="font-size:18px;font-weight:700;color:#1D428A;letter-spacing:2px;">
          ${bestAttempt.verificationCode}
        </div>
      </div>
    ` : ''}
    <div style="margin-top:20px;">
      <button id="qf-locked-pdf-btn" style="
        padding:12px 30px;border-radius:8px;border:none;
        background:#1D428A;color:white;font-weight:600;font-size:14px;
        cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;
      ">Download Score Report (PDF)</button>
    </div>
    <div style="margin-top:15px;">
      <a href="index.html" style="color:#1D428A;font-size:14px;text-decoration:none;">
        Back to Dashboard
      </a>
    </div>
  `;

  container.appendChild(msg);
  document.getElementById('qf-locked-pdf-btn').addEventListener('click', () => qfDownloadPDF(bestAttempt));
}

function qfRemoveLockedMsg() {
  const msg = document.getElementById('qf-locked-msg');
  if (msg) msg.remove();
}

// ─── Retry Button ───────────────────────────────────────────────────────────
function qfSetupRetryButton() {
  document.querySelectorAll('.retry-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    if (onclick && onclick.includes('location.reload')) {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', qfHandleRetry);
    }
  });
}

function qfHandleRetry(e) {
  if (qfAttemptsUsed >= QF_MAX_ATTEMPTS) {
    e.preventDefault();
    alert(`You have used all ${QF_MAX_ATTEMPTS} attempts for this quiz.`);
    return;
  }
  location.reload();
}

// ─── Show Results Wrapper ───────────────────────────────────────────────────
async function qfShowResultsWrapper() {
  // Call original showResults
  if (qfOrigShowResults) qfOrigShowResults();

  // If not signed in, no tracking
  if (!qfUser) return;

  // Don't save if already at max attempts (prevents multi-tab bypass)
  if (qfAttemptsUsed >= QF_MAX_ATTEMPTS) return;

  // Read score from DOM — quiz variables use `let` so aren't on `window`
  const scoreText = document.getElementById('final-score')?.textContent || '';
  const parts = scoreText.split('/');
  const score = parseInt(parts[0], 10) || 0;
  const total = parseInt(parts[1], 10) || 10;

  try {
    // Save attempt to Firestore
    const result = await qfSaveAttempt(score, total);
    if (!result) return;

    qfInjectResultsExtras(result);
    qfUpdateAttemptsUI();
    qfUpdateRetryButtonAfterResults();
  } catch (err) {
    console.error('[quiz-firebase] Failed to save/display results:', err);
  }
}

function qfInjectResultsExtras(result) {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;

  // Remove previous extras if any
  const existing = document.getElementById('qf-results-extras');
  if (existing) existing.remove();

  const extras = document.createElement('div');
  extras.id = 'qf-results-extras';
  extras.style.cssText = 'margin-top: 25px; font-family: "Montserrat", sans-serif;';

  extras.innerHTML = `
    <div style="background:#f0f4ff;padding:20px;border-radius:10px;margin:0 auto;max-width:350px;">
      <div style="font-size:12px;color:#666;margin-bottom:6px;">Verification Code</div>
      <div style="font-size:22px;font-weight:700;color:#1D428A;letter-spacing:2px;">
        ${result.verificationCode}
      </div>
      <div style="font-size:12px;color:#888;margin-top:6px;">
        Attempt ${result.attemptNumber} of ${QF_MAX_ATTEMPTS}
      </div>
    </div>
    <button id="qf-download-pdf-btn" style="
      display:inline-block;padding:12px 30px;border-radius:8px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:14px;
      cursor:pointer;font-family:'Montserrat',sans-serif;
      margin-top:20px;transition:all 0.2s;
    ">Download Score Report (PDF)</button>
    <div style="font-size:12px;color:#888;margin-top:8px;">Submit this PDF to Blackboard</div>
  `;

  // Insert before the retry buttons
  const retryBtn = resultsDiv.querySelector('.retry-btn');
  if (retryBtn) {
    retryBtn.parentNode.insertBefore(extras, retryBtn);
  } else {
    resultsDiv.appendChild(extras);
  }

  document.getElementById('qf-download-pdf-btn').addEventListener('click', qfDownloadPDF);
}

function qfUpdateRetryButtonAfterResults() {
  if (qfAttemptsUsed >= QF_MAX_ATTEMPTS) {
    document.querySelectorAll('.retry-btn').forEach(btn => {
      if (btn.textContent.includes('Try Again') || btn.textContent.includes('Retake')) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.textContent = `All ${QF_MAX_ATTEMPTS} Attempts Used`;
      }
    });
  }
}

// ─── PDF Generation ─────────────────────────────────────────────────────────
function qfDownloadPDF(overrideAttempt) {
  const jspdf = window.jspdf;
  if (!jspdf) {
    alert('PDF library is still loading. Please try again in a moment.');
    return;
  }

  // Use provided attempt (e.g., best attempt from locked screen) or most recent
  // Guard against MouseEvent being passed when used as a click handler
  const attempt = (overrideAttempt && !(overrideAttempt instanceof Event))
    ? overrideAttempt
    : qfAttempts[qfAttempts.length - 1];
  if (!attempt) return;

  const doc = new jspdf.jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 25;

  // ── Header ──
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 16, 46);
  doc.text('UBUS 670: AI for Business Leaders', margin, y);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(29, 66, 138);
  const quizTitle = document.title || 'Quiz';
  doc.text(quizTitle, margin, y);
  y += 10;

  doc.setDrawColor(200, 16, 46);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // ── Student Info ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  doc.text(`Student: ${qfUser.displayName || '\u2014'}`, margin, y);
  y += 7;
  doc.text(`Email: ${qfUser.email || '\u2014'}`, margin, y);
  y += 7;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
  y += 15;

  // ── Score Box ──
  doc.setFillColor(240, 244, 255);
  doc.roundedRect(margin, y, maxWidth, 50, 5, 5, 'F');

  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 16, 46);
  doc.text(`${attempt.score}/${attempt.totalQuestions}`, pageWidth / 2, y + 22, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(`${attempt.percentage}%`, pageWidth / 2, y + 35, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Attempt ${attempt.attemptNumber} of ${QF_MAX_ATTEMPTS}`, pageWidth / 2, y + 45, { align: 'center' });
  y += 65;

  // ── Verification Code ──
  doc.setFillColor(29, 66, 138);
  doc.roundedRect(margin + 30, y, maxWidth - 60, 35, 5, 5, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFICATION CODE', pageWidth / 2, y + 12, { align: 'center' });

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(attempt.verificationCode, pageWidth / 2, y + 27, { align: 'center' });
  y += 50;

  // ── Instructions ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Submit this PDF to Blackboard for grading.', pageWidth / 2, y, { align: 'center' });
  y += 7;
  doc.text('The verification code confirms your identity and score.', pageWidth / 2, y, { align: 'center' });
  y += 20;

  // ── All Attempts Summary ──
  if (qfAttempts.length > 1) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 66, 138);
    doc.text('All Attempts', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    qfAttempts.forEach(a => {
      doc.text(
        `Attempt ${a.attemptNumber}: ${a.score}/${a.totalQuestions} (${a.percentage}%) \u2014 ${a.verificationCode}`,
        margin + 5, y
      );
      y += 6;
    });
    y += 10;
  }

  // ── Footer ──
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    `Generated: ${new Date().toLocaleString()} | UBUS 670 \u2014 Northern Illinois University`,
    margin, y
  );

  // ── Save ──
  const dayNum = qfQuizId.replace(/\D/g, '');
  const qfFilename = `day-${dayNum}_quiz_score_report.pdf`;
  try {
    doc.save(qfFilename);
  } catch (e) {
    // Fallback: open as data URI if blob download fails (Safari/Edge)
    console.warn('[quiz-firebase] doc.save() failed, using fallback:', e);
    const pdfData = doc.output('datauristring');
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = qfFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Button feedback
  const btn = document.getElementById('qf-download-pdf-btn') ||
              document.getElementById('qf-locked-pdf-btn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = 'PDF Downloaded!';
    setTimeout(() => { btn.textContent = orig; }, 3000);
  }
}
