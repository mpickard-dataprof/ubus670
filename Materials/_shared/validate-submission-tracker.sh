#!/usr/bin/env bash
# v2 — updated for JSONP transport
cd "/home/mpickard/Documents/NIU/Classes/2026/Spring/UBUS 670/Materials"

PASS=0
FAIL=0

pass() { PASS=$((PASS+1)); echo "  ✓ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ✗ $1"; }

echo "═══ Shared Files ═══"
test -f _shared/submission-tracker.js && pass "submission-tracker.js exists" || fail "submission-tracker.js MISSING"
test -f _shared/submission-tracker.css && pass "submission-tracker.css exists" || fail "submission-tracker.css MISSING"
test -f _shared/apps-script-backend/Code.gs && pass "Code.gs exists" || fail "Code.gs MISSING"

check_quiz() {
    local f="$1" d="$2"
    echo ""
    echo "── Day $d Quiz ──"
    test -f "$f" || { fail "File missing: $f"; return; }
    grep -q '../../../_shared/submission-tracker.css' "$f" && pass "CSS path" || fail "CSS path"
    grep -q '../../../_shared/submission-tracker.js' "$f" && pass "JS path" || fail "JS path"
    grep -q 'accounts.google.com/gsi/client' "$f" && pass "GIS" || fail "GIS"
    grep -q 'jspdf' "$f" && pass "jsPDF" || fail "jsPDF"
    grep -q 'SUBMISSION_CONFIG' "$f" && pass "CONFIG" || fail "CONFIG"
    grep -q "type: 'quiz'" "$f" && pass "type=quiz" || fail "type!=quiz"
    grep -q "day: $d" "$f" && pass "day=$d" || fail "day!=$d"
    grep -q 'maxAttempts: 3' "$f" && pass "maxAttempts=3" || fail "maxAttempts!=3"
    grep -q 'id="auth-gate"' "$f" && pass "auth-gate" || fail "auth-gate"
    grep -q 'SubmissionTracker.init()' "$f" && pass "init()" || fail "init()"
    grep -q 'SubmissionTracker.submitQuiz' "$f" && pass "submitQuiz()" || fail "submitQuiz()"
}

check_lab() {
    local f="$1" d="$2" v="$3"
    echo ""
    echo "── Day $d Lab ($v) ──"
    test -f "$f" || { fail "File missing: $f"; return; }
    grep -q '../../../_shared/submission-tracker.css' "$f" && pass "CSS path" || fail "CSS path"
    grep -q '../../../_shared/submission-tracker.js' "$f" && pass "JS path" || fail "JS path"
    grep -q 'accounts.google.com/gsi/client' "$f" && pass "GIS" || fail "GIS"
    grep -q 'jspdf' "$f" && pass "jsPDF" || fail "jsPDF"
    grep -q 'SUBMISSION_CONFIG' "$f" && pass "CONFIG" || fail "CONFIG"
    grep -q "type: 'lab'" "$f" && pass "type=lab" || fail "type!=lab"
    grep -q "day: $d" "$f" && pass "day=$d" || fail "day!=$d"
    grep -q 'maxAttempts: 1' "$f" && pass "maxAttempts=1" || fail "maxAttempts!=1"
    grep -q 'id="auth-gate"' "$f" && pass "auth-gate" || fail "auth-gate"
    grep -q 'SubmissionTracker.init()' "$f" && pass "init()" || fail "init()"
    grep -q 'function submitLab' "$f" && pass "submitLab() defined" || fail "submitLab() not defined"
    grep -q 'SubmissionTracker.submitLab' "$f" && pass "submitLab() called" || fail "submitLab() not called"
    if grep -q 'function downloadPDF\|function generatePDF' "$f"; then
        fail "Old PDF function still present"
    else
        pass "Old PDF function removed"
    fi
    if [ "$v" != "lab" ]; then
        grep -q "labVariant: '$v'" "$f" && pass "labVariant=$v" || fail "labVariant!=$v"
    fi
}

echo ""
echo "═══ Quiz Files ═══"
check_quiz "week-1/day-1/web/quiz.html" 1
check_quiz "week-1/day-2/web/quiz.html" 2
check_quiz "week-1/day-3/web/quiz.html" 3
check_quiz "week-2/day-4/web/quiz.html" 4
check_quiz "week-2/day-5/web/quiz.html" 5
check_quiz "week-2/day-6/web/quiz.html" 6
check_quiz "week-3/day-7/web/quiz.html" 7

echo ""
echo "═══ Lab Files ═══"
check_lab "week-1/day-1/web/lab.html" 1 "lab"
check_lab "week-1/day-2/web/lab.html" 2 "lab"
check_lab "week-1/day-3/web/lab.html" 3 "lab"
check_lab "week-2/day-4/web/lab.html" 4 "lab"
check_lab "week-2/day-5/web/lab.html" 5 "lab"
check_lab "week-2/day-6/web/lab.html" 6 "lab"
check_lab "week-3/day-7/web/lab-adk.html" 7 "lab-adk"
check_lab "week-3/day-7/web/lab-mindstudio.html" 7 "lab-mindstudio"

echo ""
echo "═══ submission-tracker.js Internals ═══"
JS="_shared/submission-tracker.js"
grep -q 'SubmissionTracker' "$JS" && pass "SubmissionTracker namespace" || fail "SubmissionTracker namespace"
grep -q 'submitQuiz' "$JS" && pass "submitQuiz in JS" || fail "submitQuiz in JS"
grep -q 'submitLab' "$JS" && pass "submitLab in JS" || fail "submitLab in JS"
grep -q 'YOUR_CLIENT_ID' "$JS" && pass "Placeholder detection" || fail "Placeholder detection"
grep -q 'OFFLINE' "$JS" && pass "Offline fallback" || fail "Offline fallback"

echo ""
echo "═══ Code.gs Internals ═══"
GS="_shared/apps-script-backend/Code.gs"
grep -q 'doGet' "$GS" && pass "doGet" || fail "doGet"
grep -q 'doPost' "$GS" && pass "doPost" || fail "doPost"
grep -q 'handleCheck' "$GS" && pass "handleCheck" || fail "handleCheck"
grep -q 'handleSubmit' "$GS" && pass "handleSubmit" || fail "handleSubmit"
grep -q 'computeHMAC' "$GS" && pass "computeHMAC" || fail "computeHMAC"

echo ""
echo "═════════════════════════════════"
echo "  RESULTS: $PASS passed, $FAIL failed"
echo "═════════════════════════════════"
test "$FAIL" -eq 0 && echo "  ALL CHECKS PASSED" || echo "  SOME CHECKS FAILED"
