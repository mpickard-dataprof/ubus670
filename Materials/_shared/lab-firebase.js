/**
 * lab-firebase.js — Firebase Auth + Save/Resume + Completion Tracking for Labs
 *
 * Drop-in script for UBUS 670 lab pages. Requires:
 *   - <body data-lab-id="day-X"> on the host page
 *   - Firebase project with Google Auth + Firestore enabled
 *
 * Graceful degradation: if Firebase fails to load, labs work exactly as before.
 */

// ─── Firebase Config ────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD8vXhY9UYcodVB4KLTV10AGuZUKtNUSJ0",
  authDomain: "ubus-670-labs.firebaseapp.com",
  projectId: "ubus-670-labs",
  storageBucket: "ubus-670-labs.firebasestorage.app",
  messagingSenderId: "27233273185",
  appId: "1:27233273185:web:37a2cfdace34cb70747120"
};

// ─── Constants ──────────────────────────────────────────────────────────────
const AUTOSAVE_DELAY_MS = 2000;
const ALLOWED_DOMAINS = ['niu.edu', 'students.niu.edu'];
const ALLOWED_EMAILS = ['matthew.david.pickard@gmail.com', '1999aparnaiyer@gmail.com', 'z2049004students.niu.edu@gmail.com'];

// ─── State ──────────────────────────────────────────────────────────────────
let db = null;
let auth = null;
let currentUser = null;
let labId = null;
let saveTimeout = null;
let saveStatusTimeout = null;
let isSubmitted = false;
let listenersAttached = false;

// ─── Bootstrap ──────────────────────────────────────────────────────────────
(async function init() {
  labId = document.body.dataset.labId;
  if (!labId) {
    console.warn('[lab-firebase] No data-lab-id on <body>, skipping Firebase init.');
    return;
  }

  try {
    await loadSDKs();
    initFirebase();
    injectAuthUI();
    injectSignInGate();
    overrideDownloadPDF();
    auth.onAuthStateChanged(
      handleAuthStateChanged,
      (err) => console.error('[lab-firebase] Auth listener error:', err)
    );
  } catch (err) {
    console.error('[lab-firebase] Firebase init failed:', err);
    // Show error on the gate instead of falling back to unauthenticated access
    hideLabContent();
    const gate = document.getElementById('lab-sign-in-gate');
    if (gate) {
      gate.innerHTML = `
        <div style="font-size:48px;margin-bottom:20px;">&#9888;&#65039;</div>
        <h2 style="color:#C8102E;margin:0 0 15px;">Unable to Load Lab</h2>
        <p style="color:#666;margin:0 0 25px;max-width:400px;margin-left:auto;margin-right:auto;">
          The lab system failed to initialize. Please refresh the page or try a different browser.
        </p>
        <button onclick="location.reload()" style="
          padding:12px 30px;border-radius:8px;border:none;
          background:#1D428A;color:white;font-weight:600;font-size:15px;
          cursor:pointer;font-family:'Montserrat',sans-serif;
        ">Refresh Page</button>
      `;
    } else {
      const container = document.querySelector('.lab-container');
      if (container) {
        const errDiv = document.createElement('div');
        errDiv.id = 'lab-sign-in-gate';
        errDiv.style.cssText = 'background:white;padding:60px 40px;border-radius:12px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1);margin-top:30px;font-family:"Montserrat",sans-serif;';
        errDiv.innerHTML = `
          <h2 style="color:#C8102E;margin:0 0 15px;">Unable to Load Lab</h2>
          <p style="color:#666;">Please refresh the page or try a different browser.</p>
          <button onclick="location.reload()" style="padding:12px 30px;border-radius:8px;border:none;background:#1D428A;color:white;font-weight:600;font-size:15px;cursor:pointer;">Refresh Page</button>
        `;
        container.prepend(errDiv);
      }
    }
  }
})();

// ─── Load Firebase + jsPDF SDKs from CDN ────────────────────────────────────
function loadSDKs() {
  return new Promise((resolve, reject) => {
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js'
    ];

    // Load sequentially (app must load before auth/firestore)
    function loadNext(i) {
      if (i >= scripts.length) { resolve(); return; }
      const s = document.createElement('script');
      s.src = scripts[i];
      s.onload = () => loadNext(i + 1);
      s.onerror = () => reject(new Error(`Failed to load ${scripts[i]}`));
      document.head.appendChild(s);
    }
    loadNext(0);
  });
}

