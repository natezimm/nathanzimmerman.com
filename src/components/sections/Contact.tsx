import { useState, useRef } from 'react';
import { Mail, Github, Linkedin, MapPin, Copy, Check, Send, Loader2, ArrowUpRight, Phone } from 'lucide-react';
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
      setStatusMessage({ type: 'error', text: `Rate limit active: please wait ${waitSec}s before sending another message.` });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        setStatusMessage({
          type: 'error',
          text: 'Dispatch service offline. Please transmit directly to nathan.a.zimmerman@gmail.com',
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
      setStatusMessage({ type: 'success', text: 'Dispatch transmitted successfully. I will review and reply promptly.' });
      trackPortfolioEvent('contact_submit_success', { source: 'dispatch_console' });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Transmission failure. Please transmit directly via nathan.a.zimmerman@gmail.com',
      });
      trackPortfolioEvent('contact_submit_failure', { reason: 'send_error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="dispatch" className="py-16 md:py-24 bg-[#090A0D]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E6A838] uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              <span>04 // INQUIRY &amp; DISPATCH CONSOLE</span>
            </div>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F2EE]">
              Communication Dispatch
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Direct communication endpoint for senior full-stack, distributed systems, and payment infrastructure opportunities in the NYC metro area.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8">
          {/* Left Column: Direct Coordinates */}
          <div className="space-y-4">
            {/* Email Card */}
            <div className="rounded-lg border border-white/[0.1] bg-[#0E1015] p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded border border-white/[0.08] bg-black/40 p-2.5 text-[#E6A838]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      DIRECT TRANSMISSION ENDPOINT
                    </p>
                    <p className="font-mono text-sm sm:text-base font-semibold text-[#F3F2EE] mt-0.5">
                      nathan.a.zimmerman@gmail.com
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="rounded border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] p-2 text-zinc-300 transition-colors"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-[#00E599]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Location & Phone Card */}
            <div className="rounded-lg border border-white/[0.1] bg-[#0E1015] p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded border border-white/[0.08] bg-black/40 p-2.5 text-[#00E599]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    GEOGRAPHIC COORDINATES
                  </p>
                  <p className="font-mono text-sm font-semibold text-[#F3F2EE] mt-0.5">
                    Raritan, NJ · NYC Metro Area
                  </p>
                  <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
                    Commutable to NYC / Hybrid / Remote
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <div className="rounded border border-white/[0.08] bg-black/40 p-2.5 text-zinc-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                    VOICE / SMS
                  </p>
                  <p className="font-mono text-sm font-semibold text-[#F3F2EE] mt-0.5">
                    610.955.6578
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/natezimm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/[0.1] bg-[#0E1015] hover:border-white/[0.2] hover:bg-[#12151B] p-4 font-mono text-xs text-[#F3F2EE] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-zinc-400" />
                  <span>GITHUB</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </a>

              <a
                href="https://www.linkedin.com/in/zimmermannathan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/[0.1] bg-[#0E1015] hover:border-white/[0.2] hover:bg-[#12151B] p-4 font-mono text-xs text-[#F3F2EE] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-[#E6A838]" />
                  <span>LINKEDIN</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </a>
            </div>
          </div>

          {/* Right Column: Dispatch Transmission Form */}
          <div className="rounded-lg border border-white/[0.1] bg-[#0E1015] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#F3F2EE]">
                  Transmit Dispatch Message
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">
                  Direct encrypted transmission to personal engineer inbox.
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#00E599] uppercase tracking-wider">
                READY
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label htmlFor="dispatch-name" className="block text-zinc-400 uppercase tracking-wider text-[11px] mb-1.5">
                  Sender Identity [Name]
                </label>
                <input
                  id="dispatch-name"
                  type="text"
                  required
                  maxLength={MAX_NAME_LENGTH}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hiring Manager / Recruiter"
                  className="w-full rounded border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm text-[#F3F2EE] placeholder:text-zinc-600 focus:border-[#E6A838] focus:outline-none transition-colors font-sans"
                />
              </div>

              <div>
                <label htmlFor="dispatch-email" className="block text-zinc-400 uppercase tracking-wider text-[11px] mb-1.5">
                  Sender Return Address [Email]
                </label>
                <input
                  id="dispatch-email"
                  type="email"
                  required
                  maxLength={MAX_EMAIL_LENGTH}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full rounded border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm text-[#F3F2EE] placeholder:text-zinc-600 focus:border-[#E6A838] focus:outline-none transition-colors font-sans"
                />
              </div>

              <div>
                <label htmlFor="dispatch-message" className="block text-zinc-400 uppercase tracking-wider text-[11px] mb-1.5">
                  Transmission Payload [Message]
                </label>
                <textarea
                  id="dispatch-message"
                  required
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="We are looking for a Senior C#/.NET and Angular engineer to lead financial transaction workflows..."
                  className="w-full rounded border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-sm text-[#F3F2EE] placeholder:text-zinc-600 focus:border-[#E6A838] focus:outline-none transition-colors font-sans"
                />
              </div>

              {statusMessage && (
                <div
                  className={`rounded p-3 text-xs font-mono ${
                    statusMessage.type === 'success'
                      ? 'border border-[#00E599]/30 bg-[#00E599]/10 text-[#00E599]'
                      : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#E6A838] hover:bg-[#f3b544] disabled:opacity-50 px-5 py-3 font-mono text-xs font-bold text-black uppercase tracking-wider transition-colors shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Transmit Dispatch</span>
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
