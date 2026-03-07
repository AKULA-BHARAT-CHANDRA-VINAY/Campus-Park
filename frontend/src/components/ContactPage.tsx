import React, { useState } from 'react';
import MailIcon from './icons/MailIcon';
import PhoneIcon from './icons/PhoneIcon';
import UserIcon from './icons/UserIcon';
import ToastContainer, { ToastMessage } from './ToastContainer';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value) return 'Full Name is required.';
        if (value.length < 2) return 'Full Name must be at least 2 characters.';
        return '';
      case 'email':
        if (!value) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid.';
        return '';
      case 'message':
        if (!value) return 'Message is required.';
        if (value.length < 10) return 'Message must be at least 10 characters.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Thank you! Your message has been sent successfully.', 'success');
      setFormData({ fullName: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="relative w-full min-h-screen overflow-y-auto bg-gradient-to-br from-[var(--color-bg-dark)] via-[var(--color-cyan-dark)] to-[var(--color-bg-dark)]">
        {/* Animated Ambient Light Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-cyan-light)] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--color-teal-light)] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[var(--color-cyan-light)] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-cyan-light)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MV</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl">MVGR Smart Parking</h1>
              <p className="text-gray-400 text-xs md:text-sm">College Project • Parking & Access</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="text-white hover:text-[var(--color-cyan-light)] transition-colors text-sm md:text-base"
          >
            ← Back
          </button>
        </header>

        {/* Hero Section with Image */}
        <div className="relative z-10 px-6 md:px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12">
              <img 
                src="/images/signin.jpg" 
                alt="Contact Us" 
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Contact Us
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                    Have questions or feedback? We'd love to hear from you!
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left: Contact Form */}
              <div className="relative">
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8 md:p-10">
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--color-cyan-light)] via-[var(--color-teal-light)] to-[var(--color-cyan-light)] opacity-30 blur-xl animate-gradient-x"></div>
                    <div className="absolute inset-[1px] rounded-2xl bg-gray-900/40 backdrop-blur-xl"></div>
                  </div>

                  <div className="relative">
                    <h3 className="text-3xl font-bold text-white mb-2">Feel Free to Contact</h3>
                    <p className="text-gray-300 mb-8 text-sm md:text-base">
                      Your suggestions help us make the website more useful for students, faculty and the community. You can submit anonymously — but provide contact details if you'd like us to follow up.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="fullName" className="block text-white text-sm mb-1 font-normal">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none pl-1">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder=""
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.fullName}
                            required
                            className="relative w-full bg-transparent border-b-2 border-gray-500 py-2 pl-8 pr-4 text-white placeholder-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300"
                            style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-white text-sm mb-1 font-normal">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none pl-1">
                            <MailIcon className="w-5 h-5" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder=""
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={!!errors.email}
                            required
                            className="relative w-full bg-transparent border-b-2 border-gray-500 py-2 pl-8 pr-4 text-white placeholder-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300"
                            style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-white text-sm mb-1 font-normal">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          placeholder="Your message here..."
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.message}
                          required
                          rows={6}
                          className="relative w-full bg-transparent border-b-2 border-gray-500 py-2 px-4 text-white placeholder-gray-500 focus:border-[var(--color-cyan-light)] focus:outline-none transition-all duration-300 resize-none"
                          style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1 ml-2 animate-slide-down-sm">{errors.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[var(--color-teal-dark)] to-[var(--color-cyan-light)] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-[0.98] shadow-md"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right: Contact Information */}
              <div className="space-y-6">
                <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-8">
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">?</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">FAQs</h4>
                        <p className="text-gray-300 text-sm">Have a quick question? Check our FAQs for a quick answer.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MailIcon className="w-6 h-6 text-[var(--color-cyan-light)]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">Email us</h4>
                        <p className="text-gray-300 text-sm">info@mvgrparking.in</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--color-cyan-light)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <PhoneIcon className="w-6 h-6 text-[var(--color-cyan-light)]" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">Call us</h4>
                        <p className="text-gray-300 text-sm">+91 9542964155</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

