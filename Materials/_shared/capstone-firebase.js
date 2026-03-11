/**
 * capstone-firebase.js — Firebase Auth + Team Management + Submission + Scoring + Leaderboard
 *
 * Powers the Days 8-9 Capstone Competition for UBUS 670.
 * Requires:
 *   - Firebase project with Google Auth + Firestore enabled
 *   - Pre-created team documents in capstone_teams collection
 *   - Host page with expected DOM elements (see competition.html)
 *
 * Graceful degradation: if Firebase fails to load, competition page shows error message.
 */

// ─── Firebase Config ────────────────────────────────────────────────────────
const CF_CONFIG = {
  apiKey: "AIzaSyD8vXhY9UYcodVB4KLTV10AGuZUKtNUSJ0",
  authDomain: "ubus-670-labs.firebaseapp.com",
  projectId: "ubus-670-labs",
  storageBucket: "ubus-670-labs.firebasestorage.app",
  messagingSenderId: "27233273185",
  appId: "1:27233273185:web:37a2cfdace34cb70747120"
};

// ─── Constants ──────────────────────────────────────────────────────────────
const CF_ALLOWED_DOMAINS = ['niu.edu', 'students.niu.edu'];
const CF_ALLOWED_EMAILS = ['matthew.david.pickard@gmail.com', '1999aparnaiyer@gmail.com', 'z2049004students.niu.edu@gmail.com', 'nickcanady2025@gmail.com'];
const CF_INSTRUCTOR_EMAILS = ['mpickard@niu.edu', 'matthew.david.pickard@gmail.com'];
const CF_MAX_ATTEMPTS = 3;
const CF_MAX_TEAM_SIZE = 3;
const CF_COLLECTION = 'capstone_teams';
const CF_SETTINGS_DOC = 'capstone_settings';

// ─── State ──────────────────────────────────────────────────────────────────
let cfDb = null;
let cfAuth = null;
let cfUser = null;
let cfTeamId = null;
let cfTeamData = null;
let cfIsInstructor = false;
let cfGroundTruth = null;
let cfLeaderboardUnsub = null;

// ─── Bootstrap ──────────────────────────────────────────────────────────────
(async function cfInit() {
  try {
    await cfLoadSDKs();
    cfInitFirebase();

    if (document.readyState === 'loading') {
      await new Promise(r => document.addEventListener('DOMContentLoaded', r));
    }

    cfInjectAuthUI();
    cfAuth.onAuthStateChanged(cfOnAuthChanged);
  } catch (err) {
    console.error('[capstone] Init failed:', err);
    cfShowError('Failed to initialize. Please refresh the page.');
  }
})();

// ─── Load Firebase SDKs ─────────────────────────────────────────────────────
function cfLoadSDKs() {
  return new Promise((resolve, reject) => {
    if (window.firebase && firebase.app && firebase.firestore) {
      resolve(); return;
    }
    const urls = [
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
    ];
    function loadNext(i) {
      if (i >= urls.length) { resolve(); return; }
      const s = document.createElement('script');
      s.src = urls[i];
      s.onload = () => loadNext(i + 1);
      s.onerror = () => reject(new Error(`Failed to load ${urls[i]}`));
      document.head.appendChild(s);
    }
    loadNext(0);
  });
}

function cfInitFirebase() {
  if (!firebase.apps.length) firebase.initializeApp(CF_CONFIG);
  cfAuth = firebase.auth();
  cfDb = firebase.firestore();
}

// ─── Auth UI ────────────────────────────────────────────────────────────────
function cfInjectAuthUI() {
  const nav = document.querySelector('.nav-pills');
  if (!nav || document.getElementById('cf-auth-ui')) return;

  const el = document.createElement('div');
  el.id = 'cf-auth-ui';
  el.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:12px;';
  el.innerHTML = `
    <button id="cf-sign-in-btn" style="
      padding:8px 16px;border-radius:6px;border:none;
      background:#1D428A;color:white;font-weight:600;font-size:13px;
      cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;
    ">Sign In</button>
    <span id="cf-user-info" style="
      font-size:12px;color:#666;font-family:'Montserrat',sans-serif;display:none;
    "></span>
    <button id="cf-sign-out-btn" style="
      padding:6px 12px;border-radius:6px;border:1px solid #ddd;
      background:white;color:#666;font-size:12px;cursor:pointer;
      font-family:'Montserrat',sans-serif;display:none;transition:all 0.2s;
    ">Sign Out</button>
  `;
  nav.appendChild(el);
  document.getElementById('cf-sign-in-btn').addEventListener('click', cfSignIn);
  document.getElementById('cf-sign-out-btn').addEventListener('click', cfSignOut);
}

// ─── Auth Handlers ──────────────────────────────────────────────────────────
async function cfSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ hd: 'niu.edu' });
  try {
    const result = await cfAuth.signInWithPopup(provider);
    if (!cfIsAllowedEmail(result.user.email || '')) {
      await cfAuth.signOut();
      alert('Please sign in with your NIU email address.');
    }
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      console.error('[capstone] Sign-in error:', err);
      alert('Sign-in failed. Please try again.');
    }
  }
}

async function cfSignOut() {
  try { await cfAuth.signOut(); } catch (err) {
    console.error('[capstone] Sign-out error:', err);
  }
}

function cfIsAllowedEmail(email) {
  const lower = email.toLowerCase();
  if (CF_ALLOWED_EMAILS.includes(lower)) return true;
  return CF_ALLOWED_DOMAINS.includes(lower.split('@')[1]);
}