// ─── Initialize Firebase ────────────────────────────────────────────────────
function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth();
  db = firebase.firestore();
}

// ─── Auth UI ────────────────────────────────────────────────────────────────
function injectAuthUI() {
  const navPills = document.querySelector('.nav-pills');
  if (!navPills) return;

  const authContainer = document.createElement('div');
  authContainer.id = 'firebase-auth-ui';
  authContainer.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;';
  authContainer.innerHTML = `
    <button id="firebase-sign-in-btn" style="
      padding:8px 16px;border-radius:6px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:13px;
      cursor:pointer;font-family:'Montserrat',sans-serif;
      display:flex;align-items:center;gap:6px;transition:all 0.2s;
    ">Sign In</button>
    <span id="firebase-user-info" style="
      font-size:12px;color:#666;font-family:'Montserrat',sans-serif;display:none;
    "></span>
    <button id="firebase-sign-out-btn" style="
      padding:6px 12px;border-radius:6px;border:1px solid #ddd;
      background:white;color:#666;font-size:12px;cursor:pointer;
      font-family:'Montserrat',sans-serif;display:none;transition:all 0.2s;
    ">Sign Out</button>
  `;

  // Append inside nav-pills so it stays in the same flex row
  navPills.appendChild(authContainer);

  document.getElementById('firebase-sign-in-btn').addEventListener('click', signIn);
  document.getElementById('firebase-sign-out-btn').addEventListener('click', signOut);
}

// ─── Sign-In Gate ───────────────────────────────────────────────────────────
function injectSignInGate() {
  const container = document.querySelector('.lab-container');
  if (!container || document.getElementById('lab-sign-in-gate')) return;

  hideLabContent();

  const gate = document.createElement('div');
  gate.id = 'lab-sign-in-gate';
  gate.style.cssText = `
    background: white; padding: 60px 40px; border-radius: 12px;
    text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-top: 30px; font-family: 'Montserrat', sans-serif;
  `;
  gate.innerHTML = `
    <div style="font-size:48px;margin-bottom:20px;">&#128274;</div>
    <h2 style="color:#1D428A;margin:0 0 15px;">Sign In Required</h2>
    <p style="color:#666;margin:0 0 25px;max-width:400px;margin-left:auto;margin-right:auto;">
      Sign in with your NIU email to start this lab. Your progress will be saved automatically.
    </p>
    <button id="lab-gate-sign-in-btn" style="
      padding:12px 30px;border-radius:8px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:15px;
      cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;
    ">Sign In with Google</button>
  `;

  container.prepend(gate);
  document.getElementById('lab-gate-sign-in-btn').addEventListener('click', signIn);
}

function removeSignInGate() {
  const gate = document.getElementById('lab-sign-in-gate');
  if (gate) gate.remove();
}

function hideLabContent() {
  document.querySelectorAll('.lab-section').forEach(s => { s.style.display = 'none'; });
  const progressTracker = document.querySelector('.progress-tracker');
  if (progressTracker) progressTracker.style.display = 'none';
}

function showLabContent() {
  document.querySelectorAll('.lab-section').forEach(s => { s.style.display = ''; });
  const progressTracker = document.querySelector('.progress-tracker');
  if (progressTracker) progressTracker.style.display = '';
}

// ─── Save Status Indicator ──────────────────────────────────────────────────
function showSaveStatus(message, isError = false) {
  let indicator = document.getElementById('firebase-save-status');
  if (!indicator) {
    const tracker = document.querySelector('.progress-tracker');
    if (!tracker) return;
    indicator = document.createElement('div');
    indicator.id = 'firebase-save-status';
    indicator.style.cssText = `
      font-size:11px;margin-top:6px;font-family:'Montserrat',sans-serif;
      transition:opacity 0.3s;
    `;
    tracker.appendChild(indicator);
  }

  indicator.textContent = message;
  indicator.style.color = isError ? '#C8102E' : '#28a745';
  indicator.style.opacity = '1';

  clearTimeout(saveStatusTimeout);
  if (!isError) {
    saveStatusTimeout = setTimeout(() => { indicator.style.opacity = '0'; }, 2000);
  }
}

