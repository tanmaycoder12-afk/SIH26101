const form = document.querySelector('#auth-form');
const identityInput = document.querySelector('#identity');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#submit-button');
const statusMessage = document.querySelector('#status-message');
const togglePasswordButton = document.querySelector('#toggle-password');

function setStatus(message = '', type = 'info') {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = 'status-message';
  if (message) statusMessage.classList.add('is-visible', `is-${type}`);
}

function setFieldError(fieldId, message = '') {
  const field = document.querySelector(`[for="${fieldId}"]`);
  const error = document.querySelector(`#${fieldId}-error`);
  if (error) error.textContent = message;
  if (field) field.classList.toggle('has-error', Boolean(message));
}

function validate() {
  const email = identityInput.value.trim();
  const password = passwordInput.value;
  let ok = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('identity', 'Enter a valid email address.');
    ok = false;
  } else setFieldError('identity', '');

  if (!password) {
    setFieldError('password', 'Enter your prototype account password.');
    ok = false;
  } else setFieldError('password', '');

  return ok;
}

if (togglePasswordButton) {
  togglePasswordButton.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    togglePasswordButton.classList.toggle('is-showing', show);
    togglePasswordButton.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    togglePasswordButton.setAttribute('title', show ? 'Hide password' : 'Show password');
  });
}

identityInput?.addEventListener('input', () => setFieldError('identity', ''));
passwordInput?.addEventListener('input', () => setFieldError('password', ''));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus();
  if (!validate()) return;

  submitButton.disabled = true;
  setStatus('Signing in to GyanSetu…', 'info');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: identityInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 503 && (data.code === 'DATABASE_NOT_CONFIGURED' || data.code === 'DATABASE_UNREACHABLE' || data.code === 'DATABASE_SCHEMA_MISSING')) {
        setStatus('GyanSetu account services are being connected. Please try again after the database setup is completed.', 'info');
        return;
      }
      setStatus(data.error || 'Sign-in failed.', 'error');
      return;
    }

    setStatus('Signed in. Redirecting…', 'success');
    window.location.assign(data.next || '/onboarding.html');
  } catch {
    setStatus('Could not reach the GyanSetu authentication backend.', 'error');
  } finally {
    submitButton.disabled = false;
  }
});