async function cfOnAuthChanged(user) {
  cfUser = user;
  cfUpdateAuthUI(user);

  if (user) {
    cfIsInstructor = CF_INSTRUCTOR_EMAILS.includes(user.email.toLowerCase());
    await cfFindTeam();

    const gate = document.getElementById('cf-sign-in-gate');
    if (gate) gate.style.display = 'none';

    if (cfTeamId) {
      cfShowTeamUI();
      cfShowCompetitionContent();
      cfStartLeaderboard();
      if (cfIsInstructor) cfShowAdminPanel();
    } else {
      cfShowTeamPicker();
    }
  } else {
    cfTeamId = null;
    cfTeamData = null;
    cfIsInstructor = false;
    if (cfLeaderboardUnsub) { cfLeaderboardUnsub(); cfLeaderboardUnsub = null; }
    cfHideCompetitionContent();
    const gate = document.getElementById('cf-sign-in-gate');
    if (gate) gate.style.display = '';
  }
}

function cfUpdateAuthUI(user) {
  const btn = document.getElementById('cf-sign-in-btn');
  const info = document.getElementById('cf-user-info');
  const out = document.getElementById('cf-sign-out-btn');
  if (!btn) return;
  if (user) {
    btn.style.display = 'none';
    info.style.display = 'inline';
    info.textContent = user.email;
    out.style.display = 'inline-block';
  } else {
    btn.style.display = 'flex';
    info.style.display = 'none';
    out.style.display = 'none';
  }
}

// ─── Team Management ────────────────────────────────────────────────────────
async function cfFindTeam() {
  if (!cfUser) return;
  try {
    const snap = await cfDb.collection(CF_COLLECTION)
      .where('members', 'array-contains', cfUser.email.toLowerCase())
      .limit(1).get();
    if (!snap.empty) {
      cfTeamId = snap.docs[0].id;
      cfTeamData = snap.docs[0].data();
    } else {
      cfTeamId = null;
      cfTeamData = null;
    }
  } catch (err) {
    console.error('[capstone] Failed to find team:', err);
  }
}

async function cfShowTeamPicker() {
  const container = document.getElementById('cf-team-picker');
  if (!container) return;
  container.style.display = '';
  container.innerHTML = `
    <div style="text-align:center;padding:20px;">
      <p style="color:#C8102E;font-weight:600;font-family:Montserrat,sans-serif;">
        Teams have already been assigned.</p>
      <p style="color:#666;">If you don't see your team, make sure you're signed in with the same email
        your instructor used to register you. Contact your instructor if you need help.</p>
    </div>`;
}

async function cfJoinTeam(teamId) {
  if (!cfUser) return;
  try {
    await cfDb.runTransaction(async (tx) => {
      const ref = cfDb.collection(CF_COLLECTION).doc(teamId);
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Team not found');
      const data = snap.data();
      const members = data.members || [];
      if (members.length >= CF_MAX_TEAM_SIZE) throw new Error('Team is full');
      if (members.includes(cfUser.email.toLowerCase())) throw new Error('Already on this team');
      tx.update(ref, { members: [...members, cfUser.email.toLowerCase()] });
    });
    await cfFindTeam();
    const picker = document.getElementById('cf-team-picker');
    if (picker) picker.style.display = 'none';
    cfShowTeamUI();
    cfShowCompetitionContent();
    cfStartLeaderboard();
    if (cfIsInstructor) cfShowAdminPanel();
  } catch (err) {
    alert(err.message || 'Failed to join team.');
  }
}

function cfShowTeamUI() {
  const el = document.getElementById('cf-team-info');
  if (!el || !cfTeamData) return;
  el.style.display = '';
  el.innerHTML = `
    <span style="font-family:Montserrat,sans-serif;font-weight:700;color:#1D428A;">${cfEsc(cfTeamData.teamName)}</span>
    <span style="color:#666;font-size:0.85rem;margin-left:8px;">
      Attempts: ${cfTeamData.attemptsUsed || 0}/${CF_MAX_ATTEMPTS}
      ${cfTeamData.bestScore != null ? ` | Best: ${cfTeamData.bestScore.toFixed(1)} pts` : ''}
    </span>
  `;
}

