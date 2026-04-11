import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@/utils/axiosInstance';

const ContactModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/Auth/send-mail', {
        userEmail: email,
        message: message,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setEmail('');
        setMessage('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending mail:", err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 animate-scaleIn">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('footer.contactUs')}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            <div className="py-10 text-center animate-slideUpFade">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-emerald-500/20">
                ✓
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('common.success')}</h4>
              <p className="text-slate-500 dark:text-slate-400">{t('modals.contact.successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  {t('modals.contact.email')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  {t('modals.contact.message')}
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('modals.contact.messagePlaceholder')}
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-linear-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-black shadow-xl shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 mt-2"
              >
                {loading ? t('common.loading') : t('modals.contact.sendButton')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
