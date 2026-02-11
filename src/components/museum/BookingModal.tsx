import { useMuseumStore } from '@/store/museumStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

function generateICS(name: string, email: string, dateTime: string): string {
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gallery//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Gallery Viewing — ${name}`,
    `DESCRIPTION:Booking for ${name} (${email})`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function BookingModal() {
  const showBooking = useMuseumStore((s) => s.showBooking);
  const setShowBooking = useMuseumStore((s) => s.setShowBooking);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showBooking) {
      setTimeout(() => firstInput.current?.focus(), 100);
    } else {
      setSubmitted(false);
      setName('');
      setEmail('');
      setDateTime('');
    }
  }, [showBooking]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBooking(false);
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [setShowBooking]
  );

  const handleSubmit = () => {
    if (!name || !email || !dateTime) return;
    const text = `Gallery Viewing\nName: ${name}\nEmail: ${email}\nDate/Time: ${dateTime}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setSubmitted(true);
  };

  const downloadICS = () => {
    const ics = generateICS(name, email, dateTime);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gallery-viewing.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {showBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center"
          onKeyDown={handleKeyDown}
        >
          <div
            className="absolute inset-0 bg-museum-bg/80 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          />
          <motion.div
            ref={modalRef}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-md w-full mx-4 p-8 bg-museum-charcoal/95 border border-museum-white/10 backdrop-blur-md"
            role="dialog"
            aria-label="Book a viewing"
          >
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-4 right-5 text-museum-white/40 hover:text-museum-white text-xs tracking-[0.2em] uppercase transition-colors"
              aria-label="Close booking"
            >
              ✕
            </button>

            <h2 className="font-serif text-2xl text-museum-white mb-6">Book a Viewing</h2>

            {!submitted ? (
              <div className="space-y-4">
                <div>
                  <label className="text-museum-white/40 text-[10px] tracking-[0.2em] uppercase block mb-1">
                    Name
                  </label>
                  <input
                    ref={firstInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-museum-bg/50 border border-museum-white/10 text-museum-white px-3 py-2 text-sm focus:outline-none focus:border-museum-brass/40"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-museum-white/40 text-[10px] tracking-[0.2em] uppercase block mb-1">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full bg-museum-bg/50 border border-museum-white/10 text-museum-white px-3 py-2 text-sm focus:outline-none focus:border-museum-brass/40"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="text-museum-white/40 text-[10px] tracking-[0.2em] uppercase block mb-1">
                    Preferred Date & Time
                  </label>
                  <input
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    type="datetime-local"
                    className="w-full bg-museum-bg/50 border border-museum-white/10 text-museum-white px-3 py-2 text-sm focus:outline-none focus:border-museum-brass/40"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!name || !email || !dateTime}
                  className="w-full mt-2 py-3 border border-museum-brass/30 bg-museum-brass/10 text-museum-brass text-xs tracking-[0.2em] uppercase hover:bg-museum-brass/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-museum-white/60 text-sm">Booking details copied to clipboard.</p>
                <button
                  onClick={downloadICS}
                  className="px-6 py-2 border border-museum-brass/30 text-museum-brass text-xs tracking-[0.2em] uppercase hover:bg-museum-brass/10 transition-colors"
                >
                  Download .ics
                </button>
                <button
                  onClick={() => setShowBooking(false)}
                  className="block mx-auto text-museum-white/30 text-xs tracking-[0.15em] uppercase mt-3 hover:text-museum-white/60 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