// ─── Ground Truth (Obfuscated) ──────────────────────────────────────────────
const _cf_a = 'eyJ0MTAiOlsiQy0xMiIsIkMtMjEiLCJDLTA2IiwiQy0xOCIsIkMtMDMiLCJDLTI0IiwiQy0wOCIsIkMtMDkiLCJDLTE2IiwiQy0wNSJdLCJ0MyI6eyIxIjoiQy0xMiIsIjIiOiJDLTIxIiwiMyI6IkMtMDYifSwiYjUiOlsiQy0yMyIsIkMtMDciLCJDLTI5IiwiQy0xMyIsIkMtMzAiXSwiYjgiOlsiQy0wMiIsIkMtMjYiLCJDLTI3IiwiQy0yMyIsIkMtMDciLCJDLTI5IiwiQy0xMyIsIkMtMzAiXSwiZmwiOlt7ImlkIjoiQy0xNCIsImt3IjpbImdhcCIsIjE0IG1vbnRoIiwiMTUgbW9udGgiLCJ1bmV4cGxhaW5lZCIsIm5vIHdvcmsiLCJtaXNzaW5nIiwiYnJlYWsiXSwic3YiOiJtaW5vciJ9LHsiaWQiOiJDLTEwIiwia3ciOlsiaW5mbGF0ZWQiLCJleGFnZ2VyYXRlZCIsIm9wZXJhdGlvbnMgZGlyZWN0b3IiLCJyZWdpb25hbCIsImZyb3plbiB5b2d1cnQiLCJ0aXRsZSJdLCJzdiI6Im1pbm9yIn0seyJpZCI6IkMtMTUiLCJrdyI6WyJjb3B5IiwiaWRlbnRpY2FsIiwic2FtZSIsImR1cGxpY2F0ZSIsImNvcGllZCIsImZhYnJpY2F0Il0sInN2IjoibWlub3IifSx7ImlkIjoiQy0yNSIsImt3IjpbImNvcHkiLCJpZGVudGljYWwiLCJzYW1lIiwiZHVwbGljYXRlIiwiY29waWVkIiwiZmFicmljYXQiXSwic3YiOiJtaW5vciJ9LHsiaWQiOiJDLTAyIiwia3ciOlsiaW5mbGF0ZWQiLCJleGFnZ2VyYXRlZCIsImN1c3';
const _cf_b = 'RvbWVyIHJlbGF0aW9ucyIsImhlYWQgb2YiLCJsYXVuZHJvbWF0IiwibGF1bmRyeSIsInRpdGxlIl0sInN2IjoibWlub3IifSx7ImlkIjoiQy0yNyIsImt3IjpbImdhcCIsIjE2IG1vbnRoIiwidW5leHBsYWluZWQiLCJubyB3b3JrIiwibWlzc2luZyIsImJyZWFrIl0sInN2IjoibWlub3IifSx7ImlkIjoiQy0wNyIsImt3IjpbImdhcCIsIjEzIG1vbnRoIiwiMTYgbW9udGgiLCJ1bmV4cGxhaW5lZCIsIm5vIHdvcmsiLCJtaXNzaW5nIiwiYnJlYWsiXSwic3YiOiJtaW5vciJ9LHsiaWQiOiJDLTIzIiwia3ciOlsiY29udHJhZGljdCIsIm92ZXJsYXAiLCJzYW1lIHRpbWUiLCJib3RoIGZ1bGwiLCJpbXBvc3NpYmxlIiwic2ltdWx0YW5lb3VzIl0sInN2IjoiZGlzcXVhbGlmeWluZyJ9LHsiaWQiOiJDLTIzIiwia3ciOlsiY29udHJhZGljdCIsIm92ZXJsYXAiLCJkYXRlcyIsImJlZm9yZSIsInN0YXJ0Iiwib3ZlcmxhcHBpbmciXSwic3YiOiJkaXNxdWFsaWZ5aW5nIn0seyJpZCI6IkMtMjkiLCJrdyI6WyJmYWJyaWNhdCIsImZha2UiLCJkb2Vzbid0IGV4aXN0IiwiZG9lcyBub3QgZXhpc3QiLCJub3QgcmVhbCIsImdyYW5kdmlldyJdLCJzdiI6ImRpc3F1YWxpZnlpbmcifSx7ImlkIjoiQy0yOSIsImt3IjpbImZhYnJpY2F0IiwiZmFrZSIsImRvZXNuJ3QgZXhpc3QiLCJkb2VzIG5vdCBleGlzdCIsIm5vdCBy';
const _cf_c = 'ZWFsIiwiYWxsaWVkIGNvbnN1bWVyIl0sInN2IjoiZGlzcXVhbGlmeWluZyJ9LHsiaWQiOiJDLTEzIiwia3ciOlsiZmFrZSIsImRvZXNuJ3QgZXhpc3QiLCJkb2VzIG5vdCBleGlzdCIsIm5vdCByZWFsIiwicGFjaWZpYyBub3J0aHdlc3QiLCJidXNpbmVzcyBpbnN0aXR1dGUiXSwic3YiOiJkaXNxdWFsaWZ5aW5nIn0seyJpZCI6IkMtMzAiLCJrdyI6WyJmYWtlIiwiZG9lc24ndCBleGlzdCIsImRvZXMgbm90IGV4aXN0Iiwibm90IHJlYWwiLCJncmVhdCBsYWtlcyBwb2x5dGVjaG5pYyJdLCJzdiI6ImRpc3F1YWxpZnlpbmcifSx7ImlkIjoiQy0zMCIsImt3IjpbImNvbnRyYWRpY3QiLCI1IHllYXIiLCJmaXZlIHllYXIiLCJpbXBvc3NpYmxlIiwiZ3JhZHVhdGVkIiwiaW5jb25zaXN0ZW50Il0sInN2IjoiZGlzcXVhbGlmeWluZyJ9XSwiYnAiOlt7ImlkcyI6WyJDLTA0IiwiQy0yMiJdLCJrdyI6WyJzaW1pbGFyIiwic2FtZSIsImlkZW50aWNhbCIsIm1hdGNoZWQiLCJjb21wYXJhYmxlIiwiZXF1YWwiLCJlcXVpdmFsZW50IiwiYmlhcyIsInBhaXIiXX0seyJpZHMiOlsiQy0xOCIsIkMtMDMiXSwia3ciOlsic2ltaWxhciIsInNhbWUiLCJpZGVudGljYWwiLCJtYXRjaGVkIiwiY29tcGFyYWJsZSIsImVxdWFsIiwiZXF1aXZhbGVudCIsImJpYXMiLCJwYWlyIl19LHsiaWRzIjpbIkMtMDIiLCJDLTI2Il0sIm';
const _cf_d = 't3IjpbInNpbWlsYXIiLCJzYW1lIiwiaWRlbnRpY2FsIiwibWF0Y2hlZCIsImNvbXBhcmFibGUiLCJlcXVhbCIsImVxdWl2YWxlbnQiLCJiaWFzIiwicGFpciJdfSx7ImlkcyI6WyJDLTAxIiwiQy0xNyJdLCJrdyI6WyJzaW1pbGFyIiwic2FtZSIsImlkZW50aWNhbCIsIm1hdGNoZWQiLCJjb21wYXJhYmxlIiwiZXF1YWwiLCJlcXVpdmFsZW50IiwiYmlhcyIsInBhaXIiXX0seyJpZHMiOlsiQy0wOSIsIkMtMTYiXSwia3ciOlsic2ltaWxhciIsInNhbWUiLCJpZGVudGljYWwiLCJtYXRjaGVkIiwiY29tcGFyYWJsZSIsImVxdWFsIiwiZXF1aXZhbGVudCIsImJpYXMiLCJwYWlyIiwiZ2VuZGVyIl19XSwicHQiOlt7ImlkcyI6WyJDLTA4IiwiQy0xOSIsIkMtMjciXSwia3ciOlsibm9ydGhmaWVsZCIsImNhcmVlciBjZW50ZXIiLCJjYXJlZXIgc2VydmljZXMiLCJmb290ZXIiLCJ0ZW1wbGF0ZSIsInByZXBhcmVkIGJ5Il19LHsiaWRzIjpbIkMtMDUiLCJDLTE0IiwiQy0wNyJdLCJrdyI6WyJsYWtlc2lkZSIsImNsb3NlZCIsImJhbmtydXB0Iiwic2h1dCBkb3duIiwiZGVmdW5jdCIsInNhbWUgZW1wbG95ZXIiXX0seyJpZHMiOlsiQy0yNSIsIkMtMTUiXSwia3ciOlsiY29weSIsImlkZW50aWNhbCIsInNhbWUgc2tpbGxzIiwiZHVwbGljYXRlIiwid29yZCBmb3Igd29yZCIsInNraWxscyBzZWN0aW9uIl19XX0K';