// ─── Auth Handlers ──────────────────────────────────────────────────────────
async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ hd: 'students.niu.edu' });

  try {
    const result = await auth.signInWithPopup(provider);
    const email = result.user.email || '';

    if (!isAllowedEmail(email)) {
      await auth.signOut();
      alert('This email is not authorized. Please sign in with your NIU email address (@niu.edu or @students.niu.edu).');
      return;
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[lab-firebase] Sign-in error:', err);
      alert('Sign-in failed. Please try again.');
    }
  }
}

async function signOut() {
  try {
    await auth.signOut();
  } catch (err) {
    console.error('[lab-firebase] Sign-out error:', err);
  }
}

function isAllowedEmail(email) {
  const lower = email.toLowerCase();
  if (ALLOWED_EMAILS.includes(lower)) return true;
  const domain = lower.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
}

function handleAuthStateChanged(user) {
  currentUser = user;
  updateAuthUI(user);

  if (user) {
    // Reset UI state (handles user switch — clear any previous submitted banner)
    unlockLab();
    removeSignInGate();
    showLabContent();
    loadLabState();
  } else {
    isSubmitted = false;
    // Disable all inputs so work can't be done while signed out
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.disabled = true; });
    document.querySelectorAll('.reflection-area textarea').forEach(ta => { ta.readOnly = true; });
    const dlBtn = document.getElementById('download-pdf-btn');
    if (dlBtn) { dlBtn.disabled = true; }
    injectSignInGate();
  }
}

function updateAuthUI(user) {
  const signInBtn = document.getElementById('firebase-sign-in-btn');
  const userInfo = document.getElementById('firebase-user-info');
  const signOutBtn = document.getElementById('firebase-sign-out-btn');

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

// ─── Firestore Document Helpers ─────────────────────────────────────────────
function getDocId() {
  if (!currentUser || !labId) return null;
  return `${currentUser.uid}_${labId}`;
}

function getDocRef() {
  const docId = getDocId();
  if (!docId) return null;
  return db.collection('labs').doc(docId);
}

// ─── Load State from Firestore ──────────────────────────────────────────────
async function loadLabState() {
  const ref = getDocRef();
  if (!ref) return;

  try {
    const snap = await ref.get();
    if (!snap.exists) {
      attachAutoSaveListeners();
      return;
    }

    const data = snap.data();

    // Restore checkboxes
    if (data.checkboxes) {
      for (const [id, checked] of Object.entries(data.checkboxes)) {
        const el = document.getElementById(id);
        if (el && el.type === 'checkbox') {
          el.checked = checked;
          const step = el.closest('.step');
          if (step) step.classList.toggle('completed', checked);
        }
      }
    }

    // Restore textareas
    if (data.textareas) {
      const textareas = document.querySelectorAll('.reflection-area textarea');
      for (const [idx, value] of Object.entries(data.textareas)) {
        const i = parseInt(idx, 10);
        if (textareas[i]) textareas[i].value = value;
      }
    }

    // Update progress bar
    if (typeof window.updateProgress === 'function') {
      window.updateProgress();
    } else {
      const firstCb = document.querySelector('input[type="checkbox"]');
      if (firstCb) firstCb.dispatchEvent(new Event('change'));
    }

    // Check submission status
    if (data.status === 'submitted') {
      isSubmitted = true;
      lockLab(data.submittedAt);
    } else {
      attachAutoSaveListeners();
    }

    showSaveStatus('Progress restored');
  } catch (err) {
    console.error('[lab-firebase] Failed to load state:', err);
    if (err.code === 'permission-denied' || (err.message && err.message.includes('permissions'))) {
      showSaveStatus('Cloud save unavailable — your work will be saved when you submit', true);
    } else {
      showSaveStatus('Failed to load saved progress', true);
    }
    // Still let the student work and attach listeners so saves can retry
    attachAutoSaveListeners();
  }
}

// ─── Auto-Save ──────────────────────────────────────────────────────────────
function attachAutoSaveListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  document.querySelectorAll('.reflection-area textarea').forEach(ta => {
    ta.addEventListener('input', scheduleSave);
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', scheduleSave);
  });
}

