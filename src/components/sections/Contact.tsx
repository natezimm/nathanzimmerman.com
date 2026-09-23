import { useState, useRef } from 'react';
import { Mail, Github, Linkedin, MapPin, Copy, Check, Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { trackPortfolioEvent } from '@/lib/analytics';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const SUBMIT_COOLDOWN_MS = 30000;

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const lastSubmitTime = useRef<number>(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nathan.a.zimmerman@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN_MS) {
      const waitSec = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime.current)) / 1000);
      setStatusMessage({ type: 'error', text: `Please wait ${waitSec}s before sending another message.` });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        // Fallback if emailjs is not configured locally
        setStatusMessage({
          type: 'error',
          text: 'Contact service is currently offline. Please email me directly at nathan.a.zimmerman@gmail.com',
        });
        trackPortfolioEvent('contact_submit_failure', { reason: 'not_configured' });
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name.slice(0, MAX_NAME_LENGTH),
          from_email: formData.email.slice(0, MAX_EMAIL_LENGTH),
          message: formData.message.slice(0, MAX_MESSAGE_LENGTH),
          to_name: 'Nathan Zimmerman',
        },
        publicKey
      );

      lastSubmitTime.current = Date.now();
      setFormData({ name: '', email: '', message: '' });
      setStatusMessage({ type: 'success', text: 'Message sent successfully! I will get back to you shortly.' });
      trackPortfolioEvent('contact_submit_success', { source: 'redesign_contact' });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to send message. Please reach out directly to nathan.a.zimmerman@gmail.com.',
      });
      trackPortfolioEvent('contact_submit_failure', { reason: 'send_error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Get in Touch
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            I am currently open to senior full-stack and backend engineering opportunities in the NYC metro area, 
            hybrid or remote. Feel free to reach out directly.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8">
          {/* Direct Contact Cards */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Direct Email</p>
                    <p className="text-sm sm:text-base font-medium text-slate-100 mt-0.5">
                      nathan.a.zimmerman@gmail.com
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 p-2 text-slate-300 transition-colors"
                  aria-label="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</p>
                  <p className="text-sm sm:text-base font-medium text-slate-100 mt-0.5">
                    Raritan, NJ · NYC Metro Area
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Available for Hybrid (NYC commute) or Remote</p>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/natezimm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/80 p-4 text-sm font-semibold text-slate-200 transition-all shadow-sm"
              >
                <Github className="h-4 w-4 text-slate-300" />
                GitHub Profile
              </a>
              <a
                href="https://www.linkedin.com/in/zimmermannathan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/80 p-4 text-sm font-semibold text-slate-200 transition-all shadow-sm"
              >
                <Linkedin className="h-4 w-4 text-cyan-400" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-100">Send a Message</h3>
            <p className="mt-1 text-xs text-slate-400">Messages are delivered directly to my inbox.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-300">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={MAX_NAME_LENGTH}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-300">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  maxLength={MAX_EMAIL_LENGTH}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hi Nathan, we are looking for a senior C#/.NET and Angular engineer..."
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>

              {statusMessage && (
                <div
                  className={`rounded-lg p-3 text-xs ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