function cfDecodeGT() {
  if (cfGroundTruth) return cfGroundTruth;
  try {
    cfGroundTruth = JSON.parse(atob(_cf_a + _cf_b + _cf_c + _cf_d));
    return cfGroundTruth;
  } catch (e) {
    console.error('[capstone] GT decode failed');
    return null;
  }
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────
function cfScoreSubmission(submission) {
  const gt = cfDecodeGT();
  if (!gt) return { total: 0, error: 'Scoring unavailable' };

  const scores = {
    top10: cfScoreTop10(submission, gt),
    bottom5: cfScoreBottom5(submission, gt),
    flags: cfScoreFlagsAndSeverity(submission, gt),
    biasPairs: cfScoreBiasPairs(submission, gt),
    patterns: cfScorePatterns(submission, gt)
  };
  scores.total = Math.min(100, Math.max(0,
    scores.top10.points + scores.bottom5.points + scores.flags.points +
    scores.biasPairs.points + scores.patterns.points
  ));
  return scores;
}

function cfScoreTop10(sub, gt) {
  const result = { points: 0, setMatches: 0, positionBonus: 0, details: [] };
  const subIds = (sub.top_10_hire || []).map(e => (e.id || '').toUpperCase());
  const gtSet = new Set(gt.t10.map(id => id.toUpperCase()));

  // Set membership: 2.5 pts per correct ID in top 10
  subIds.forEach(id => {
    if (gtSet.has(id)) { result.setMatches++; result.details.push(`${id}: correct`); }
  });
  result.points = result.setMatches * 2.5;

  // Position accuracy bonus for top 3
  let exactTop3 = 0;
  for (let rank = 1; rank <= 3; rank++) {
    const subEntry = (sub.top_10_hire || []).find(e => Number(e.rank) === rank);
    if (subEntry && subEntry.id && subEntry.id.toUpperCase() === gt.t3[String(rank)].toUpperCase()) {
      exactTop3++;
    }
  }
  result.positionBonus = exactTop3 === 3 ? 5 : exactTop3 === 2 ? 2 : exactTop3 === 1 ? 1 : 0;
  result.points += result.positionBonus;
  return result;
}

function cfScoreBottom5(sub, gt) {
  const result = { points: 0, strictMatches: 0, partialMatches: 0, details: [] };
  const gtStrict = new Set(gt.b5.map(id => id.toUpperCase()));
  const gtPartial = new Set(gt.b8.map(id => id.toUpperCase()));
  const subIds = (sub.bottom_5 || []).map(e => (e.id || '').toUpperCase());

  subIds.forEach(id => {
    if (gtStrict.has(id)) {
      result.strictMatches++;
      result.details.push(`${id}: strict match (2 pts)`);
    } else if (gtPartial.has(id)) {
      result.partialMatches++;
      result.details.push(`${id}: partial match (1 pt)`);
    }
  });
  result.points = Math.min(10, result.strictMatches * 2 + result.partialMatches * 1);
  return result;
}

function cfScoreFlagsAndSeverity(sub, gt) {
  const result = { points: 0, fullCredit: 0, partialCredit: 0, details: [] };
  const subFlags = sub.flags || [];

  gt.fl.forEach((gtFlag, i) => {
    const gtId = gtFlag.id.toUpperCase();
    // Find matching submission flag (same candidate ID)
    const match = subFlags.find(sf =>
      (sf.candidate_id || '').toUpperCase() === gtId &&
      cfHasKeywordMatch(sf.flag || '', gtFlag.kw)
    );

    if (match) {
      const severityMatch = (match.severity || '').toLowerCase() === gtFlag.sv;
      if (severityMatch) {
        result.fullCredit++;
        result.points += 30 / 14;
        result.details.push(`Flag ${i+1} (${gtId}): full credit`);
      } else {
        result.partialCredit++;
        result.points += 1.0;
        result.details.push(`Flag ${i+1} (${gtId}): partial — wrong severity (1 pt)`);
      }
    }
  });
  result.points = Math.min(30, result.points);
  return result;
}

function cfScoreBiasPairs(sub, gt) {
  const result = { points: 0, fullCredit: 0, partialCredit: 0, details: [] };
  const subPairs = sub.bias_pairs || [];

  gt.bp.forEach((gtPair, i) => {
    const gtIds = gtPair.ids.map(id => id.toUpperCase());
    // Find matching submission pair
    const match = subPairs.find(sp => {
      const spIds = (sp.candidate_ids || []).map(id => (id || '').toUpperCase());
      const bothMatch = gtIds.every(gid => spIds.includes(gid));
      const hasObservation = cfHasKeywordMatch(sp.observation || '', gtPair.kw);
      return bothMatch && hasObservation;
    });

    if (match) {
      result.fullCredit++;
      result.points += 3;
      result.details.push(`Pair ${i+1}: full credit (3 pts)`);
    } else {
      // Check partial: one ID + observation keyword
      const partial = subPairs.find(sp => {
        const spIds = (sp.candidate_ids || []).map(id => (id || '').toUpperCase());
        const oneMatch = gtIds.some(gid => spIds.includes(gid));
        const hasObs = cfHasKeywordMatch(sp.observation || '', gtPair.kw);
        return oneMatch && hasObs;
      });
      if (partial) {
        result.partialCredit++;
        result.points += 1;
        result.details.push(`Pair ${i+1}: partial — one ID match (1 pt)`);
      }
    }
  });
  result.points = Math.min(15, result.points);
  return result;
}

function cfScorePatterns(sub, gt) {
  const result = { points: 0, found: 0, details: [] };
  const subPatterns = sub.patterns || [];

  gt.pt.forEach((gtPat, i) => {
    const gtIds = gtPat.ids.map(id => id.toUpperCase());
    // Find a submission pattern that mentions 2+ candidate IDs and has keyword match
    const match = subPatterns.find(sp => {
      const text = (typeof sp === 'string' ? sp : '').toUpperCase();
      const idMatches = gtIds.filter(gid => text.includes(gid)).length;
      const hasKeyword = cfHasKeywordMatch(typeof sp === 'string' ? sp : '', gtPat.kw);
      return idMatches >= 2 && hasKeyword;
    });

    if (match) {
      result.found++;
      result.points += 5;
      result.details.push(`Pattern ${i+1}: found (5 pts)`);
    }
  });
  result.points = Math.min(15, result.points);
  return result;
}

function cfHasKeywordMatch(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

// ─── Submission Validation ──────────────────────────────────────────────────
function cfValidateSubmission(jsonStr) {
  // Stage 1: Parse
  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    return { valid: false, error: `Invalid JSON: ${e.message}` };
  }

  // Guard: JSON.parse can return null, numbers, strings, arrays
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Invalid JSON: expected an object, got ' + (data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data) };
  }

  // Stage 2: Schema validation
  const errors = [];
  const idPattern = /^C-\d{2}$/i;

  if (!Array.isArray(data.top_10_hire) || data.top_10_hire.length !== 10) {
    errors.push('top_10_hire must be an array of exactly 10 entries');
  } else {
    const t10Seen = new Set();
    data.top_10_hire.forEach((entry, i) => {
      if (!entry.id || !idPattern.test(entry.id)) errors.push(`top_10_hire[${i}]: invalid id (expected C-XX format)`);
      else if (t10Seen.has(entry.id.toUpperCase())) errors.push(`top_10_hire[${i}]: duplicate id ${entry.id}`);
      else t10Seen.add(entry.id.toUpperCase());
      if (entry.rank == null) errors.push(`top_10_hire[${i}]: missing rank`);
      if (!entry.reason) errors.push(`top_10_hire[${i}]: missing reason`);
    });
  }

  if (!Array.isArray(data.bottom_5) || data.bottom_5.length !== 5) {
    errors.push('bottom_5 must be an array of exactly 5 entries');
  } else {
    const b5Seen = new Set();
    data.bottom_5.forEach((entry, i) => {
      if (!entry.id || !idPattern.test(entry.id)) errors.push(`bottom_5[${i}]: invalid id`);
      else if (b5Seen.has(entry.id.toUpperCase())) errors.push(`bottom_5[${i}]: duplicate id ${entry.id}`);
      else b5Seen.add(entry.id.toUpperCase());
      if (!entry.reason) errors.push(`bottom_5[${i}]: missing reason`);
    });
  }

  if (!Array.isArray(data.flags)) {
    errors.push('flags must be an array');
  } else {
    data.flags.forEach((entry, i) => {
      if (!entry.candidate_id || !idPattern.test(entry.candidate_id)) errors.push(`flags[${i}]: invalid candidate_id`);
      if (!entry.flag) errors.push(`flags[${i}]: missing flag description`);
      if (!['minor', 'disqualifying'].includes((entry.severity || '').toLowerCase())) {
        errors.push(`flags[${i}]: severity must be "minor" or "disqualifying"`);
      }
    });
  }

  if (!Array.isArray(data.bias_pairs)) {
    errors.push('bias_pairs must be an array');
  } else {
    data.bias_pairs.forEach((entry, i) => {
      if (!Array.isArray(entry.candidate_ids) || entry.candidate_ids.length < 2) {
        errors.push(`bias_pairs[${i}]: candidate_ids must have at least 2 entries`);
      }
      if (!entry.observation) errors.push(`bias_pairs[${i}]: missing observation`);
    });
  }

  if (!Array.isArray(data.patterns)) {
    errors.push('patterns must be an array');
  } else {
    data.patterns.forEach((entry, i) => {
      if (typeof entry !== 'string') errors.push(`patterns[${i}]: must be a string, not ${typeof entry}`);
    });
  }

  if (errors.length > 0) {
    return { valid: false, error: 'Validation errors:\n' + errors.join('\n') };
  }

  return { valid: true, data };
}

