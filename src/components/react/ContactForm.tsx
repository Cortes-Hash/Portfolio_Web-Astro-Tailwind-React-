import { useState, useCallback } from 'react';

// ============================================================
// IMPORTANT: Replace FORMSPREE_ENDPOINT with your actual
// Formspree form ID from https://formspree.io
// Format: 'https://formspree.io/f/YOUR_FORM_ID'
// ============================================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgqlnyl';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

// --- Validation ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data: FormData, isEN: boolean): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim()) {
    errors.name = isEN ? 'Name is required' : 'El nombre es obligatorio';
  }

  if (!data.email.trim()) {
    errors.email = isEN ? 'Email is required' : 'El correo es obligatorio';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = isEN ? 'Invalid email format' : 'Formato de correo inválido';
  }

  if (!data.message.trim()) {
    errors.message = isEN ? 'Message is required' : 'El mensaje es obligatorio';
  } else if (data.message.trim().length < 10) {
    errors.message = isEN
      ? 'Message must be at least 10 characters'
      : 'El mensaje debe tener al menos 10 caracteres';
  }

  return errors;
}

// --- Component ---
export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Detect current language from HTML attribute
  const isEN = () => {
    try {
      return document.documentElement.getAttribute('data-lang') === 'en';
    } catch {
      return false;
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear field error on change
      if (errors[name as keyof FieldErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const en = isEN();

    // Client-side validation
    const validationErrors = validateForm(formData, en);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        throw new Error(
          en
            ? 'No internet connection. Please check your network.'
            : 'Sin conexión a internet. Comprueba tu red.'
        );
      }

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        // Try to parse error body for a meaningful message
        let serverError = '';
        try {
          const body = await response.json();
          serverError = body?.errors?.[0]?.message || body?.error || '';
        } catch {
          // Ignore JSON parse error, use status text
        }

        throw new Error(
          serverError ||
            (en
              ? `Server error (${response.status}). Please try again.`
              : `Error del servidor (${response.status}). Inténtalo de nuevo.`)
        );
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (err: unknown) {
      setStatus('error');

      if (err instanceof TypeError && err.message.includes('fetch')) {
        // Network / CORS error
        setErrorMsg(
          en
            ? 'Connection error. Please try again or contact me directly.'
            : 'Error de conexión. Inténtalo de nuevo o escríbeme directamente.'
        );
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          en
            ? 'Unknown error. Please try again.'
            : 'Error desconocido. Por favor, inténtalo de nuevo.'
        );
      }

      console.error('[ContactForm] Submission failed:', err);
    }
  };

  const en = isEN();
  const isSending = status === 'sending';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">
          <span className="i18n-es">Nombre</span>
          <span className="i18n-en">Name</span>
        </label>
        <input
          id="cf-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={en ? 'Your name' : 'Tu nombre'}
          className={`form-input${errors.name ? ' has-error' : ''}`}
          disabled={isSending}
          autoComplete="name"
          maxLength={120}
        />
        {errors.name && (
          <span className="form-error" role="alert">
            ⚠️ {errors.name}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">
          <span className="i18n-es">Correo electrónico</span>
          <span className="i18n-en">Email</span>
        </label>
        <input
          id="cf-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={en ? 'your@email.com' : 'tu@email.com'}
          className={`form-input${errors.email ? ' has-error' : ''}`}
          disabled={isSending}
          autoComplete="email"
          maxLength={254}
        />
        {errors.email && (
          <span className="form-error" role="alert">
            ⚠️ {errors.email}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="form-group">
        <label className="form-label" htmlFor="cf-message">
          <span className="i18n-es">Mensaje</span>
          <span className="i18n-en">Message</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={en ? 'Write your message...' : 'Escribe tu mensaje...'}
          className={`form-input form-textarea${errors.message ? ' has-error' : ''}`}
          disabled={isSending}
          maxLength={2000}
        />
        {errors.message && (
          <span className="form-error" role="alert">
            ⚠️ {errors.message}
          </span>
        )}
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
          {formData.message.length} / 2000
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        disabled={isSending}
        style={{ justifyContent: 'center', opacity: isSending ? 0.7 : 1 }}
        id="cf-submit"
      >
        {isSending ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            <span className="i18n-es">Enviando...</span>
            <span className="i18n-en">Sending...</span>
          </>
        ) : (
          <>
            <span>✉️</span>
            <span className="i18n-es">Enviar mensaje</span>
            <span className="i18n-en">Send message</span>
          </>
        )}
      </button>

      {/* Success message */}
      {status === 'success' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#22c55e',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>✅</span>
          <span className="i18n-es">¡Mensaje enviado correctamente! Me pondré en contacto contigo pronto.</span>
          <span className="i18n-en">Message sent successfully! I'll get back to you soon.</span>
        </div>
      )}

      {/* Error message */}
      {status === 'error' && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.35)',
            color: '#f87171',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span>❌</span>
            <span className="i18n-es">Error al enviar el mensaje.</span>
            <span className="i18n-en">Failed to send message.</span>
          </div>
          {errorMsg && (
            <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>{errorMsg}</p>
          )}
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', opacity: 0.85 }}>
            <span className="i18n-es">Escríbeme directamente a </span>
            <span className="i18n-en">Write me directly at </span>
            <a
              href="mailto:cortesdiaz905@gmail.com"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              cortesdiaz905@gmail.com
            </a>
          </p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            style={{
              marginTop: '0.5rem',
              fontSize: '0.78rem',
              color: 'inherit',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            <span className="i18n-es">Intentar de nuevo</span>
            <span className="i18n-en">Try again</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
