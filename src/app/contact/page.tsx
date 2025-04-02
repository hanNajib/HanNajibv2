"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import TitleLabel from "@/components/TitleLabel";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { useCursor } from "../layout";

const ContactPage = () => {
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof typeof formData]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Email submission error:', err);
      } else {
        setError('An unknown error occurred.');
        console.error('Unknown error:', err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: <FaGithub size={24} />, link: "https://github.com/hanNajib", label: "GitHub" },
    // { icon: <FaYoutube size={24} />, link: "https://github.com/hanNajib", label: "YouTube" },
    { icon: <FaInstagram size={24} />, link: "https://instagram.com/handefined", label: "Instagram" },
    { icon: <FaLinkedin size={24} />, link: "https://www.linkedin.com/", label: "LinkedIn" },
  ];

  const { api } = useCursor();

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <TitleLabel>Contact</TitleLabel>

      <div className="grid md:grid-cols-2 gap-12 mt-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: "name", type: "text" },
                { id: "email", type: "email" },
              ].map(({ id, type }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-white mb-2 capitalize">{id}</label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 focus:border-yellow-300 transition-colors"
                    onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })}
                    onMouseLeave={() => api.start({ rounded: 0, scale: 1 })}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })}
                  onMouseLeave={() => api.start({ rounded: 0, scale: 1 })}
                  className="w-full bg-neutral-800 text-white p-3 rounded-lg border border-neutral-700 focus:border-yellow-300 transition-colors"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-yellow-300 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {submitting ? 'Sending....' : (<><FaPaperPlane className="mr-2" /> Send Message</>)}
              </motion.button>
            </form>
          ) : (
            <div className="text-center text-white flex flex-col justify-center items-center h-full">
              <h3 className="text-2xl font-bold mb-4">Terima Kasih!</h3>
              <p>Pesan Anda berhasil dikirim.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Let&apos;s Connect</h2>
            <p className="text-neutral-400 mb-6">
              Terbuka untuk diskusi tentang proyek, kolaborasi, atau peluang lainnya. Jangan ragu untuk menghubungi saya!
            </p>
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-yellow-300" size={24} />
              <div>
                <h3 className="font-semibold text-white">Email</h3>
                <p className="text-sm text-neutral-400">handefined@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Follow Me</h2>
            <div className="space-y-4">
              {socialLinks.map(({ icon, link, label }, index) => (
              <motion.a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-yellow-300 transition-colors"
              >
                <div className="text-neutral-300">{icon}</div>
                <span className="text-white font-semibold">{label}</span>
              </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;