// ─── Submission Flow ────────────────────────────────────────────────────────
function cfValidateAndPreview() {
  const textarea = document.getElementById('cf-json-input');
  const previewEl = document.getElementById('cf-submission-preview');
  const submitBtn = document.getElementById('cf-submit-btn');
  if (!textarea || !previewEl) return;

  const result = cfValidateSubmission(textarea.value);
  if (!result.valid) {
    previewEl.innerHTML = `<div style="color:#C8102E;font-weight:600;white-space:pre-wrap;">${cfEsc(result.error)}</div>`;
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const d = result.data;
  let html = '<div style="font-family:Montserrat,sans-serif;">';
  html += '<h4 style="color:#1D428A;margin:0 0 10px;">Submission Preview</h4>';

  html += '<p><strong>Top 10:</strong></p><ol>';
  d.top_10_hire.sort((a, b) => a.rank - b.rank).forEach(e => {
    html += `<li><strong>${cfEsc(e.id)}</strong> — ${cfEsc(e.reason)}</li>`;
  });
  html += '</ol>';

  html += '<p><strong>Bottom 5:</strong></p><ul>';
  d.bottom_5.forEach(e => {
    html += `<li><strong>${cfEsc(e.id)}</strong> — ${cfEsc(e.reason)}</li>`;
  });
  html += '</ul>';

  html += `<p><strong>Flags:</strong> ${d.flags.length} reported</p>`;
  html += `<p><strong>Bias Pairs:</strong> ${d.bias_pairs.length} reported</p>`;
  html += `<p><strong>Patterns:</strong> ${d.patterns.length} reported</p>`;
  html += '</div>';

  previewEl.innerHTML = html;
  if (submitBtn) submitBtn.disabled = false;
  // Store validated data for submission
  previewEl.dataset.validJson = JSON.stringify(d);
}

async function cfSubmitResults() {
  const previewEl = document.getElementById('cf-submission-preview');
  const submitBtn = document.getElementById('cf-submit-btn');
  if (!previewEl || !previewEl.dataset.validJson || !cfTeamId) return;

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }
  const submission = JSON.parse(previewEl.dataset.validJson);

  try {
    // Check if competition is frozen
    const settingsSnap = await cfDb.collection('settings').doc(CF_SETTINGS_DOC).get();
    if (settingsSnap.exists && settingsSnap.data().competitionFrozen) {
      throw new Error('Competition is closed. No more submissions are accepted.');
    }

    const result = await cfDb.runTransaction(async (tx) => {
      const ref = cfDb.collection(CF_COLLECTION).doc(cfTeamId);
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('Team not found');
      const data = snap.data();

      if ((data.attemptsUsed || 0) >= CF_MAX_ATTEMPTS) {
        throw new Error('Maximum attempts reached (3/3). No more submissions allowed.');
      }

      const scores = cfScoreSubmission(submission);
      const attemptNum = (data.attemptsUsed || 0) + 1;

      const attempt = {
        attempt: attemptNum,
        submission,
        scores: {
          top10: scores.top10.points,
          bottom5: scores.bottom5.points,
          flags: scores.flags.points,
          biasPairs: scores.biasPairs.points,
          patterns: scores.patterns.points,
          total: scores.total
        },
        submittedAt: new Date().toISOString(),
        submittedBy: cfUser.email
      };

      const newAttempts = [...(data.attempts || []), attempt];
      const bestScore = Math.max(scores.total, ...(data.attempts || []).map(a => a.scores.total));

      tx.update(ref, {
        attempts: newAttempts,
        attemptsUsed: attemptNum,
        bestScore,
        bestAttempt: scores.total >= bestScore ? attemptNum : (data.bestAttempt || 1),
        lastSubmitted: firebase.firestore.FieldValue.serverTimestamp()
      });

      return { scores, attemptNum };
    });

    // Update local state
    cfTeamData.attemptsUsed = result.attemptNum;
    cfTeamData.bestScore = Math.max(result.scores.total, cfTeamData.bestScore || 0);
    cfShowTeamUI();
    cfShowScoreBreakdown(result.scores, result.attemptNum);

  } catch (err) {
    alert(err.message || 'Submission failed. Please try again.');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit (uses 1 attempt)'; }
  }
}

