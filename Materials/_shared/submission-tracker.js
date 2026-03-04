/**
 * UBUS 670 — Submission Tracker
 *
 * Shared module for quiz and lab submission tracking.
 * Handles Google Sign-In, attempt checking, submission logging, and PDF receipt generation.
 *
 * GRACEFUL DEGRADATION:
 * - If googleClientId is not configured (placeholder): skips auth gate, works without sign-in
 * - If appsScriptUrl is not configured: skips backend calls, still generates PDFs
 * - If backend is unreachable: shows error but still offers PDF download
 *
 * USAGE: Set window.SUBMISSION_CONFIG before this script loads, then call
 * SubmissionTracker.init() on DOMContentLoaded.
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════

    var config = null;
    var currentUser = null;       // { email, name, picture, credential }
    var attemptData = null;       // response from check endpoint
    var submitted = false;        // has this session already submitted?
    var gisLoaded = false;
    var gisInitialized = false;
    var authConfigured = false;   // is Google OAuth actually set up?
    var backendConfigured = false; // is Apps Script URL actually set up?

    // ═══════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════

    var SubmissionTracker = {
        init: init,
        getUser: function () { return currentUser; },
        submitQuiz: submitQuiz,
        submitLab: submitLab,
        generateQuizPDF: generateQuizPDF,
        generateLabPDF: generateLabPDF
    };

    window.SubmissionTracker = SubmissionTracker;

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    function init() {
        config = window.SUBMISSION_CONFIG;
        if (!config) {
            console.warn('SubmissionTracker: No SUBMISSION_CONFIG found');
            return;
        }

        // Detect if auth and backend are actually configured (not placeholder values)
        authConfigured = config.googleClientId &&
            config.googleClientId.indexOf('YOUR_CLIENT_ID') === -1 &&
            config.googleClientId.indexOf('.apps.googleusercontent.com') !== -1;

        backendConfigured = config.appsScriptUrl &&
            config.appsScriptUrl.indexOf('YOUR_SCRIPT_ID') === -1 &&
            config.appsScriptUrl.indexOf('script.google.com') !== -1;

        if (!authConfigured) {
            // Auth not configured — skip auth gate, run without sign-in
            console.info('SubmissionTracker: Google OAuth not configured. Running in offline mode (PDF-only).');
            currentUser = null;
            return; // Don't inject auth gate or hide content
        }

        // Auth is configured — set up the full flow
        injectAuthGate();
        injectAttemptBadge();
        injectLockedOverlay();
        hideMainContent();

        // Wait for GIS library to load
        waitForGIS(function () {
            gisLoaded = true;
            enableSignInButton();
        });
    }

    function waitForGIS(callback) {
        if (window.google && window.google.accounts) {
            callback();
            return;
        }
        var checks = 0;
        var interval = setInterval(function () {
            checks++;
            if (window.google && window.google.accounts) {
                clearInterval(interval);
                callback();
            } else if (checks > 50) { // 5 seconds
                clearInterval(interval);
                console.error('SubmissionTracker: Google Identity Services failed to load');
                showAuthError('Google Sign-In failed to load. Please refresh the page.');
            }
        }, 100);
    }

    // ═══════════════════════════════════════════════════════════
    // GOOGLE SIGN-IN
    // ═══════════════════════════════════════════════════════════

    function initializeGIS() {
        if (gisInitialized) return;
        gisInitialized = true;

        google.accounts.id.initialize({
            client_id: config.googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
    }

    function triggerSignIn() {
        if (!gisLoaded) return;
        initializeGIS();
        google.accounts.id.prompt(function (notification) {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback: use popup mode
                google.accounts.id.prompt();
            }
        });
    }

    function handleCredentialResponse(response) {
        var payload = parseJwt(response.credential);
        if (!payload) {
            showAuthError('Failed to verify Google account. Please try again.');
            return;
        }

        var email = payload.email.toLowerCase();

        // Check domain restriction
        if (config.allowedDomains && config.allowedDomains.length > 0) {
            var domain = email.split('@')[1];
            if (config.allowedDomains.indexOf(domain) === -1) {
                showAuthError(
                    'Please sign in with your NIU email address (' +
                    config.allowedDomains.join(' or ') + ').'
                );
                return;
            }
        }

        currentUser = {
            email: email,
            name: payload.name || email,
            picture: payload.picture || null,
            credential: response.credential
        };

        hideAuthError();
        checkAttempts();
    }

    function signOut() {
        if (window.google && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
        currentUser = null;
        attemptData = null;
        submitted = false;
        gisInitialized = false;

        hideMainContent();
        hideAttemptBadge();
        hideLockedOverlay();
        hideSubmissionPanel();
        showAuthGate();
    }

    function parseJwt(token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // JSONP — bypasses CORS by injecting a <script> tag
    // ═══════════════════════════════════════════════════════════

    var jsonpCounter = 0;

    function jsonpRequest(url) {
        return new Promise(function (resolve, reject) {
            var callbackName = '_st_cb_' + (++jsonpCounter) + '_' + Date.now();
            var separator = url.indexOf('?') === -1 ? '?' : '&';
            var scriptUrl = url + separator + 'callback=' + callbackName;

            var script = document.createElement('script');
            script.src = scriptUrl;

            var timeout = setTimeout(function () {
                cleanup();
                reject(new Error('JSONP request timed out'));
            }, 4000);

            function cleanup() {
                clearTimeout(timeout);
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            }

            window[callbackName] = function (data) {
                cleanup();
                resolve(data);
            };

            script.onerror = function () {
                cleanup();
                reject(new Error('JSONP script failed to load'));
            };

            document.head.appendChild(script);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ATTEMPT CHECKING
    // ═══════════════════════════════════════════════════════════

    function checkAttempts() {
        if (!backendConfigured || !currentUser) {
            // Backend not configured — assume first attempt
            attemptData = { attempts: 0, maxAttempts: config.maxAttempts, history: [] };
            onAttemptsLoaded(attemptData);
            return;
        }

        var url = config.appsScriptUrl +
            '?action=check' +
            '&email=' + encodeURIComponent(currentUser.email) +
            '&type=' + encodeURIComponent(config.type) +
            '&day=' + encodeURIComponent(config.day);

        if (config.type === 'lab' && config.labVariant) {
            url += '&labVariant=' + encodeURIComponent(config.labVariant);
        }

        jsonpRequest(url)
            .then(function (data) {
                attemptData = data;
                onAttemptsLoaded(data);
            })
            .catch(function (err) {
                console.error('SubmissionTracker: Failed to check attempts', err);
                // Allow access anyway if backend is unreachable
                attemptData = { attempts: 0, maxAttempts: config.maxAttempts, history: [] };
                onAttemptsLoaded(attemptData);
            });
    }

    function onAttemptsLoaded(data) {
        hideAuthGate();

        if (data.attempts >= data.maxAttempts) {
            // Locked out
            showLockedOverlay(data);
            showAttemptBadge(data);
        } else {
            // Can proceed
            showMainContent();
            showAttemptBadge(data);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // QUIZ SUBMISSION
    // ═══════════════════════════════════════════════════════════

    function submitQuiz(data) {
        if (submitted) return Promise.resolve(null);
        submitted = true;

        var timestamp = new Date().toISOString();
        var score = data.score + '/' + data.total;
        var percentage = Math.round((data.score / data.total) * 100);

        // If no user or no backend, skip server submission — just show PDF
        if (!currentUser || !backendConfigured) {
            showSubmissionPanel({
                type: 'quiz',
                score: score,
                percentage: percentage,
                attempt: 'N/A',
                maxAttempts: config.maxAttempts,
                timestamp: timestamp,
                verification: 'OFFLINE',
                quizData: data
            });
            return Promise.resolve(null);
        }

        showSubmittingSpinner();

        var payload = {
            action: 'submit',
            email: currentUser.email,
            name: currentUser.name,
            type: 'quiz',
            day: config.day,
            data: {
                score: data.score,
                total: data.total,
                questions: data.questions
            }
        };

        var submitUrl = config.appsScriptUrl +
            '?action=submit&payload=' + encodeURIComponent(JSON.stringify(payload));

        return jsonpRequest(submitUrl)
            .then(function (result) {
                hideSubmittingSpinner();
                if (result.success) {
                    showSubmissionPanel({
                        type: 'quiz',
                        score: score,
                        percentage: percentage,
                        attempt: result.attempt,
                        maxAttempts: config.maxAttempts,
                        timestamp: result.timestamp,
                        verification: result.verification,
                        quizData: data
                    });
                } else {
                    showSubmissionPanel({
                        type: 'quiz',
                        score: score,
                        percentage: percentage,
                        attempt: 'N/A',
                        maxAttempts: config.maxAttempts,
                        timestamp: timestamp,
                        verification: 'ERROR',
                        quizData: data,
                        errorMessage: result.error || 'Submission failed. You can still download your receipt.'
                    });
                }
                return result;
            })
            .catch(function (err) {
                hideSubmittingSpinner();
                console.warn('SubmissionTracker: Quiz response not confirmed (request was sent)', err);
                showSubmissionPanel({
                    type: 'quiz',
                    score: score,
                    percentage: percentage,
                    attempt: 'Sent',
                    maxAttempts: config.maxAttempts,
                    timestamp: timestamp,
                    verification: 'SUBMITTED',
                    quizData: data
                });
                return null;
            });
    }

    // ═══════════════════════════════════════════════════════════
    // LAB SUBMISSION
    // ═══════════════════════════════════════════════════════════

    function submitLab(data) {
        if (submitted) return Promise.resolve(null);
        submitted = true;

        var timestamp = new Date().toISOString();
        var stepsCompleted = data.stepsCompleted + '/' + data.stepsTotal;

        // If no user or no backend, skip server submission — just show PDF
        if (!currentUser || !backendConfigured) {
            showSubmissionPanel({
                type: 'lab',
                stepsCompleted: stepsCompleted,
                attempt: 'N/A',
                timestamp: timestamp,
                verification: 'OFFLINE',
                labData: data
            });
            return Promise.resolve(null);
        }

        showSubmittingSpinner();

        var payload = {
            action: 'submit',
            email: currentUser.email,
            name: currentUser.name,
            type: 'lab',
            day: config.day,
            data: {
                stepsCompleted: data.stepsCompleted,
                stepsTotal: data.stepsTotal,
                reflections: data.reflections,
                labVariant: config.labVariant || 'lab'
            }
        };

        var submitUrl = config.appsScriptUrl +
            '?action=submit&payload=' + encodeURIComponent(JSON.stringify(payload));

        return jsonpRequest(submitUrl)
            .then(function (result) {
                hideSubmittingSpinner();
                if (result.success) {
                    showSubmissionPanel({
                        type: 'lab',
                        stepsCompleted: stepsCompleted,
                        attempt: result.attempt,
                        timestamp: result.timestamp,
                        verification: result.verification,
                        labData: data
                    });
                } else {
                    showSubmissionPanel({
                        type: 'lab',
                        stepsCompleted: stepsCompleted,
                        attempt: 'N/A',
                        timestamp: timestamp,
                        verification: 'ERROR',
                        labData: data,
                        errorMessage: result.error || 'Submission failed. You can still download your receipt.'
                    });
                }
                return result;
            })
            .catch(function (err) {
                hideSubmittingSpinner();
                console.warn('SubmissionTracker: Lab response not confirmed (request was sent)', err);
                showSubmissionPanel({
                    type: 'lab',
                    stepsCompleted: stepsCompleted,
                    attempt: 'Sent',
                    timestamp: timestamp,
                    verification: 'SUBMITTED',
                    labData: data
                });
                return null;
            });
    }

    // ═══════════════════════════════════════════════════════════
    // PDF GENERATION (jsPDF)
    // ═══════════════════════════════════════════════════════════

    function getUserName() {
        return currentUser ? currentUser.name : 'Student';
    }

    function getUserEmail() {
        return currentUser ? currentUser.email : 'Not signed in';
    }

    function generateQuizPDF(info) {
        var doc = createPDFDoc();
        var y = addPDFHeader(doc, 'Quiz Receipt');

        // Score
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 66, 138); // navy
        doc.text(String(info.score), 105, y, { align: 'center' });
        y += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        var attemptText = info.attempt !== 'N/A'
            ? info.percentage + '% — Attempt ' + info.attempt + ' of ' + info.maxAttempts
            : info.percentage + '%';
        doc.text(attemptText, 105, y, { align: 'center' });
        y += 12;

        // Student info
        y = addStudentBlock(doc, y, info.timestamp);

        // Question details
        if (info.quizData && info.quizData.questions) {
            y += 4;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(51);
            doc.text('Question Details', 20, y);
            y += 7;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            var questions = info.quizData.questions;
            for (var i = 0; i < questions.length; i++) {
                if (y > 260) {
                    addPDFFooter(doc, info.verification);
                    doc.addPage();
                    y = 20;
                }

                var q = questions[i];
                var icon = q.isCorrect ? 'CORRECT' : 'WRONG';
                var color = q.isCorrect ? [67, 176, 42] : [200, 16, 46];
                doc.setTextColor(color[0], color[1], color[2]);
                doc.setFont('helvetica', 'bold');
                doc.text(icon, 20, y);
                doc.setTextColor(51);
                doc.setFont('helvetica', 'normal');

                var qText = (i + 1) + '. ' + truncate(q.question, 85);
                doc.text(qText, 44, y);
                y += 5;
                doc.setTextColor(100);
                doc.text('Your answer: ' + truncate(q.selected, 70), 44, y);
                y += 4;
                if (!q.isCorrect) {
                    doc.setTextColor(67, 176, 42);
                    doc.text('Correct: ' + truncate(q.correct, 70), 44, y);
                    y += 4;
                }
                y += 3;
            }
        }

        addPDFFooter(doc, info.verification);

        var emailPrefix = currentUser ? currentUser.email.split('@')[0] : 'student';
        var filename = 'UBUS670_Quiz_Day' + config.day + '_' + emailPrefix + '.pdf';
        doc.save(filename);
    }

    function generateLabPDF(info) {
        var doc = createPDFDoc();
        var y = addPDFHeader(doc, 'Lab Receipt');

        // Completion
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(29, 66, 138);
        doc.text(String(info.stepsCompleted), 105, y, { align: 'center' });
        y += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Steps Completed', 105, y, { align: 'center' });
        y += 12;

        // Student info
        y = addStudentBlock(doc, y, info.timestamp);

        // Reflections
        if (info.labData && info.labData.reflections) {
            y += 4;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(51);
            doc.text('Reflections', 20, y);
            y += 7;

            var reflections = info.labData.reflections;
            for (var i = 0; i < reflections.length; i++) {
                if (y > 240) {
                    addPDFFooter(doc, info.verification);
                    doc.addPage();
                    y = 20;
                }

                var r = reflections[i];
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(29, 66, 138);
                var promptLines = doc.splitTextToSize(r.prompt || 'Reflection ' + (i + 1), 165);
                doc.text(promptLines, 20, y);
                y += promptLines.length * 4.5 + 2;

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(51);
                var respLines = doc.splitTextToSize(r.response || '[No response]', 165);
                doc.text(respLines, 20, y);
                y += respLines.length * 4.5 + 6;
            }
        }

        addPDFFooter(doc, info.verification);

        var variant = config.labVariant || 'lab';
        var emailPrefix = currentUser ? currentUser.email.split('@')[0] : 'student';
        var filename = 'UBUS670_Lab_Day' + config.day +
            (variant !== 'lab' ? '_' + variant : '') +
            '_' + emailPrefix + '.pdf';
        doc.save(filename);
    }

    // ── PDF Helpers ───────────────────────────────────────────

    function createPDFDoc() {
        var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        return new jsPDF({ unit: 'mm', format: 'letter' });
    }

    function addPDFHeader(doc, receiptType) {
        // Red header bar
        doc.setFillColor(200, 16, 46); // NIU red
        doc.rect(0, 0, 216, 28, 'F');

        // White text on red
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('UBUS 670 — ' + receiptType, 20, 12);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(config.title, 20, 20);

        // Navy subheader
        doc.setFillColor(29, 66, 138); // NIU navy
        doc.rect(0, 28, 216, 6, 'F');
        doc.setFontSize(8);
        doc.text('Northern Illinois University', 20, 33);

        return 48; // y position after header
    }

    function addStudentBlock(doc, y, timestamp) {
        doc.setDrawColor(200);
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(20, y, 170, 22, 2, 2, 'FD');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51);
        doc.text('Student:', 25, y + 7);
        doc.text('Email:', 25, y + 13);
        doc.text('Submitted:', 25, y + 19);

        doc.setFont('helvetica', 'normal');
        doc.text(getUserName(), 55, y + 7);
        doc.text(getUserEmail(), 55, y + 13);
        doc.text(formatTimestamp(timestamp), 55, y + 19);

        return y + 28;
    }

    function addPDFFooter(doc, verification) {
        var pageCount = doc.internal.getNumberOfPages();
        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Watermark (light email)
            doc.setTextColor(230, 230, 230);
            doc.setFontSize(8);
            doc.text(getUserEmail(), 105, 270, { align: 'center' });

            // Verification bar
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 272, 216, 8, 'F');
            doc.setTextColor(150);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text(
                'Verification: ' + (verification || 'N/A') +
                '  |  Page ' + i + ' of ' + pageCount,
                105, 277, { align: 'center' }
            );
        }
    }

    function formatTimestamp(ts) {
        if (!ts) return 'N/A';
        try {
            return new Date(ts).toLocaleString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true
            });
        } catch (e) {
            return ts;
        }
    }

    function truncate(str, maxLen) {
        if (!str) return '';
        return str.length > maxLen ? str.substring(0, maxLen - 3) + '...' : str;
    }

    // ═══════════════════════════════════════════════════════════
    // UI: AUTH GATE
    // ═══════════════════════════════════════════════════════════

    function injectAuthGate() {
        var gate = document.getElementById('auth-gate');
        if (!gate) return;

        gate.className = 'active';
        gate.innerHTML =
            '<div class="auth-gate-content">' +
            '  <p class="auth-course">UBUS 670 — Generative AI for Business</p>' +
            '  <h2>Sign in to Continue</h2>' +
            '  <p class="auth-subtitle">Sign in with your Google account to access this ' +
            (config.type === 'quiz' ? 'quiz' : 'lab') +
            ' and track your progress.</p>' +
            '  <button class="google-signin-btn" id="google-signin-btn" disabled>' +
            '    <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>' +
            '    Sign in with Google' +
            '  </button>' +
            '  <p class="auth-error" id="auth-error"></p>' +
            '</div>';

        var btn = document.getElementById('google-signin-btn');
        btn.addEventListener('click', function () {
            triggerSignIn();
        });
    }

    function enableSignInButton() {
        var btn = document.getElementById('google-signin-btn');
        if (btn) btn.disabled = false;
    }

    function showAuthGate() {
        var gate = document.getElementById('auth-gate');
        if (gate) {
            gate.className = 'active';
        }
    }

    function hideAuthGate() {
        var gate = document.getElementById('auth-gate');
        if (gate) {
            gate.className = 'hidden';
        }
    }

    function showAuthError(msg) {
        var el = document.getElementById('auth-error');
        if (el) {
            el.textContent = msg;
            el.className = 'auth-error show';
        }
    }

    function hideAuthError() {
        var el = document.getElementById('auth-error');
        if (el) {
            el.className = 'auth-error';
        }
    }

    // ═══════════════════════════════════════════════════════════
    // UI: ATTEMPT BADGE
    // ═══════════════════════════════════════════════════════════

    function injectAttemptBadge() {
        // Insert badge before the main container
        var container = document.querySelector('.quiz-container') ||
            document.querySelector('.lab-container');
        if (!container) return;

        var badge = document.createElement('div');
        badge.className = 'attempt-badge';
        badge.id = 'attempt-badge';
        container.insertBefore(badge, container.firstChild);
    }

    function showAttemptBadge(data) {
        var badge = document.getElementById('attempt-badge');
        if (!badge || !currentUser) return;

        var text;
        if (config.type === 'quiz') {
            text = 'Attempt ' + (data.attempts + 1) + ' of ' + data.maxAttempts;
            if (data.attempts >= data.maxAttempts) {
                text = 'All ' + data.maxAttempts + ' attempts used';
            }
        } else {
            text = data.attempts > 0 ? 'Already submitted' : '1 submission allowed';
        }

        var pictureHtml = currentUser.picture
            ? '<img src="' + currentUser.picture + '" alt="">'
            : '';

        badge.innerHTML =
            '<span class="badge-icon">' + (config.type === 'quiz' ? '&#128221;' : '&#128300;') + '</span>' +
            '<span class="badge-text">' + text + '</span>' +
            '<span class="badge-user">' +
            pictureHtml +
            '<span>' + currentUser.email + '</span>' +
            '<span class="signout-link" id="signout-link">Sign out</span>' +
            '</span>';

        badge.className = 'attempt-badge show';

        document.getElementById('signout-link').addEventListener('click', signOut);
    }

    function hideAttemptBadge() {
        var badge = document.getElementById('attempt-badge');
        if (badge) badge.className = 'attempt-badge';
    }

    // ═══════════════════════════════════════════════════════════
    // UI: LOCKED OVERLAY
    // ═══════════════════════════════════════════════════════════

    function injectLockedOverlay() {
        var container = document.querySelector('.quiz-container') ||
            document.querySelector('.lab-container');
        if (!container) return;

        var overlay = document.createElement('div');
        overlay.className = 'locked-overlay';
        overlay.id = 'locked-overlay';
        container.appendChild(overlay);
    }

    function showLockedOverlay(data) {
        var overlay = document.getElementById('locked-overlay');
        if (!overlay) return;

        hideMainContent();

        var html;
        if (config.type === 'quiz') {
            var historyHtml = '';
            if (data.history && data.history.length > 0) {
                historyHtml = '<div class="locked-history"><h3>Your Attempts</h3>';
                for (var i = 0; i < data.history.length; i++) {
                    var h = data.history[i];
                    historyHtml += '<div class="attempt-row">' +
                        '<span>Attempt ' + h.attempt + '</span>' +
                        '<span>' + h.score + ' (' + h.percentage + '%)</span>' +
                        '</div>';
                }
                historyHtml += '</div>';
            }

            html =
                '<h2>All Attempts Used</h2>' +
                '<p>You\'ve completed all ' + data.maxAttempts + ' quiz attempts.</p>' +
                '<div class="locked-score">' + (data.bestScore || 'N/A') + '</div>' +
                '<p class="locked-label">Best Score</p>' +
                historyHtml +
                '<button class="download-receipt-btn" id="locked-download-btn">' +
                '&#128196; Download Best Score Receipt (PDF)' +
                '</button>';
        } else {
            html =
                '<h2>Already Submitted</h2>' +
                '<p>You\'ve already submitted this lab.</p>' +
                '<button class="download-receipt-btn" id="locked-download-btn">' +
                '&#128196; Re-download Receipt (PDF)' +
                '</button>';
        }

        overlay.innerHTML = html;
        overlay.className = 'locked-overlay show';

        // Attach download handler for best/previous receipt
        var dlBtn = document.getElementById('locked-download-btn');
        if (dlBtn) {
            dlBtn.addEventListener('click', function () {
                downloadLockedReceipt(data);
            });
        }
    }

    function hideLockedOverlay() {
        var overlay = document.getElementById('locked-overlay');
        if (overlay) overlay.className = 'locked-overlay';
    }

    function downloadLockedReceipt(data) {
        if (config.type === 'quiz') {
            // Find best attempt
            var best = null;
            var bestPct = 0;
            for (var i = 0; i < data.history.length; i++) {
                var pct = parseFloat(data.history[i].percentage) || 0;
                if (pct >= bestPct) {
                    bestPct = pct;
                    best = data.history[i];
                }
            }
            if (best) {
                generateQuizPDF({
                    score: best.score,
                    percentage: best.percentage,
                    attempt: best.attempt,
                    maxAttempts: data.maxAttempts,
                    timestamp: best.timestamp,
                    verification: best.verification,
                    quizData: null // no question details for previous attempts
                });
            }
        } else if (data.history && data.history.length > 0) {
            var sub = data.history[0];
            generateLabPDF({
                stepsCompleted: sub.stepsCompleted,
                timestamp: sub.timestamp,
                verification: sub.verification,
                labData: null
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // UI: SUBMISSION PANEL
    // ═══════════════════════════════════════════════════════════

    function showSubmissionPanel(info) {
        // Remove existing panel
        var existing = document.getElementById('submission-panel');
        if (existing) existing.remove();

        var panel = document.createElement('div');
        var hasError = !!info.errorMessage;
        panel.className = 'submission-panel show';
        panel.id = 'submission-panel';

        if (info.type === 'quiz') {
            var errorNote = hasError
                ? '<p class="submission-detail" style="color:#C8102E;font-size:0.85em;">' + info.errorMessage + '</p>'
                : '';
            var verificationHtml = info.verification && info.verification !== 'OFFLINE' && info.verification !== 'ERROR'
                ? '<div class="verification-code">Verification: ' + info.verification + '</div>'
                : '';

            panel.innerHTML =
                '<h3>&#9989; Quiz Complete</h3>' +
                '<p class="submission-detail">Score: <strong>' + info.score + '</strong> (' + info.percentage + '%)</p>' +
                (info.attempt !== 'N/A' ? '<p class="submission-detail">Attempt ' + info.attempt + ' of ' + info.maxAttempts + '</p>' : '') +
                errorNote +
                verificationHtml +
                '<br>' +
                '<button class="download-receipt-btn" id="download-receipt-btn">&#128196; Download PDF Receipt</button>' +
                '<p class="submission-detail" style="margin-top:12px;font-size:0.85em;color:#888;">Upload this PDF to Blackboard to complete your submission.</p>';
        } else {
            var errorNote2 = hasError
                ? '<p class="submission-detail" style="color:#C8102E;font-size:0.85em;">' + info.errorMessage + '</p>'
                : '';
            var verificationHtml2 = info.verification && info.verification !== 'OFFLINE' && info.verification !== 'ERROR'
                ? '<div class="verification-code">Verification: ' + info.verification + '</div>'
                : '';

            panel.innerHTML =
                '<h3>&#9989; Lab Submitted</h3>' +
                '<p class="submission-detail">Steps completed: <strong>' + info.stepsCompleted + '</strong></p>' +
                errorNote2 +
                verificationHtml2 +
                '<br>' +
                '<button class="download-receipt-btn" id="download-receipt-btn">&#128196; Download PDF Receipt</button>' +
                '<p class="submission-detail" style="margin-top:12px;font-size:0.85em;color:#888;">Upload this PDF to Blackboard to complete your submission.</p>';
        }

        // Insert after results div (quiz) or at end of container (lab)
        var results = document.getElementById('results');
        var container = document.querySelector('.quiz-container') ||
            document.querySelector('.lab-container');

        if (results && results.parentNode) {
            results.parentNode.insertBefore(panel, results.nextSibling);
        } else if (container) {
            container.appendChild(panel);
        }

        // Attach PDF download handler
        setTimeout(function () {
            var btn = document.getElementById('download-receipt-btn');
            if (btn) {
                btn.addEventListener('click', function () {
                    if (info.type === 'quiz') {
                        generateQuizPDF(info);
                    } else {
                        generateLabPDF(info);
                    }
                });
            }
        }, 0);
    }

    function hideSubmissionPanel() {
        var panel = document.getElementById('submission-panel');
        if (panel) panel.remove();
    }

    // ═══════════════════════════════════════════════════════════
    // UI: SPINNER
    // ═══════════════════════════════════════════════════════════

    function showSubmittingSpinner() {
        var existing = document.getElementById('submitting-spinner');
        if (existing) {
            existing.className = 'submitting-spinner show';
            return;
        }

        var spinner = document.createElement('div');
        spinner.className = 'submitting-spinner show';
        spinner.id = 'submitting-spinner';
        spinner.innerHTML = '<div class="spinner"></div><span>Submitting...</span>';

        var results = document.getElementById('results');
        var container = document.querySelector('.quiz-container') ||
            document.querySelector('.lab-container');

        if (results && results.parentNode) {
            results.parentNode.insertBefore(spinner, results.nextSibling);
        } else if (container) {
            container.appendChild(spinner);
        }
    }

    function hideSubmittingSpinner() {
        var spinner = document.getElementById('submitting-spinner');
        if (spinner) spinner.className = 'submitting-spinner';
    }

    // ═══════════════════════════════════════════════════════════
    // UI: CONTENT VISIBILITY
    // ═══════════════════════════════════════════════════════════

    function hideMainContent() {
        var els = document.querySelectorAll(
            '.quiz-header, .quiz-progress, #questions-container, .results,' +
            '.lab-header, .objectives-box, .lab-section, .progress-tracker'
        );
        for (var i = 0; i < els.length; i++) {
            els[i].style.display = 'none';
        }
    }

    function showMainContent() {
        var els = document.querySelectorAll(
            '.quiz-header, .quiz-progress, #questions-container,' +
            '.lab-header, .objectives-box, .lab-section, .progress-tracker'
        );
        for (var i = 0; i < els.length; i++) {
            els[i].style.display = '';
        }
        // Keep results hidden until quiz completes
    }

})();
