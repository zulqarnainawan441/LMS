/* 
    auth.js
    Client-side behaviors for Authentication pages (Login, Signup, Admin)
*/

document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------
       1. PASSWORD VISIBILITY TOGGLE
    ------------------------------------------------------- */
    const setupPasswordToggle = (btnId, inputId) => {
        const btn   = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (btn && input) {
            btn.addEventListener('click', function () {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
    };

    setupPasswordToggle('togglePassword',      'password'); // Student Login
    setupPasswordToggle('toggleAdminPassword', 'password'); // Admin Login
    setupPasswordToggle('toggleSignupPassword','password'); // Signup

    /* -------------------------------------------------------
       2. SHARED VALIDATION HELPERS
    ------------------------------------------------------- */
    const showError = (input, errorElement, message) => {
        if (!input) return;
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (errorElement) errorElement.textContent = message;
    };

    const showSuccess = (input, errorElement) => {
        if (!input) return;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (errorElement) errorElement.textContent = '';
    };

    const validateEmail = (input, errorElement) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(input.value)) {
            showError(input, errorElement, 'Please enter a valid email address');
            return false;
        }
        showSuccess(input, errorElement);
        return true;
    };

    const validateName = (input, errorElement) => {
        const regex = /^[A-Za-z\s]{1,30}$/;
        if (!regex.test(input.value)) {
            showError(input, errorElement, 'Name must contain only letters and be max 30 characters');
            return false;
        }
        showSuccess(input, errorElement);
        return true;
    };

    const validatePhone = (input, errorElement) => {
        const regex = /^[0-9]{10,15}$/;
        if (!regex.test(input.value)) {
            showError(input, errorElement, 'Enter a valid phone number (10\u201315 digits)');
            return false;
        }
        showSuccess(input, errorElement);
        return true;
    };

    const attachLiveValidation = (inputId, errorId, validateFn) => {
        const input   = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) {
            input.addEventListener('input', () => validateFn(input, errorEl));
            input.addEventListener('blur',  () => validateFn(input, errorEl));
        }
    };

    /* -------------------------------------------------------
       3. CAPTCHA MODULE
    ------------------------------------------------------- */

    /**
     * Generates a random 6-character alphanumeric code.
     * Excludes visually ambiguous chars: 0, O, I, l, 1
     */
    const generateCaptchaCode = () => {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789abcdefghjkmnpqrstuvwxyz';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    /**
     * Wires up a CAPTCHA widget (display + refresh + input + error).
     * Stores the live code in displayEl.dataset.code so validateCaptcha()
     * can always read the latest value even after refreshes.
     */
    const setupCaptcha = (displayId, refreshId, inputId, errorId) => {
        const displayEl  = document.getElementById(displayId);
        const refreshBtn = document.getElementById(refreshId);
        const inputEl    = document.getElementById(inputId);
        const errorEl    = document.getElementById(errorId);

        // Silently skip if widget not present on this page
        if (!displayEl || !refreshBtn || !inputEl) return;

        const applyNewCode = () => {
            const code = generateCaptchaCode();
            displayEl.textContent  = code;
            displayEl.dataset.code = code;   // always keep in sync
        };

        // Render initial code
        applyNewCode();

        // Refresh button handler
        refreshBtn.addEventListener('click', () => {
            applyNewCode();
            inputEl.value = '';
            inputEl.classList.remove('is-invalid', 'is-valid');
            if (errorEl) errorEl.textContent = '';
        });

        // Clear error feedback while user types
        inputEl.addEventListener('input', () => {
            inputEl.classList.remove('is-invalid');
            if (errorEl) errorEl.textContent = '';
        });
    };

    /**
     * Validates CAPTCHA on form submit (case-insensitive).
     * Auto-refreshes and clears input on failure.
     * Returns true when valid (or when widget is absent on this page).
     */
    const validateCaptcha = (inputId, errorId, displayId) => {
        const inputEl   = document.getElementById(inputId);
        const errorEl   = document.getElementById(errorId);
        const displayEl = document.getElementById(displayId);

        if (!inputEl || !displayEl) return true; // widget not on this page — skip

        const expected = (displayEl.dataset.code || displayEl.textContent || '').trim();
        const entered  = (inputEl.value || '').trim();

        if (entered.toLowerCase() !== expected.toLowerCase()) {
            inputEl.classList.add('is-invalid');
            inputEl.classList.remove('is-valid');
            if (errorEl) errorEl.textContent = 'Incorrect CAPTCHA. Please try again.';

            // Auto-refresh so user gets a fresh code after each failure
            const refreshBtn = document.getElementById(
                displayId.replace('captchaCode', 'captchaRefresh')
            );
            if (refreshBtn) refreshBtn.click();

            inputEl.focus();
            return false;
        }

        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
        if (errorEl) errorEl.textContent = '';
        return true;
    };

    // Initialise whichever CAPTCHA widgets exist on the current page
    setupCaptcha('captchaCodeLogin',  'captchaRefreshLogin',  'captchaInputLogin',  'captchaErrorLogin');
    setupCaptcha('captchaCodeAdmin',  'captchaRefreshAdmin',  'captchaInputAdmin',  'captchaErrorAdmin');
    setupCaptcha('captchaCodeSignup', 'captchaRefreshSignup', 'captchaInputSignup', 'captchaErrorSignup');

    /* -------------------------------------------------------
       4. STUDENT LOGIN FORM
    ------------------------------------------------------- */
    const studentForm = document.getElementById('studentLoginForm');
    if (studentForm) {
        attachLiveValidation('email', 'emailError', validateEmail);

        studentForm.addEventListener('submit', (e) => {
            const isEmailValid   = validateEmail(
                document.getElementById('email'),
                document.getElementById('emailError')
            );
            const isCaptchaValid = validateCaptcha(
                'captchaInputLogin', 'captchaErrorLogin', 'captchaCodeLogin'
            );

            if (!isEmailValid || !isCaptchaValid) {
                e.preventDefault();
            } else {
                console.log('Student Authentication Submitting...');
            }
        });
    }

    /* -------------------------------------------------------
       5. ADMIN LOGIN FORM
    ------------------------------------------------------- */
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        attachLiveValidation('adminId', 'adminIdError', validateEmail);

        adminForm.addEventListener('submit', (e) => {
            const isEmailValid   = validateEmail(
                document.getElementById('adminId'),
                document.getElementById('adminIdError')
            );
            const isCaptchaValid = validateCaptcha(
                'captchaInputAdmin', 'captchaErrorAdmin', 'captchaCodeAdmin'
            );

            if (!isEmailValid || !isCaptchaValid) {
                e.preventDefault();
            } else {
                console.log('Admin Authentication Submitting...');
            }
        });
    }

    /* -------------------------------------------------------
       6. SIGNUP FORM
    ------------------------------------------------------- */
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        attachLiveValidation('fullName', 'fullNameError', validateName);
        attachLiveValidation('phone',    'phoneError',    validatePhone);
        attachLiveValidation('email',    'emailError',    validateEmail);

        const validateCourse = (input, errorElement) => {
            if (!input.value) {
                showError(input, errorElement, 'Please select a course.');
                return false;
            }
            showSuccess(input, errorElement);
            return true;
        };

        const validatePassword = (input, errorElement) => {
            if (input.value.length < 8) {
                showError(input, errorElement, 'Password must be at least 8 characters.');
                return false;
            }
            showSuccess(input, errorElement);
            return true;
        };

        const validateConfirmPassword = (input, errorElement) => {
            const pwd = document.getElementById('password');
            if (input.value !== pwd.value || input.value === '') {
                showError(input, errorElement, 'Passwords do not match.');
                return false;
            }
            showSuccess(input, errorElement);
            return true;
        };

        attachLiveValidation('course',          'courseError',          validateCourse);
        attachLiveValidation('password',         'passwordError',        validatePassword);
        attachLiveValidation('confirmPassword',  'confirmPasswordError', validateConfirmPassword);

        const terms = document.getElementById('terms');
        if (terms) {
            terms.addEventListener('change', () => {
                const err = document.getElementById('termsError');
                if (!terms.checked) {
                    if (err) err.textContent = 'You must agree to the terms and privacy policy.';
                } else {
                    if (err) err.textContent = '';
                }
            });
        }

        signupForm.addEventListener('submit', (e) => {
            const isNameValid    = validateName(document.getElementById('fullName'),        document.getElementById('fullNameError'));
            const isPhoneValid   = validatePhone(document.getElementById('phone'),          document.getElementById('phoneError'));
            const isEmailValid   = validateEmail(document.getElementById('email'),          document.getElementById('emailError'));
            const isCourseValid  = validateCourse(document.getElementById('course'),        document.getElementById('courseError'));
            const isPwdValid     = validatePassword(document.getElementById('password'),    document.getElementById('passwordError'));
            const isConfPwdValid = validateConfirmPassword(document.getElementById('confirmPassword'), document.getElementById('confirmPasswordError'));
            const isCaptchaValid = validateCaptcha('captchaInputSignup', 'captchaErrorSignup', 'captchaCodeSignup');

            let isTermsValid = true;
            if (terms && !terms.checked) {
                const err = document.getElementById('termsError');
                if (err) err.textContent = 'You must agree to the terms and privacy policy.';
                isTermsValid = false;
            }

            if (!(isNameValid && isPhoneValid && isEmailValid && isCourseValid &&
                  isPwdValid  && isConfPwdValid && isTermsValid && isCaptchaValid)) {
                e.preventDefault();
            } else {
                console.log('Signup Validation Passed! Redirecting...');
            }
        });
    }

});