function cfShowScoreBreakdown(scores, attemptNum) {
  const el = document.getElementById('cf-score-breakdown');
  if (!el) return;
  el.style.display = '';

  el.innerHTML = `
    <h3 style="font-family:Montserrat,sans-serif;color:#1D428A;margin:0 0 15px;">
      Attempt ${attemptNum} Results
    </h3>
    <table style="width:100%;border-collapse:collapse;font-size:0.95rem;">
      <tr style="background:#f8f8f8;">
        <td style="padding:10px 14px;font-weight:600;">Top 10 Ranking</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;color:#C8102E;">
          ${scores.top10.points.toFixed(1)} / 30
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:600;">Bottom 5 Identification</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;color:#C8102E;">
          ${scores.bottom5.points.toFixed(1)} / 10
        </td>
      </tr>
      <tr style="background:#f8f8f8;">
        <td style="padding:10px 14px;font-weight:600;">Red Flags + Severity</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;color:#C8102E;">
          ${scores.flags.points.toFixed(1)} / 30
        </td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:600;">Bias Pair Detection</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;color:#C8102E;">
          ${scores.biasPairs.points.toFixed(1)} / 15
        </td>
      </tr>
      <tr style="background:#f8f8f8;">
        <td style="padding:10px 14px;font-weight:600;">Pattern Discovery</td>
        <td style="padding:10px 14px;text-align:right;font-weight:700;color:#C8102E;">
          ${scores.patterns.points.toFixed(1)} / 15
        </td>
      </tr>
      <tr style="border-top:3px solid #1D428A;">
        <td style="padding:12px 14px;font-weight:700;font-size:1.1rem;">TOTAL</td>
        <td style="padding:12px 14px;text-align:right;font-weight:700;font-size:1.3rem;color:#C8102E;">
          ${scores.total.toFixed(1)} / 100
        </td>
      </tr>
    </table>
    <p style="color:#666;font-size:0.85rem;margin-top:12px;">
      Attempts used: ${cfTeamData.attemptsUsed}/${CF_MAX_ATTEMPTS}
      ${cfTeamData.attemptsUsed < CF_MAX_ATTEMPTS ? ' — you can submit again to improve your score.' : ' — no more attempts remaining.'}
    </p>
  `;
}

