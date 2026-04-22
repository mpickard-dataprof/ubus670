#!/usr/bin/env node
/**
 * create_capstone_teams.js — Pre-create capstone team documents in Firestore
 *
 * Usage:
 *   node create_capstone_teams.js [--dry-run]
 *
 * Requires: npm install firebase-admin
 * Requires: Service account key JSON (path set in SERVICE_ACCOUNT_PATH below)
 *
 * Uses the Firebase Admin SDK which bypasses Firestore security rules.
 */

const admin = require('firebase-admin');
const path = require('path');

// ─── Service Account ────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = path.resolve(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(process.env.HOME, 'Downloads/ubus-670-labs-firebase-adminsdk-fbsvc-1ffa49f34e.json')
);

// ─── Team Definitions ───────────────────────────────────────────────────────
const TEAMS = [
  {
    docId: 'group-1',
    teamName: 'Group 1',
    members: [
      'z1915853@students.niu.edu',
      'z2082244@students.niu.edu',
      'z2013868@students.niu.edu'
    ]
  },
  {
    docId: 'group-2',
    teamName: 'Group 2',
    members: [
      'z2009614@students.niu.edu',
      'z2011003@students.niu.edu'
    ]
  },
  {
    docId: 'group-3',
    teamName: 'Group 3',
    members: [
      'z1914688@students.niu.edu',
      'z1914905@students.niu.edu',
      'z1934434@students.niu.edu'
    ]
  },
  {
    docId: 'group-4',
    teamName: 'Group 4',
    members: [
      'z1888505@students.niu.edu',
      'z2075120@students.niu.edu',
      '1999aparnaiyer@gmail.com',
      'z2049004@students.niu.edu',
      'z2049004students.niu.edu@gmail.com'
    ]
  },
  {
    docId: 'group-5',
    teamName: 'Group 5',
    members: [
      'z1920520@students.niu.edu',
      'z2046783@students.niu.edu',
      'z2080426@students.niu.edu'
    ]
  },
  {
    docId: 'group-6',
    teamName: 'Group 6',
    members: [
      'z1948068@students.niu.edu',
      'z1966722@students.niu.edu',
      'z2103770@students.niu.edu',
      'nickcanady2025@gmail.com'
    ]
  },
  // ─── Test Teams (for manual testing — see MANUAL_TEST_PLAN.md Part 0.3) ───
  {
    docId: 'test-team-alpha',
    teamName: 'Test Team Alpha',
    members: ['mpickard@niu.edu']
  },
  {
    docId: 'test-team-beta',
    teamName: 'Test Team Beta',
    members: ['matthew.david.pickard@gmail.com']
  },
  {
    docId: 'test-team-gamma',
    teamName: 'Test Team Gamma',
    members: []
  }
];

// ─── Settings Document ──────────────────────────────────────────────────────
const SETTINGS = {
  competitionVisible: false,
  competitionFrozen: false
};

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (dryRun) {
    console.log('=== DRY RUN — no writes will be made ===\n');
    for (const team of TEAMS) {
      console.log(`Would create: capstone_teams/${team.docId}`);
      console.log(`  teamName: ${team.teamName}`);
      console.log(`  members: [${team.members.join(', ')}]`);
      console.log(`  attemptsUsed: 0, bestScore: null, bestAttempt: null, attempts: []\n`);
    }
    console.log('Would create: settings/capstone_settings');
    console.log(`  competitionVisible: false, competitionFrozen: false\n`);
    console.log('Run without --dry-run to create these documents.');
    return;
  }

  // Initialize Firebase Admin
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();

  console.log('Creating capstone team documents in Firestore...\n');

  let created = 0;
  let skipped = 0;

  for (const team of TEAMS) {
    const ref = db.collection('capstone_teams').doc(team.docId);
    const existing = await ref.get();

    if (existing.exists) {
      console.log(`⚠  SKIP: capstone_teams/${team.docId} already exists (${existing.data().teamName})`);
      skipped++;
      continue;
    }

    const data = {
      teamName: team.teamName,
      members: team.members,
      attemptsUsed: 0,
      bestScore: null,
      bestAttempt: null,
      attempts: []
    };

    try {
      await ref.set(data);
      console.log(`✓  Created: capstone_teams/${team.docId} — ${team.teamName} (${team.members.length} members)`);
      created++;
    } catch (err) {
      console.error(`✗  FAILED: capstone_teams/${team.docId} — ${err.message}`);
    }
  }

  // Create settings document
  const settingsRef = db.collection('settings').doc('capstone_settings');
  const existingSettings = await settingsRef.get();
  if (existingSettings.exists) {
    console.log(`\n⚠  SKIP: settings/capstone_settings already exists`);
  } else {
    try {
      await settingsRef.set(SETTINGS);
      console.log(`\n✓  Created: settings/capstone_settings`);
      created++;
    } catch (err) {
      console.error(`\n✗  FAILED: settings/capstone_settings — ${err.message}`);
    }
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