function scheduleSave() {
  if (isSubmitted || !currentUser) return;

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveLabState, AUTOSAVE_DELAY_MS);
}

function gatherState() {
  const checkboxes = {};
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.id) checkboxes[cb.id] = cb.checked;
  });

  const textareas = {};
  document.querySelectorAll('.reflection-area textarea').forEach((ta, i) => {
    textareas[String(i)] = ta.value;
  });

  return { checkboxes, textareas };
}

async function saveLabState() {
  const ref = getDocRef();
  if (!ref || isSubmitted) return;

  const { checkboxes, textareas } = gatherState();

  try {
    await ref.set({
      userId: currentUser.uid,
      email: currentUser.email,
      labId: labId,
      status: 'in-progress',
      lastSaved: firebase.firestore.FieldValue.serverTimestamp(),
      checkboxes: checkboxes,
      textareas: textareas
    }, { merge: true });

    showSaveStatus('Saved');
  } catch (err) {
    console.error('[lab-firebase] Save failed:', err);
    showSaveStatus('Save failed', true);
  }
}

// ─── Submission Lock / Unlock ────────────────────────────────────────────────
function unlockLab() {
  // Re-enable all inputs
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.disabled = false;
  });
  document.querySelectorAll('.reflection-area textarea').forEach(ta => {
    ta.readOnly = false;
    ta.style.opacity = '';
    ta.style.backgroundColor = '';
  });

  // Remove submitted banner if present
  const banner = document.getElementById('firebase-submitted-banner');
  if (banner) {
    banner.remove();
    document.body.style.paddingTop = '';
  }

  // Re-enable download button
  const dlBtn = document.getElementById('download-pdf-btn');
  if (dlBtn) {
    dlBtn.disabled = false;
    dlBtn.textContent = 'Download as PDF';
    dlBtn.style.opacity = '';
    dlBtn.style.cursor = '';
  }
}