// ─── Leaderboard ────────────────────────────────────────────────────────────
function cfStartLeaderboard() {
  if (cfLeaderboardUnsub) cfLeaderboardUnsub();
  cfLeaderboardUnsub = cfDb.collection(CF_COLLECTION)
    .onSnapshot(snap => {
      const teams = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.bestScore != null && d.bestScore > 0) {
          teams.push({ id: doc.id, name: d.teamName, score: d.bestScore, attempts: d.attemptsUsed || 0 });
        }
      });
      teams.sort((a, b) => b.score - a.score);
      cfRenderLeaderboard(teams);
    }, err => {
      console.error('[capstone] Leaderboard error:', err);
    });
}

function cfRenderLeaderboard(teams) {
  const el = document.getElementById('cf-leaderboard');
  if (!el) return;

  if (teams.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No scores yet. Be the first to submit!</p>';
    return;
  }

  let html = `
    <table style="width:100%;border-collapse:collapse;font-family:Montserrat,sans-serif;font-size:0.9rem;">
      <thead>
        <tr style="background:#1D428A;color:white;">
          <th style="padding:10px 14px;text-align:center;width:50px;">Rank</th>
          <th style="padding:10px 14px;text-align:left;">Team</th>
          <th style="padding:10px 14px;text-align:center;">Score</th>
          <th style="padding:10px 14px;text-align:center;">Attempts</th>
        </tr>
      </thead>
      <tbody>`;

  teams.forEach((t, i) => {
    const isMyTeam = t.id === cfTeamId;
    const medal = i === 0 ? '&#129351;' : i === 1 ? '&#129352;' : i === 2 ? '&#129353;' : '';
    html += `
      <tr style="background:${isMyTeam ? '#FFF3CD' : (i % 2 === 0 ? '#f8f8f8' : 'white')};">
        <td style="padding:10px 14px;text-align:center;font-weight:700;">${medal} ${i + 1}</td>
        <td style="padding:10px 14px;font-weight:${isMyTeam ? '700' : '400'};">${cfEsc(t.name)}${isMyTeam ? ' (You)' : ''}</td>
        <td style="padding:10px 14px;text-align:center;font-weight:700;color:#C8102E;">${t.score.toFixed(1)}</td>
        <td style="padding:10px 14px;text-align:center;">${t.attempts}/${CF_MAX_ATTEMPTS}</td>
      </tr>`;
  });

  html += '</tbody></table>';
  el.innerHTML = html;
}

