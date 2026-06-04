import { FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { type ViewMode } from "@/data/portfolioData";

type ContactProps = {
  viewMode?: ViewMode;
};

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const SUBMIT_COOLDOWN_MS = 30000;

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim();
};

const Contact = ({ viewMode = "map" }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmitTime = useRef<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil(
        (SUBMIT_COOLDOWN_MS - (now - lastSubmitTime.current)) / 1000
      );
      toast.error(`Please wait ${remainingSeconds} seconds before sending another message.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        toast.error("Contact form is not configured. Please email me directly.");
        setIsSubmitting(false);
        return;
      }

      const sanitizedName = sanitizeInput(formData.name).slice(0, MAX_NAME_LENGTH);
      const sanitizedEmail = sanitizeInput(formData.email).slice(0, MAX_EMAIL_LENGTH);
      const sanitizedMessage = sanitizeInput(formData.message).slice(0, MAX_MESSAGE_LENGTH);

      if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
        toast.error("Please fill in all fields with valid content.");
        setIsSubmitting(false);
        return;
      }

      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      await emailjs.send(
        serviceId,
        templateId,
        {
          fname: sanitizedName,
          femail: sanitizedEmail,
          message: sanitizedMessage,
          to_name: "Nathan Zimmerman",
          date: currentDate,
        },
        publicKey
      );

      lastSubmitTime.current = Date.now();
      toast.success("Message sent! You'll receive a confirmation email shortly.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="retro-section contact-zone py-16 md:py-20">
      <div className="contact-backdrop" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="retro-heading text-4xl text-amber-200 md:text-5xl">LET&apos;S CONNECT!</h2>
            <p className="mt-4 text-lg text-slate-200/90 md:text-xl">
              I enjoy meeting new people and chatting about engineering or creative projects. Always happy to connect.
            </p>
          </div>

          <div className="mx-auto mb-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              className={viewMode === "map" ? "retro-contact-btn" : "retro-contact-btn retro-contact-btn-muted"}
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
              GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              className={viewMode === "map" ? "retro-contact-btn" : "retro-contact-btn retro-contact-btn-muted"}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
              LINKEDIN
            </a>
            <a
              href="mailto:nathan.a.zimmerman@gmail.com"
              className={viewMode === "map" ? "retro-contact-btn" : "retro-contact-btn retro-contact-btn-muted"}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
              EMAIL
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="retro-contact-btn retro-contact-btn-gold"
              aria-label="Resume"
            >
              <FileText className="h-5 w-5" />
              RESUME
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card className="border-cyan-300/22 bg-slate-950/75">
                <CardContent className="flex items-center gap-4 p-5">
                  <Mail className="h-8 w-8 text-cyan-300" />
                  <div>
                    <h3 className="retro-ui text-xs text-cyan-100">EMAIL</h3>
                    <p className="mt-1 text-sm text-slate-200">nathan.a.zimmerman@gmail.com</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-cyan-300/22 bg-slate-950/75">
                <CardContent className="flex items-center gap-4 p-5">
                  <MapPin className="h-8 w-8 text-cyan-300" />
                  <div>
                    <h3 className="retro-ui text-xs text-cyan-100">LOCATION</h3>
                    <p className="mt-1 text-sm text-slate-200">New Jersey, United States</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-cyan-300/22 bg-slate-950/80 p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="retro-ui text-[10px] text-slate-100">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    maxLength={MAX_NAME_LENGTH}
                    className="border-slate-400/35 bg-slate-900/70 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-300/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="retro-ui text-[10px] text-slate-100">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    maxLength={MAX_EMAIL_LENGTH}
                    className="border-slate-400/35 bg-slate-900/70 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-300/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="retro-ui text-[10px] text-slate-100">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me what you're working on or say hello!"
                    rows={5}
                    required
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="resize-none border-slate-400/35 bg-slate-900/70 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-300/40"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-ui w-full rounded-sm border border-emerald-300/45 bg-emerald-500/18 text-xs text-emerald-50 hover:bg-emerald-500/30"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