function lockLab(submittedAt) {
  // Guard against duplicate banners
  if (document.getElementById('firebase-submitted-banner')) return;

  // Disable all inputs
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.disabled = true;
  });
  document.querySelectorAll('.reflection-area textarea').forEach(ta => {
    ta.readOnly = true;
    ta.style.opacity = '0.7';
    ta.style.backgroundColor = '#f5f5f5';
  });

  // Show submitted banner
  const banner = document.createElement('div');
  banner.id = 'firebase-submitted-banner';
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:9999;
    background:#28a745;color:white;text-align:center;
    padding:12px 20px;font-family:'Montserrat',sans-serif;
    font-weight:600;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.15);
  `;

  let timeStr = '';
  if (submittedAt && submittedAt.toDate) {
    timeStr = ` on ${submittedAt.toDate().toLocaleString()}`;
  }
  banner.textContent = `Lab Submitted${timeStr}`;

  document.body.prepend(banner);
  document.body.style.paddingTop = '48px';

  // Disable download button
  const dlBtn = document.getElementById('download-pdf-btn');
  if (dlBtn) {
    dlBtn.disabled = true;
    dlBtn.textContent = 'Lab Already Submitted';
    dlBtn.style.opacity = '0.6';
    dlBtn.style.cursor = 'not-allowed';
  }
}

// ─── PDF Download (jsPDF) ───────────────────────────────────────────────────
function generateLabPDF() {
  const jspdf = window.jspdf;
  if (!jspdf) {
    alert('PDF library is still loading. Please try again in a moment.');
    return;
  }

  const doc = new jspdf.jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  // ── Header ──
  const labTitle = document.title || 'UBUS 670 Lab';

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 16, 46); // NIU Red
  doc.text('UBUS 670: AI for Business Leaders', margin, y);
  y += 8;

  doc.setFontSize(13);
  doc.setTextColor(29, 66, 138); // NIU Navy
  const titleLines = doc.splitTextToSize(labTitle, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6 + 4;

  // ── Student info ──
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80);

  const studentName = currentUser ? (currentUser.displayName || '—') : '—';
  const studentEmail = currentUser ? (currentUser.email || '—') : '—';
  doc.text(`Student: ${studentName}`, margin, y);
  y += 5;
  doc.text(`Email: ${studentEmail}`, margin, y);
  y += 5;

  // ── Progress ──
  const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
  const total = document.querySelectorAll('input[type="checkbox"]').length;
  doc.text(`Date: ${new Date().toLocaleDateString()}    Progress: ${checked}/${total} steps`, margin, y);
  y += 5;

  // ── Divider ──
  doc.setDrawColor(200, 16, 46);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ── Reflections ──
  const textareas = document.querySelectorAll('.reflection-area textarea');
  doc.setFontSize(11);

  textareas.forEach((textarea, index) => {
    // Get label from the DOM
    const labelEl = textarea.closest('.reflection-area').querySelector('label');
    const label = labelEl ? labelEl.textContent.trim() : `Response ${index + 1}`;
    const value = textarea.value.trim() || '[No response provided]';

    // Page break check
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 66, 138);
    const labelLines = doc.splitTextToSize(label, maxWidth);
    doc.text(labelLines, margin, y);
    y += labelLines.length * 5 + 3;

    // Value — render in chunks to handle page breaks
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);
    const valueLines = doc.splitTextToSize(value, maxWidth);
    const lineHeight = 5;

    let lineIdx = 0;
    while (lineIdx < valueLines.length) {
      const availableLines = Math.floor((280 - y) / lineHeight);
      if (availableLines <= 0) {
        doc.addPage();
        y = 20;
        continue;
      }
      const chunk = valueLines.slice(lineIdx, lineIdx + availableLines);
      doc.text(chunk, margin, y);
      y += chunk.length * lineHeight;
      lineIdx += chunk.length;
      if (lineIdx < valueLines.length) {
        doc.addPage();
        y = 20;
      }
    }
    y += 10;
  });

  // ── Footer divider ──
  if (y > 270) { doc.addPage(); y = 20; }
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(`Generated: ${new Date().toLocaleString()} | UBUS 670 - Northern Illinois University`, margin, y);

  // ── Save ──
  const filename = labId ? `${labId.replace(/\s+/g, '_')}_lab_submission.pdf` : 'lab_submission.pdf';
  try {
    doc.save(filename);
  } catch (e) {
    // Fallback: open as data URI if blob download fails (Safari/Edge)
    console.warn('[lab-firebase] doc.save() failed, using fallback:', e);
    const pdfData = doc.output('datauristring');
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Update button text
  const dlBtn = document.getElementById('download-pdf-btn');
  if (dlBtn) {
    dlBtn.textContent = 'PDF Downloaded';
    setTimeout(() => { dlBtn.textContent = 'Download as PDF'; }, 3000);
  }
}

// ─── Override downloadPDF / generatePDF / submitLab ─────────────────────────
function overrideDownloadPDF() {
  const fnNames = ['downloadPDF', 'generatePDF', 'submitLab'];

  for (const fnName of fnNames) {
    if (typeof window[fnName] === 'function') {
      const orig = window[fnName];
      window[fnName] = function () {
        // Run the original function (e.g. submitLab's tracking logic)
        orig.apply(this, arguments);
        // Generate the PDF directly
        generateLabPDF();

        // Mark as submitted if user is signed in
        if (currentUser && !isSubmitted) {
          markAsSubmitted().catch(err => {
            console.error('[lab-firebase] Submission failed:', err);
            showSaveStatus('Submission save failed — your PDF was still downloaded', true);
          });
        }
      };
    }
  }
}

async function markAsSubmitted() {
  // Prevent any pending auto-save from reverting the submission
  clearTimeout(saveTimeout);
  isSubmitted = true;

  const ref = getDocRef();
  if (!ref) return;

  const { checkboxes, textareas } = gatherState();
  const submittedNow = new Date();

  try {
    await ref.set({
      userId: currentUser.uid,
      email: currentUser.email,
      labId: labId,
      status: 'submitted',
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastSaved: firebase.firestore.FieldValue.serverTimestamp(),
      checkboxes: checkboxes,
      textareas: textareas
    });

    showSaveStatus('Lab submitted!');

    // Lock with local timestamp (server timestamp isn't available client-side yet)
    setTimeout(() => lockLab({ toDate: () => submittedNow }), 1000);
  } catch (err) {
    // Revert flag so student can retry
    isSubmitted = false;
    throw err;
  }
}