// ─── Instructor Admin ───────────────────────────────────────────────────────
function cfShowAdminPanel() {
  const el = document.getElementById('cf-admin-panel');
  if (!el || !cfIsInstructor) return;
  el.style.display = '';

  el.innerHTML = `
    <h3 style="font-family:Montserrat,sans-serif;color:#C8102E;margin:0 0 15px;">Instructor Controls</h3>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button onclick="cfToggleCompetitionSet()" id="cf-toggle-comp-btn" style="
        padding:10px 20px;border:none;border-radius:6px;
        background:#1D428A;color:white;font-weight:600;cursor:pointer;
        font-family:Montserrat,sans-serif;font-size:0.9rem;">
        Toggle Competition Set
      </button>
      <button onclick="cfViewAllSubmissions()" style="
        padding:10px 20px;border:none;border-radius:6px;
        background:#333;color:white;font-weight:600;cursor:pointer;
        font-family:Montserrat,sans-serif;font-size:0.9rem;">
        View All Submissions
      </button>
      <button onclick="cfToggleFreeze()" id="cf-freeze-btn" style="
        padding:10px 20px;border:none;border-radius:6px;
        background:#C8102E;color:white;font-weight:600;cursor:pointer;
        font-family:Montserrat,sans-serif;font-size:0.9rem;">
        Freeze Competition
      </button>
    </div>
    <div id="cf-admin-output" style="margin-top:15px;"></div>
  `;

  cfCheckCompetitionVisibility();
}

async function cfToggleCompetitionSet() {
  try {
    const ref = cfDb.collection('settings').doc(CF_SETTINGS_DOC);
    const snap = await ref.get();
    const current = snap.exists ? (snap.data().competitionVisible || false) : false;
    await ref.set({ competitionVisible: !current }, { merge: true });
    cfCheckCompetitionVisibility();
  } catch (err) {
    console.error('[capstone] Toggle failed:', err);
  }
}

async function cfToggleFreeze() {
  try {
    const ref = cfDb.collection('settings').doc(CF_SETTINGS_DOC);
    const snap = await ref.get();
    const current = snap.exists ? (snap.data().competitionFrozen || false) : false;
    await ref.set({ competitionFrozen: !current }, { merge: true });
    cfCheckCompetitionVisibility();
  } catch (err) {
    console.error('[capstone] Freeze toggle failed:', err);
  }
}

async function cfCheckCompetitionVisibility() {
  try {
    const ref = cfDb.collection('settings').doc(CF_SETTINGS_DOC);
    const snap = await ref.get();
    const settings = snap.exists ? snap.data() : {};
    const visible = settings.competitionVisible || false;
    const frozen = settings.competitionFrozen || false;

    const resumeSection = document.getElementById('cf-competition-resumes');
    if (resumeSection) resumeSection.style.display = visible ? '' : 'none';

    const toggleBtn = document.getElementById('cf-toggle-comp-btn');
    if (toggleBtn) toggleBtn.textContent = visible ? 'Hide Competition Set' : 'Show Competition Set';

    const freezeBtn = document.getElementById('cf-freeze-btn');
    if (freezeBtn) {
      freezeBtn.textContent = frozen ? 'Unfreeze Competition' : 'Freeze Competition';
      freezeBtn.style.background = frozen ? '#28a745' : '#C8102E';
    }
  } catch (err) {
    console.error('[capstone] Visibility check failed:', err);
  }
}

async function cfViewAllSubmissions() {
  const output = document.getElementById('cf-admin-output');
  if (!output) return;
  output.innerHTML = '<p>Loading...</p>';

  try {
    const snap = await cfDb.collection(CF_COLLECTION).get();
    let html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">';
    html += '<tr style="background:#333;color:white;"><th style="padding:8px;">Team</th><th>Attempts</th><th>Best</th><th>Members</th></tr>';

    snap.forEach(doc => {
      const d = doc.data();
      html += `<tr style="border-bottom:1px solid #eee;">
        <td style="padding:8px;font-weight:600;">${cfEsc(d.teamName)}</td>
        <td style="text-align:center;">${d.attemptsUsed || 0}</td>
        <td style="text-align:center;font-weight:700;color:#C8102E;">${(d.bestScore || 0).toFixed(1)}</td>
        <td style="font-size:0.8rem;color:#666;">${(d.members || []).join(', ')}</td>
      </tr>`;
    });
    html += '</table>';
    output.innerHTML = html;
  } catch (err) {
    output.innerHTML = `<p style="color:#C8102E;">Error: ${err.message}</p>`;
  }
}

// ─── Competition Timer ──────────────────────────────────────────────────────
function cfStartTimer(endTimeISO) {
  const el = document.getElementById('cf-timer');
  if (!el) return;

  const end = new Date(endTimeISO).getTime();
  const interval = setInterval(() => {
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) {
      el.textContent = 'Competition Ended';
      el.style.color = '#C8102E';
      clearInterval(interval);
      return;
    }
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    el.textContent = `${hrs}h ${String(mins).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s remaining`;
  }, 1000);
}

// ─── UI Helpers ─────────────────────────────────────────────────────────────
function cfShowCompetitionContent() {
  const el = document.getElementById('cf-competition-content');
  if (el) el.style.display = '';
  cfCheckCompetitionVisibility();
}

function cfHideCompetitionContent() {
  const el = document.getElementById('cf-competition-content');
  if (el) el.style.display = 'none';
  const admin = document.getElementById('cf-admin-panel');
  if (admin) admin.style.display = 'none';
  const teamPicker = document.getElementById('cf-team-picker');
  if (teamPicker) teamPicker.style.display = 'none';
  const teamInfo = document.getElementById('cf-team-info');
  if (teamInfo) teamInfo.style.display = 'none';
}

function cfShowError(msg) {
  const el = document.getElementById('cf-error-msg');
  if (el) { el.textContent = msg; el.style.display = ''; }
}

function cfEsc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ─── Copy to Clipboard ──────────────────────────────────────────────────────
function cfCopyResume(id) {
  const el = document.getElementById(`resume-${id}`);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = document.querySelector(`[data-copy-id="${id}"]`);
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    }
  });
}
