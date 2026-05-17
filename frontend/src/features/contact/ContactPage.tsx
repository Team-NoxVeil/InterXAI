import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";

export interface ContactPageProps {
  onLoginClick?: () => void;
  onBack?: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({
  onLoginClick,
  onBack,
}) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050e0a] font-sans antialiased">
      <Navbar
        ctaLabel="Sign In"
        onCtaClick={onLoginClick}
        orgCtaLabel="For Organisations"
        onOrgCtaClick={onBack}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f13]/50 via-transparent to-[#050e0a]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[#3ddc84] text-xs uppercase tracking-widest font-semibold mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            We'd love to <span className="text-[#3ddc84]">hear</span> from you
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have a question, suggestion, or want to partner with us? Reach out
            and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:hello@interxai.com"
                  className="flex items-center gap-3 text-white/60 hover:text-[#3ddc84] transition-colors text-sm"
                >
                  <MailIcon />
                  hello@interxai.com
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-white/60 hover:text-[#3ddc84] transition-colors text-sm"
                >
                  <MapPinIcon />
                  Bangalore, India
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {[
                  { label: "Twitter", icon: <TwitterIcon /> },
                  { label: "LinkedIn", icon: <LinkedInIcon /> },
                  { label: "GitHub", icon: <GitHubIcon /> },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center
                      justify-center text-white/50 hover:text-[#3ddc84] hover:border-[#3ddc84]/30
                      hover:bg-[#3ddc84]/10 transition-all duration-200"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6">
              <p className="text-white/40 text-xs leading-relaxed">
                We typically respond within 24 hours on business days. For
                urgent inquiries, please use the subject line "URGENT" and
                we'll prioritise your message.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="rounded-2xl border border-[#3ddc84]/20 bg-[#3ddc84]/5 backdrop-blur-sm p-10
                  text-center flex flex-col items-center gap-4"
              >
                <div
                  className="w-16 h-16 rounded-full bg-[#3ddc84]/10 border border-[#3ddc84]/30 flex items-center
                    justify-center text-[#3ddc84]"
                >
                  <CheckIcon />
                </div>
                <h3 className="text-white text-xl font-semibold">
                  Message Sent!
                </h3>
                <p className="text-white/50 text-sm max-w-sm">
                  Thank you for reaching out. Our team will review your message
                  and get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-2"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-8 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-white/70 text-sm font-medium">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm
                        text-white placeholder-white/30 outline-none transition-all duration-200
                        focus:border-[#3ddc84]/40 focus:bg-white/10 focus:ring-1 focus:ring-[#3ddc84]/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-white/70 text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm
                        text-white placeholder-white/30 outline-none transition-all duration-200
                        focus:border-[#3ddc84]/40 focus:bg-white/10 focus:ring-1 focus:ring-[#3ddc84]/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="text-white/70 text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm
                      text-white placeholder-white/30 outline-none transition-all duration-200
                      focus:border-[#3ddc84]/40 focus:bg-white/10 focus:ring-1 focus:ring-[#3ddc84]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-white/70 text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm
                      text-white placeholder-white/30 outline-none transition-all duration-200 resize-y
                      focus:border-[#3ddc84]/40 focus:bg-white/10 focus:ring-1 focus:ring-[#3ddc84]/20"
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full justify-center py-3.5"
                >
                  Send Message →
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 4l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="5.5" width="2.5" height="9" rx="0.5" />
      <circle cx="2.25" cy="2.25" r="1.25" />
      <path d="M5 5.5h2.7v1.3h.03A2.9 2.9 0 0110.5 5c2.5 0 3 1.6 3 3.7v5.8h-2.5V9.3c0-1.1-.02-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v5H5V5.5z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.67 7.67 0 018 3.85c.68.01 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.5v2.22c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M8 14l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default ContactPage;
